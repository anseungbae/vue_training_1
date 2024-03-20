<template>
  <el-dialog
    v-model="bannerGroupPreviewPopupOpened"
    align-center
    class="modal-title min-w-[580px] min-h-[500px]"
    title="메인상단 배너 미리보기"
  >
    <el-scrollbar>
      <div class="modal-box">
        <div class="modal-form in-w-[580px] min-h-[500px]" style="margin-top: 10px">
          <div class="line_form">
            <el-image
              style="width: 100%; height: 100%"
              :src="fileUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :initial-index="4"
              fit="cover"
            />
          </div>
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { isEmpty } from '@/utils/is'
const bannerGroupPreviewPopupOpened = ref(false)
const fileUrl = ref<any>(null)

const oriFileName = ref(null)
const fileId = ref(null)
const fileGroupId = ref(null)
const bannerGroupId = ref(null)

const previewOpen = (data: any) => {
  if (!isEmpty(data)) {
    fileUrl.value = data.fileUrl
    fileId.value = data.fileGroupId
    fileGroupId.value = data.fileGroupId
    oriFileName.value = data.name
    bannerGroupId.value = data.id
    bannerGroupPreviewPopupOpened.value = true
  } else {
    bannerGroupPreviewPopupOpened.value = false
  }
}

defineExpose({
  previewOpen
})
</script>

<style scoped></style>
