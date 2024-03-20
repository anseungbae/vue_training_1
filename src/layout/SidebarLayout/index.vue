<template>
  <section :class="[`${prefixCls}`, `${prefixCls}__${layout}`, 'w-[100%] h-[100%] relative']">
    <HeaderToolbar class="flex-1"></HeaderToolbar>

    <div
      :class="[
        'absolute top-[var(--logo-height)+1px] left-0 w-full h-[calc(100%-1px-var(--top-tool-height))] flex'
      ]"
    >
      <!-- Menu Side Bar Start -->
      <side-bar class="!h-full relative layout-border__right"></side-bar>
      <!-- Menu Side Bar End -->
      <div
        :class="[
          'flex flex-col',
          {
            'w-[calc(100%-var(--left-menu-min-width))] left-[var(--left-menu-min-width)]': collapse,
            'w-[calc(100%-var(--left-menu-max-width))] left-[var(--left-menu-max-width)]': !collapse
          }
        ]"
        style="transition: all var(--transition-time-02)"
      >
        <div class="flex items-center h-10 bg-white" style="border-bottom: 1px solid #dee0e7">
          <el-row class="w-full">
            <el-col :span="4" class="pl-6">{{ nowMenu }}</el-col>
            <el-col :span="20" class="text-right">
              <Breadcrumb></Breadcrumb>
            </el-col>
          </el-row>
        </div>
        <div :class="[`${prefixCls}-content`, 'flex flex-1']">
          <ElScrollbar
            :class="[
              `${prefixCls}-content-scrollbar w-full`,
              {
                '!h-[calc(100%-var(--tags-view-height))] mt-[calc(var(--tags-view-height))]':
                  fixedHeader && isTagsView
              }
            ]"
          >
            <!-- Contents View 영역 Start -->
            <ContentsView></ContentsView>
            <!-- Contents View 영역 End -->
          </ElScrollbar>
        </div>
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
import { usePageLoading } from '@/hooks/web/usePageLoading'
import Breadcrumb from '@/layout/components/header/Breadcrumb.vue'
import { useRouter } from 'vue-router'

const { getPrefixCls } = useDesign()
const appStore = useAppStore()
const { currentRoute } = useRouter()

const prefixCls = getPrefixCls('layout')

const collapse = computed(() => false)
const layout = computed(() => 'classic')

const fixedHeader = computed(() => true)
const isTagsView = computed(() => false)
const usePageLoad = usePageLoading()

const nowMenu = computed(() => {
  return currentRoute.value?.meta?.title
})
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
