<template>
  <div class="grid-box flex flex-col flex-1 mt-5 h-full min-w-[1200px]">
    <div class="button-box grid-header-box">
      <el-button class="grid-button" @click="onAddTermsClick">등록</el-button>
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
          ref="termsGridRef"
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
        v-model:current-page="pageParam.pageNo"
        v-model:page-size="pageSize"
        :total="totalCnt"
        :page-sizes="[10, 20, 30, 50, 100]"
        layout=" prev, pager, next"
        @size-change="onChangePagination"
        @current-change="onChangePagination"
      />
    </div>
  </div>
  <TermsDetailPopup ref="termsDetailPopRef" @onSearchDataReload="onSearchDataReload" />
  <TermsVersionPopup ref="termsVersionPopRef" @onSearchDataReloadVer="onSearchDataReload" />
  <TermsCreatePopup ref="termsCreatePopRef" @onSearchDataReloadCre="onSearchDataReload" />
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import TermsDetailPopup from '@/views/terms/popup/TermsDetailPopup.vue'
import TermsVersionPopup from '@/views/terms/popup/TermsVersionPopup.vue'
import TermsCreatePopup from '@/views/terms/popup/TermsCreatePopup.vue'
import termsVersionBtnRender from '@/views/terms/renderer/TermsVersionBtnRender.vue'

/** Local Variable **/
//grid param
const props = defineProps({
  dataProp: {
    type: Object
  }
}) //부모컨포넌트에서 데이터 전달받음
const gridItems = ref([])
const gridApi = ref(null)
const termsDetailPopRef = ref(null)
const termsVersionPopRef = ref(null)
const termsCreatePopRef = ref(null)
const colDefs = ref([
  {
    field: 'termsTypeName',
    headerName: '약관구분',
    width: 150,
    sortable: false,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'termsCode',
    headerName: '약관코드',
    width: 100,
    sortable: false,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'termsName',
    headerName: '약관명',
    flex: 1,
    sortable: false,
    cellStyle: {
      textDecoration: 'underline',
      cursor: 'pointer',
      textAlign: 'left'
    }
  },
  {
    field: 'version',
    headerName: 'Version',
    width: 100,
    sortable: false,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'locale',
    headerName: '언어',
    width: 80,
    sortable: false,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'requireYn',
    headerName: '필수여부',
    width: 100,
    sortable: false,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'useYn',
    headerName: '사용여부',
    width: 100,
    sortable: false,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'Versionup',
    headerName: 'Version Up',
    width: 120,
    sortable: false,
    cellRenderer: termsVersionBtnRender,
    cellRendererParams: {
      btnLabel: 'Version Up',
      clicked: (id) => {
        termsVersionPopRef.value.openVersionUp(id)
      }
    },
    cellStyle: { textAlign: 'center' }
  }
])
//  page param
const emit = defineEmits(['pageChange']) //Page 변경시 데이터 부모컨포넌트 전달
const pageParam = ref({
  pageNo: 1,
  rowCnt: 20
})
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

/** Service API **/

/** Event Handler **/
const getGridItems = computed(() => {
  return gridItems.value || []
})
watch(props, () => {
  setTermsInfo()
})
/** Local Functions **/
const onGridReady = (params) => {
  gridApi.value = params.api
}

//사용자정보 그리드에 넣기
const setTermsInfo = () => {
  totalCnt.value = Number(props.dataProp.totalElements)
  curPageEnd.value = pageParam.value.pageNo * pageParam.value.rowCnt
  curPageStart.value = curPageEnd.value - (pageParam.value.rowCnt - 1)
  if (curPageEnd.value > totalCnt.value) {
    curPageEnd.value = totalCnt.value
  }
  pageSize.value = pageParam.value.rowCnt
  gridItems.value = props.dataProp.termsList //  조회해온 목록을 넣는다.
}
//  Pagenation의 선택한 Page의 변경 Event
const onChangePagination = () => {
  emit('pageChange', pageParam)
}
//페이지 사이즈 변경시
const onSizeChangePagination = () => {
  pageParam.value.pageNo = 1
  pageParam.value.rowCnt = pageSize.value
  emit('pageChange', pageParam)
}

//  약관 관리 등록 팝업
const onAddTermsClick = () => {
  termsCreatePopRef.value.openCreate()
}
//  약관 관리 상세 팝업
const onGridCellClick = (event) => {
  if (event.colDef.field === 'termsName') {
    termsDetailPopRef.value.openDetali(event.data.id)
  } else if (event.colDef.field === 'Versionup') {
    // termsVersionPopRef.value.openVersionUp(event.data.id)
  } else {
    console.log(' :: Cell Click : ')
  }
}
/**  팝업  관련 Event **/
const onSearchDataReload = () => {
  emit('pageChange', pageParam)
}
</script>

<style lang="scss" scoped></style>
