<script setup lang="ts">
// import { useTagsViewStore } from '@/store/modules/tagsView'
// import { useAppStore } from '@/store/modules/app'
// import { Footer } from '@/components/Footer'
import { computed } from 'vue'

// const appStore = useAppStore()

// const footer = computed(() => appStore.getFooter)

// const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  // return tagsViewStore.getCachedViews
  return []
})
</script>

<template>
  <section
    :class="[
      'flex-1 p-[var(--app-content-padding)] w-[100%] bg-[var(--app-content-bg-color)] flex flex-col'
    ]"
  >
    <router-view>
      <template #default="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </template>
    </router-view>
  </section>
  <!--  <Footer v-if="footer" />-->
</template>
