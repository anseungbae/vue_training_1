<template>
  <div class="grid-box flex flex-col flex-1 mt-5 min-w-[1200px] h-full">
    <div class="button-box grid-header-box h-[44px]">
      <el-button class="grid-button" @click="executeRestClear">휴먼해제</el-button>
      <el-button class="grid-button" @click="sendEmail">이메일발송</el-button>
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
          rowSelection="multiple"
          class="ag-theme-quartz"
          :rowData="gridItems"
          :columnDefs="colDefs"
          @onGridReady="onGridReady"
        />
      </div>
      <div class="footer-pagination">
        <el-pagination
          v-model:current-page="pageParam.pageNo"
          v-model:page-size="pageSize"
          v-model:total="totalCnt"
          :page-sizes="[10, 20, 30, 50, 100]"
          layout=" prev, pager, next"
          @size-change="onChangePagination"
          @current-change="onChangePagination"
          @row-selected="onRowSelected"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAlert } from '@/hooks/web/usePageLoading'
import { dateToString } from '@/utils/gridFormatter'
const { alert } = useAlert()

/** Local Variable **/
const props = defineProps({
  dataProp: {
    type: Array
  },
  totalElemnetCnt: { type: Number }
}) //부모컨포넌트에서 데이터 전달받음
const emit = defineEmits([
  'pageChange',
  'changeRowsPerPage',
  'getRestMemberList',
  'sendEmail',
  'executeRestClear'
]) //Page 변경시 데이터 부모컨포넌트 전달
const gridItems = ref<any>([])
const gridApi = ref()
//  page param

const pageSize = ref(0)
const totalCnt = ref(0)
const curPageStart = ref(0)
const curPageEnd = ref(0)

// 페이지 Select 목록
const pageList = [
  { value: 10, label: '10개씩' },
  { value: 20, label: '20개씩' },
  { value: 30, label: '30개씩' },
  { value: 50, label: '50개씩' },
  { value: 100, label: '100개씩' }
]

const pageParam = ref({
  pageNo: 1,
  rowCnt: 20
})

const colDefs = ref([
  {
    width: 60,
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
    width: 200,
    sortable: false,
    cellStyle: {
      textAlign: 'left'
    }
  },
  {
    field: 'emailId',
    headerName: '이메일',
    width: 200,
    flex: 1,
    sortable: false,
    cellStyle: {
      textAlign: 'left'
    }
  },
  {
    field: 'bizNames',
    headerName: '사업장명',
    width: 300,
    sortable: false,
    cellStyle: {
      textAlign: 'left'
    }
  },
  {
    field: 'viewRestNotiDt',
    headerName: '휴면예정 일자',
    width: 120,
    sortable: false,
    cellStyle: { textAlign: 'center' },
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD')
    }
  },
  {
    field: 'viewRestDt',
    headerName: '휴면 일자',
    width: 120,
    sortable: false,
    cellStyle: {
      textAlign: 'center'
    },
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD')
    }
  },
  {
    field: 'mailSendYn',
    headerName: '이메일 발송여부',
    width: 120,
    sortable: false,
    cellStyle: {
      textAlign: 'center'
    },
    valueFormatter: (param) => {
      return param.value == 'Y' ? '발송' : '미발송'
    }
  }
]) //  Grid 컬럼 정의

/** Service API **/

/** Event Handler **/
/** Page 변경  **/
// 페이지 이동
const onChangePagination = () => {
  pageParam.value.rowCnt = pageSize.value
  emit('pageChange', pageParam)
}
// 페이지 사이즈 변경시
const onSizeChangePagination = () => {
  pageParam.value.pageNo = 1
  pageParam.value.rowCnt = pageSize.value
  emit('pageChange', pageParam)
}

/** Local Functions **/
watch(props, () => {
  getRestMemberList()
})

const getRestMemberList = () => {
  gridItems.value = props.dataProp
  totalCnt.value = Number(props.totalElemnetCnt)
  pageSize.value = pageParam.value.rowCnt
  curPageEnd.value = pageParam.value.pageNo * pageParam.value.rowCnt
  curPageStart.value = curPageEnd.value - (pageParam.value.rowCnt - 1)
  if (curPageEnd.value > totalCnt.value) {
    curPageEnd.value = totalCnt.value
  }
}

/** 그리드  **/

//그리드 재조회
const onSearchDataReload = () => {
  emit('getRestMemberList')
}

const onRowSelected = (e: any) => {
  console.log('onRowSelected : ', e)
}

const onGridReady = (params: any) => {
  gridApi.value = params?.api
}

const executeRestClear = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  if (selectedRows && selectedRows.length > 0) {
    const userIdList = selectedRows.map((userInfo) => userInfo.userId)
    let param = {
      userList: userIdList
    }
    emit('executeRestClear', param)
  } else {
    alert('해제할 목록을 선택해 주세요.', '알림', null, () => {})
  }
}

const sendEmail = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  if (selectedRows && selectedRows.length > 0) {
    const userIdList = selectedRows.map((userInfo) => userInfo.userId)
    let param = {
      userList: userIdList
    }
    emit('sendEmail', param)
  } else {
    alert('발송할 이메일을 선택해 주세요.', '알림', null, () => {})
  }
}
</script>

<style scoped lang="scss"></style>
