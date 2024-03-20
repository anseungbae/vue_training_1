<template>
  <el-dialog
    v-model="paidHistoryPopupOpened"
    align-center
    class="modal-title modal-mid"
    title="결제 내역"
  >
    <hr />
    <div class="modal-box mt-[15px]">
      <DataGrid
        ref="paidHistoryGridRef"
        class="ag-theme-quartz h-[540px] mt-5"
        :rowData="getPaidHistoryGridItems"
        :columnDefs="paidHistoryColDefs"
        :enableBrowserTooltips="true"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BizService from '@/api/bizService'
import { dateToString, numberFormatter } from '@/utils/gridFormatter'

/********* Local Variable *********/
const paidHistoryColDefs = [
  {
    headerName: 'No.',
    valueGetter: 'node.rowIndex + 1',
    width: 40,
    sortable: false,
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'payMethod',
    headerName: '결제 타입',
    flex: 1,
    sortable: false,
    valueFormatter: (param) => {
      return (param.value = 'accountTransfer' ? '계좌이체' : '카드')
    },
    cellStyle: { width: 100, textAlign: 'center' }
  },
  {
    field: 'cardName',
    headerName: '카드사',
    flex: 1,
    sortable: false,
    cellStyle: { width: 100, textAlign: 'center' }
  },
  {
    field: 'cardNumber',
    headerName: '카드번호',
    flex: 1.5,
    sortable: false,
    cellStyle: { width: 150, textAlign: 'center' }
  },
  {
    field: 'paidAt',
    headerName: '결제 시간',
    flex: 1.5,
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD HH:mm:ss')
    },
    cellStyle: { width: 140, textAlign: 'center', sortable: true }
  },
  {
    field: 'paidAmount',
    headerName: '결제 금액',
    flex: 1,
    sortable: false,
    valueFormatter: numberFormatter,
    cellStyle: { width: 100, textAlign: 'right', sortable: true }
  },
  {
    field: 'name',
    headerName: '결제 항목',
    flex: 1.5,
    sortable: false,
    tooltipValueGetter: (param) => {
      return param.value
    },
    cellStyle: { width: 120, textAlign: 'left' }
  },
  {
    field: 'planType',
    headerName: '요금제',
    flex: 1,
    sortable: false,
    cellStyle: { width: 120, textAlign: 'center' }
  },
  {
    field: 'paymentStatus',
    headerName: '결제 상태',
    flex: 1,
    sortable: false,
    cellStyle: { width: 120, textAlign: 'center' }
  },
  {
    field: 'cancelAmount',
    headerName: '취소금액',
    flex: 1,
    sortable: false,
    valueFormatter: numberFormatter,
    cellStyle: { width: 100, textAlign: 'right' }
  },
  {
    field: 'canceledAt',
    headerName: '취소일자',
    flex: 1.5,
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD HH:mm:ss')
    },
    cellStyle: { width: 140, textAlign: 'center' }
  }
]
const paidHistoryPopupOpened = ref(false)
const pkBizId = ref(null)
const paidHistoryGridItems = ref(null)

/********* Service API *********/
// 약관 상세조회 API 호출
const getPaidHistoryApi = () => {
  const param = { bizId: pkBizId.value }
  BizService.getPaidHistory(param).then((res) => {
    paidHistoryGridItems.value = res.data.paidHistory
  })
}
/********* Local Functions *********/
const open = (bizId) => {
  // 넘어온 사업장ID 설정
  pkBizId.value = bizId
  // 약관 상세정보 조회
  getPaidHistoryApi()
  paidHistoryPopupOpened.value = true
}

/********* lifeCycle *********/
const getPaidHistoryGridItems = computed(() => {
  return paidHistoryGridItems.value || []
})
defineExpose({
  open
})
</script>
