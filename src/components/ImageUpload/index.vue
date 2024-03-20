<template>
  <div
    class="flex flex-row justify-start items-center w-full h-full px-[10px] , pt-1 , pb-1 , pl-2 , pr-2"
  >
    <el-input
      v-model="oriFileName"
      :style="inputStyle"
      :input-style="{ fontSize: '12px', width: '100%' }"
      disabled
      clearable
    />
    <div class="flex flex-row justify-end max-w-30">
      <img
        v-if="isOriFileName && props.isDeleteShowHide"
        :src="DeleteIcon"
        title="업로드된 이미지 삭제"
        :class="deleteButtonStyle"
        @click="deleteImage"
      />
      <img
        v-if="isOriFileName && props.isPreviewShowHide"
        title="이미지 미리보기"
        src="@/assets/previewIcon.png"
        :class="previewButtonStyle"
        @click="onPreviewOpenPop"
      />
      <img
        src="@/assets/imageUploadIcon.png"
        title="이미지 첨부"
        :class="fileUploadButtonStyle"
        @click="onSelectFileOpen"
      />
    </div>
    <input
      ref="fileRef"
      type="file"
      :accept="props.accept"
      @change="changeImage"
      style="display: none"
      :multiple="props.multiple"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onBeforeMount, ref, watch, type PropType } from 'vue'
import DeleteIcon from '@/assets/component/ic_trash.svg'
import { isEmpty } from '@/utils/is'

const props = defineProps({
  oriFileName: { type: String },
  accept: { type: String },
  isDeleteShowHide: { type: Boolean, default: true },
  isPreviewShowHide: { type: Boolean, default: true },
  inputStyle: { type: String, default: 'width:100%' },
  deleteButtonStyle: { type: String, default: 'ml-1 w-7 h-6' },
  fileUploadButtonStyle: { type: String, default: 'ml-1 w-7 h-6' },
  previewButtonStyle: { type: String, default: 'ml-1 w-7 h-6' },
  multiple: { type: Boolean, default: false }
}) //부모컨포넌트에서 데이터 전달받음
/**
 * accept
 * default : ""
 * 파일 확장자
 * audio/*
 * video/*
 * image/*
 * 미디어 타입
 */

const selectFile = ref(null)
const fileRef = ref(null)
const fileUrl = ref(null)
const oriFileName = ref()
const isOriFileName = ref(false)
// const bannerPreviewRef = ref(null)

watch(props, () => {
  if (isEmpty(props.oriFileName)) {
    isOriFileName.value = false
  } else {
    isOriFileName.value = true
  }
  oriFileName.value = props.oriFileName
})

onBeforeMount(() => {})

onMounted(() => {})

// Column Definitions: Defines the columns to be displayed.
const emit = defineEmits(['onPreviewOpenPop', 'changeImage', 'deleteImage'])

//파일열기
const onSelectFileOpen = () => {
  fileRef.value.click()
}

const onPreviewOpenPop = (event) => {
  emit('onPreviewOpenPop', event)
}

const changeImage = (e) => {
  selectFile.value = e.target.files[0]
  oriFileName.value = e.target.files[0].name
  emit('changeImage', e)
}

const deleteImage = () => {
  emit('deleteImage')
}
</script>
<style lang="scss" scoped></style>
