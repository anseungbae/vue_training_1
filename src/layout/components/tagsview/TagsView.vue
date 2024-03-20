<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
import { asyncRouterMap } from '@/router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { watch, onMounted, computed, ref, unref, nextTick } from 'vue'
import { useTemplateRefsList } from '@vueuse/core'
import ContextMenu from '@/components/ContextMenu.vue'
import type { ContextMenuExpose } from '@/components/types/context-menu-expose'
import { useScrollTo } from '@/hooks/event/useScrollTo'
import { useTagsView } from '@/hooks/web/useTagsView'
import { useAppStore } from '@/store/modules/app'
import { filterAffixTags } from '@/layout/components/tagsview/helper'
import { cloneDeep } from 'lodash-es'
import { ElScrollbar } from 'element-plus'

const { currentRoute, push } = useRouter()
const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage } = useTagsView()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('tags-view')

const routers = computed(() => asyncRouterMap)
const tagsViewStore = useTagsViewStore()
const visitedViews = computed(() => tagsViewStore.getVisitedViews)

const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([])

const selectedTag = computed(() => tagsViewStore.getSelectedTag)

const setSelectTag = tagsViewStore.setSelectedTag

const appStore = useAppStore()

const tagsViewIcon = computed(() => appStore.getTagsViewIcon)

const isDark = computed(() => appStore.getIsDark)

const initTags = () => {
  affixTagArr.value = filterAffixTags(unref(routers))

  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~ affixTagArr.value : ', affixTagArr.value)

  for (const tag of unref(affixTagArr)) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(cloneDeep(tag))
    }
  }
}

const addTags = () => {
  const { name } = unref(currentRoute)
  if (name) {
    setSelectTag(unref(currentRoute))
    tagsViewStore.addView(unref(currentRoute))
  }
}

const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  closeCurrent(view, () => {
    if (isActive(view)) {
      toLastView()
    }
  })
}

const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    push(latestView)
  }
  // else {
  //   if (
  //     unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
  //     unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
  //   ) {
  //     addTags()
  //     return
  //   }
  //   // You can set another route
  //   push(permissionStore.getAddRouters[0].path)
  // }
}

const closeAllTags = () => {
  closeAll(() => {
    toLastView()
  })
}

const closeOthersTags = () => {
  closeOther()
}

const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  refreshPage(view)
}

const closeLeftTags = () => {
  closeLeft()
}

const closeRightTags = () => {
  closeRight()
}

const moveToCurrentTag = async () => {
  await nextTick()
  for (const v of unref(visitedViews)) {
    if (v.fullPath === unref(currentRoute).path) {
      moveToTarget(v)
      if (v.fullPath !== unref(currentRoute).fullPath) {
        tagsViewStore.updateVisitedView(unref(currentRoute))
      }

      break
    }
  }
}

const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()

const moveToTarget = (currentTag: RouteLocationNormalizedLoaded) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  let firstTag: Nullable<RouterLinkProps> = null
  let lastTag: Nullable<RouterLinkProps> = null

  const tagList = unref(tagLinksRefs)
  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  if ((firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 0으로 바로 가기
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: 0,
      duration: 500
    })
    start()
  } else if ((lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 끝까지 스크롤
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: wrap$!.scrollWidth - wrap$!.offsetWidth,
      duration: 500
    })
    start()
  } else {
    // find preTag and nextTag
    const currentIndex: number = tagList.findIndex(
      (item) => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath
    )
    const tgsRefs = document.getElementsByClassName(`${prefixCls}__item`)

    const prevTag = tgsRefs[currentIndex - 1] as HTMLElement
    const nextTag = tgsRefs[currentIndex + 1] as HTMLElement

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4

    if (afterNextTagOffsetLeft > unref(scrollLeftNumber) + wrap$!.offsetWidth) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
        duration: 500
      })
      start()
    } else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber)) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: beforePrevTagOffsetLeft,
        duration: 500
      })
      start()
    }
  }
}
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.path === unref(currentRoute).path
}

const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

const visibleChange = (visible: boolean, tagItem: RouteLocationNormalizedLoaded) => {
  if (visible) {
    for (const v of unref(itemRefs)) {
      const elDropdownMenuRef = v.elDropdownMenuRef
      if (tagItem.fullPath !== v.tagItem.fullPath) {
        elDropdownMenuRef?.handleClose()
        setSelectTag(tagItem)
      }
    }
  }
}

