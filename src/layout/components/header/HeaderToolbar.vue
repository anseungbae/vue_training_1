<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { computed } from 'vue'
import UserInfo from '@/layout/components/header/UserInfo.vue'

const { getPrefixCls, variables } = useDesign()

const logoPrefixCls = getPrefixCls('logo')
const mobile = computed(() => false)
const prefixCls = getPrefixCls('tool-header')
const collapse = computed(() => false)
</script>

<template>
  <div
    :id="`${variables.namespace}-tool-header`"
    :class="`${prefixCls} h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between bg-white`"
    style="border-bottom: 1px solid #dee0e7"
  >
    <!-- Logo Start -->
    <div
      :class="[
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
          'flex items-center cursor-pointer relative decoration-none overflow-hidden'
        ]"
        to="/"
      >
        <img src="@/assets/gs-logo.png" class="h-[var(--logo-height)]" />
      </router-link>
    </div>
    <!-- Logo End -->

    <div class="h-full flex items-center">
      <UserInfo></UserInfo>
    </div>
  </div>
</template>

<style scoped>
.v-tool-header {
  transition: left var(--transition-time-02);
}
</style>
