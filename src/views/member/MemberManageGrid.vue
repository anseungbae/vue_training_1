<template>
  <div ref="gridRef" class="grid-box flex flex-col flex-1 mt-5 h-full min-w-[1200px]">
    <div class="grid-header-box h-[44px]"></div>
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
          ref="memberGridRef"
          rowSelection="multiple"
          class="ag-theme-quartz"
          :columnDefs="colDefs"
          :rowData="gridItems"
          :enableBrowserTooltips="true"
          :autoSize="autoSize"
          @onGridCellClick="onGridCellClick"
          @onGridReady="onGridReady"
          @onGridRowDoubleClick="onGridRowDoubleClick"
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
  <MemberDetailPopup ref="memberDetailPopRef" @onSearchDataReload="onChangePagination" />
  <MemberCsListPopup ref="memberCsListPopRef" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  dateToString,
  emptyFormatter,
  etcMarketYnFormatter,
  marketYnFormatter,
  numberFormatter,
  phoneNoFormatter
} from '@/utils/gridFormatter'
import CellCsButtonRenderer from '@/views/member/renderer/cellCsButtonRenderer.vue'
import MemberDetailPopup from './popup/MemberDetailPopup.vue'
import MemberCsListPopup from './popup/MemberCsListPopup.vue'

/********* Local Variable *********/
//grid param
const gridRef = ref()
const props = defineProps({
  data: {
    type: Object
  },
  pageParam: {
    type: Object
  }
}) //부모컨포넌트에서 데이터 전달받음
const gridItems = ref([])
const gridApi = ref(null)
const memberDetailPopRef = ref(null)
const memberCsListPopRef = ref(null)
const autoSize = ref(null)
const colDefs = ref([
  {
    field: 'userName',
    headerName: '회원명',
    sortable: true,
    unSortIcon: true,
    width: 200,
    pinned: 'left',
    cellStyle: {
      textDecoration: 'underline',
      cursor: 'pointer',
      textAlign: 'left'
    }
  },
  {
    field: 'emailId',
    headerName: '이메일',
    pinned: 'left',
    width: 300,
    sortable: true,
    unSortIcon: true,
    cellStyle: {
      textDecoration: 'underline',
      cursor: 'pointer',
      textAlign: 'left'
    }
  },
  {
    field: 'userContactNo',
    headerName: '전화번호',
    pinned: 'left',
    sortable: true,
    unSortIcon: true,
    width: 130,
    valueFormatter: phoneNoFormatter,
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'planTypeNm',
    headerName: '결제타입',
    width: 100,
    pinned: 'left',
    sortable: false,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'endDate',
    headerName: '유료회원 만료일',
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD')
    },
    width: 130,
    sortable: false,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'remainPeriod',
    headerName: '남은 일수',
    width: 120,
    sortable: true,
    unSortIcon: true,
    valueFormatter: (param) => {
      return emptyFormatter(param)
    },
    // comparator: (valueA, valueB, nodeA, nodeB, isDescending) => valueA - valueB,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'graceDate',
    headerName: '유예기간 만료일',
    width: 130,
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD')
    },
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'vendorCnt',
    headerName: '연동수',
    width: 80,
    sortable: true,
    unSortIcon: true,
    comparator: (valueA, valueB, nodeA, nodeB, isDescending) => valueA - valueB,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'monthOrderCnt',
    headerName: '월주문건수',
    sortable: true,
    unSortIcon: true,
    width: 120,
    valueFormatter: (param) => {
      return numberFormatter(param)
    },
    comparator: (valueA, valueB, nodeA, nodeB, isDescending) => valueA - valueB,
    cellStyle: {
      textAlign: 'right'
    }
  },
  {
    field: 'monthSaleAmount',
    headerName: '월정산금액',
    width: 120,
    valueFormatter: numberFormatter,
    sortable: true,
    unSortIcon: true,
    comparator: (valueA, valueB, nodeA, nodeB, isDescending) => valueA - valueB,
    cellStyle: {
      textAlign: 'right'
    }
  },
  {
    field: 'linkNaverSts',
    headerName: '스스연동',
    width: 100,
    sortable: false,
    valueFormatter: (param) => {
      return emptyFormatter(param)
    },

    tooltipValueGetter: function (params) {
      let cusNames: String = params.data.linkNaverNames
      if (cusNames) {
        // const cusNames = names.split('|').join(' , ');
        cusNames = cusNames.split('|').join(' , ')
      }

      return cusNames
    },
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'linkCoupangSts',
    headerName: '쿠팡연동',
    width: 100,
    sortable: false,
    valueFormatter: (param) => {
      return emptyFormatter(param)
    },
    tooltipValueGetter: function (params) {
      let cusNames: String = params.data.linkCoupangNames
      if (cusNames) {
        cusNames = cusNames.split('|').join(' , ')
      }

      return cusNames
    },
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'marketSmartStore',
    headerName: '스스여부',
    sortable: true,
    unSortIcon: true,
    valueFormatter: marketYnFormatter,
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'marketCoupangWing',
    headerName: '쿠팡여부',
    width: 100,
    sortable: true,
    unSortIcon: true,
    valueFormatter: marketYnFormatter,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'marketEtc',
    headerName: '기타 여부',
    width: 100,
    sortable: true,
    unSortIcon: true,
    valueFormatter: marketYnFormatter,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'joinedAt',
    headerName: '회원 가입일',
    width: 200,
    sortable: true,
    unSortIcon: true,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD')
    },
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'lastLoginDate',
    headerName: '마지막 로그인',
    width: 200,
    sortable: true,
    unSortIcon: true,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD')
    },
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'userId',
    headerName: '사용자ID',
    width: 250,
    unSortIcon: true,
    valueFormatter: numberFormatter,
    cellStyle: {
      textAlign: 'left'
    }
  },
  {
    field: 'bizId',
    headerName: '사업자ID',
    unSortIcon: true,
    width: 280,
    cellStyle: {
      textAlign: 'left',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  {
    field: 'cellRender',
    headerName: '상담내역',
    width: 100,
    cellRenderer: CellCsButtonRenderer,
    cellRendererParams: {
      clicked: (userId) => {
        memberCsListPopRef.value.open(userId)
      }
    },
    cellStyle: {
      textAlign: 'center'
    }
  }
]) // Grid 컬럼 정의

