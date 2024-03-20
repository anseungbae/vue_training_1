<template>
  <NoticeManageSearch @getSearchList="onSearchGrid" :searchParam="searchParam" />
  <NoticeManageGrid
    :data="gridInfo"
    :pageParam="pageParam"
    @pageChange="onPageChange"
    @noticeDeletId="getDelListApi"
  />
</template>

<script setup lang="ts">
import NoticeManageSearch from '@/views/notice/NoticeManageSearch.vue'
import NoticeManageGrid from '@/views/notice/NoticeManageGrid.vue'
import NoticeService from '@/api/noticeService'
import { onMounted, ref } from 'vue'
import { isEmpty } from '@/utils/is'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'
import { useAlert } from '@/hooks/web/usePageLoading'
import dayjs from 'dayjs'

/********* Local Variable *********/
const { loadStart, loadDone } = usePageLoading()
const { alert, confirm } = useAlert()
const today = dayjs(new Date())

// 조회조건 parameter.
const searchParam = ref({
  fromCreatedAt: today.add(-1, 'month').format('YYYYMMDD'),
  toCreatedAt: today.format('YYYYMMDD'),
  title: null,
  postYn: null
})
// 페이징 parameter.
const pageParam = ref({
  pageNo: 1,
  rowCnt: 20
})
// NoticeService 조회 값을 자식(noticeListManageGrid)컨포넌트로 보냄
const gridInfo = ref(null)

/********* Service API *********/
// Service 공지목록 조회
const getNoticeListApi = () => {
  loadStart()
  const noticeList = { ...searchParam.value, ...pageParam.value }
  NoticeService.getNoticeList(noticeList).then((res) => {
    gridInfo.value = res.data
  })
  loadDone()
}
// Delete button cilck data  action
const getDelListApi = (noticeDeletId: any) => {
  if (isEmpty(noticeDeletId)) {
    alert('삭제할 데이터가 없습니다.', '알림', null, null)
    return false
  }
  confirm('삭제 하시겠습니까?', '삭제', null, (action) => {
    if (action === 'confirm') {
      const deleteList = noticeDeletId.map((checkInfo) => checkInfo.id)
      let obj = { deleteList: deleteList }
      NoticeService.deleteNoticeList(obj).then((res) => {
        let alertMsg = ''
        if (res.data.saveStatus) {
          alertMsg = `삭제되었습니다.`
        } else {
          alertMsg = '삭제에 실패하였습니다.'
        }
        alert(alertMsg, '삭제', null, () => {
          getNoticeListApi()
        })
      })
    }
  })
}

/********* Event Handler *********/
// 조회버튼 클릭 시 호출
const onSearchGrid = () => {
  getNoticeListApi()
}
// 페이지 변경시 호출
const onPageChange = () => {
  getNoticeListApi()
}

/********* Local Functions *********/

/********* lifeCycle *********/
onMounted(() => {
  getNoticeListApi()
})
</script>
<style scoped></style>
