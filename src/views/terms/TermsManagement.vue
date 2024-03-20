<template>
  <TermsManageSearch @searchList="onSearchGrid" />
  <TermsManageGrid :dataProp="gridInfoProp" @pageChange="onPageChange" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TermsManageSearch from '@/views/terms/TermsManageSearch.vue'
import TermsManageGrid from '@/views/terms/TermsManageGrid.vue'
import TermsService from '@/api/termsService'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'
const { loadStart, loadDone } = usePageLoading()
/** Local Variable **/
const searchParam = ref({
  termsType: null,
  termsName: null
})
const pageParam = ref({
  pageNo: 1,
  rowCnt: 20
})
const gridInfoProp = ref(null)

/** Service API **/

/** Event Handler **/
onMounted(() => {
  getTermsManageApi()
})
/** Local Functions **/
//  넘어온 조회값
const onSearchGrid = (param) => {
  searchParam.value = param
  getTermsManageApi()
}
//  페이지 변경시 호출
const onPageChange = (param) => {
  pageParam.value = param.value
  getTermsManageApi()
}

// grid data call 설정
const getTermsManageApi = () => {
  loadStart()
  const searchCondition = { ...searchParam.value, ...pageParam.value }
  TermsService.getTermsList(searchCondition).then((res) => {
    gridInfoProp.value = res.data
  })
  loadDone()
}
</script>
<style scoped></style>
