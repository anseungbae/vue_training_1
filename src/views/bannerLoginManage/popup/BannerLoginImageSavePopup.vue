<template>
  <el-dialog
    v-model="bannerImagePopupOpened"
    align-center
    class="modal-title modal-small"
    title="로그인 배너 저장"
  >
    <hr />
    <div class="flex justify-end my-3">
      <el-button class="basic-button" @click="onSaveButtonClick">저장</el-button>
    </div>
    <div class="modal-box">
      <div>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">배너 이미지명</el-col>
          <el-col :span="21" class="input-content">
            <el-input
              v-model="paramData.name"
              placeholder="배너 이미지명"
              maxlength="35"
              clearable
            />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">게시여부</el-col>
          <el-col :span="9" class="input-content">
            <el-select v-model="paramData.postYn" placeholder="전체" style="width: 150px">
              <el-option
                v-for="item in postYnList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="3" class="input-label">게시일자</el-col>
          <el-col :span="9" class="input-content">
            <el-date-picker
              v-model="dateRangeVal"
              type="daterange"
              range-separator="~"
              format="YYYY.MM.DD"
              value-format="YYYYMMDD"
              :clearable="false"
              style="min-width: 210px; width: 250px"
            />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">사용여부</el-col>
          <el-col :span="21" class="input-content">
            <el-select v-model="paramData.useYn" placeholder="전체" style="width: 150px">
              <el-option
                v-for="item in useYnList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div class="grid-box mt-5">
        <div class="grid-header-box">
          <p class="subtitle-font">배너 이미지 목록</p>
          <div class="button-box">
            <el-button class="grid-button" @click="onBannerLoginImageSelectListAdd">추가</el-button>
            <el-button class="grid-button" @click="onBannerLoginImageSelectListRemove"
              >삭제</el-button
            >
          </div>
        </div>
        <DataGrid
          ref="bannerImageSelectGridRef"
          class="ag-theme-quartz data-grid-small-box"
          rowSelection="multiple"
          :rowData="bannerLoginImageMapList"
          :columnDefs="colDefs"
          @onGridReady="onGridReady"
        />
      </div>
    </div>
  </el-dialog>
  <BannerSelectPopup ref="bannerImageSelectPopRef" @bannerImgCheckedList="onAddGridItems" />
</template>

<script setup lang="ts">
import bannerService from '@/api/bannerService'
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { useAlert } from '@/hooks/web/usePageLoading.ts'
import { isEmpty } from '@/utils/is'
import BannerSelectPopup from '@/views/bannerImage/popup/BannerSelectPopup.vue'

/********* Local Variable *********/
const emit = defineEmits(['onPopupSaveComplete'])
const { alert, confirm } = useAlert()
const today = dayjs(new Date())
const dateRangeVal = ref([today.format('YYYY.MM.DD'), today.add(1, 'month').format('YYYY.MM.DD')])
/** 팝업 관련 **/
const bannerImagePopupOpened = ref(false)
const bannerImageSelectGridRef = ref(null)
const bannerImageSelectPopRef = ref(null)
/** 그리드 관련 **/
const bannerLoginImageMapList = ref([])
const gridApi = ref(null)

/** Detail Info 관련 **/
const paramData = reactive({
  id: null,
  saveMode: null,
  name: null,
  postYn: null,
  postStartAt: null,
  postEndAt: null,
  useYn: null,
  saveTerm: ''
})
const useYnList = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '사용안함' }
]
const postYnList = [
  { value: 'Y', label: '게시' },
  { value: 'N', label: '게시안함' }
]
const pageIdsList = ref([])
const colDefs = ref([
  {
    width: 40,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    editable: true,
    sortable: false,
    showDisabledCheckboxes: true
  },
  {
    field: 'name',
    headerName: '이미지 명',
    flex: 2,
    sortable: false,
    cellStyle: { textAlign: 'left' }
  },
  {
    field: 'imageDesc',
    headerName: '이미지 설명',
    flex: 2,
    sortable: false,
    cellStyle: { textAlign: 'left' }
  },
  {
    field: 'linkUrl',
    headerName: '링크주소',
    flex: 5,
    sortable: false,
    cellStyle: { textAlign: 'left' }
  },
  {
    field: 'orderNo',
    headerName: '순서',
    sortable: false,
    flex: 1,
    editable: true,
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: {
      min: 0,
      max: 100
    },
    cellStyle: {
      textAlign: 'center'
    }
  }
])

/********* Service API *********/
// 조회 정보 가져오기
const getBannerLoginImageDetailApi = () => {
  const param = { id: paramData.id }
  bannerService
    .getBannerLoginImageDetail(param)
    .then((res) => {
      paramData.saveMode = 'update'
      paramData.name = res.data.detailInfo.name
      paramData.postYn = res.data.detailInfo.postYn
      paramData.useYn = res.data.detailInfo.useYn
      dateRangeVal.value[0] = res.data.detailInfo.postStartAt
      dateRangeVal.value[1] = res.data.detailInfo.postEndAt
      bannerLoginImageMapList.value = res.data.bannerImageList
    })
    .catch((err) => console.error(err))
}

