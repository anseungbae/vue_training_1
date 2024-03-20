<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { computed, ref, unref, watch } from 'vue'
import { filter, treeToList } from '@/utils/tree'
import { asyncRouterMap } from '@/router'

const { getPrefixCls } = useDesign()
const { currentRoute } = useRouter()

const prefixCls = getPrefixCls('breadcrumb')
const levelList = ref<AppRouteRecordRaw[]>([])

const breadCrumbList = computed(() => treeToList<AppRouteRecordRaw[]>(unref(levelList)))

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    if (route.path.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  },
  {
    immediate: true
  }
)
function getBreadcrumb() {
  const currentPath = currentRoute.value.matched.slice(-1)[0].path
  levelList.value = filter<AppRouteRecordRaw>(unref(asyncRouterMap), (node: AppRouteRecordRaw) => {
    return node.fullPath === currentPath
  })
}
</script>

<template>
  <ElBreadcrumb
    separator="/"
    :class="`${prefixCls} flex items-center h-full w-full justify-end pr-6`"
  >
    <TransitionGroup appear enter-active-class="animate__animated animate__fadeInRight">
      <template
        v-for="itemInfo in breadCrumbList"
        :key="itemInfo?.path ? itemInfo.path : itemInfo.fullPath"
      >
        <ElBreadcrumbItem>
          {{ itemInfo?.meta?.title }}
        </ElBreadcrumbItem>
      </template>
    </TransitionGroup>
  </ElBreadcrumb>
</template>

<style scoped>
:deep(.el-breadcrumb__item) {
  display: flex;
  .el-breadcrumb__inner {
    display: flex;
    align-items: center;
    color: var(--top-header-text-color);
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
:deep(.el-breadcrumb__item):not(:last-child) {
  .el-breadcrumb__inner {
    color: var(--top-header-text-color);
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
:deep(.el-breadcrumb__item):last-child {
  .el-breadcrumb__inner {
    color: var(--el-text-color-placeholder);
    &:hover {
      color: var(--el-text-color-placeholder);
    }
  }
}
</style>
