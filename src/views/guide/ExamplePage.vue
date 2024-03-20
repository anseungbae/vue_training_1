<template>
  <ContentWrap title="Example Page">
    <div class="flex items-center"></div>
    <div class="mb-10px">
      <el-button
        v-loading.fullscreen.lock="fullscreenLoading"
        :element-loading-svg="svg"
        type="primary"
        @click="openFullScreen1"
      >
        indcater
      </el-button>
      <el-button type="success" @click="openFullScreen2"> Loding indcater </el-button>
      <BaseButton v-loading="LoadingDialog" type="danger" @click="delData(null)">
        Delete
      </BaseButton>
    </div>
    <div class="mb-10px">
      <BaseButton type="success" @click="dialogTableVisible = true"> call Dialog </BaseButton>
    </div>

    <div class="mb-10px">
      <el-table :data="tableData" style="width: 100%" @click="closeBox">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
    <div class="mb-10px">
      <el-alert
        title="alert box"
        description="success"
        show-icon
        type="info"
        @click="closeBox"
      ></el-alert>
    </div>
  </ContentWrap>
  <el-dialog v-model="dialogTableVisible" title="Test Grid Data" width="800">
    <el-table ElLoading="true" :data="gridData">
      <el-table-column property="date" label="Date" width="150" />
      <el-table-column property="name" label="Name" width="200" />
      <el-table-column property="address" label="Address" />
    </el-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElTable, ElMessageBox, ElLoading } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import BaseButton from '@/components/Button/src/Button.vue'
const loading = ref(true)
const show = ref(true)
const loadingInstance = ElLoading.service({
  text: 'Loading...',
  background: 'rgba(122, 122, 122, 0.8)'
})
nextTick(() => {
  loadingInstance.close()
})
onMounted(() => {
  show.value = true
  openLoadSvg()
})
const openLoadSvg = () => {
  setTimeout(() => {
    show.value = false
  }, 1000)
}

// alert box
const closeBox = () => {
  alert('success close')
}

// dialog 설정

const dialogTableVisible = ref(false)

// indcater  setTimeout  옵션 직접주는 방식
const fullscreenLoading = ref(false)
const openFullScreen1 = () => {
  fullscreenLoading.value = true
  setTimeout(() => {
    fullscreenLoading.value = false
  }, 1000)
}

// indcater  setTimeout
const openFullScreenApi = () => {
  LoadingDialog.value = true
  setTimeout(() => {
    LoadingDialog.value = false
  }, 1000)
}

// indcater  setTimeout  옵션 설정 방식
const openFullScreen2 = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'circular'
    //  background: 'rgba(0, 0, 0, 0.7)'
    // background: url('../assets/sample.gif')
    //background: 'rgba(255,255,255,0,0)'
  })
  setTimeout(() => {
    loading.close()
  }, 1000)
}

// 버튼 메세지 박스
const LoadingDialog = ref(false)

const delData = async (row: 0 | null) => {
  LoadingDialog.value = false
  ElMessageBox.confirm('Delete the selected data?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    openFullScreenApi()
    if (!null) {
      ElMessage.success('Deleted successfully')
    }
  })
}

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})

const gridData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-03',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  }
]

const tableData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District'
  }
]

/**   indcater  디자인
1-1. M: 시작점
1-2. L: 직선 ( 시작점, 끝점 )
1-3. H: 가로 직선 ( 이동할 x위치 )
1-4. V: 세로 직선 ( 이동할 y위치 )
1-5. Z: 현재 위치와 시작점 잇기
1-6. C: 곡선 ( 시작점, 휘어짐 정도, 끝점 )\
*/
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 30px; fill: rgba(0, 0, 0, 0)"/>
      `

// Dialog
const actionDialog = () => {}
</script>
<style scoped>
.el-loading-spinner .circular {
  display: none !important;
}
.el-loading-spinner {
  background: url('../assets/sample.gif') no-repeat center;
  background-size: 100px 100px;
  width: 100%;
  height: 200%;
  position: absolute !important;
  left: 48%;
  top: 40% !important;
  text-align: center;
}
</style>
