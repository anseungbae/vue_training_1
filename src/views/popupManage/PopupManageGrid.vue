<template>
  <div class="grid-box flex flex-col flex-1 mt-5 h-full min-w-[1200px]">
    <div class="grid-header-box-end">
      <div class="button-box">
        <el-button class="grid-button" @click="onPopupAddBtnClick">등록</el-button>
        <el-button class="grid-button" @click="onDeleteBtnClick">삭제</el-button>
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
          rowSelection="multiple"
          class="ag-theme-quartz"
          :rowData="getGridItems"
          :autoSize="autoSize"
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
  <PopupDetailPopup
    ref="popupDetailPopRef"
    @onPopupDetailInfoSaveComplete="onSizeChangePagination"
  />
  <ImagePreview ref="previewRef" />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { dateToString } from '@/utils/gridFormatter'
import CellPopupPreviewButtonRenderer from '@/views/popupManage/renderer/cellPopupPreviewButtonRenderer.vue'
import cellPopupMobilePreviewButtonRenderer from '@/views/popupManage/renderer/cellPopupMobilePreviewButtonRenderer.vue'
import PopupDetailPopup from './popup/PopupDetailPopup.vue'
import { useAlert } from '@/hooks/web/usePageLoading.ts'

/********* Local Variable *********/
const { alert, confirm } = useAlert()
//grid param

const gridRef = ref()
const popupDetailPopRef = ref(null)
const previewRef = ref(null)
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
const autoSize = ref(null)
//  Grid 컬럼 정의
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
    headerName: '번호',
    field: 'id',
    width: 60,
    sortable: false,
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'popTypeName',
    headerName: '구분',
    width: 120,
    flex: 1,
    sortable: false,
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'title',
    headerName: '제목',
    sortable: false,
    flex: 6,
    cellStyle: {
      textAlign: 'left',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  {
    field: 'postYn',
    headerName: '게시 여부',
    sortable: false,
    flex: 1,
    cellStyle: { textAlign: 'center' },
    valueFormatter: (obj) => {
      return obj.value && obj.value.toString() === 'Y' ? '사용' : '사용안함'
    }
  },
  {
    field: 'viewPostStartAt',
    headerName: '게시 시작일',
    sortable: false,
    flex: 2,
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'viewPostEndAt',
    headerName: '게시 종료일',
    flex: 2,
    sortable: false,
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'fileUrl',
    headerName: '웹 미리보기',
    flex: 1.2,
    sortable: false,
    cellStyle: { textAlign: 'center' },
    cellRenderer: CellPopupPreviewButtonRenderer
  },
  {
    field: 'mobileFileUrl',
    headerName: '모바일 미리보기',
    flex: 1.2,
    sortable: false,
    cellStyle: { textAlign: 'left', display: 'flex' },
    cellRenderer: cellPopupMobilePreviewButtonRenderer
  }
])

//  page param
const emit = defineEmits(['pageChange', 'getDeleteList']) //Page 변경시 데이터 부모컨포넌트 전달
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
//그리드 셀 클릭이벤트
const onGridCellClick = (event) => {
  if (event.colDef.field === 'title') {
    popupDetailPopRef.value.open(event.data.id)
  } else if (event.colDef.field === 'fileUrl') {
    if (event.value) {
      if (event.data && event.data.popType === 'G') {
        //  새창으로 띄우기.
        const imgObj = new Image()
        imgObj.src = event.value
        const windowParam =
          'width=' +
          event.data.popWidth +
          ', height=' +
          event.data.popHeight +
          ', left=' +
          event.data.popX +
          ', top=' +
          event.data.popY
        const imageWin = window.open('', event.data.title, windowParam)
        imageWin.document.body.innerHTML = ''
        imageWin.document.write("<html><body style='margin:0; object-fit: cover;'>")
        imageWin.document.write(
          `<a href=javascript:window.close()><img src='${imgObj.src}' style="object-fit: none;" alt='${event.data.imageDesc}'></a>`
        )
        imageWin.document.write('</body><html>')
        imageWin.document.title = event.data.title
      } else if (event.data && event.data.popType === 'L') {
        previewRef.value.open(event.data.fileUrl) //  레이어로 띄우기.
      }
    } else {
      alert('팝업 정보가 없습니다.', '알림', null, null)
    }
  } else if (event.colDef.field === 'mobileFileUrl') {
    if (event.value) {
      if (event.data && event.data.popType === 'G') {
        //  새창으로 띄우기.
        const imgObj = new Image()
        imgObj.src = event.value
        const windowParam =
          'width=' +
          event.data.popWidth +
          ', height=' +
          event.data.popHeight +
          ', left=' +
          event.data.popX +
          ', top=' +
          event.data.popY
        const imageWin = window.open('', event.data.title, windowParam)
        imageWin.document.body.innerHTML = ''
        imageWin.document.write("<html><body style='margin:0; object-fit: cover;'>")
        imageWin.document.write(
          `<a href=javascript:window.close()><img src='${imgObj.src}' style="object-fit: none;" alt='${event.data.imageDesc}'></a>`
        )
        imageWin.document.write('</body><html>')
        imageWin.document.title = event.data.title
      } else if (event.data && event.data.popType === 'L') {
        previewRef.value.open(event.data.mobileFileUrl) //  레이어로 띄우기.
      }
    } else {
      alert('팝업 정보가 없습니다.', '알림', null, null)
    }
  } else {
    console.log('~~~~~~ etc Cell Click : ')
  }
}
/** Paging 관련 Event **/
const onChangePagination = () => {
  emit('pageChange', props.pageParam)
}
//페이지 사이즈 변경시
const onSizeChangePagination = () => {
  props.pageParam.pageNo = 1
  props.pageParam.rowCnt = pageSize.value
  emit('pageChange', props.pageParam)
}

/** 상단 Button 관련 Event **/
//  등록 Button Click Event
const onPopupAddBtnClick = () => {
  popupDetailPopRef.value.open(null)
}

//  삭제 Button Click Event
const onDeleteBtnClick = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  if (selectedRows && selectedRows.length > 0) {
    const delIdList = selectedRows.map((checkInfo) => checkInfo.id)
    confirm('삭제하시겠습니까?', '삭제', null, (action) => {
      if (action === 'confirm') {
        emit('getDeleteList', delIdList)
      }
    })
  } else {
    alert('삭제할 목록을 선택해 주세요.', '알림', null, null)
  }
}
/********* Local Functions *********/
//사용자정보 그리드에 넣기
const setPopupInfo = () => {
  totalCnt.value = Number(props.data.totalElements)
  curPageEnd.value = props.pageParam.pageNo * props.pageParam.rowCnt
  curPageStart.value = curPageEnd.value - (props.pageParam.rowCnt - 1)
  if (curPageEnd.value > totalCnt.value) {
    curPageEnd.value = totalCnt.value
  }
  pageSize.value = props.pageParam.rowCnt
  gridItems.value = props.data.popupList //  조회해온 목록을 넣는다.
}

//그리드 생성 후 기능담기
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
