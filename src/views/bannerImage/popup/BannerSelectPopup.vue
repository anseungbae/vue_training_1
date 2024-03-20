<template>
  <el-dialog
    v-model="bannerImageSelectPopupOpened"
    align-center
    class="modal-title modal-small"
    title="배너이미지 선택"
  >
    <hr />
    <div class="modal-box">
      <div class="grid-box mt-5">
        <div class="grid-header-box">
          <p class="subtitle-font">배너 이미지 목록</p>
          <div class="button-box">
            <el-button class="grid-button" @click="handleSelectBtnOnClick">선택</el-button>
          </div>
        </div>
        <DataGrid
          class="ag-theme-quartz data-grid-small-box"
          rowSelection="multiple"
          ref="bannerImageSelectGridRef"
          :rowData="gridItems"
          :columnDefs="colDefs"
          @onGridReady="onGridReady"
        />
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import BannerService from '@/api/bannerService'
import { useAlert } from '@/hooks/web/usePageLoading.ts'

/********* Local Variable *********/
const { alert } = useAlert()
const emit = defineEmits(['bannerImgCheckedList'])
const bannerImageSelectPopupOpened = ref(false)
const bannerImageSelectGridRef = ref(null)

const gridItems = ref([])
const gridApi = ref(null)
const colDefs = ref([
  {
    headerName: 'No.',
    cellClass: 'centered',
    valueGetter: 'node.rowIndex + 1',
    width: 40,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    width: 40,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    editable: true,
    headerCheckboxSelectionFilteredOnly: true,
    showDisabledCheckboxes: true
  },
  {
    field: 'name',
    headerName: '이미지 명',
    width: 400,
    suppressSizeToFit: true,
    flex: 2,
    cellStyle: {
      textAlign: 'left',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  {
    field: 'imageDesc',
    headerName: '이미지 설명',
    width: 400,
    suppressSizeToFit: true,
    flex: 2,
    cellStyle: {
      textAlign: 'left'
    }
  },
  {
    field: 'linkUrl',
    headerName: '링크주소',
    width: 400,
    suppressSizeToFit: true,
    flex: 2,
    cellStyle: {
      textAlign: 'left'
    }
  }
])

/********* Service API *********/
// 이미지 목록 api
const getBannerImageSelectListApi = () => {
  const param = {
    page: 'LOGIN'
  }
  BannerService.getBannerImageSelectList(param).then((res) => {
    gridItems.value = res.data
  })
}

/********* Local Functions *********/
// 넘어온 사용자 설정
const imageOpen = () => {
  getBannerImageSelectListApi()
  bannerImageSelectPopupOpened.value = true
}

//  선택 버튼 클릭.
const handleSelectBtnOnClick = (e) => {
  const selectedRows = gridApi.value.getSelectedRows()
  if (selectedRows && selectedRows.length > 0) {
    emit('bannerImgCheckedList', selectedRows)
    bannerImageSelectPopupOpened.value = false
  } else {
    alert('체크한 항목이 없습니다.', '알림', null, null)
  }
}

const onGridReady = (params) => {
  gridApi.value = params?.api
}

/********* lifeCycle *********/
defineExpose({
  imageOpen
})
</script>

<style scoped></style>
