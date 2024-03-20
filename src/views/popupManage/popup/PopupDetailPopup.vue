<template>
  <el-dialog
    v-model="popupDetailPopupOpened"
    align-center
    class="modal-title modal-small"
    title="팝업관리 저장"
  >
    <hr />
    <div class="flex justify-end my-3">
      <el-button class="basic-button" @click="onSaveButtonClick">저장</el-button>
    </div>
    <div class="modal-box">
      <el-row class="row-box">
        <el-col :span="3" class="input-label">팝업 구분</el-col>
        <el-col :span="21" class="input-content">
          <el-select v-model="paramData.popType" style="width: 150px">
            <el-option
              v-for="item in popTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label">제목</el-col>
        <el-col :span="21" class="input-content">
          <el-input v-model="paramData.title" placeholder="팝업제목" maxlength="100" clearable />
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
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label">이미지</el-col>
        <el-col :span="9">
          <imageUpload
            @changeImage="onSelectFileChange"
            @deleteImage="deleteImage"
            @onPreviewOpenPop="onPreviewOpenPop"
            :oriFileName="paramData.fileName"
            :isDeleteShowHide="true"
            :isPreviewShowHide="true"
            inputStyle="width:250px"
            accept="image/*"
          />
        </el-col>
        <el-col :span="3" class="input-label">모바일이미지</el-col>
        <el-col :span="9">
          <imageUpload
            @changeImage="onSelectMobileFileChange"
            @deleteImage="deleteMobileImage"
            @onPreviewOpenPop="onPreviewMobileOpenPop"
            :oriFileName="paramData.mobileFileName"
            :isDeleteShowHide="true"
            :isPreviewShowHide="true"
            inputStyle="width:250px"
            accept="image/*"
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label">이미지 설명</el-col>
        <el-col :span="21" class="input-content">
          <el-input
            v-model="paramData.imageDesc"
            :input-style="{ fontSize: '12px' }"
            placeholder="이미지 설명"
            maxlength="165"
            clearable
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label">이미지 크기</el-col>
        <el-col :span="9" class="input-content">
          <el-input
            v-model="paramData.popWidth"
            style="width: 100px"
            placeholder="팝업넓이"
            oninput="value = value.replace(/[^0-9.]/g, '')"
            clearable
          />
          <p class="mx-4 basic-font">X</p>
          <el-input
            v-model="paramData.popHeight"
            style="width: 100px"
            placeholder="팝업높이"
            oninput="value = value.replace(/[^0-9.]/g, '')"
            clearable
          />
        </el-col>
        <el-col :span="3" class="input-label">팝업 위치</el-col>
        <el-col :span="9" class="input-content">
          <p class="mx-2 basic-font">X</p>
          <el-input
            v-model="paramData.popX"
            style="width: 100px"
            placeholder="Open X좌표"
            oninput="value = value.replace(/[^0-9.]/g, '')"
            clearable
          />
          <p class="mx-4 basic-font">Y</p>
          <el-input
            v-model="paramData.popY"
            style="width: 100px"
            placeholder="Open Y좌표"
            oninput="value = value.replace(/[^0-9.]/g, '')"
            clearable
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label">Link URL </el-col>
        <el-col :span="21" class="input-content">
          <el-input
            v-model="paramData.linkUrl"
            :input-style="{ fontSize: '12px' }"
            placeholder="Link URL"
            maxlength="170"
            clearable
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label">적용페이지</el-col>
        <el-col :span="21" class="input-content">
          <el-select v-model="paramData.pageIds" multiple placeholder="적용페이지">
            <el-option
              v-for="item in pageIdsList"
              :key="item.value"
              :label="item.codeName"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
  <ImagePreview ref="previewRef" />
</template>

<script setup lang="ts">
import PopupService from '@/api/popupService'
import CodeService from '@/api/codeService'
import { reactive, ref, onBeforeMount } from 'vue'
import dayjs from 'dayjs'
import { useAlert } from '@/hooks/web/usePageLoading.ts'
import { isEmpty } from '@/utils/is'

/********* Local Variable *********/
const emit = defineEmits(['onPopupDetailInfoSaveComplete'])
const { alert, confirm } = useAlert()
const today = dayjs(new Date())
const dateRangeVal = ref<any>([
  today.format('YYYY.MM.DD'),
  today.add(1, 'month').format('YYYY.MM.DD')
])

