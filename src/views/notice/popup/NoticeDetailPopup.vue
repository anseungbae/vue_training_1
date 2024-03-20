<template>
  <el-dialog
    v-model="noticeDetailPopupOpened"
    align-center
    class="modal-title min-w-[995px] min-h-[700px]"
    :title="modeText"
  >
    <hr />
    <div class="flex justify-end my-3">
      <el-button class="basic-button" @click="onSaveBtnClick">저장</el-button>
    </div>
    <div class="modal-box">
      <el-scrollbar ref="scrollbarRef">
        <div>
          <el-row class="row-box">
            <el-col :span="3" class="input-label"> 공지사항 구분</el-col>
            <el-col :span="9" class="input-content">
              <el-select v-model="noticeDetailParam.type">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="3" class="input-label"> New Icon 표시 </el-col>
            <el-col :span="9" class="input-content input-text-font">
              <el-select v-model="noticeDetailParam.newIconType">
                <el-option
                  v-for="item in newIconTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">제목</el-col>
            <el-col :span="21" class="input-content input-text-font">
              <el-input
                v-model="noticeDetailParam.title"
                placeholder="제목"
                maxlength="150"
                clearable
                ref="inputTitle"
              />
            </el-col>
          </el-row>
          <el-row class="row-box">
            <!-- Edit 시작-->
            <el-col :span="3" class="input-label">내용</el-col>
            <el-col :span="21" class="input-content input-text-font min-w-[800px] min-h-[420px]">
              <editor ref="editorRef" @onEditContent="onEditContent"></editor>
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">팝업 게시여부</el-col>
            <el-col :span="9" class="input-content input-text-font">
              <el-select v-model="noticeDetailParam.postYn" placeholder="전체">
                <el-option
                  v-for="item in postYnList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="3" class="input-label">팝업 게시일자</el-col>
            <el-col :span="9" class="input-content input-text-font">
              <el-date-picker
                v-model="dateRangeVal"
                type="daterange"
                range-separator="~"
                value-format="YYYY.MM.DD"
                style="max-width: 300px; width: 240px"
              />
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label"> 관련 링크</el-col>
            <el-col :span="21" class="input-content input-text-font">
              <el-input
                v-model="noticeDetailParam.relatedLink"
                placeholder="관련 링크"
                maxlength="170"
                clearable
              />
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">첨부파일</el-col>
            <el-col :span="21">
              <imageUpload
                @changeImage="changeImage"
                @deleteImage="deleteImage"
                :oriFileName="noticeDetailParam.oriFileName"
                :isDeleteShowHide="true"
                :isPreviewShowHide="true"
                :isImagePreview="false"
                inputStyle="width:100%"
              />
            </el-col>
          </el-row>
        </div>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import NoticeService from '@/api/noticeService'
import Editor from '@/components/Editor.vue'
import dayjs from 'dayjs'
import { isEmpty } from '@/utils/is'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'
import { useAlert } from '@/hooks/web/usePageLoading'
let modeText = ''
const inputTitle = ref(null)
const { loadStart, loadDone } = usePageLoading()
const { alert, confirm } = useAlert()
const today = dayjs(new Date())
const dateRangeVal = ref<any>([
  today.add(-1, 'month').format('YYYY.MM.DD'),
  today.format('YYYY.MM.DD')
])
const dateRangeValue = ref({
  fromAt: dateRangeVal.value[0], // 게시시작일
  toAt: dateRangeVal.value[1] // 게시종료일
})
const postYnList = [
  {
    value: 'Y',
    label: '표시'
  },
  {
    value: 'N',
    label: '표시안함'
  }
]
const typeList = [
  {
    value: 'info',
    label: '안내'
  },
  {
    value: 'maintenance',
    label: '점검'
  }
]
const newIconTypeList = [
  {
    value: 'always',
    label: '항상'
  },
  {
    value: 'day',
    label: '하루'
  },
  {
    value: 'no',
    label: '표시안함'
  }
]

const emit = defineEmits(['onSearchDataReload']) //
const editorRef = ref(null)

const selectFile = ref(null)
const noticeDetailPopupOpened = ref(false)
const noticeDetailParam = ref<any>({
  id: null,
  type: null,
  typeName: null,
  newIconType: null,
  title: null,
  content: null,
  postYn: null,
  postStartAt: null,
  postEndAt: null,
  relatedLink: null,
  fileGroupId: null,
  fileName: null,
  oriFileName: null,
  selectFile: null,
  fileId: null,

  //  input value
  contents: null,
  saveMode: null
})

const delFileId = ref(null)
// Validation Check
const noticeDetailValidationCheck = () => {
  if (isEmpty(noticeDetailParam.value)) {
    alert('저장할 데이터가 없습니다.', '알림', null, null)
    return false
  } else if (isEmpty(noticeDetailParam.value.type)) {
    alert('공지사항 구분은 필수 입력 항목입니댜.', '알림', null, null)
    return false
  } else if (isEmpty(noticeDetailParam.value.newIconType)) {
    alert('Icon 표시 항목은 필수 입력 항목입니댜.', '알림', null, null)
    return false
  } else if (isEmpty(noticeDetailParam.value.title)) {
    alert('제목은 필수 입력 항목입니댜.', '알림', null, null)
    inputTitle.value.focus(true)
    return false
  } else if (isEmpty(noticeDetailParam.value.content)) {
    alert('내용을 입력해 주세요.', '알림', null, null)
    return false
  }
  return true
}

