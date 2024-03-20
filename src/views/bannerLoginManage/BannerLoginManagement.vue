<template>
  <BannerLoginManageSearch :searchParam="searchParam" @getSearchList="onSearch" />
  <BannerLoginManageGrid
    :data="gridInfo"
    :pageParam="pageParam"
    @pageChange="onPageChange"
    @getDeleteList="onDelete"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BannerService from '@/api/bannerService'
import BannerLoginManageSearch from '@/views/bannerLoginManage/BannerLoginManageSearch.vue'
import BannerLoginManageGrid from '@/views/bannerLoginManage/BannerLoginManageGrid.vue'
import dayjs from 'dayjs'
import { usePageLoading, useAlert } from '@/hooks/web/usePageLoading.ts'
const { loadStart, loadDone } = usePageLoading()

/********* Local Variable *********/
const { alert, confirm } = useAlert()
const today = dayjs(new Date())
const searchParam = ref({
  name: '', // 배너 그룹명
  postStartAt: today.add(-1, 'month').format('YYYYMMDD'), // 게시일자 From
  postEndAt: today.format('YYYYMMDD'), //게시일자 To
  postYn: '' //  게시여부
})
const pageParam = ref({
  pageNo: 1,
  rowCnt: 20
})
const gridInfo = ref(null)

/********* Service API *********/
// 목록 조회
const getLoginBannerApi = () => {
  loadStart()
  const param = { ...searchParam.value, ...pageParam.value }
  BannerService.getBannerLoginImageList(param).then((res) => {
    gridInfo.value = res.data
  })
  loadDone()
}

/********* Event Handler *********/
//  조회버튼 클릭 시 호출
const onSearch = () => {
  getLoginBannerApi()
}
//  페이지 변경시 호출
const onPageChange = () => {
  getLoginBannerApi()
}

//  삭제목록 조회
const onDelete = (checkedID) => {
  BannerService.deleteBannerLoginImageList({ deleteList: checkedID }).then((res) => {
    let alertMsg = ''
    if (res.data.saveStatus) {
      alertMsg = '삭제하였습니다.'
    } else {
      alertMsg = res.data.message || 'Error'
    }
    alert(alertMsg, '알림', null, () => {
      if (res.data.saveStatus) {
        pageParam.value.pageNo = 1
        getLoginBannerApi()
      }
    })
  })
}

/********* Local Functions *********/

/********* lifeCycle *********/
onMounted(() => {
  getLoginBannerApi()
})
</script>
<style scoped></style>
