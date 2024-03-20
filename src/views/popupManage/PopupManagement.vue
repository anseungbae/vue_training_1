<template>
  <PopupManageSearch :searchParam="searchParam" @getSearchList="onSearch" />
  <PopupManageGrid
    ref="popupGridRef"
    :data="gridInfo"
    :pageParam="pageParam"
    @pageChange="onPageChange"
    @getDeleteList="onDeleteList"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PopupService from '@/api/popupService'
import PopupManageSearch from '@/views/popupManage/PopupManageSearch.vue'
import PopupManageGrid from '@/views/popupManage/PopupManageGrid.vue'
import { usePageLoading, useAlert } from '@/hooks/web/usePageLoading.ts'
const { loadStart, loadDone } = usePageLoading()
import dayjs from 'dayjs'

/********* Local Variable *********/
const today = dayjs(new Date())
const searchParam = ref({
  title: '', // 제목
  pageIds: '', // 적용페이지
  fromCreatedAt: today.add(-1, 'month').format('YYYYMMDD'), // 게시시작일
  toCreatedAt: today.format('YYYYMMDD'), // 게시종료일
  postYn: '' //  게시여부
})
const pageParam = ref({
  pageNo: 1,
  rowCnt: 20
})
const gridInfo = ref(null)
const popupGridRef = ref()

/********* Service API *********/
// 목록 조회
const getPopupManageApi = () => {
  loadStart()
  const param = { ...searchParam.value, ...pageParam.value }
  PopupService.getPopupList(param).then((res) => {
    gridInfo.value = res.data
  })
  loadDone()
}

/********* Event Handler *********/
//  조회버튼 클릭 시 호출
const onSearch = () => {
  getPopupManageApi()
}
//  페이지 변경시 호출
const onPageChange = () => {
  getPopupManageApi()
}

//  삭제목록 조회
const onDeleteList = (checkedID) => {
  PopupService.deletePopupList({ deleteList: checkedID }).then((res) => {
    let alertMsg = ''
    if (res.data.saveStatus) {
      alertMsg = '삭제하였습니다.'
    } else {
      alertMsg = res.data.message || 'Error'
    }
    alert(alertMsg, '알림', null, () => {
      if (res.data.saveStatus) {
        pageParam.value.pageNo = 1
        getPopupManageApi()
      }
    })
  })
}

/********* Local Functions *********/

/********* lifeCycle *********/
onMounted(() => {
  getPopupManageApi()
})
</script>
<style scoped></style>