const previewRef = ref(null)

const popupDetailPopupOpened = ref(false)

/** Detail Info 관련 **/
const paramData = reactive({
  pkId: null,
  saveMode: null,
  popType: null,
  title: null,
  postYn: null,
  postStartAt: null,
  postEndAt: null,
  fileName: null,
  mobileFileName: null,
  imageDesc: null,
  popWidth: null,
  popHeight: null,
  popX: null,
  popY: null,
  linkUrl: null,
  fileGroupId: null,
  fileId: null,
  mobileFileId: null,
  selectFile: null,
  selectMobileFile: null,
  pageIds: []
})
const fileUrl = ref(null)
const mobileFileUrl = ref(null)

const delFileId = ref(null)
const delMobileFileId = ref(null)

const popTypeList = [
  { value: 'G', label: '일반' },
  { value: 'L', label: '레이어' }
]
const postYnList = [
  { value: 'Y', label: '게시' },
  { value: 'N', label: '게시안함' }
]
const pageIdsList = ref([])

/********* Service API *********/
// 적용페이지 옵션 조회
const getPageIdsCodeListApi = () => {
  CodeService.getCodeListByPCode('POP_PAGE_ID').then((res) => {
    pageIdsList.value = res.data
  })
}
// 조회한 사업장 정보를 넣는다.
const getPopupDetailInfoApi = () => {
  const param = { id: paramData.pkId }
  PopupService.getPopupDetail(param).then((res) => {
    paramData.saveMode = 'update'
    paramData.popType = res.data.popType
    paramData.title = res.data.title
    paramData.postYn = res.data.postYn
    dateRangeVal.value[0] = res.data.postStartAt
    dateRangeVal.value[1] = res.data.postEndAt
    paramData.imageDesc = res.data.imageDesc
    paramData.popX = res.data.popX
    paramData.popY = res.data.popY
    paramData.popWidth = res.data.popWidth
    paramData.popHeight = res.data.popHeight
    paramData.linkUrl = res.data.linkUrl
    fileUrl.value = res.data.fileUrl
    mobileFileUrl.value = res.data.mobileFileUrl
    if (res.data.pageIds != null) {
      paramData.pageIds = res.data.pageIds.split(',')
    }
    if (res.data.fileGroupId) {
      paramData.fileGroupId = res.data.fileGroupId
      paramData.fileId = res.data.fileId
      paramData.mobileFileId = res.data.mobileFileId
      paramData.fileName = res.data.oriFileName
      paramData.mobileFileName = res.data.oriMobileFileName
    } else {
      paramData.fileGroupId = null
      paramData.fileId = null
      paramData.mobileFileId = null
      paramData.fileName = null
      paramData.mobileFileName = null
    }
  })
}

