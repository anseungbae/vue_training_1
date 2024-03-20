<template>
  <div class="grid-box">
    <div class="grid-header-box">
      <p class="menu-alin-left" style="margin-top: 5px">{{ menuRole.menuName }}</p>
      <el-button class="basic-button flex justify-end" @click="onUpdateMenuData">저장</el-button>
    </div>
    <div>
      <el-row class="row-box">
        <el-col :span="3" class="input-label"> 메뉴ID </el-col>
        <el-col :span="21" class="input-content input-text-font"> {{ menuRole.id }}</el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label">메뉴명 </el-col>
        <el-col :span="21" class="input-content input-text-font">
          <el-input v-model="menuRole.menuName" placeholder="input title" clearable></el-input>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label"> 메뉴타입</el-col>
        <el-col :span="21" class="input-content input-text-font">
          <el-select v-model="menuRole.menuType" placeholder="전체">
            <el-option
              v-for="item in menuTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label"> 메뉴설명</el-col>
        <el-col :span="21" class="input-content input-text-font">
          <el-input v-model="menuRole.menuDesc" placeholder="File Name" clearable></el-input>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label"> 메뉴URL</el-col>
        <el-col :span="21" class="input-content input-text-font">
          <el-input placeholder="input image" clearable></el-input>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label"> 페이지</el-col>
        <el-col :span="21" class="input-content input-text-font">
          <el-select v-model="menuRole.pageId" placeholder="전체">
            <el-option
              v-for="item in pageIdList"
              :key="item.id"
              :label="item.pageName"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label"> 사용여부</el-col>
        <el-col :span="21" class="input-content input-text-font">
          <el-select v-model="menuRole.useYn" placeholder="전체">
            <el-option
              v-for="item in useYnList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label"> 모바일여부</el-col>
        <el-col :span="21" class="input-content input-text-font">
          <el-select v-model="menuRole.mobileUseYn" placeholder="전체">
            <el-option
              v-for="item in mobileUseYnList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label"> 메뉴포함구분</el-col>
        <el-col :span="21" class="input-content input-text-font">
          <el-select v-model="menuRole.menuIncludeType" placeholder="전체">
            <el-option
              v-for="item in menuIncludeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-box">
        <el-col :span="3" class="input-label"> 모바일페이지URL </el-col>
        <el-col :span="21" class="input-content input-text-font">
          <el-input v-model="menuRole.mobilePageUrl" placeholder="input image" clearable></el-input>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
/** Local Variable **/
const emit = defineEmits(['updateMenuParam']) // 업데이트된 메뉴 데이터 부모컨포넌트로 보냄
const pageIdList = ref()

//tree select param
const menuProps = defineProps({
  menuDataProp: {
    type: Object,
    default: null
  },
  menuPageIdProp: {
    type: Object,
    default: null
  }
})

// from select box settting
const menuTypeList = [
  { value: '', label: '전체', text: '전체' },
  { value: 'PAGE', label: 'PAGE', text: 'PAGE' },
  { value: 'LINK', label: 'LINK', text: 'LINK' }
]

const mobileUseYnList = [
  { value: '', label: '전체', text: '전체' },
  { value: 'Y', label: '사용', text: '사용' },
  { value: 'N', label: '사용안함', text: '사용안함' }
]
const useYnList = [
  { value: '', label: '전체', text: '전체' },
  { value: 'Y', label: '사용', text: '사용' },
  { value: 'N', label: '사용안함', text: '사용안함' }
]
const menuIncludeTypeList = [
  { value: 'A', label: '전체', text: '전체' },
  { value: 'C', label: '사업장', text: '사업장' },
  { value: 'P', label: '개인', text: '개인' }
]

// Form data set settting
const menuRole = reactive({
  id: null,
  menuName: null,
  menuType: null,
  menuDesc: null,
  menuUrl: null,
  pageId: null,
  mobileUseYn: null,
  useYn: null,
  menuIncludeType: null,
  mobilePageUrl: null,
  menuLevel: null,
  menuIcon: null,
  upMenuId: null
})
/** Service API **/

/** Event Handler **/

watch(
  () => menuProps.menuDataProp,
  () => {
    setMenuManageForm()
  }
)

watch(
  () => menuProps.menuPageIdProp,
  () => {
    setPageListForm()
  }
)

/** Local Functions **/

// save 버튼 클릭시 입력된 data 부모컨포넌트로 보냄

const onUpdateMenuData = () => {
  const updateMenuParam = {
    id: menuRole.id,
    menuName: menuRole.menuName,
    menuType: menuRole.menuType,
    menuDesc: menuRole.menuDesc,
    menuUrl: menuRole.menuUrl,
    pageId: menuRole.pageId,
    mobileUseYn: menuRole.mobileUseYn,
    useYn: menuRole.useYn,
    menuIncludeType: menuRole.menuIncludeType,
    mobilePageUrl: menuRole.mobilePageUrl,
    menuLevel: menuRole.menuLevel,
    menuIcon: menuRole.menuIcon
  }
  emit('updateMenuParam', updateMenuParam)
}

//  tree 선택된데이터 부모창에서 받아오기..
const setMenuManageForm = () => {
  menuRole.id = menuProps.menuDataProp.id
  menuRole.menuName = menuProps.menuDataProp.menuName
  menuRole.menuType = menuProps.menuDataProp.menuType
  menuRole.menuDesc = menuProps.menuDataProp.menuDesc
  menuRole.menuUrl = menuProps.menuDataProp.menuUrl
  menuRole.pageId = menuProps.menuDataProp.pageId
  menuRole.mobileUseYn = menuProps.menuDataProp.mobileUseYn
  menuRole.useYn = menuProps.menuDataProp.useYn
  menuRole.menuIncludeType = menuProps.menuDataProp.menuIncludeType
  menuRole.mobilePageUrl = menuProps.menuDataProp.mobilePageUrl
  menuRole.menuLevel = menuProps.menuDataProp.menuLevel
  menuRole.menuIcon = menuProps.menuDataProp.menuIcon
}

const setPageListForm = () => {
  pageIdList.value = menuProps.menuPageIdProp
}
</script>

<style lang="scss" scoped></style>
