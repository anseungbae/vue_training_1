<template>
  <span class="justify-center items-center">
    <el-button class="grid-render-button" size="small" @click="onClickButton">내역</el-button>
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type PropType } from 'vue'

const props = defineProps({
  params: {}
})

// watch(props, () => {
//   console.log('1111111111111', props)
// })

const onClickButton = () => {
  console.log('1111111111111', props)
  const userId = props.params.data.userId
  props.params.clicked(userId)
}

onMounted(() => {})

computed(() => {})
</script>
<style lang="scss" scoped></style>
