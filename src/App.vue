<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const currentSize = computed(() => appStore.getCurrentSize)
onMounted(() => {
  // appStore.initTheme()
})
</script>

<template>
  <ElConfigProvider namespace="el" :size="currentSize">
    <RouterView />
  </ElConfigProvider>
</template>

<style lang="scss">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
html #app,
body #app {
  width: 100%;
  height: 100%;
}
.v-app-grey-mode {
  filter: grayscale(100%);
}
</style>
