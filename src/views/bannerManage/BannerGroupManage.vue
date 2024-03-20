<template>
  <BannerGroupSearch @getSearchList="onSearchGrid" :searchParam="searchParam" />
  <BannerGroupGrid
    :data="gridInfo"
    :pageParam="pageParam"
    @pageChange="onPageChange"
    @bannerGroupDeletId="bannerGroupDeleteListApi"
  />
</template>

<script setup lang="ts">
import BannerGroupSearch from '@/views/bannerManage/BannerGroupSearch.vue'
import BannerGroupGrid from '@/views/bannerManage/BannerGroupGrid.vue'
import BannerService from '@/api/bannerService'
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
  postStartAt: today.add(-1, 'month').format('YYYYMMDD'),
  postEndAt: today.format('YYYYMMDD'),
  name: null,
  postYn: ''
})
// 페이징 parameter.
const pageParam = ref({
  pageNo: 1,
  rowCnt: 20
})
// BannerService 조회 값을 자식(bannerManageeGrid)컨포넌트로 보냄
const gridInfo = ref(null)

/********* Event Handler *********/
// 조회버튼 클릭 시 호출
const onSearchGrid = () => {
  getBannerGroupListApi()
}
// 페이지 변경시 호출
const onPageChange = () => {
  getBannerGroupListApi()
}

/********* Service API *********/
// Service 메인상단 배너 관리 조회
const getBannerGroupListApi = () => {
  loadStart()
  const param = { ...searchParam.value, ...pageParam.value }
  BannerService.getBannerGroupList(param).then((res) => {
    gridInfo.value = res.data
  })
  loadDone()
}
// Delete button cilck data  action
const bannerGroupDeleteListApi = (bannerGroupDeletId: any) => {
  if (isEmpty(bannerGroupDeletId)) {
    alert('삭제할 데이터가 없습니다.', '알림', null, null)
    return false
  }
  confirm('삭제 하시겠습니까?', '삭제', null, (action) => {
    if (action === 'confirm') {
      const deleteList = bannerGroupDeletId.map((checkInfo) => checkInfo.id)
      let obj = { deleteList: deleteList }
      BannerService.deleteBannerGroupList(obj).then((res) => {
        let alertMsg = ''
        if (res.data.saveStatus) {
          alertMsg = `삭제되었습니다.`
        } else {
          alertMsg = '삭제에 실패하였습니다.'
        }
        alert(alertMsg, '삭제', null, () => {
          getBannerGroupListApi()
        })
      })
    }
  })
}
/********* Local Functions *********/

/********* lifeCycle *********/
onMounted(() => {
  getBannerGroupListApi()
})
</script>
<style scoped></style>