// 저장 서비스
const onPopupDetailSaveApi = () => {
  const formData = new FormData()
  formData.append('uploadFile', paramData.selectFile)
  formData.append('uploadMobileFile', paramData.selectMobileFile)
  formData.append('saveMode', paramData.saveMode)
  formData.append('id', paramData.pkId)
  formData.append('popType', paramData.popType)
  formData.append('title', paramData.title)
  formData.append('postYn', paramData.postYn)
  formData.append('postStartAt', dayjs(dateRangeVal.value[0]).format('YYYYMMDD'))
  formData.append('postEndAt', dayjs(dateRangeVal.value[1]).format('YYYYMMDD'))
  formData.append('imageDesc', paramData.imageDesc)
  formData.append('popX', paramData.popX)
  formData.append('popY', paramData.popY)
  formData.append('popWidth', paramData.popWidth)
  formData.append('popHeight', paramData.popHeight)
  formData.append('fileGroupId', paramData.fileGroupId)
  formData.append('fileId', paramData.fileId)
  formData.append('mobileFileId', paramData.mobileFileId)
  formData.append('linkUrl', paramData.linkUrl)
  formData.append('pageIds', paramData.pageIds.join(','))
  formData.append('delFileId', delFileId.value)
  formData.append('delMobileFileId', delMobileFileId.value)
  const config = {
    headers: { 'Content-Type': `multipart/form-data; charset: UTF-8;` }
  }

  confirm('저장하시겠습니까?', '저장', null, (action) => {
    if (action === 'confirm') {
      PopupService.savePopup(formData, config).then((res) => {
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
  // Save API 호출 전 Validation 체크
  if (saveValidation()) {
    onPopupDetailSaveApi() // sava API 호출
  }
}

/** 이미지 파일  **/
// 이미지 변경
const onSelectFileChange = (e) => {
  paramData.selectFile = e.target.files[0]
  paramData.fileName = e.target.files[0].name
}

// 모바일 이미지 변경
const onSelectMobileFileChange = (e) => {
  paramData.selectMobileFile = e.target.files[0]
  paramData.mobileFileName = e.target.files[0].name
}

const onPreviewOpenPop = () => {
  previewRef.value.open(fileUrl.value)
}

const onPreviewMobileOpenPop = () => {
  previewRef.value.open(mobileFileUrl.value)
}

const deleteImage = () => {
  confirm('저장시 이미지파일이 삭제 됩니다. 삭제 하시겠습니까?', '알림', null, (action) => {
    if (action == 'confirm') {
      // deleteFileId.value = detailParam.value.fileId
      delFileId.value = paramData.fileId
      paramData.fileName = null
    }
  })
}

const deleteMobileImage = () => {
  confirm('저장시 이미지파일이 삭제 됩니다. 삭제 하시겠습니까?', '알림', null, (action) => {
    if (action == 'confirm') {
      // deleteFileId.value = detailParam.value.fileId
      delMobileFileId.value = paramData.mobileFileId
      paramData.mobileFileName = null
    }
  })
}

// 화면 닫기
const onCloseModal = () => {
  emit('onPopupDetailInfoSaveComplete') // 재조회 관련 호출하기.
  popupDetailPopupOpened.value = false
}

/********* Local Functions *********/
// 넘어온 팝업ID 설정
const open = (id) => {
  paramData.pkId = id
  clearForm() // 입력 폼 초기화
  if (paramData.pkId) {
    getPopupDetailInfoApi() // 사업장 상세정보 조회
  }
  popupDetailPopupOpened.value = true
}

// 입력 폼 Clear 하기.
const clearForm = () => {
  paramData.saveMode = 'insert'
  paramData.popType = 'G'
  paramData.title = null
  paramData.postYn = 'Y'
  paramData.fileName = null
  paramData.mobileFileName = null
  paramData.imageDesc = null
  paramData.popWidth = null
  paramData.popHeight = null
  paramData.popX = null
  paramData.popY = null
  paramData.linkUrl = null
  paramData.fileGroupId = null
  paramData.fileId = null
  paramData.mobileFileId = null
  paramData.selectFile = null
  paramData.selectMobileFile = null
  paramData.pageIds = null
}

// 저장 전 Validation 체크
const saveValidation = () => {
  const regex = /(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}(\?[\/a-z0-9-%#?&=\w]+)*/gi
  if (isEmpty(paramData.title)) {
    alert('제목을 입력해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(paramData.fileName)) {
    alert('이미지 파일을 선택해주세요.', '알림', null, null)
    return false
  } else if (isEmpty(paramData.mobileFileName)) {
    alert('모바일 이미지 파일을 선택해주세요.', '알림', null, null)
    return false
  } else if (isEmpty(paramData.imageDesc)) {
    alert('이미지 설명란을 입력해주세요.', '알림', null, null)
    return false
  } else if (isEmpty(paramData.popWidth)) {
    alert('이미지 크기 넓이를 입력해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(paramData.popHeight)) {
    alert('이미지 크기 높이를 선택해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(paramData.popX)) {
    alert('가로축 팝업위치를 선택해 주세요.', '알림', null, null)
    return false
  } else if (isEmpty(paramData.popY)) {
    alert('세로축 팝업위치를 선택해 주세요', '알림', null, null)
    return false
  } else if (isEmpty(paramData.linkUrl)) {
    alert('Link주소를 입력해주세요.', '알림', null, null)
    return false
  } else if (!regex.test(paramData.linkUrl)) {
    alert('URL주소로 작성해주세요.', '알림', null, null)
    return false
  } else if (isEmpty(paramData.pageIds) || paramData.pageIds.length == 0) {
    alert('적용페이지를 입력해주세요.', '알림', null, null)
    return false
  }
  return true
}

/********* lifeCycle *********/
// 적용페이지 목록
onBeforeMount(() => {
  getPageIdsCodeListApi()
})
// Popup Open
defineExpose({
  open
})
</script>

<style scoped></style>
