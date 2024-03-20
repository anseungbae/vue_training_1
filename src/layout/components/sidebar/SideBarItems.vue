<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  parentPath: String,
  routes: Array<AppCustomRouteRecordRaw>
})
const routeList = computed(() => props.routes || [])
</script>
<template>
  <template v-for="routeInfo in routeList">
    <template v-if="!routeInfo.children || routeInfo.children.length == 0">
      <ElMenuItem :index="routeInfo.fullPath" style="--el-menu-hover-bg-color: #f6faff">
        <!-- 공통 Menu Title Start -->
        <div>
          <!--          <Icon icon="{{routeInfo.meta.icon}}"></Icon>-->
          <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
            {{ routeInfo.meta.title }}
          </span>
        </div>
        <!-- 공통 Menu Title End -->
      </ElMenuItem>
    </template>
    <template v-else>
      <ElSubMenu :index="routeInfo.path" style="--el-menu-hover-bg-color: #f6faff">
        <template #title>{{ routeInfo.meta.title }}</template>
        <!-- 공통 Menu Title Start -->
        <!--        <div>-->
        <!--          <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">-->
        <!--            {{ routeInfo.meta.title }}-->
        <!--          </span>-->
        <!--        </div>-->
        <!-- 공통 Menu Title End -->
        <!-- 다시 SideBarItems 호출 Start -->
        <SideBarItems :parent-path="routeInfo.fullPath" :routes="routeInfo.children"></SideBarItems>
        <!-- 다시 SideBarItems 호출 End -->
      </ElSubMenu>
    </template>
  </template>
</template>

<style scoped>
.el-menu {
  border-bottom: 1px solid #e5e7eb;
}
.el-menu-item{
  height: 40px;
}
</style>
