<template>
  <el-button class="grid-render-button" @click="onClickButton">Version Up</el-button>
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
  const id = props.params.data.id
  props.params.clicked(id)
}

onMounted(() => {})

computed(() => {})
</script>
<style lang="scss" scoped></style>
