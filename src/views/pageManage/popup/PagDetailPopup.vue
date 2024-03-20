<template>
  <el-dialog
    v-model="memberDetailPopupOpened"
    class="min-w-[550px] min-h-[300px] pb-0 t-0%"
    width="600"
    title="배너이미지 저장"
  >
    <hr />
    <div class="flex justify-end mt-[10px]">
      <el-button class="basic-button" @click="dialogAlert(alertSave)">저장</el-button>
    </div>
    <div class="subtitle-font">
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> 이미지 명</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.name"
            :input-style="{ fontSize: '12px' }"
            disable
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
            clearable
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> 이미지 </el-col>
        <el-col :span="13" class="input-content">
          <el-input
            v-model="detailParam.oriFileName"
            :input-style="{ fontSize: '12px' }"
            disabled
            clearable
          />
        </el-col>
        <el-col :span="1" class="input-content">
          <el-button class="basic-button" @click="onSelectFileOpen">파일선택</el-button>
        </el-col>

        <input
          ref="fileRef"
          type="file"
          accept="image/*"
          @change="changeImage"
          style="display: none"
        />
        <!-- <el-upload
                class="upload-demo"
                action=""
                :on-success="handlePreview"
  
              >
                <el-button type="primary">파일 설정</el-button>
              </el-upload> -->
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> Link 주소</el-col>
        <el-col :span="18" class="input-content">
          <el-input
            v-model="detailParam.linkUrl"
            :input-style="{ fontSize: '12px' }"
            disable
            clearable
          />
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="6" class="input-label"> 새창오픈여부</el-col>
        <el-col :span="18" class="input-content">
          <el-select v-model="detailParam.linkNewWindowYn" placeholder="선택" style="width: 250px">
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
          <el-select v-model="detailParam.useYn" placeholder="선택" style="width: 250px">
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
          <el-select v-model="detailParam.usePage" placeholder="선택" style="width: 250px">
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
</template>

<script setup lang="ts">
import { ref, computed, reactive, render } from 'vue'
import UserService from '@/api/userService'
import { ElMessageBox } from 'element-plus'
import BannerService from '@/api/bannerService'

/** 파라미터**/

const emit = defineEmits(['onSearchDataReload']) //
//  성별 Select 목록
const fileRef = ref(null)

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

const memberDetailPopupOpened = ref(false)
const pkUserId = ref<any>(null)
/** Grid 관련 **/
const businessGridItems = ref(null)
const usePayGridItems = ref(null)
const termsGridItems = ref(null)
const selectFile = ref(null)

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
  fileGroupId: null
})
//Dialog param
const alertMsg = ref('')
const alertSave = ref({
  type: 'save',
  title: '알람',
  message: '수정한 정보를 저장하시겠습니까?'
})
const alertReset = ref({
  type: 'reset',
  title: '알람',
  message: '회원의 비밀번호를 초기화를 하시겠습니까?'
})

// Popup  Ref

const getUsePayGridItems = computed(() => {
  return usePayGridItems.value || []
})

/** 기능 **/
//넘어온 사용자 EmailId 설정
const open = (userId: any) => {
  if (userId) {
    console.log('1111111111111')
    pkUserId.value = userId
    console.log('pkUserId : ', pkUserId.value)
    getBannerDetailApi() //  회원 상세정보 조회
    memberDetailPopupOpened.value = true
  } else {
    console.log('2222222222222222 : ', pkUserId.value)
    pkUserId.value = ''
    getBannerDetailApi()
    memberDetailPopupOpened.value = true
  }
}

//  배너이미지 상세조회 API 호출
const getBannerDetailApi = () => {
  const param = { id: pkUserId.value }
  console.log('parrrrrr : ', param)
  BannerService.getBannerImageDetail(param).then((res) => {
    console.log('데이터어어 : ', res)

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
  })
}

/** Dialog 관련 **/
const dialogAlert = (alertList: any) => {
  ElMessageBox.confirm(alertList.message, alertList.title, {
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    type: 'warning'
  })
    .then(() => {
      if (alertList.type == 'save') {
        onSaveApi()
      }
    })
    .catch(() => {
      // catch error
    })
}

const onSelectFileOpen = () => {
  fileRef.value.click()
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
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }

  console.log('form DATA : ', formData)
  console.log('form config : ', config)
  BannerService.saveBannerImage(formData, config)
    .then((res) => {
      console.log('userModify ', res.data)
      // saveFormClear();
      // props.bannerImageSavePopupClose(true);
    })
    .catch((err) => alert(err))
  const param = {
    userInfo: {
      // userId: pkUserId.value,
      // userName: detailParam.value.userName,
      // userBirthDt: detailParam.value.userBirthDt,
      // contactNo: detailParam.value.contactNo,
      // zipCode: detailParam.value.zipCode,
      // basicAddr: detailParam.value.basicAddr,
      // detailAddr: detailParam.value.detailAddr,
      // userGender: detailParam.value.userGender,
      // maktSmsYn: detailParam.value.maktSmsYn,
      // maktEmailYn: detailParam.value.maktEmailYn,
      // recommenderId: detailParam.value.recommenderId,
      // failPwCnt: detailParam.value.failPwCnt,
    }
  }
  UserService.userModify(param).then((res) => {
    if (res.data) {
      alertMsg.value = '저장하였습니다.'
      onClosePopupResearch()
      // memberDetailPopupOpened.value = false
    } else {
      alertMsg.value = '저장에 실패하였습니다.'
    }
    ElMessageBox.alert(alertMsg.value, alertSave.value.title, {
      confirmButtonText: '확인'
    })
  })
}

/** Popup  **/

// 팝업 닫으며 재조회.
const onClosePopupResearch = () => {
  emit('onSearchDataReload')
  memberDetailPopupOpened.value = false //  화면 닫기
}

const changeImage = (e) => {
  console.log('222222222222222 : ', e)
  // const files = e.target.files;
  selectFile.value = e.target.files[0]
  console.log('222222222222222 : ', selectFile.value)
  console.log('333333333333333 : ', e.target.files[0])
  detailParam.value.oriFileName = e.target.files[0].name
}

defineExpose({
  open
}) //Popup Open
</script>

<style lang="scss" scoped>
.row-box {
  font-weight: 400;
  font-size: 12px;
  line-height: 17.38px;
  border: 1px solid #dee0e7;
  border-bottom: none;
  &:last-child {
    border-bottom: 1px solid #dee0e7;
  }
}
.basic-button {
  background-color: #0055d4;
  color: white;
  height: 30px;
  font-weight: 700;
  font-size: 13px;
  line-height: 18.82px;
  &:hover {
    background-color: #16389e;
    color: white;
  }
}
.gray-basic-button {
  background-color: #dce1ea;
  color: #0055d4;
  height: 30px;
  font-weight: 700;
  font-size: 13px;
  line-height: 18.82px;
  &:hover {
    background-color: #bec7e5;
    color: #16389e;
  }
}
.input-label {
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #f6f9fe;
}
.input-content {
  display: flex;
  align-items: center;
  padding: 5px 10px;
}
.grid-box {
  background-color: white;
  border: 1px solid #dee0e7;
  font-weight: 400;
  font-size: 12px;
  line-height: 17.38px;
}
.between-box {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #f3f4fb;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.11);
}
.button-box {
  display: flex;
  justify-content: flex-end;
}
.ag-grid-box {
  margin: 15px 20px;
}
.subtitle-font {
  font-weight: 400;
  font-size: 14px;
  line-height: 20.27px;
  margin: 10px 0;
}
.basic-font {
  font-weight: 400;
  font-size: 12px;
  line-height: 17.38px;
}
</style>
