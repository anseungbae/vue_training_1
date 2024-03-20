<template>
  <div class="grid-box">
    <div class="grid-header-box">
      <p class="menu-alin-left">페이지 관리</p>
      <div class="button-box">
        <el-button class="basic-button" @click="addRow">등록</el-button>
        <el-button class="basic-button" @click="onUpdateEditRequest">저장</el-button>
      </div>
    </div>
    <div class="data-grid-large-box">
      <DataGrid
        ref="pageManaGrid"
        class="ag-theme-quartz"
        :rowData="gridItems"
        :columnDefs="colDefs"
        @grid-ready="onGridReady"
        @cellClicked="onGridCellClick"
      />
    </div>
  </div>
  <PageManageDetailPopRef ref="PageManageDetailPopRef" @onSearchDataReload="onSearchDataReload" />
</template>
<script setup lang="ts">
import { dateToString } from '@/utils/gridFormatter'
import { ElMessageBox } from 'element-plus'
import { ref, computed, watch, reactive } from 'vue'
/** Local Variable **/
const pageManaGrid = ref()
const PageManageDetailPopRef = ref()
// page update insert data set settting
const pageUpdateData = reactive({
  id: null,
  pageName: null,
  pageUrl: null,
  pageDesc: null,
  useYn: null,
  delYn: null
})

// param data setting
const pageGridProps = defineProps({
  pageGridProp: {
    type: Object,
    default: null
  }
})

// grid data set
const gridItems = ref()
const gridApi = ref()

// old grid data set
const oriGridItems = ref()

//  Grid 컬럼 정의 시작
const colDefs = ref([
  {
    field: 'number',
    headerName: 'No.',
    valueGetter: 'node.rowIndex + 1',
    sortable: false,
    width: 60,
    cellStyle: {
      width: 60,
      filter: 'text',
      textAlign: 'center'
    }
  },
  {
    field: 'pageName',
    headerName: '페이지명',
    cellEditor: 'agTextCellEditor',
    sortable: false,
    cellEditorParams: { maxLength: 50 },
    width: 150,
    cellStyle: {
      width: 150,
      filter: 'text'
    }
  },
  {
    field: 'pageUrl',
    headerName: '페이지 URL',
    cellEditor: 'agTextCellEditor',
    sortable: false,
    cellEditorParams: { maxLength: 150 },
    width: 300,
    cellStyle: {
      width: 300,
      filter: 'text'
    }
  },
  {
    field: 'pageDesc',
    headerName: '페이지설명',
    cellEditor: 'agTextCellEditor',
    sortable: false,
    cellEditorParams: { maxLength: 200 },
    flex: 1,
    cellStyle: {
      filter: 'text'
    }
  },
  {
    field: 'useYn',
    headerName: '사용여부',
    cellEditor: 'agTextCellEditor',
    sortable: false,
    cellStyle: {
      width: 100,
      filter: 'text'
    }
  }
]) //  Grid 컬럼 정의 끝

// grid 옵션 가져오기
const gridOpts = ref()
gridOpts.value = colDefs
/** Service API **/
const getGridItems = computed(() => {
  return gridItems.value || []
})

// data ag grid stting JSON pasing
const setPageGridData = () => {
  gridItems.value = pageGridProps.pageGridProp
  oriGridItems.value = JSON.parse(JSON.stringify(pageGridProps.pageGridProp))
}

/** Event Handler **/
// 부모에서 넘어온 데이터를 감지
watch(
  () => pageGridProps.pageGridProp,
  () => {
    setPageGridData()
  }
)
// grid click event
const onGridCellClick = (event: any) => {
  if (event.colDefs.field === 'pageName') {
    PageManageDetailPopRef.value.open(event.data.id)
  }
}
// onGridReady : 그리드가 초기화되어 대부분의 API 호출에 사용할 준비가 되었지만
//               아직 완전히 렌더링되지 않아 세부정보를 준비해준다.
//               세부정보 숨기기
const onGridReady = (params: any) => {
  gridApi.value = params.api
}
// grid의 마자막 row를 추가 한다.
const addRow = () => {
  gridApi.value.applyTransaction({ add: [colDefs] })
}

/** Local Functions **/
// 저장 버튼 클릭
const onUpdateEditRequest = () => {
  getUpdatePageRequestCheck()
}

// 변경 값 체크 후 저장 Api 호출.
const getUpdatePageRequestCheck = () => {
  const oldData = oriGridItems.value
  gridApi.value.applyTransaction({ update: [gridApi.value] })
  gridApi.value.forEachNode(function (node: any) {
    const oriItemId = oldData.find((item: any) => item.Id === node.data.Id)
    const oriPageName = oldData.find((item: any) => item.pageName != node.data.pageName)
    const oriPageUrl = oldData.find((item: any) => item.pageUrl != node.data.pageUrl)
    // 조건 ID가 같고 Page Name or Page Url이 다른 경우 find
    console.log('oriItem :: ', oriPageUrl)
    console.log('oriPageName :: ', oriPageName)
    console.log('oriItemId :: ', oriItemId)
    if (node.data.pageName === '' && node.data.pageName === null) {
      console.log('err node :: ', node.data.pageName)
      ElMessageBox.confirm('페이지명을 입력하세요', 'Warning', {
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {})
      return
    } else if (node.data.pageUrl === '') {
      ElMessageBox.confirm('페이지 URL을 입력하세요', 'Warning', {
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {})
      return
    }
    if (oriItemId !== '' && (oriPageUrl !== '' || oriItemId !== '')) {
      console.log('node.data.pageName  :: ', node.data.pageName)
      console.log('oriPageName  ::  ', oriPageName)
    }
  })
}
// data 조회
const onSearchDataReload = () => {}
</script>

<style lang="scss" scoped></style>
