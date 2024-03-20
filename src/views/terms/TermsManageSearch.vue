<template>
  <div class="searchbox-box items-center">
    <div>
      <el-row>
        <el-col :span="2" class="search-label">약관구분</el-col>
        <el-col :span="3">
          <el-select
            v-model="searchParam.searchTermsType"
            placeholder="전체"
            style="width: 150px"
            @change="onSearchDataToParent"
          >
            <el-option
              v-for="item in searchTermsTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="search-label">약관명 </el-col>
        <el-col :span="5" class="search-content">
          <el-input
            v-model="searchParam.searchTermsName"
            placeholder="약관명"
            clearable
            @clear="onSearchDataToParent"
            @keyup.enter="onSearchDataToParent"
            style="width: 250px"
          />
        </el-col>
      </el-row>
    </div>
    <div>
      <el-button class="searchbox-button" @click="onRefreshBtnClick">초기화</el-button>
      <el-button class="searchbox-button" @click="onSearchDataToParent">조회</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/** Local Variable **/
const emit = defineEmits(['searchList']) //조회조건 부모컨포넌트로 보냄
const searchParam = ref({
  searchTermsName: null,
  searchTermsType: ''
})

//  조회 조건 목록
const searchTermsTypeList = [
  {
    value: '',
    label: '전체'
  },
  {
    value: 'B',
    label: '사업장 약관'
  },
  {
    value: 'P',
    label: '개인 약관'
  },
  {
    value: 'S',
    label: '구독 결제 약관'
  }
]
/** Service API **/

/** Event Handler **/
//  초기화 버튼 Click Event
const onRefreshBtnClick = () => {
  searchParam.value = {
    searchTermsName: null,
    searchTermsType: ''
  }
  //  다시 조회
  onSearchDataToParent()
}
//조회버튼시 부모컨포넌트 데이터 전달
const onSearchDataToParent = () => {
  const terms = {
    termsType: searchParam.value.searchTermsType, // 약관 구분
    termsName: searchParam.value.searchTermsName // 약관명
  }
  console.log('terms', terms)
  emit('searchList', terms)
}
/** Local Functions **/
</script>
<style lang="scss" scoped></style>