// page param
const emit = defineEmits(['pageChange']) //Page 변경시 데이터 부모컨포넌트 전달
const totalCnt = ref(0)
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
/********* Service API *********/

/********* Event Handler *********/
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
// 그리드 클릭시
const onGridCellClick = (event: any) => {
  console.log('datagrid       :  ', event)
  if (event.colDef.field === 'emailId' || event.colDef.field === 'userName') {
    memberDetailPopRef.value.open(event.data.userId)
  } else if (event.colDef.field === 'bizId') {
    window.open(`https://stg-app.sellerking.io/settingsStore?pBizId=${event.data.bizId}`, '_blank')
  }
}
//그리드 로우 더블클릭시 이벤트
const onGridRowDoubleClick = (event: any) => {
  memberCsListPopRef.value.open(event.data.userId)
}
// member-detail-popup 리로드
const onSearchDataReload = () => {
  setMemberInfo()
}

/********* Local Functions *********/
// 회원정보 그리드에 넣기
const setMemberInfo = () => {
  totalCnt.value = Number(props.data?.totalElements)
  curPageEnd.value = props.pageParam.pageNo * props.pageParam.rowCnt
  curPageStart.value = curPageEnd.value - (props.pageParam.rowCnt - 1)
  if (curPageEnd.value > totalCnt.value) {
    curPageEnd.value = totalCnt.value
  }
  pageSize.value = props.pageParam.rowCnt
  gridItems.value = props.data?.userList // 조회해온 목록을 넣는다.
}
const onGridReady = (params: any) => {
  gridApi.value = params?.api
  autoSize.value = 'fitGridWidth'
}

/********* lifeCycle *********/
watch(props, () => {
  setMemberInfo()
})

defineExpose({
  gridRef
})
</script>

<style scoped lang="scss"></style>
