<template>
  <el-dialog
    v-model="memberDetailPopupOpened"
    align-center
    class="min-w-[550px] min-h-[300px] pb-0 t-0%"
    width="600"
    title="배너이미지 저장"
  >
    <hr />
    <div class="flex justify-end my-3">
      <el-button class="basic-button" @click="dialogAlert()">저장</el-button>
    </div>
    <div class="modal-box">
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> 이미지 명</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.name"
            :input-style="{ fontSize: '12px' }"
            disable
            maxlength="35"
            clearable
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> 이미지 설명</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.imageDesc"
            :input-style="{ fontSize: '12px' }"
            disable
            maxlength="165"
            clearable
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> 이미지 </el-col>
        <el-col :span="18">
          <ImageUpload
            @changeImage="changeImage"
            @deleteImage="deleteImage"
            :oriFileName="detailParam.oriFileName"
            @onPreviewOpenPop="onPreviewOpenPop"
            :isDeleteShowHide="true"
            :isPreviewShowHide="true"
            inputStyle="width:300px"
            accept="image/*"
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> Link 주소</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.linkUrl"
            :input-style="{ fontSize: '12px' }"
            disable
            maxlength="170"
            clearable
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> 새창오픈여부</el-col>
        <el-col :span="18" class="input-content">
          <el-select v-model="detailParam.linkNewWindowYn" placeholder="선택" style="width: 150px">
            <el-option
              v-for="item in newPageYnList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> 사용여부</el-col>
        <el-col :span="18" class="input-content">
          <el-select v-model="detailParam.useYn" placeholder="선택" style="width: 150px">
            <el-option
              v-for="item in useYnList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> 적용영역 선택</el-col>
        <el-col :span="18" class="input-content">
          <el-select v-model="detailParam.usePage" placeholder="선택" style="width: 150px">
            <el-option
              v-for="item in bannerTypeList"
              :key="item.value"
              :label="item.label"
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
import { ref } from 'vue'
import BannerService from '@/api/bannerService'
import BannerPreviewPopup from './BannerPreviewPopup.vue'
import { isEmpty } from '@/utils/is'
import { useAlert } from '@/hooks/web/usePageLoading'

/** 파라미터**/
const { alert, confirm } = useAlert()
const emit = defineEmits(['onSearchDataReload']) //
const isPreview = ref(null)
const validationMsg = ref(null)
//사용여부 리스트
const useYnList = [
  {
    value: 'Y',
    label: '사용'
  },
  {
    value: 'N',
    label: '사용안함'
  }
]

//사용여부 리스트
const newPageYnList = [
  {
    value: 'Y',
    label: '사용'
  },
  {
    value: 'N',
    label: '사용안함'
  }
]

//사용페이지 리스트
const bannerTypeList = [
  {
    value: 'LOGIN',
    label: '로그인 배너'
  },
  {
    value: 'MAINTOP',
    label: '메인 상단 배너'
  }
]
const previewRef = ref(null)
const memberDetailPopupOpened = ref(false)
const pkUserId = ref<any>(null)
/** Grid 관련 **/
const selectFile = ref(null)
const fileUrl = ref(null)

/** Detail Info 관련 **/
const detailParam = ref<any>({
  id: null,
  imageDesc: null,
  linkNewWindowYn: null,
  linkUrl: '',
  name: null,
  oriFileName: null,
  usePage: null,
  useYn: null,
  fileGroupId: null,
  fileId: null
})

const deleteFileId = ref(null)

const onPreviewOpenPop = () => {
  previewRef.value.open(fileUrl.value)
}

/** 기능 **/
//넘어온 사용자 EmailId 설정
const open = (userId: any) => {
  if (userId) {
    pkUserId.value = userId
    getBannerDetailApi() //  회원 상세정보 조회
    memberDetailPopupOpened.value = true
    isPreview.value = true
  } else {
    pkUserId.value = ''
    getBannerDetailApi()
    memberDetailPopupOpened.value = true
    isPreview.value = false
  }
}