//저장 API 호출
const saveNoticeDetailApi = () => {
  const formData = new FormData()
  formData.append('uploadFile', selectFile.value)
  formData.append('saveMode', noticeDetailParam.value.saveMode)
  formData.append('id', noticeDetailParam.value.id)
  formData.append('type', noticeDetailParam.value.type)
  formData.append('newIconType', noticeDetailParam.value.newIconType)
  formData.append('title', noticeDetailParam.value.title)
  formData.append('content', noticeDetailParam.value.content)
  formData.append('postYn', noticeDetailParam.value.postYn)
  formData.append('postStartAt', dayjs(dateRangeVal.value[0]).format('YYYYMMDD'))
  formData.append('postEndAt', dayjs(dateRangeVal.value[1]).format('YYYYMMDD'))
  formData.append('relatedLink', noticeDetailParam.value.relatedLink)
  formData.append('oriFileName', noticeDetailParam.value.oriFileName)
  formData.append('fileGroupId', noticeDetailParam.value.fileGroupId)
  formData.append('fileId', noticeDetailParam.value.fileId)
  formData.append('delFileId', delFileId.value)
  const config = { headers: { 'Content-Type': `multipart/form-data` } }
  confirm('저장하시겠습니까?', '저장', null, (action) => {
    if (action === 'confirm') {
      NoticeService.saveNotice(formData, config).then((res) => {
        let alertMsg = ''
        if (res.data.saveStatus) {
          alertMsg = `저장되었습니다.`
        } else {
          alertMsg = '저장에 실패하였습니다.'
        }
        alert(alertMsg, '저장', null, () => {
          onCloseBtnClick()
        })
      })
    }
  })
}
//  공지사항 조회 API 호출
const getNoticeDetailApi = () => {
  const param = { id: noticeDetailParam.value.id }
  loadStart()
  NoticeService.getNoticeDetail(param).then((res) => {
    //  조회해온 Data
    noticeDetailParam.value = res.data
    noticeDetailParam.value.type = res.data.type
    noticeDetailParam.value.typeName = res.data.typeName
    noticeDetailParam.value.newIconType = res.data.newIconType
    noticeDetailParam.value.title = res.data.title
    noticeDetailParam.value.content = res.data.content
    noticeDetailParam.value.postYn = res.data.postYn
    dateRangeVal.value[0] = dayjs(res.data.postStartAt).format('YYYY-MM-DD')
    dateRangeVal.value[1] = dayjs(res.data.postEndAt).format('YYYY-MM-DD')
    noticeDetailParam.value.relatedLink =
      res.data.relatedLink === 'null' ? '' : res.data.relatedLink
    noticeDetailParam.value.oriFileName = res.data.oriFileName
    noticeDetailParam.value.fileGroupId =
      res.data.fileGroupId !== 'null' ? res.data.fileGroupId : null
    noticeDetailParam.value.fileId = res.data.fileId
    noticeDetailParam.value.fileName = res.data.oriFileName

    editorRef.value.setEditContent(res.data.content)
  })
  loadDone()
}
//부모창에서 popup의 메소드 호출 넘어온 id
const open = (id) => {
  if (isEmpty(id)) {
    // 공지사항 등록
    noticeDetailPopupOpened.value = true
    modeText = '공지사항 등록'
    if (editorRef && editorRef.value) {
      editorRef.value.setEditContent('') // edit 초기화
    }
    // data 초기화
    dateRangeVal.value[0] = dayjs(dateRangeValue.value.fromAt).format('YYYY-MM-DD')
    dateRangeVal.value[1] = dayjs(dateRangeValue.value.toAt).format('YYYY-MM-DD')
    noticeDetailParam.value = {
      id: null,
      type: 'info',
      typeName: null,
      newIconType: 'no',
      title: null,
      content: null,
      postYn: 'Y',
      postStartAt: dateRangeValue.value.fromAt,
      postEndAt: dateRangeValue.value.toAt,
      relatedLink: null,
      fileGroupId: null,
      fileName: null,
      oriFileName: null,
      selectFile: null,
      fileId: null,

      //  input value
      contents: null,
      saveMode: null
    }
  } else {
    //  공지사항 상세 조회
    // Update Mod
    noticeDetailPopupOpened.value = true
    modeText = '공지사항 수정'
    noticeDetailParam.value.id = id
    getNoticeDetailApi()
  }
}
// 저장 버튼 클릭 시
const onSaveBtnClick = async () => {
  if (isEmpty(noticeDetailParam.value.id)) {
    noticeDetailParam.value.saveMode = 'insert'
  } else {
    noticeDetailParam.value.saveMode = 'update'
  }
  //  Validation Check 전에 내용 Content 가져오기
  editorRef.value.getEditContent()
  //  Validation 체크 후 저장 처리
  if (noticeDetailValidationCheck()) {
    saveNoticeDetailApi()
  }
}

const deleteImage = () => {
  confirm('저장시 이미지파일이 삭제 됩니다. 삭제 하시겠습니까?', '알림', null, (action) => {
    if (action == 'confirm') {
      noticeDetailParam.value.oriFileName = null
      delFileId.value = noticeDetailParam.value.fileId
    }
  })
}

// edit 컴퍼넌트의 메소드 호출.
const onEditContent = (getMark) => {
  noticeDetailParam.value.content = getMark
  if (getMark === null || getMark === '<p><br></p>') {
    noticeDetailParam.value.content = ''
  }
}
const onCloseBtnClick = () => {
  //  재조회 관련 호출하기.
  emit('onSearchDataReload')
  //  화면 닫기
  noticeDetailPopupOpened.value = false
}
const changeImage = (e) => {
  selectFile.value = e.target.files[0]
  noticeDetailParam.value.oriFileName = e.target.files[0].name
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped></style>
