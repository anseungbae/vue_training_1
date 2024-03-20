<template>
  <el-dialog
    v-model="memberCsDetailPopupOpened"
    class="modal-title min-w-[500px] min-h-[550px]"
    title="상담내역 저장"
    align-center
  >
    <hr />

    <div class="flex justify-end my-2">
      <el-button class="basic-button" @click="onMemberCsDetailSaveBtnClick">저장</el-button>
    </div>
    <div class="modal-box">
      <div class="subtitle-font">
        <el-row class="row-box">
          <el-col :span="3" class="input-label"> 상담 제목</el-col>
          <el-col :span="21" class="input-content">
            <el-input v-model="title" :input-style="{ fontSize: '12px' }" clearable />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label"> 상담내용 </el-col>
          <el-col :span="21" class="input-content">
            <el-input v-model="content" type="textarea" :rows="7" resize="none" clearable />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label"> 처리내용 </el-col>
          <el-col :span="21" class="input-content">
            <el-input v-model="answer" type="textarea" :rows="7" resize="none" clearable />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label"> 상담일</el-col>
          <el-col :span="9" class="input-content">
            <el-date-picker
              v-model="csDate"
              type="date"
              :input-style="{ width: '100px', fontSize: '12px' }"
            />
          </el-col>
          <el-col :span="3" class="input-label"> 상담완료일</el-col>
          <el-col :span="9" class="input-content">
            <el-date-picker
              v-model="csCompDate"
              type="date"
              :input-style="{ width: '100px', fontSize: '12px' }"
            />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">처리상태</el-col>
          <el-col :span="21" class="input-content">
            <el-select v-model="csProcessSts" placeholder="선택" style="width: 110px">
              <el-option
                v-for="item in csProcessStsList"
                :key="item.code"
                :label="item.codeName"
                :value="item.code"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="row-box flex">
          <el-col :span="3" class="input-label"> 파일선택</el-col>

          <el-col :span="21">
            <ImageUpload
              @changeImage="onSelectFileChange"
              :oriFileName="fileName"
              :isDeleteShowHide="false"
              :isPreviewShowHide="false"
              inputStyle="width:100%"
              :multiple="true"
              accept="image/*"
            />
          </el-col>
        </el-row>
        <el-row class="row-box" v-if="isUploadCompFileList">
          <el-col :span="3" class="input-label">파일목록</el-col>
          <el-col :span="21" class="input-content">
            <el-space :size="10" wrap>
              <template v-for="fileInfo in fileList" :key="fileInfo.id">
                <el-tag
                  closable
                  :disable-transitions="false"
                  @close="onFileDeleteBtnClick(fileInfo.id)"
                  color="primary"
                  text-color="white"
                >
                  {{ fileInfo.oriFileName }}
                </el-tag>
              </template>
            </el-space>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import UserCsService from '@/api/userCsService'
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { useAlert } from '@/hooks/web/usePageLoading'
import { isEmpty } from '@/utils/is'
import CodeService from '@/api/codeService'

const { alert, confirm } = useAlert()
const emit = defineEmits(['onMemberCsDetailInfoSaveComplete'])
const memberCsDetailPopupOpened = ref(false)
const pkId = ref(null)
const pkUserId = ref(null)
const saveMode = ref(null)
/** Detail Info 관련 **/
const title = ref(null)
const content = ref(null)
const answer = ref(null)
const csDate = ref(null)
const csCompDate = ref(null)
const validationMsg = ref('')
const fileName = ref(null)
const fileGroupId = ref(null)
const fileId = ref(null)
const selectFile = ref<any>([])
const fileNameList = ref([])
const today = dayjs(new Date())
const fileList = ref(null)
const delFileList = ref<any>([])

const csProcessSts = ref(null)
const csProcessStsList = ref([])

const getMemberCsDetailInfoApi = () => {
  const param = { id: pkId.value }
  UserCsService.getUserCsDetail(param).then((res) => {
    //  조회한 사업장 정보를 넣는다.
    saveMode.value = 'update'
    title.value = res.data.detail.title
    content.value = res.data.detail.content
    answer.value = res.data.detail.answer
    csDate.value = String(res.data.detail.csDate).replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')
    csCompDate.value = String(res.data.detail.csCompDate).replace(
      /(\d{4})(\d{2})(\d{2})/g,
      '$1/$2/$3'
    )
    csProcessSts.value = res.data.detail.csProcessSts
    if (res.data.detail.fileGroupId) {
      fileGroupId.value = res.data.detail.fileGroupId
      fileId.value = res.data.detail.fileId
      fileName.value = res.data.detail.oriFileName
    } else {
      fileGroupId.value = null
      fileId.value = null
      // mobileFileId.value = null
    }

    //  조회한 파일 목록 넣기
    fileList.value = res.data.fileList
  })
}

