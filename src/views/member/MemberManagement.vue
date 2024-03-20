<template>
  <MemberManageSearch :searchParam="searchParam" @getSearchList="onSearchGrid" />
  <MemberManageGrid
    ref="memberGridRef"
    :data="gridInfo"
    :pageParam="pageParam"
    @pageChange="onPageChange"
  />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MemberManageSearch from '@/views/member/MemberManageSearch.vue'
import MemberManageGrid from '@/views/member/MemberManageGrid.vue'
import UserService from '@/api/userService'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'
const { loadStart, loadDone } = usePageLoading()

/********* Local Variable *********/
// 조회조건 parameter.
const searchParam = ref({
  dateSts: '',
  fromAt: null,
  toAt: null,
  userNmId: null,
  userTel: null,
  bizNmId: null,
  planType: null,
  vendorNickName: null,
  userSts: null
})

// 페이징 parameter.
const pageParam = ref({
  pageNo: 1,
  rowCnt: 20
})

// UserService 조회 값을 자식(MemberManageGrid)컨포넌트로 보냄
const gridInfo = ref(null)

//  Grid Reference
const memberGridRef = ref()

/********* Service API *********/
// UserService 목록 조회
const getUserListApi = () => {
  loadStart()
  const userList = { ...searchParam.value, ...pageParam.value }
  UserService.getUserList(userList).then((res) => {
    gridInfo.value = res.data
  })
  loadDone()
}

/********* Event Handler *********/

/********* Local Functions *********/
// 조회버튼 클릭 시 호출
const onSearchGrid = () => {
  getUserListApi()
}
// 페이지 변경시 호출
const onPageChange = () => {
  getUserListApi()
}

/********* lifeCycle *********/
onMounted(() => {
  getUserListApi()
})
</script>

<style scoped></style>
