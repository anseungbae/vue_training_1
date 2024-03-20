<template>
  <div class="grid-box flex flex-col flex-1 mt-5 h-full min-w-[1200px]">
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
          rowSelection="multiple"
          class="ag-theme-quartz"
          :rowData="getGridItems"
          :autoSize="autoSize"
          :columnDefs="colDefs"
          @onGridReady="onGridReady"
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
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { dateToString } from '@/utils/gridFormatter'
import { useAlert } from '@/hooks/web/usePageLoading.ts'

/********* Local Variable *********/
const { alert, confirm } = useAlert()
//grid param
const gridRef = ref()
const bannerLoginImageGridRef = ref(null)
const props = defineProps({
  data: {
    type: Object
  },
  pageParam: {
    type: Object
  }
}) // 부모컨포넌트에서 데이터 전달받음
const gridItems = ref([])
const gridApi = ref(null)
const autoSize = ref(null)
// Grid 컬럼 정의
const colDefs = ref([
  {
    headerName: 'No.',
    valueGetter: 'node.rowIndex + 1',
    width: 40,
    sortable: false,
    cellStyle: { textAlign: 'center' }
  },
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
    field: 'userName',
    headerName: '회원명',
    sortable: false,
    flex: 1,
    cellStyle: { textAlign: 'left' }
  },
  {
    field: 'emailId',
    headerName: '이메일',
    sortable: false,
    flex: 1,
    cellStyle: { textAlign: 'left' }
  },

  {
    field: 'bizNames',
    headerName: '사업장명',
    sortable: false,
    flex: 1.5,
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'quitReason',
    headerName: '탈퇴사유',
    sortable: false,
    flex: 2,
    cellStyle: { textAlign: 'left' }
  },
  {
    field: 'viewJoinedAt',
    headerName: '가입 일자',
    sortable: false,
    flex: 1,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD HH:mm:ss')
    },
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'viewQuitAt',
    headerName: '탈퇴 일자',
    flex: 1,
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD HH:mm:ss')
    },
    cellStyle: { textAlign: 'center' }
  }
])

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

/** Paging 관련 Event **/
const onChangePagination = () => {
  emit('pageChange', props.pageParam)
}
// 페이지 사이즈 변경시
const onSizeChangePagination = () => {
  props.pageParam.pageNo = 1
  props.pageParam.rowCnt = pageSize.value
  emit('pageChange', props.pageParam)
}

/********* Local Functions *********/
// 사용자정보 그리드에 넣기
const setPopupInfo = () => {
  totalCnt.value = Number(props.data.totalElements)
  curPageEnd.value = props.pageParam.pageNo * props.pageParam.rowCnt
  curPageStart.value = curPageEnd.value - (props.pageParam.rowCnt - 1)
  if (curPageEnd.value > totalCnt.value) {
    curPageEnd.value = totalCnt.value
  }
  pageSize.value = props.pageParam.rowCnt
  gridItems.value = props.data.userList // 조회해온 목록을 넣는다.
}

// 그리드 생성 후 기능담기
const onGridReady = (params) => {
  gridApi.value = params?.api
  autoSize.value = 'fitGridWidth'
}

/********* lifeCycle *********/
const getGridItems = computed(() => {
  return gridItems.value || []
})

watch(props, () => {
  setPopupInfo()
})
</script>
<style lang="scss" scoped></style>