const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()
const scrollLeftNumber = ref(0)

const scroll = ({ scrollLeft }: { scrollLeft: number }) => {
  scrollLeftNumber.value = scrollLeft
}

const move = (to: number) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  const { start } = useScrollTo({
    el: wrap$!,
    position: 'scrollLeft',
    to: unref(scrollLeftNumber) + to,
    duration: 500
  })
  start()
}

onMounted(() => {
  initTags()
  addTags()
})

watch(
  () => currentRoute.value,
  () => {
    addTags()
    moveToCurrentTag()
  }
)
</script>

<template>
  <div
    :id="prefixCls"
    :class="prefixCls"
    class="flex w-full relative bg-[#fff] dark:bg-[var(--el-bg-color)]"
  >
    <span
      :class="`${prefixCls}__tool ${prefixCls}__tool--first`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
      @click="move(-200)"
    >
      <!--      <Icon-->
      <!--        icon="ep:d-arrow-left"-->
      <!--        color="var(&#45;&#45;el-text-color-placeholder)"-->
      <!--        :hover-color="isDark ? '#fff' : 'var(&#45;&#45;el-color-black)'"-->
      <!--      />-->
    </span>
    <div class="overflow-hidden flex-1">
      <ElScrollbar ref="scrollbarRef" class="h-full" @scroll="scroll">
        <div class="flex h-full">
          <ContextMenu
            :ref="itemRefs.set"
            :schema="[
              {
                icon: 'ant-design:sync-outlined',
                label: 'Reload current',
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  refreshSelectedTag(item)
                }
              },
              {
                icon: 'ant-design:close-outlined',
                label: 'Close current',
                disabled: !!visitedViews?.length && selectedTag?.meta.affix,
                command: () => {
                  closeSelectedTag(item)
                }
              },
              {
                divided: true,
                icon: 'ant-design:vertical-right-outlined',
                label: 'Close left',
                disabled:
                  !!visitedViews?.length &&
                  (item.fullPath === visitedViews[0].fullPath ||
                    selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeLeftTags()
                }
              },
              {
                icon: 'ant-design:vertical-left-outlined',
                label: 'Close right',
                disabled:
                  !!visitedViews?.length &&
                  (item.fullPath === visitedViews[visitedViews.length - 1].fullPath ||
                    selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeRightTags()
                }
              },
              {
                divided: true,
                icon: 'ant-design:tag-outlined',
                label: 'Close other',
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  closeOthersTags()
                }
              },
              {
                icon: 'ant-design:line-outlined',
                label: 'Close all',
                command: () => {
                  closeAllTags()
                }
              }
            ]"
            v-for="item in visitedViews"
            :key="item.fullPath"
            :tag-item="item"
            :class="[
              `${prefixCls}__item`,
              item?.meta?.affix ? `${prefixCls}__item--affix` : '',
              {
                'is-active': isActive(item)
              }
            ]"
            @visible-change="visibleChange"
          >
            <div>
              <router-link :ref="tagLinksRefs.set" :to="{ ...item }" custom v-slot="{ navigate }">
                <div
                  @click="navigate"
                  class="h-full flex justify-center items-center whitespace-nowrap pl-15px"
                >
                  <!--                  <Icon-->
                  <!--                    v-if="-->
                  <!--                      item?.matched &&-->
                  <!--                      item?.matched[1] &&-->
                  <!--                      item?.matched[1]?.meta?.icon &&-->
                  <!--                      tagsViewIcon-->
                  <!--                    "-->
                  <!--                    :icon="item?.matched[1]?.meta?.icon"-->
                  <!--                    :size="12"-->
                  <!--                    class="mr-5px"-->
                  <!--                  />-->
                  {{ item?.meta?.title as string }}
                  <!--                  <Icon-->
                  <!--                    :class="`${prefixCls}__item&#45;&#45;close`"-->
                  <!--                    color="#333"-->
                  <!--                    icon="ant-design:close-outlined"-->
                  <!--                    :size="12"-->
                  <!--                    @click.prevent.stop="closeSelectedTag(item)"-->
                  <!--                  />-->
                </div>
              </router-link>
            </div>
          </ContextMenu>
        </div>
      </ElScrollbar>
    </div>
    <span
      :class="`${prefixCls}__tool`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
      @click="move(200)"
    >
      <!--      <Icon-->
      <!--        icon="ep:d-arrow-right"-->
      <!--        color="var(&#45;&#45;el-text-color-placeholder)"-->
      <!--        :hover-color="isDark ? '#fff' : 'var(&#45;&#45;el-color-black)'"-->
      <!--      />-->
    </span>
    <span
      :class="`${prefixCls}__tool`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
      @click="refreshSelectedTag(selectedTag)"
    >
      <!--      <Icon-->
      <!--        icon="ant-design:reload-outlined"-->
      <!--        color="var(&#45;&#45;el-text-color-placeholder)"-->
      <!--        :hover-color="isDark ? '#fff' : 'var(&#45;&#45;el-color-black)'"-->
      <!--      />-->
    </span>
    <ContextMenu
      trigger="click"
      :schema="[
        {
          icon: 'ant-design:sync-outlined',
          label: 'Reload current',
          command: () => {
            refreshSelectedTag(selectedTag)
          }
        },
        {
          icon: 'ant-design:close-outlined',
          label: 'Close current',
          disabled: !!visitedViews?.length && selectedTag?.meta.affix,
          command: () => {
            closeSelectedTag(selectedTag!)
          }
        },
        {
          divided: true,
          icon: 'ant-design:vertical-right-outlined',
          label: 'Close left',
          disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath,
          command: () => {
            closeLeftTags()
          }
        },
        {
          icon: 'ant-design:vertical-left-outlined',
          label: 'Close right',
          disabled:
            !!visitedViews?.length &&
            selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath,
          command: () => {
            closeRightTags()
          }
        },
        {
          divided: true,
          icon: 'ant-design:tag-outlined',
          label: 'Close other',
          command: () => {
            closeOthersTags()
          }
        },
        {
          icon: 'ant-design:line-outlined',
          label: 'Close all',
          command: () => {
            closeAllTags()
          }
        }
      ]"
    >
      <span
        :class="`${prefixCls}__tool`"
        class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
      >
        <!--        <Icon-->
        <!--          icon="ant-design:setting-outlined"-->
        <!--          color="var(&#45;&#45;el-text-color-placeholder)"-->
        <!--          :hover-color="isDark ? '#fff' : 'var(&#45;&#45;el-color-black)'"-->
        <!--        />-->
      </span>
    </ContextMenu>
  </div>