const getPageIdsCodeListApi = () => {
  CodeService.getCodeListByPCode('csProcessSts').then((res) => {
    csProcessStsList.value = res.data
  })
}

const open = (userId, id) => {
  getPageIdsCodeListApi()
  //  넘어온 id, userId 설정
  pkUserId.value = userId
  pkId.value = id

  //  입력 폼 초기화
  clearForm()

  if (pkId.value) {
    //  사업장 상세정보 조회
    getMemberCsDetailInfoApi()
  }
  memberCsDetailPopupOpened.value = true
}
//등록일때 기본값 세팅.
const clearForm = () => {
  saveMode.value = 'insert'
  title.value = null
  content.value = null
  csDate.value = today.format('YYYY.MM.DD')
  fileName.value = null
  answer.value = null
  csCompDate.value = null
  csProcessSts.value = null
  fileGroupId.value = null
  fileId.value = null
  fileList.value = null
  delFileList.value = []
}

const validationChk = () => {
  if (isEmpty(title.value)) {
    validationMsg.value = '제목을 입력해주세요.'
    return false
  } else if (isEmpty(content.value)) {
    validationMsg.value = '내용을 입력해주세요.'
    return false
  } else if (isEmpty(csDate.value) || csDate.value == '-') {
    validationMsg.value = '상담일을 입력해주세요.'
    return false
  } else if (isEmpty(csProcessSts.value)) {
    validationMsg.value = '처리상태를 입력해주세요.'
    return false
  } else {
    return true
  }
}

//  사업장 상세 정보 저장 Click Event
const onMemberCsDetailSaveBtnClick = () => {
  confirm('저장하시겠습니까?', '저장', {}, (action) => {
    if (action === 'confirm') {
      if (validationChk()) {
        onSaveFile()
      } else {
        alert(validationMsg.value, '알림', null, () => {})
      }
    }
  })
}

const onSaveFile = () => {
  const formData = new FormData()
  if (selectFile.value && selectFile.value.length > 0) {
    for (let i = 0; i < selectFile.value.length; i++) {
      formData.append('uploadFiles', selectFile.value[i])
    }
  }
  console.log('delFileList : ', delFileList.value)
  if (delFileList.value && delFileList.value.length > 0) {
    for (let i = 0; i < delFileList.value.length; i++) {
      formData.append('delFileIdList', delFileList.value[i])
    }
  }

  console.log('24151515 : ', dayjs(csCompDate.value).format('YYYYMMDD'))

  // formData.append('uploadFiles', selectFile.value)
  formData.append('saveMode', saveMode.value)
  formData.append('id', pkId.value)
  formData.append('userId', pkUserId.value)
  formData.append('title', title.value)
  formData.append('content', content.value)
  formData.append('csDate', dayjs(csDate.value).format('YYYYMMDD'))
  formData.append('fileGroupId', fileGroupId.value)
  formData.append('answer', answer.value)
  formData.append('csProcessSts', csProcessSts.value)
  if (!isEmpty(csCompDate.value)) {
    formData.append('csCompDate', dayjs(csCompDate.value).format('YYYYMMDD'))
  }

  const config = { headers: { 'Content-Type': `multipart/form-data` } }
  UserCsService.savesUserCsDetail(formData, config).then((res) => {
    let msg = '저장되었습니다.'
    alert(msg, '저장', null, () => {
      emit('onMemberCsDetailInfoSaveComplete')
      memberCsDetailPopupOpened.value = false
    })
  })
}
const onSelectFileChange = (value) => {
  //다시 입력시 초기화
  fileName.value = []
  fileNameList.value = []
  selectFile.value = []

  if (value && value.target.files.length > 0) {
    for (let i = 0; i < value.target.files.length; i++) {
      selectFile.value.push(value.target.files[i])
      fileNameList.value.push(value.target.files[i].name)
    }

    fileName.value = fileNameList.value.join(' , ')
  } else {
    fileName.value = ''
  }
}
const onFileDeleteBtnClick = (fileId) => {
  delFileList.value.push(fileId)
  const delInx = getFileList.value.findIndex((item) => item.id === fileId)
  if (delInx > -1) {
    getFileList.value.splice(delInx, 1)
  }
}

const getFileList = computed(() => {
  // console.log('getFileList111111 : ', getFileList.value)
  return fileList.value || []
})
const isUploadCompFileList = computed(() => {
  return getFileList.value.length > 0
})

defineExpose({
  open
})
</script>

<style lang="scss" scoped></style>
