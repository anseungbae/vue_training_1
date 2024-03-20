<template>
  <BannerImageSearch @searchList="onSearch" @searchReset="onSearchReset" />
  <BannerImageGrid
    :dataProp="bannerImageList"
    @pageChange="onPageChange"
    :totalElemnetCnt="totalCnt"
    @ChangeRowsPerPage="onChangeRowsPerPage"
    @getBannerImageList="getBannerImageList"
  />
</template>

<script setup lang="ts">
import BannerImageSearch from '@/views/bannerImage/BannerImageSearch.vue'
import BannerImageGrid from '@/views/bannerImage/BannerImageGrid.vue'
import { onMounted, reactive, ref } from 'vue'
import BannerService from '@/api/bannerService'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'

/** Local Variable **/
const { loadStart, loadDone } = usePageLoading()
const searchParam = reactive({
  rowCnt: 20,
  pageNo: 1,
  name: null, //  이미지명
  imageDesc: null, //  이미지 설명
  linkUrl: null, //  링크주소
  useYn: null, // 사용여부
  usePage: null // 사용 페이지
})
const totalCnt = ref(0)

//  배너이미지 목록을  관리.
const bannerImageList = ref([])

/** Service API **/
onMounted(() => {
  getBannerImageList()
})

const getBannerImageList = () => {
  loadStart()
  BannerService.getBannerImageList(searchParam).then((res) => {
    //  조회한 전체 Count 및 현재 페이지를 State값으로 넣어야 아래 Pagination에 반영
    totalCnt.value = Number(res.data.totalElements)

    //  조회해온 목록을 넣는다.
    bannerImageList.value = res.data.bannerImageList ? res.data.bannerImageList : []
  })
  loadDone()
}
/** Event Handler **/

/** Local Functions **/

const onSearch = (param: any) => {
  // searchParam = param
  searchParam.name = param.name
  searchParam.imageDesc = param.imageDesc
  searchParam.linkUrl = param.linkUrl
  searchParam.useYn = param.useYn == 'All' ? '' : param.useYn
  searchParam.usePage = param.usePage == 'All' ? '' : param.usePage
  getBannerImageList()
}

const onSearchReset = () => {
  searchParam.name = null
  searchParam.imageDesc = null
  searchParam.linkUrl = null
  searchParam.useYn = null
  searchParam.usePage = null
  searchParam.rowCnt = 20
  searchParam.pageNo = 1
  getBannerImageList()
}

//  PageChange
const onPageChange = (page: any) => {
  searchParam.pageNo = page.value.pageNo
  searchParam.rowCnt = page.value.rowCnt
  getBannerImageList()
}

//  페이지 사이즈 변경.
const onChangeRowsPerPage = (page: any) => {
  searchParam.pageNo = page.value.pageNo
  searchParam.rowCnt = page.value.rowCnt
  getBannerImageList()
}
</script>

<style scoped lang="scss"></style>