</template>

<style scoped>
.v-tags-view {
  :deep(.el-scrollbar__view) {
    height: 100%;
  }
}
.v-tags-view__tool {
  position: relative;
  &::before {
    position: absolute;
    top: 1px;
    left: 0;
    width: 100%;
    height: calc(100% - 1px);
    border-left: 1px solid var(--el-border-color);
    content: '';
  }
}
.v-tags-view__tool--first {
  &::before {
    position: absolute;
    top: 1px;
    left: 0;
    width: 100%;
    height: calc(100% - 1px);
    border-right: 1px solid var(--el-border-color);
    border-left: none;
    content: '';
  }
}
.v-tags-view__item {
  position: relative;
  top: 2px;
  height: calc(100% - 6px);
  padding-right: 25px;
  margin-left: 4px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  &:not(.v-tags-view__item--affix):hover {
    .v-tags-view__item--close {
      display: block;
    }
  }
  &:not(.is-active):hover {
    color: var(--el-color-primary);
  }
  &.is-active {
    color: var(--el-color-white);
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);
    .v-tags-view__item--close {
      :deep(svg) {
        color: var(--el-color-white) !important;
      }
    }
  }
}
.v-tags-view__item--close {
  position: absolute;
  top: 50%;
  right: 5px;
  display: none;
  transform: translate(0, -50%);
}
.dark {
  .v-tags-view__tool--first {
    &::after {
      display: none;
    }
  }
  .v-tags-view__item {
    border: 1px solid var(--el-border-color);
    &:not(.is-active):hover {
      color: var(--el-color-primary);
    }
    &.is-active {
      color: var(--el-color-white);
      background-color: var(--el-color-primary);
      border: 1px solid var(--el-color-primary);
      .v-tags-view__item--close {
        :deep(svg) {
          color: var(--el-color-white) !important;
        }
      }
    }
  }
}
</style>
