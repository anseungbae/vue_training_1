<template>
  <div class="grid-box flex flex-col flex-1 mt-5 h-full min-w-[1200px]">
    <div class="grid-header-box-end">
      <div class="button-box">
        <el-button class="grid-button" @click="onBannerGroupPopUpOpenClick">등록</el-button>
        <el-button class="grid-button" @click="onBannerGroupDeletClick">삭제</el-button>
      </div>
    </div>
    <div class="grid-box flex flex-col flex-1">
      <div class="flex">
        <el-select
          placeholder="20개씩"
          style="width: 100px; margin: 15px 5px 0px 20px"
          v-model="pageSize"
          @change="onSizeChangePagination"
        >
          <el-option
            v-for="item in pageList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="total-page-label">
          {{ `전체 ${totalCnt}개 중` }}
        </div>
        <div v-show="totalCnt !== 0" class="current-pagerange-label">
          {{ `${curPageStart}~${curPageEnd}개` }}
        </div>
      </div>
      <div class="data-grid-large-box">
        <DataGrid
          ref="bannerManageGridRef"
          rowSelection="multiple"
          class="ag-theme-quartz"
          :rowData="gridItems"
          :columnDefs="colDefs"
          @onGridReady="onGridReady"
          @onGridCellClick="onGridCellClick"
        />
      </div>
      <el-pagination
        class="footer-pagination"
        v-model:current-page="props.pageParam.pageNo"
        v-model:page-size="pageSize"
        v-model:total="totalCnt"
        :page-sizes="[10, 20, 30, 50, 100]"
        layout=" prev, pager, next"
        @size-change="onChangePagination"
        @current-change="onChangePagination"
      />
    </div>
  </div>
  <BannerGroupDetailPopup
    ref="bannerGroupDetailPopRef"
    @onSearchDataReload="onSizeChangePagination"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { dateToString } from '@/utils/gridFormatter'
import BannerGroupDetailPopup from './popup/BannerGroupDetailPopup.vue'

/********* Local Variable *********/
const bannerGroupDetailPopRef = ref(null)

//grid param
const props = defineProps({
  data: {
    type: Object
  },
  pageParam: {
    type: Object
  }
}) //부모컨포넌트에서 데이터 전달받음
const gridItems = ref([])
const gridApi = ref<any>(null)
const autoSize = ref(null)
const colDefs = ref([
  {
    width: 40,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    editable: true,
    headerCheckboxSelectionFilteredOnly: true,
    showDisabledCheckboxes: true,
    sortable: false
  },
  {
    field: 'id',
    headerName: '번호',
    width: 60,
    sortable: false,
    cellStyle: {
      textAlign: 'center',
      width: 60,
      filter: 'text'
    }
  },
  {
    field: 'categoryName',
    headerName: '배너분류',
    width: 150,
    sortable: false,
    cellStyle: {
      textAlign: 'center',
      width: 150,
      filter: 'text'
    }
  },
  {
    field: 'name',
    headerName: '배너명',
    cellClass: 'cell-link',
    flex: 1,
    sortable: false,
    cellStyle: {
      filter: 'text',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  {
    field: 'type',
    headerName: '배너형태',
    width: 120,
    sortable: false,
    cellStyle: {
      textAlign: 'center',
      width: 120,
      filter: 'text'
    },
    valueFormatter: (obj) => {
      return obj.value && obj.value.toString() === 'H'
        ? '가로'
        : obj.value && obj.value.toString() === 'V'
          ? '세로'
          : ''
    }
  },
  {
    field: 'postYn',
    headerName: '게시여부',
    width: 100,
    sortable: false,
    cellStyle: {
      textAlign: 'center',
      width: 100,
      filter: 'text'
    },
    valueFormatter: (obj) => {
      return obj.value && obj.value.toString() === 'Y' ? '게시' : '게시안함'
    }
  },
  {
    field: 'postStartAt',
    headerName: '게시시작일',
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
    field: 'postEndAt',
    headerName: '게시종료일',
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
    field: 'useYn',
    headerName: '사용여부',
    width: 100,
    sortable: false,
    cellStyle: {
      textAlign: 'center',
      width: 100,
      filter: 'text'
    },
    valueFormatter: (obj) => {
      return obj.value && obj.value.toString() === 'Y' ? '사용' : '사용안함'
    }
  }
]) //  Grid 컬럼 정의 끝
// page param
const totalCnt = ref(0)
const emit = defineEmits(['pageChange', 'bannerGroupDeletId']) //Page 변경시 데이터 부모컨포넌트 전달
const curPageStart = ref(0)
const curPageEnd = ref(0)
const pageSize = ref(0)

// 페이지 Select 목록
const pageList = [
  { value: 10, label: '10개씩' },
  { value: 20, label: '20개씩' },
  { value: 30, label: '30개씩' },
  { value: 50, label: '50개씩' },
  { value: 100, label: '100개씩' }
]

/** Event Handler **/
watch(props, () => {
  setBannerGroupInfo()
})
/** Local Functions **/
const setBannerGroupInfo = () => {
  totalCnt.value = Number(props.data?.totalElements)
  curPageEnd.value = props.pageParam.pageNo * props.pageParam.rowCnt
  curPageStart.value = curPageEnd.value - (props.pageParam.rowCnt - 1)
  if (curPageEnd.value > totalCnt.value) {
    curPageEnd.value = totalCnt.value
  }
  pageSize.value = props.pageParam.rowCnt
  gridItems.value = props.data?.bannerGroupList // 조회해온 목록을 넣는다.
}
const onGridReady = (params: any) => {
  gridApi.value = params?.api
  autoSize.value = 'fitGridWidth'
}
// delete button click

const onBannerGroupDeletClick = () => {
  const selectedCheckedRows = gridApi.value.getSelectedRows()
  const checkedList = selectedCheckedRows
  emit('bannerGroupDeletId', checkedList)
}

/** Page 변경  **/
// 페이지 이동
const onChangePagination = () => {
  emit('pageChange', props.pageParam)
}
// 페이지 사이즈 변경시
const onSizeChangePagination = () => {
  props.pageParam.pageNo = 1
  props.pageParam.rowCnt = pageSize.value
  emit('pageChange', props.pageParam)
}
/** 그리드  **/
//  그리드 클릭시 메인 상단 배너 상세 팝업
const onGridCellClick = (event: any) => {
  if (event.colDef.field === 'name') {
    bannerGroupDetailPopRef.value.detailOpen(event.data.id)
  }
}

//  등록 팝업
const onBannerGroupPopUpOpenClick = () => {
  bannerGroupDetailPopRef.value.detailOpen()
}

/** Service API **/
</script>
<style lang="scss" scoped></style>
