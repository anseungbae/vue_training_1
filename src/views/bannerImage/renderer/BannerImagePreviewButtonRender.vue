<template>
  <el-button class="grid-render-button" @click="onClickButton">미리보기</el-button>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps({
  params: {}
})

const onClickButton = () => {
  const fileUrl = props.params.data.fileUrl
  props.params.clicked(fileUrl)
}

onMounted(() => {
  console.log('this.param =========== : ', props.params)
})
</script>
<style lang="scss" scoped></style>
