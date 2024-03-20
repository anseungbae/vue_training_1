<template>
  <div
    :id="prefixCls"
    :class="[
      `${prefixCls} ${prefixCls}__${unref(menuMode)}`,
      'h-[100%] overflow-hidden flex-col bg-[var(--left-menu-bg-color)]',
      'shadow-[2px_0_2px_0_rgba(42,48,66,.06)]',
      {
        'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu',
        'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu'
      },
      'border-r-[1px] border-solid border-[rgb(222, 224, 231)]'
    ]"
  >
    <ElScrollbar>
      <ElMenu
        :defaultActive="unref(activeMenu)"
        :mode="`${unref(menuMode) as modeType}`"
        :collapse="unref(collapse)"
        :uniqueOpened="unref(uniqueOpened)"
        backgroundColor="var(--left-menu-bg-color)"
        textColor="var(--left-menu-text-color)"
        activeTextColor="var(--left-menu-text-active-color)"
        :popperClass="`${prefixCls}-popper--vertical`"
        style="--el-menu-hover-bg-color: #f6faff; border: none;"
        @select="onMenuSelect"
      >
        <SideBarItems :parent-path="'/'" :routes="routers"></SideBarItems>
        <!--        {{-->
        <!--          default: () => {-->
        <!--            const { renderMenuItem } = useRenderMenuItem()-->
        <!--            return renderMenuItem(unref(routers))-->
        <!--          }-->
        <!--        }}-->
      </ElMenu>
    </ElScrollbar>
  </div>
</template>
<script setup lang="ts">
import { computed, type PropType, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useDesign } from '@/hooks/web/useDesign'
import SideBarItems from '@/layout/components/sidebar/SideBarItems.vue'
import { asyncRouterMap } from '@/router'

type modeType = 'vertical' | 'horizontal'

const props = defineProps({
  menuSelect: {
    type: Function as PropType<(index: string) => void>,
    default: undefined
  }
})
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('menu')

const layout = computed(() => 'classic')
const menuMode = computed(() => 'vertical')

const { push, currentRoute } = useRouter()
const routers = computed(() => asyncRouterMap)
const collapse = computed(() => false)
const uniqueOpened = computed(() => false)
const activeMenu = computed(() => {
  const { meta, path } = unref(currentRoute)
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})
const onMenuSelect = (index: string, indexPath: string[]) => {
  if (props.menuSelect) {
    props.menuSelect(index)
  }
  // if (isUrl(index)) {
  //   window.open(index)
  // } else {
  //   push(index)
  // }

  push({
    path: index,
    query: {
      _r: Date.now()
    }
  })
}
</script>

<style scoped>
.v-menu {
  position: relative;
  transition: width var(--transition-time-02);
  :deep(.v-menu) {
    width: 100% !important;
    border-right: none;
    .is-active {
      & > .v-sub-menu__title {
        color: var(--left-menu-text-active-color) !important;
      }
    }
    .v-menu-item {
      &.is-active {
        color: var(--left-menu-text-active-color) !important;
        background-color: var(--left-menu-bg-active-color) !important;
        position: relative;
        &:hover {
          background-color: var(--left-menu-bg-active-color) !important;
        }
      }
    }
  }
  :deep(.v-menu--collapse) {
    width: var(--left-menu-min-width);
  }
  :deep(.horizontal-collapse-transition) {
    .v-menu__title {
      display: none;
    }
  }
}
.v-menu :deep(.v-menu) .v-sub-menu__title:hover,
.v-menu :deep(.v-menu) .v-menu-item:hover {
  color: var(--left-menu-text-active-color) !important;
  background-color: var(--left-menu-bg-color) !important;
}
.v-menu :deep(.v-menu) .v-menu .v-sub-menu__title,
.v-menu :deep(.v-menu) .v-menu .v-menu-item:not(.is-active) {
  background-color: var(--left-menu-bg-light-color) !important;
}
.v-menu :deep(.v-menu--collapse) > .is-active,
.v-menu :deep(.v-menu--collapse) > .is-active > .v-sub-menu__title {
  position: relative;
  background-color: var(--left-menu-collapse-bg-active-color) !important;
}
.v-menu__horizontal {
  height: calc(var(--top-tool-height)) !important;
  :deep(.v-menu--horizontal) {
    height: calc(var(--top-tool-height));
    border-bottom: none;
    & > .v-sub-menu {
      &.is-active {
        .v-sub-menu__title {
          border-bottom-color: var(--el-color-primary) !important;
        }
      }
    }
    .v-menu-item {
      &.is-active {
        position: relative;
        &::after {
          display: none !important;
        }
      }
    }
    .v-menu__title {
      max-height: calc(var(--top-tool-height) - 2px) !important;
      line-height: calc(var(--top-tool-height) - 2px);
    }
  }
}
</style>
<style>
.v-menu-popper--vertical .is-active > .el-sub-menu__title,
.v-menu-popper--horizontal .is-active > .el-sub-menu__title {
  color: var(--left-menu-text-active-color) !important;
}
.v-menu-popper--vertical .el-sub-menu__title:hover,
.v-menu-popper--vertical .el-menu-item:hover,
.v-menu-popper--horizontal .el-sub-menu__title:hover,
.v-menu-popper--horizontal .el-menu-item:hover {
  color: var(--left-menu-text-active-color) !important;
  background-color: var(--left-menu-bg-color) !important;
}
.v-menu-popper--vertical .el-menu-item.is-active,
.v-menu-popper--horizontal .el-menu-item.is-active {
  position: relative;
  background-color: var(--left-menu-bg-active-color) !important;
}
.v-menu-popper--vertical .el-menu-item.is-active:hover,
.v-menu-popper--horizontal .el-menu-item.is-active:hover {
  background-color: var(--left-menu-bg-active-color) !important;
}

.el-sub-menu {
  border-bottom: 1px solid #e5e7eb;
}

.el-sub-menu__title {
  height: 40px;
}

</style>
