<template>
  <el-dialog
    v-model="previewDetailPopupOpened"
    align-center
    class="modal-title min-w-[850px] max-h-[750px]"
    title="공지사항 미리보기"
    destroy-on-close
  >
    <div class="modal-box">
      <el-scrollbar>
        <div class="modal-form min-w-[850px] max-h-[580px]">
          <div class="line_form">
            <div v-html="content" style="margin-top: 10px"></div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-row class="row-box">
      <el-col :span="3" class="input-label">첨부파일</el-col>
      <el-col :span="21" class="input-content input-text-font">
        <el-check-tag effect="plain" hit="true" v-show="oriFileName" @click="executeFileDownload">{{
          oriFileName
        }}</el-check-tag>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { isEmpty } from '@/utils/is'
import NoticeService from '@/api/noticeService'
import FileService from '@/api/fileService'

const previewDetailPopupOpened = ref(false)
const oriFileName = ref(null)
const fileId = ref(null)
const fileName = ref(null)
const fileGroupId = ref(null)
const noticeId = ref(null)
const content = ref(null)

//부모창에서 popup의 메소드 호출
const open = (id) => {
  //  넘어온 id 설정
  noticeId.value = id
  if (noticeId.value) {
    getNoticeDetailApi(id)
    previewDetailPopupOpened.value = true
  } else {
    previewDetailPopupOpened.value = false
  }
}

//  공지사항 조회 API 호출
const getNoticeDetailApi = (id) => {
  const param = { id: id }
  NoticeService.getNoticeDetail(param).then((res) => {
    if (res.data && res.data.content) {
      content.value = res.data.content
      oriFileName.value = res.data.oriFileName
      fileId.value = res.data.fileId
      fileName.value = res.data.fileName
      fileGroupId.value = res.data.fileGroupId
    } else {
      content.value = null
      oriFileName.value = null
      fileId.value = null
      fileName.value = null
      fileGroupId.value = null
    }
  })
}
// 파일 다운 로드 API호출
const executeFileDownload = () => {
  if (!isEmpty(fileId.value)) {
    const searchParam = { fileId: fileId.value }
    FileService.fileDownload(searchParam).then((response: any) => {
      if (response.data) {
        const blob = new Blob([response.data], { type: 'image/png' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        const contentDisposition = response.headers['content-disposition'] // 파일 이름
        link.href = url
        link.setAttribute('download', contentDisposition.replace('attachment; filename=', ''))
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    })
  }
}
defineExpose({
  open
})
</script>

<style scoped></style>
