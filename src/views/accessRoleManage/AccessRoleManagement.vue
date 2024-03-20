<template>
  <!-- 트리구조는 못하고, 등록/저장기능 미완 -->
  <div style="display: flex">
    <AccessRoleLeftGridList
      class="margin-width30-left"
      :dataProp="accessRoleList"
      @menuChange="changeAccessRole"
    />
    <AccessRoleMenuGridList class="margin-width70-right" :dataProp="accessRoleMenuMapList" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AccessRoleLeftGridList from '@/views/accessRoleManage/AccessRoleLeftGridList.vue'
import AccessRoleMenuGridList from '@/views/accessRoleManage/AccessRoleMenuGridList.vue'
import RoleService from '@/api/roleService'

/** Local Variable **/
//  Grid 컬럼 정의
//AccessRoleLeftGridList
const accessRoleList = ref(null) //  접근권한 목록 State 관리

//AccessRoleMenuGridList
const menuTitle = ref(null) //  메뉴 Title 관리.

const accessRoleMenuMapList = ref(null) //  접근권한에 대한 메뉴 목록 State 관리
const selectAccessRightId = ref(null) //  왼쪽 접근권한 선택이 되었는지 관리 State

/** Service API **/

//  접근권한 목록 가져오기
const getAccessRoleList = () => {
  RoleService.getAccessRoleList().then((res) => {
    accessRoleList.value = res.data
  })
}

//  선택한 접근권한에 대한 Menu Map 목록 가져오기.
const getAccessRoleMenuMap = (accessRightId) => {
  selectAccessRightId.value = accessRightId
  const param = { accessRightId: accessRightId }
  RoleService.getAccessRoleMenuMap(param).then((res) => {
    //  조회해온 목록을 넣는다.
    accessRoleMenuMapList.value = res.data
  })
}
/** Event Handler **/
onMounted(() => {
  getAccessRoleList()
})
/** Local Functions **/

//  Left에서 변경 된 접근권한 정보를 넘기기.
const changeAccessRole = (accessRightId, accessRightName) => {
  menuTitle.value = '메뉴 - ' + (accessRightName ? accessRightName : '없음')
  getAccessRoleMenuMap(accessRightId)
}

//  접근권한 목록 저장 완료.
const saveAccessRoleListComplete = (data) => {
  getAccessRoleList()
  let alertMsg = ''
  if (data.saveStatus) {
    alertMsg = '삭제하였습니다.'
  } else {
    alertMsg = data.message || 'Error'
  }
  alert(alertMsg, '알림', null, () => {})
}
</script>
<style lang="scss" scoped>
.width30-left {
  margin: 20px 0px;
  margin-right: 20px;
  width: 30%;
}
.width70-right {
  margin: 20px 0px;
  min-width: 500px;
  width: 70%;
}
</style>
