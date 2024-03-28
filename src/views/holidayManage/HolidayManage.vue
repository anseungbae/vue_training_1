<template>
  <HolidayManageSearch @getSearchList="onSearchGrid" :searchParam="searchParam" />
  <HolidayManageTab :data="gridInfo" />
</template>

<script lang="ts" setup>
import HolidayManageSearch from '@/views/holidayManage/HolidayManageSearch.vue'
import HolidayManageTab from '@/views/holidayManage/HolidayManageTab.vue'
import HolidayService from '@/api/holidayService'
import { ref, onMounted } from 'vue'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'
import dayjs from 'dayjs'

/********* Local Variable *********/
const { loadStart, loadDone } = usePageLoading()

const gridInfo = ref(null)
const today = dayjs(new Date())
const searchParam = ref({
  month: today.format('YYYYMM'),
  holidayType: 'H',
  searchValue: null
})
/** Service API **/
// Service 메인상단 배너 관리 조회
const getHolidayManageListApi = () => {
  loadStart()
  const param = {
    month: searchParam.value.month,
    searchValue: searchParam.value.searchValue,
    holidayType: searchParam.value.holidayType
  }
  HolidayService.getHolidayList(param).then((res) => {
    gridInfo.value = res.data
    console.log('gridInfo.value ::  ', gridInfo.value)
  })
  loadDone()
}
// grid data call 설정

/** Event Handler **/
// 조회버튼 클릭 시 호출
const onSearchGrid = () => {
  getHolidayManageListApi()
}

/********* lifeCycle *********/
onMounted(() => {
  getHolidayManageListApi()
})
/** Local Functions **/
</script>
<style lang="scss" scoped></style>
