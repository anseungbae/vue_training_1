<template>
  <section :class="[`${prefixCls}`, `${prefixCls}__${layout}`, 'w-[100%] h-[100%] relative']">
    <div
      :class="[
        'flex items-center bg-[var(--top-header-bg-color)] relative layout-border__bottom dark:bg-[var(--el-bg-color)]'
      ]"
    >
      <!-- Logo Start -->
      <div
        :class="[
          'bg-[var(--left-menu-bg-color)] relative',
          {
            '!pl-0': mobile && collapse,
            'w-[var(--left-menu-min-width)]': collapse,
            'w-[var(--left-menu-max-width)]': !collapse
          }
        ]"
        style="transition: all var(--transition-time-02)"
      >
        <router-link
          :class="[
            `${logoPrefixCls}`,
            'flex !h-[var(--logo-height)] items-center cursor-pointer pl-8px relative decoration-none overflow-hidden'
          ]"
          to="/"
        >
          <img
            src="@/assets/gs-logo.png"
            :class="['w-[65%]', 'h-[calc(var(--logo-height)-10px)]']"
          />
        </router-link>
      </div>
      <!-- Logo End -->
      <HeaderToolbar class="flex-1"></HeaderToolbar>
    </div>

    <div
      :class="[
        'absolute top-[var(--logo-height)+1px] left-0 w-full h-[calc(100%-1px-var(--logo-height))] flex'
      ]"
    >
      <!-- Menu Side Bar Start -->
      <side-bar class="!h-full relative layout-border__right"></side-bar>
      <!-- Menu Side Bar End -->

      <div
        :class="[
          `${prefixCls}-content`,
          'h-[100%]',
          {
            'w-[calc(100%-var(--left-menu-min-width))] left-[var(--left-menu-min-width)]': collapse,
            'w-[calc(100%-var(--left-menu-max-width))] left-[var(--left-menu-max-width)]': !collapse
          }
        ]"
        style="transition: all var(--transition-time-02)"
      >
        <ElScrollbar
          :class="[
            `${prefixCls}-content-scrollbar`,
            {
              '!h-[calc(100%-var(--tags-view-height))] mt-[calc(var(--tags-view-height))]':
                fixedHeader && isTagsView
            }
          ]"
        >
          <!-- Tab View 영역 Start -->
          <TagsView
            :class="[
              'layout-border__bottom absolute',
              {
                '!fixed top-0 left-0 z-10': fixedHeader,
                'w-[calc(100%-var(--left-menu-min-width))] !left-[var(--left-menu-min-width)] mt-[calc(var(--logo-height)+1px)]':
                  collapse && fixedHeader,
                'w-[calc(100%-var(--left-menu-max-width))] !left-[var(--left-menu-max-width)] mt-[calc(var(--logo-height)+1px)]':
                  !collapse && fixedHeader
              }
            ]"
            style="
              transition:
                width var(--transition-time-02),
                left var(--transition-time-02);
            "
          ></TagsView>

          <!-- Tab View 영역 End -->
          <!-- Contents View 영역 Start -->
          <ContentsView></ContentsView>
          <!-- Contents View 영역 End -->
        </ElScrollbar>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import HeaderToolbar from '@/layout/components/header/HeaderToolbar.vue'
import { useDesign } from '@/hooks/web/useDesign'
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import SideBar from '@/layout/components/sidebar/SideBar.vue'
import ContentsView from '@/layout/components/ContentsView.vue'
import TagsView from '@/layout/components/tagsview/TagsView.vue'
import { usePageLoading } from '@/hooks/web/usePageLoading'
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')
const logoPrefixCls = getPrefixCls('logo')
const mobile = computed(() => false)

const collapse = computed(() => false)
const layout = computed(() => 'classic')
const fixedHeader = computed(() => true)
const isTagsView = computed(() => false)
</script>
<style scoped>
.v-layout {
  background-color: var(--app-content-bg-color);
  .v-layout-content-scrollbar {
    & > :deep(.el-scrollbar__wrap) {
      & > .el-scrollbar__view {
        display: flex;
        height: 100% !important;
        flex-direction: column;
      }
    }
  }
}
</style>
