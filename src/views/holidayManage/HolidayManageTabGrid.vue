<template>
  <div class="flex flex-col flex-1 mt-5 h-full min-w-[1200px]">
    <div class="grid-box flex flex-col flex-1">
      <div class="data-grid-large-box">
        <DataGrid
          ref="holidayManageaGridRef"
          rowSelection="multiple"
          class="ag-theme-quartz"
          :rowData="gridItems"
          :columnDefs="colDef"
          @onGridReady="onGridReady"
          @onGridCellClick="onGridCellClick"
        />
      </div>
    </div>
  </div>
  <HolidayManageDetailPopup ref="holidayManageDetailPopRef" />
</template>
<script setup lang="ts">
import { dateToString } from '@/utils/gridFormatter'
import { ref, watch } from 'vue'
import HolidayManageDetailPopup from './popup/HolidayManageDetailPopup.vue'

/** Local Variable **/

//부모컨포넌트에서 데이터 전달받음
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
const holidayManageDetailPopRef = ref(null)
const holidayManageaGridRef = ref(null)

// grid data set
const gridItems = ref(null)
const gridApi = ref(null)

//  Grid 컬럼 정의 시작
const colDef = ref([
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
    field: 'title',
    headerName: '제목',
    cellClass: 'cell-link',
    sortable: false,
    width: 250,
    cellStyle: {
      width: 250,
      filter: 'text',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  {
    field: 'description',
    headerName: '설명',
    sortable: false,
    flex: 1,
    cellStyle: {
      filter: 'text'
    }
  },
  {
    field: 'holidayType',
    headerName: '유형',
    sortable: false,
    width: 100,
    cellStyle: {
      textAlign: 'center',
      width: 100,
      filter: 'text'
    },
    valueFormatter: (obj) => {
      return obj.value && obj.value.toString() === 'H'
        ? '공휴일'
        : obj.value && obj.value.toString() === 'E'
          ? '이벤트'
          : '기타'
    }
  },
  {
    field: 'holidayStartAt',
    headerName: '휴무시작일',
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD')
    },
    cellStyle: {
      textAlign: 'center',
      width: 150,
      filter: 'text'
    }
  },
  {
    field: 'holidayEndAt',
    headerName: '휴무종료일',
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD')
    },
    cellStyle: {
      textAlign: 'center',
      width: 150,
      filter: 'text'
    }
  }
]) //  Grid 컬럼 정의 끝

// grid 옵션 가져오기
const gridOpts = ref()
gridOpts.value = colDef
/** Service API **/
// data ag grid stting
const setPageGridData = () => {
  gridItems.value = props.data
}

/** Event Handler **/
// 부모에서 넘어온 데이터를 감지
watch(
  () => props.data,
  () => {
    setPageGridData()
  }
)
//  onGridReady :
// 그리드가 초기화되어 대부분의 API 호출에 사용할 준비가 되었지만
//  아직 완전히 렌더링되지 않아 세부정보를 준비해준다.
//  세부정보 숨기기
const onGridReady = (params: any) => {
  gridApi.value = params.api
}

/** 그리드  **/
//  그리드 클릭시 상세 팝업
const onGridCellClick = (event) => {
  if (event.colDef.field === 'title') {
    // console.log('event.colDef.field', event.colDef.field)
    console.log('event.id.id', event.data.id)
    holidayManageDetailPopRef.value.detailOpen(event.data.id)
  }
}

// data 조회
</script>

<style lang="scss" scoped></style>