// 저장 서비스
const setBannerLoginImageSaveApi = () => {
  confirm('저장하시겠습니까?', '저장', null, (action) => {
    if (action === 'confirm') {
      const saveParam = {
        saveInfo: paramData,
        bannerImageList: bannerLoginImageMapList.value
      }
      bannerService.saveBannerLoginImage(saveParam).then((res) => {
        let alertMsg = ''
        if (res.data.saveStatus) {
          alertMsg = `저장되었습니다.`
        } else {
          alertMsg = '저장에 실패하였습니다.'
        }
        alert(alertMsg, '저장', { confirmButtonText: '확인' }, () => {
          onCloseModal()
        })
      })
    }
  })
}

/********* Event Handler *********/

// 사업장 상세 정보 저장 Click Event
const onSaveButtonClick = () => {
  if (saveValidation()) {
    // Save API 호출 전 Validation 체크
    paramData.postStartAt = dayjs(dateRangeVal.value[0]).format('YYYYMMDD')
    paramData.postEndAt = dayjs(dateRangeVal.value[1]).format('YYYYMMDD')
    setBannerLoginImageSaveApi() // sava API 호출
  }
}

// 배너 이미지 목록 추가버튼
const onBannerLoginImageSelectListAdd = () => {
  bannerImageSelectPopRef.value.imageOpen()
}

// 배너 이미지 추가된 항목 그리드로 Add.
const onAddGridItems = (checkedRows) => {
  // 체크된 항목이 있을 경우 처리.
  if (checkedRows && checkedRows.length > 0) {
    // 기존 목록과 합쳐서 이미지를 보여줘야 한다.
    const addCheckedRowArr = []
    checkedRows.map((checkInfo) => {
      const isDuplicate =
        bannerLoginImageMapList.value.filter((mapInfo) => mapInfo.bannerImageId === checkInfo.id)
          .length > 0

      if (!isDuplicate) {
        addCheckedRowArr.push({
          bannerLoginImageId: paramData.id,
          bannerImageId: checkInfo.id,
          orderNo:
            (bannerLoginImageMapList.value ? bannerLoginImageMapList.value.length : 0) +
            (addCheckedRowArr ? addCheckedRowArr.length : 0) +
            1,
          name: checkInfo.name,
          imageDesc: checkInfo.imageDesc,
          linkUrl: checkInfo.linkUrl,
          fileUrl: checkInfo.fileUrl
        })
      }
    })
    // 중복을 제외하고 추가된 항목만 있을 경우 추가 처리를 한다.
    if (addCheckedRowArr && addCheckedRowArr.length > 0) {
      const newBannerImageMapList = bannerLoginImageMapList.value.concat(addCheckedRowArr)
      bannerLoginImageMapList.value = newBannerImageMapList
    }
  }
  const addCheckedRowArr = []
}

// 배너 이미지 목록에서 체크한 항목 Remove하기.
const onBannerLoginImageSelectListRemove = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  if (selectedRows && selectedRows.length > 0) {
    const newBannerImageMapList = []
    bannerLoginImageMapList.value.map((imageMapInfo) => {
      if (
        selectedRows.filter((checkInfo) => checkInfo.bannerImageId === imageMapInfo.bannerImageId)
          .length === 0
      ) {
        newBannerImageMapList.push(imageMapInfo)
      }
    })
    bannerLoginImageMapList.value = newBannerImageMapList
  }
}

// 화면 닫기
const onCloseModal = () => {
  emit('onPopupSaveComplete') // 재조회 관련 호출하기.
  bannerImagePopupOpened.value = false
}

/********* Local Functions *********/
// 넘어온 팝업ID 설정
const open = (id) => {
  paramData.id = id
  clearForm() // 입력 폼 초기화
  if (paramData.id) {
    getBannerLoginImageDetailApi() // 사업장 상세정보 조회
  }
  bannerImagePopupOpened.value = true
}

// 입력 폼 Clear 하기.
const clearForm = () => {
  paramData.saveMode = 'insert'
  paramData.useYn = 'Y'
  paramData.name = null
  paramData.postYn = 'Y'
  bannerLoginImageMapList.value = []
  dateRangeVal.value = [today.format('YYYY.MM.DD'), today.add(1, 'month').format('YYYY.MM.DD')]
}

// 그리드 생성 후 기능담기
const onGridReady = (params) => {
  gridApi.value = params?.api
}

// 저장 전 Validation 체크
const saveValidation = () => {
  if (isEmpty(paramData.name)) {
    alert('배너 이미지명을 입력해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(bannerLoginImageMapList.value) || bannerLoginImageMapList.value.length == 0) {
    alert('배너 이미지 목록을 추가해 주세요.', '알림', null, null)
    return false
  }
  return true
}

/********* lifeCycle *********/
// Popup Open
defineExpose({
  open
})
</script>

<style scoped></style>
