<template>
  <el-dialog
    v-model="termsDetailPopupOpened"
    align-center
    class="modal-title modal-large"
    title="약관상세"
  >
    <hr />
    <div class="modal-box">
      <el-scrollbar max-height="750" min-width="920px">
        <div class="m-3" v-html="termsContent"></div>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import TermsService from '@/api/termsService'
import { ref } from 'vue'

/********* Local Variable *********/
const termsDetailPopupOpened = ref(false)
const pkTermsDetailId = ref(null)
const termsContent = ref(null)

/********* Service API *********/
// 약관 상세조회 API 호출
const getTermsDetailApi = () => {
  const param = { termsDetailId: pkTermsDetailId.value }
  TermsService.getTermsDetail(param).then((res) => {
    if (res.data && res.data.content) {
      termsContent.value = res.data.content
    } else {
      termsContent.value = null
    }
  })
}

/********* Local Functions *********/
const open = (termsDetailId) => {
  pkTermsDetailId.value = termsDetailId // 넘어온 약관상세ID 설정
  getTermsDetailApi() // 약관 상세정보 조회
  termsDetailPopupOpened.value = true
}

/** 부모 컴포넌트가 자식 컴포넌트(open)에 직접적으로 접근**/
defineExpose({
  open
})
</script>
