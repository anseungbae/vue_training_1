<template>
  <QuitUserManageSearch :searchParam="searchParam" @getSearchList="onSearch" />
  <QuitUserManageGrid :data="gridInfo" :pageParam="pageParam" @pageChange="onPageChange" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserService from '@/api/userService'
import QuitUserManageSearch from '@/views/quitUserManage/QuitUserManageSearch.vue'
import QuitUserManageGrid from '@/views/quitUserManage/QuitUserManageGrid.vue'
import dayjs from 'dayjs'
import { usePageLoading, useAlert } from '@/hooks/web/usePageLoading.ts'
const { loadStart, loadDone } = usePageLoading()

/********* Local Variable *********/
const { alert, confirm } = useAlert()
const today = dayjs(new Date())
const searchParam = ref({
  userNmId: '', // 회원명/ID
  fromQuitAt: today.add(-1, 'month').format('YYYYMMDD'), // 탈퇴 일자 From
  toQuitAt: today.format('YYYYMMDD'), //탈퇴 일자 To
  bizNmId: '' // 사업장명/ID
})
const pageParam = ref({
  pageNo: 1,
  rowCnt: 20
})
const gridInfo = ref(null)

/********* Service API *********/
// 목록 조회
const getQuitUserApi = () => {
  loadStart()
  const param = { ...searchParam.value, ...pageParam.value }
  UserService.getQuitUserList(param).then((res) => {
    gridInfo.value = res.data
  })
  loadDone()
}

/********* Event Handler *********/
//  조회버튼 클릭 시 호출
const onSearch = () => {
  getQuitUserApi()
}
//  페이지 변경시 호출
const onPageChange = () => {
  getQuitUserApi()
}

/********* Local Functions *********/

/********* lifeCycle *********/
onMounted(() => {
  getQuitUserApi()
})
</script>
<style scoped></style>
