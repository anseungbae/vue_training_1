<template>
  <el-dialog
    v-model="previewPopupOpened"
    align-center
    class="min-w-[550px] min-h-[300px] pb-0 t-0%"
    title="미리보기"
    width="500"
    height="500"
  >
    <hr />
    <div class="modal-box">
      <div
        class="wrap bg-slate-100 w-full h-full flex justify-center items-center min-w-[468px]"
        style="min-width: 468px; min-height: 468px"
      >
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
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  data: {
    type: Object
  }
})

const previewPopupOpened = ref(false)
const fileUrl = ref<any>(null)

const open = (url: any) => {
  fileUrl.value = url
  previewPopupOpened.value = true
}

defineExpose({
  open
})
</script>

<style scoped></style>
