<template>
  <AgGridVue
    :defaultColDef="props.defaultColDef"
    :class="props.class"
    :style="isEmpty(props.style) ? defaultStyle : props.style"
    :rowSelection="props.rowSelection"
    :rowData="props.rowData"
    :rowHeight="props.rowHeight"
    :columnDefs="props.columnDefs"
    @cell-clicked="onGridCellClick"
    @grid-ready="onGridReady"
    :overlayNoRowsTemplate="noRowsOverlayComponent"
    @rowDoubleClicked="onGridRowDoubleClick"
    :enableBrowserTooltips="props.enableBrowserTooltips"
    autoSizeStrategy="fitProvidedWidth"
  />
  <!-- :autoSizeStrategy="autoSizeStrategy" -->
</template>
<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { AgGridVue } from 'ag-grid-vue3'
import { computed, onMounted, onBeforeMount, ref, watch, type PropType } from 'vue'

//데이터 없을시 나타내는 메세지
const noRowsOverlayComponent = ref('조회된 데이터가 없습니다.')

// const autoSizeStrategy = ref(null)

enum RowSelectionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple'
}

const props = defineProps({
  dataProp: {
    type: Array
  },
  defaultColDef: {},
  columnDefs: {
    type: Array
  },
  rowData: {
    type: Array
  },
  rowSelection: { type: String as PropType<RowSelectionType>, defalut: RowSelectionType.SINGLE },
  // default : single ,
  // multiple
  style: {},
  class: {},
  noRowsOverlayComponent: {}, // 데이터 없을시 메세지
  rowHeight: {},
  enableBrowserTooltips: { type: Boolean }
  // autoSize: {
  //   type: String
  // }
}) //부모컨포넌트에서 데이터 전달받음

watch(props.rowData, () => {})

onBeforeMount(() => {
  // autoSizeStrategy.value = getAutoStrategy()
})

// 추후 업데이트 예정
// const getAutoStrategy = () => {
//   let strategy: any = {
//     type: 'fitProvidedWidth'
//   }
//   if (props.autoSize == 'fitGridWidth') {
//     strategy = {
//       type: 'fitGridWidth', // 그리드넓이기준으로
//       defaultMinWidth: 150
//     }
//   } else if (props.autoSize == 'fitCellContents') {
//     strategy = {
//       type: 'fitCellContents',
//       skipHeader: true
//     }
//   }
//   console.log('props.autoSize : ', props.autoSize, strategy)
//   return strategy
// }

onMounted(() => {})

computed(() => {})

// Column Definitions: Defines the columns to be displayed.
const emit = defineEmits(['onGridCellClick', 'onGridReady', 'onGridRowDoubleClick'])

const defaultStyle = 'min-height: 200px'

//셀 클릭 이벤트
const onGridCellClick = (event: any) => {
  emit('onGridCellClick', event)
}

//셀 더블클릭 이벤트
const onGridRowDoubleClick = (event) => {
  emit('onGridRowDoubleClick', event)
}

// 전체적인 그리드 이벤트
const onGridReady = (params: any) => {
  emit('onGridReady', params)
}
</script>
<style lang="scss" scoped></style>
