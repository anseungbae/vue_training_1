<template>
  <div style="display: flex">
    <div class="margin-width30-left">
      <menu-role-left-tree
        @menuParam="onMenuTreeParam"
        @menuAddTreeParam="onMenuAddTreeParam"
        :menuTreeProp="menuTreeData"
      ></menu-role-left-tree>
    </div>
    <div class="margin-width70-right">
      <menu-role-right-info
        @updateMenuParam="onUpdateMenuParam"
        :menuDataProp="menuTreeParam"
        :menuPageIdProp="pageList"
      ></menu-role-right-info>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import MenuRoleLeftTree from '@/views/menuRoleManage/MenuRoleLeftTree.vue'
import MenuRoleRightInfo from '@/views/menuRoleManage/MenuRoleRightInfo.vue'
import MenuService from '@/api/menuService'
import { useAlert } from '@/hooks/web/usePageLoading'
const { alert, confirm } = useAlert()
/** Local Variable **/
const menuTreeParam = ref()
// left node 추가  tree 저장 data
const menuLeftTreeParam = ref()
// Right node 수정  tree 저장 data
const menuRightTreeParam = ref()
const menuTreeData = ref()
const pageList = ref()

onMounted(() => {
  getPageAllListApi() // from page combo box data
  getMenusManageApi() // tree data search
})

/** Service API **/
//  페이지 목록 가져오기 Api 호출
const getPageAllListApi = () => {
  MenuService.getPageListAll().then((res) => {
    pageList.value = res.data
  })
}
// menuRoleRight page에서 저장 버튼 클릭시 호출 api
const onMenuInfoChange = () => {
  confirm('저장하시겠습니까?', '저장', null, (action) => {
    if (action === 'confirm') {
      setMenuSaveInfoApi()
    } else {
      return false
    }
  })
}

// 저장 api 호출...
const setMenuSaveInfoApi = () => {
  let obj = { menuInfo: menuRightTreeParam.value }
  MenuService.setMenuSaveInfo(obj).then((res) => {
    let alertMsg = ''
    if (res.data.saveStatus) {
      alertMsg = `저장되었습니다.`
    } else {
      alertMsg = '저장에 실패하였습니다.'
    }
    alert(alertMsg, '저장', null, () => {
      onPageReload()
    })
  })
}

// tree data 가져오기  Api 호출
const getMenusManageApi = () => {
  MenuService.getMenuListAll().then((res) => {
    // 초기 조회 후 In put from에  첫번재 tree data 셋팅.
    if (res.data) {
      menuTreeData.value = res.data
      onMenuTreeParam(menuTreeData.value[0])
    }
  })
}

// tree 의 node menuLevel을 정리한다.
const nodeMenuLevelRefresh = (list, menuLevel, upMenuId) => {
  let len = list.length
  for (let i = 0; i < len; i++) {
    list[i].menuLevel = menuLevel
    list[i].upMenuId = upMenuId
    if (list[i].children && list[i].children.length > 0) {
      nodeMenuLevelRefresh(list[i].children, menuLevel + 1, list[i].id)
    }
  }
}

// left tree node 저장버튼 클릭   save api 호출
const setMenuSaveListAllApi = () => {
  nodeMenuLevelRefresh(menuLeftTreeParam.value, 1, null)
  confirm('저장하시겠습니까?', '저장', null, (action) => {
    if (action === 'confirm') {
      let obj = { menuList: menuLeftTreeParam.value }
      MenuService.setMenuSaveListAll(obj).then((res) => {
        let alertMsg = ''
        if (res.data.saveStatus) {
          alertMsg = `저장되었습니다.`
        } else {
          alertMsg = '저장에 실패하였습니다.'
        }
        alert(alertMsg, '저장', null, () => {
          onPageReload()
        })
      })
    }
  })
}

/** Event Handler **/

/** Local Functions **/

// tree node click data 조회 In put from data 셋팅
const onMenuTreeParam = (menuParam: any) => {
  menuTreeParam.value = menuParam
  console.log('menuTreeParam.value  :: :', menuTreeParam.value)
}

// tree node save button clik action
const onMenuAddTreeParam = (menuAddTreeParam: any) => {
  menuLeftTreeParam.value = menuAddTreeParam
  if (menuLeftTreeParam.value) {
    setMenuSaveListAllApi()
  } else {
    alert('저장할 데이터가 없습니다.', '저장', null, null)
    return
  }
}
// menu right update data api 호출
const onUpdateMenuParam = (updateMenuParam: any) => {
  menuRightTreeParam.value = updateMenuParam
  onMenuInfoChange()
}
const onPageReload = () => {
  getPageAllListApi() // from page combo box data
  getMenusManageApi() // tree data search
}
</script>

<style lang="scss" scoped></style>
