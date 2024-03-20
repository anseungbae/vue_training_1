<template>
  <CodeManageSearch @searchList="onSearch" @searchReset="onSearchReset" />
  <CodeManageGrid
    :dataProp="commonCodeList"
    @pageChange="onPageChange"
    :totalElemnetCnt="totalCnt"
    @ChangeRowsPerPage="onChangeRowsPerPage"
    @getCommonCodeList="getCommonCodeList"
    @deleteCode="deleteCode"
  />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import CodeManageSearch from './CodeManageSearch.vue'
import CodeManageGrid from './CodeManageGrid.vue'
import { useAlert } from '@/hooks/web/usePageLoading'
import CodeService from '@/api/codeService'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'

/** Local Variable **/
const { loadStart, loadDone } = usePageLoading()
const { alert, confirm } = useAlert()
const searchParam = reactive({
  rowCnt: 20,
  pageNo: 1,
  searchTxtType: 'All', //  공통코드 타입
  searchTxtValue: null, //  공통코드 명
  useYn: 'All' // 사용여부
})
const totalCnt = ref(0)

//  휴면유저 목록을  관리.
const commonCodeList = ref([])

/** Service API **/
onMounted(() => {
  getCommonCodeList()
})

const getCommonCodeList = () => {
  let param = {
    rowCnt: searchParam.rowCnt,
    pageNo: searchParam.pageNo,
    searchTxtType: searchParam.searchTxtType == 'All' ? '' : searchParam.searchTxtType, //  공통코드 타입
    searchTxtValue: searchParam.searchTxtValue, //  공통코드 명
    useYn: searchParam.useYn == 'All' ? '' : searchParam.useYn // 사용여부
  }
  loadStart()
  CodeService.getCodeList(param).then((res) => {
    //  조회한 전체 Count 및 현재 페이지를 State값으로 넣어야 아래 Pagination에 반영
    totalCnt.value = Number(res.data.totalElements)

    //  조회해온 목록을 넣는다.
    commonCodeList.value = res.data.codeList ? res.data.codeList : []
  })
  loadDone()
}
/** Event Handler **/

/** Local Functions **/
const onSearch = (param: any) => {
  // searchParam = param
  searchParam.searchTxtType = param.searchTxtType
  searchParam.searchTxtValue = param.searchTxtValue
  searchParam.useYn = param.useYn
  getCommonCodeList()
}

const onSearchReset = () => {
  searchParam.searchTxtType = null
  searchParam.searchTxtValue = null
  searchParam.useYn = 'All'
  searchParam.rowCnt = 20
  searchParam.pageNo = 1
  getCommonCodeList()
}

//  PageChange
const onPageChange = (page: any) => {
  searchParam.pageNo = page.value.pageNo
  searchParam.rowCnt = page.value.rowCnt
  getCommonCodeList()
}

//  페이지 사이즈 변경.
const onChangeRowsPerPage = (page: any) => {
  searchParam.pageNo = page.value.pageNo
  searchParam.rowCnt = page.value.rowCnt
  getCommonCodeList()
}

const deleteCode = (param) => {
  confirm('공통코드를 삭제 하시겠습니까?', '삭제', {}, (action) => {
    if (action === 'confirm') {
      CodeService.deleteCodeList(param).then((res) => {
        alert('삭제되었습니다.', '알림', null, () => {})
        //  목록 다시 조회(휴면 목록에서 빠지기 때문에 다시 페이지를 처음으로 조회
        getCommonCodeList()
      })
    }
  })
}
</script>

<style scoped lang="scss"></style>
