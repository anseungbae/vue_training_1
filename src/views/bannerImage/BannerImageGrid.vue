<template>
  <div class="grid-box flex flex-col flex-1 mt-5 min-w-[1200px] h-full">
    <div class="button-box grid-header-box h-[44px]">
      <el-button class="grid-button" @click="onPopUpOpen">등록</el-button>
      <el-button class="grid-button" @click="onDeleteBtnOnClick">삭제</el-button>
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
          :defaultColDef="defaultColDef"
          :columnDefs="colDefs"
          @onGridCellClick="onGridCellClick"
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
  <BannerImageDetailPopup ref="bannerDetailPopRef" @onSearchDataReload="onSearchDataReload" />
  <ImagePreview ref="previewRef" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import BannerImageDetailPopup from '@/views/bannerImage/popup/BannerImageDetailPopup.vue'
import { useAlert } from '@/hooks/web/usePageLoading'
import BannerService from '@/api/bannerService'
import BannerImagePreviewImageRender from './renderer/BannerImagePreviewImageRender.vue'
const { alert, confirm } = useAlert()

/** Local Variable **/
const defaultColDef = ref({})
const props = defineProps({
  dataProp: {
    type: Array
  },
  totalElemnetCnt: { type: Number }
}) //부모컨포넌트에서 데이터 전달받음
const emit = defineEmits(['pageChange', 'changeRowsPerPage', 'getBannerImageList']) //Page 변경시 데이터 부모컨포넌트 전달
const gridItems = ref<any>([])
const bannerDetailPopRef = ref<any>(null)
const previewRef = ref<any>(null)
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
    headerCheckboxSelectionFilteredOnly: true,
    showDisabledCheckboxes: true
  },
  {
    field: 'id',
    headerName: '번호',
    width: 80,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'name',
    headerName: '이미지명',
    minWidth: 300,
    flex: 1,
    cellRenderer: BannerImagePreviewImageRender,
    cellRendererParams: {
      clicked: (fileUrl: any) => {
        previewRef.value.open(fileUrl)
      }
    },
    cellStyle: {
      textDecoration: 'underline',
      cursor: 'pointer',
      textAlign: 'center'
    }
  },
  {
    field: 'imageDesc',
    headerName: '이미지 설명',
    width: 230,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'linkUrl',
    headerName: '링크주소',
    width: 230,
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'usePage',
    headerName: '사용페이지',
    width: 230,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'linkNewWindowYn',
    headerName: '새창오픈여부',
    width: 100,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'useYn',
    headerName: '사용여부',
    width: 100,
    cellStyle: {
      textAlign: 'center'
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

const getBannerImageList = () => {
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
//그리드 클릭시
const onGridCellClick = (event: any) => {
  if (event.colDef.field === 'name') {
    bannerDetailPopRef.value.open(event.data.id)
  }
}

//팝업 오픈
const onPopUpOpen = () => {
  bannerDetailPopRef.value.open()
}

//그리드 재조회
const onSearchDataReload = () => {
  emit('getBannerImageList')
}

const onRowSelected = (e: any) => {
  console.log('onRowSelected : ', e)
}

const onGridReady = (params: any) => {
  gridApi.value = params?.api
}

//  삭제 버튼 클릭.
const onDeleteBtnOnClick = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  if (selectedRows && selectedRows.length > 0) {
    const deleteList = selectedRows.map((checkInfo) => checkInfo.id)
    let param = {
      deleteList: deleteList
    }

    confirm('삭제하시겠습니까?', '삭제', {}, (action) => {
      if (action === 'confirm') {
        BannerService.deleteBannerImageList(param).then((res) => {
          onSearchDataReload()
        })
      }
    })
  } else {
    alert('삭제할 목록을 선택해 주세요.', '알림', null, () => {})
  }
}

watch(props, () => {
  // props 값 변경시 데이터 그리드 변경
  getBannerImageList()
})
</script>

<style scoped lang="scss"></style>
