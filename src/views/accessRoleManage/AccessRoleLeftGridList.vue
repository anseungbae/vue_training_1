<template>
  <div class="grid-box">
    <div class="grid-header-box">
      <p class="subtitle-font">접근권한- 추가/저장버튼 미완</p>
      <div class="button-box">
        <el-button class="grid-button" @click="handleAccessRoleAddBtnClick">추가</el-button>
        <el-button class="grid-button">저장</el-button>
      </div>
    </div>
    <DataGrid
      ref="memberGridRef"
      style="height: 550px"
      class="ag-theme-quartz px-5 py-3"
      :rowData="getGridItems"
      :columnDefs="columnDefs"
      @onGridReady="onGridReady"
      @onGridCellClick="onGridCellClick"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { AgGridVue } from 'ag-grid-vue3' // Vue Grid Logic

/** Local Variable **/
const props = defineProps({
  dataProp: {
    type: Object
  }
})
const emit = defineEmits(['menuChange'])
const columnDefs = ref([
  {
    headerName: 'No.',
    valueGetter: 'node.rowIndex + 1',
    width: 80,
    sortable: false,
    suppressSizeToFit: true,
    cellStyle: {
      filter: 'text'
    }
  },
  {
    field: 'accessRightName',
    headerName: '접근권한명',
    editable: true,
    width: 300,
    sortable: false,
    cellStyle: {
      filter: 'text',
      cursor: 'pointer'
    }
  }
])
const gridItems = ref(null)
const gridApi = ref(null)

const accessRoleLeftGrid = ref(null)
const selectAccessRightId = ref(null)
/** Service API **/

/** Event Handler **/
const getGridItems = computed(() => {
  return gridItems.value || []
})

watch(props, () => {
  setPopupInfo()
})
/** Local Functions **/
const setPopupInfo = () => {
  gridItems.value = props.dataProp //  조회해온 목록을 넣는다.
}

//그리드
const onGridReady = (params) => {
  gridApi.value = params.api
}
//그리드 클릭시
const onGridCellClick = (event) => {
  emit('menuChange', event.data.accessRightId)
}

const handleAccessRoleAddBtnClick = () => {
  gridApi.value.setGridOption('columnDefs', columnDefs)
}
</script>

<style lang="scss" scoped></style>
