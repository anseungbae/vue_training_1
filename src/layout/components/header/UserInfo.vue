<script setup lang="ts">
import { useUserStore } from '@/store/modules/user.ts'

const userStore = useUserStore()

const loginOut = () => {
  userStore.logoutConfirm()
}
const getEmailIdSubstr = () => {
  if (userStore.getUserInfo && userStore.getUserInfo.emailId) {
    return userStore.getUserInfo.emailId.substring(0, 2).toUpperCase()
  } else {
    return ''
  }
}
</script>

<template>
  <ElDropdown trigger="click">
    <div class="flex items-center">
      <el-avatar>{{ getEmailIdSubstr() }}</el-avatar>
      <!--      <img-->
      <!--        src="@/assets/avatar.jpg"-->
      <!--        alt=""-->
      <!--        class="w-[calc(var(&#45;&#45;logo-height)-25px)] rounded-[50%]"-->
      <!--      />-->
      <!--      <span class="<lg:hidden text-14px pl-[5px] text-[var(&#45;&#45;top-header-text-color)]">{{-->
      <!--        userStore.getUserInfo?.emailId-->
      <!--      }}</span>-->
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="loginOut">Login Out</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style scoped lang="scss"></style>
