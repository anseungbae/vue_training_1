<template>
  <page-manage-grid :pageGridProp="gridInfo" />
</template>

<script lang="ts" setup>
import PageManageGrid from '@/views/pageManage/PageManageGrid.vue'
import { ref, onMounted } from 'vue'
import PageService from '@/api/menuService'

/** Local Variable **/
const gridInfo = ref(null)

/** Service API **/
//  화면 실행시
onMounted(() => {
  getMenusManageApi()
})
// grid data call 설정
const getMenusManageApi = () => {
  PageService.getPageListAll().then((res) => {
    gridInfo.value = res.data
  })
}
/** Event Handler **/

/** Local Functions **/
</script>
<style lang="scss" scoped></style>
