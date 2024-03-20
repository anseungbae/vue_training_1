<template>
  <div class="flex justify-between align-middle">
    {{ props.params.data.name }}
    <div v-if="!isEmpty(props.params.data.fileUrl)">
      <el-button @click="onClickButton" class="grid-render-button">미리보기</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  params: {}
})

const content = ref('')

const onClickButton = (e) => {
  e.stopPropagation()
  // const fileUrl = props.params.data.fileUrl
  props.params.clicked(props.params.data.fileUrl)
}

onMounted(() => {
  content.value = props.params.data.value
})
</script>
<style lang="scss" scoped></style>