//  배너이미지 상세조회 API 호출
const getBannerDetailApi = () => {
  const param = { id: pkUserId.value }
  BannerService.getBannerImageDetail(param).then((res) => {
    //조회한 배너이미지 정보를 넣어줌
    detailParam.value.id = res.data.id
    detailParam.value.imageDesc = res.data.imageDesc
    detailParam.value.linkNewWindowYn = res.data.linkNewWindowYn
    detailParam.value.linkUrl = res.data.linkUrl
    detailParam.value.name = res.data.name
    detailParam.value.oriFileName = res.data.oriFileName
    detailParam.value.usePage = res.data.usePage
    detailParam.value.useYn = res.data.useYn
    detailParam.value.fileGroupId = res.data.fileGroupId !== 'null' ? res.data.fileGroupId : null
    detailParam.value.fileId = res.data.fileId
    fileUrl.value = res.data.fileUrl
  })
}

/** Dialog 관련 **/
const dialogAlert = () => {
  confirm('저장하시겠습니까?', '알림', null, (action) => {
    if (action == 'confirm') {
      if (validation()) {
        onSaveApi()
      } else {
        alert(validationMsg.value, '알림', null, null)
      }
    }
  })
}

const validation = () => {
  const regex = /(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}(\?[\/a-z0-9-%#?&=\w]+)*/gi
  if (isEmpty(detailParam.value.name)) {
    validationMsg.value = '이미지 명을 입력해주세요.'
    return false
  } else if (isEmpty(detailParam.value.imageDesc)) {
    validationMsg.value = '이미지 설명을 입력해주세요.'
    return false
  } else if (isEmpty(detailParam.value.oriFileName)) {
    validationMsg.value = '이미지를 선택해주세요.'
    return false
  } else if (isEmpty(detailParam.value.linkUrl)) {
    validationMsg.value = 'Link주소를 입력해주세요.'
    return false
  } else if (!regex.test(detailParam.value.linkUrl)) {
    validationMsg.value = 'URL주소로 작성해주세요.'
    return false
  } else if (isEmpty(detailParam.value.linkNewWindowYn)) {
    validationMsg.value = '새창오픈여부를 선택해주세요.'
    return false
  } else if (isEmpty(detailParam.value.useYn)) {
    validationMsg.value = '사용여부를 선택해주세요.'
    return false
  } else if (isEmpty(detailParam.value.usePage)) {
    validationMsg.value = '적용영역을 선택해주세요.'
    return false
  } else {
    return true
  }
}

//  저장 서비스
const onSaveApi = () => {
  const formData = new FormData()
  formData.append('uploadFile', selectFile.value)
  formData.append('saveMode', detailParam.value.id ? 'update' : 'insert')
  formData.append('id', detailParam.value.id)
  formData.append('name', detailParam.value.name)
  formData.append('imageDesc', detailParam.value.imageDesc)
  formData.append('linkUrl', detailParam.value.linkUrl)
  formData.append('linkNewWindowYn', detailParam.value.linkNewWindowYn)
  formData.append('useYn', detailParam.value.useYn)
  formData.append('fileGroupId', detailParam.value.fileGroupId)
  formData.append('usePage', detailParam.value.usePage)
  formData.append('delFileId', deleteFileId.value)
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }

  BannerService.saveBannerImage(formData, config)
    .then((res) => {
      if (res.data) {
        onClosePopupResearch()
      }
    })
    .catch((err) => alert(err, '경고', null, () => {}))
}

/** Popup  **/

// 팝업 닫으며 재조회.
const onClosePopupResearch = () => {
  emit('onSearchDataReload')
  memberDetailPopupOpened.value = false //  화면 닫기
}

const changeImage = (e) => {
  // const files = e.target.files;
  selectFile.value = e.target.files[0]
  detailParam.value.oriFileName = e.target.files[0].name
}

const deleteImage = () => {
  confirm('저장시 이미지파일이 삭제 됩니다. 삭제 하시겠습니까?', '알림', null, (action) => {
    if (action == 'confirm') {
      detailParam.value.oriFileName = null
      deleteFileId.value = detailParam.value.fileId
    }
  })
}

defineExpose({
  open
}) //Popup Open
</script>

<style lang="scss" scoped></style>
