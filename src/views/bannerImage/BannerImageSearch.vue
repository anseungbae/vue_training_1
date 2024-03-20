<template>
  <div class="searchbox-box">
    <div>
      <el-row>
        <el-col :span="2" class="search-label">이미지명</el-col>
        <el-col :span="5" class="search-content"
          ><el-input
            v-model="searchParam.name"
            placeholder="이미지명"
            clearable
            style="width: 250px"
            @keyup.enter="onSearchDataToParent"
            @clear="onSearchDataToParent"
          />
        </el-col>
        <el-col :span="3" class="search-label">이미지 설명</el-col>
        <el-col :span="5" class="search-content">
          <el-input
            v-model="searchParam.imageDesc"
            placeholder="이미지 설명"
            clearable
            style="width: 250px"
            @keyup.enter="onSearchDataToParent"
          />
        </el-col>
        <el-col :span="9"> </el-col>
      </el-row>
      <el-row class="mt-2">
        <el-col :span="2" class="search-label">링크주소</el-col>
        <el-col :span="5" class="search-content">
          <el-input
            v-model="searchParam.linkUrl"
            placeholder="링크주소"
            clearable
            style="width: 250px"
            @keyup.enter="onSearchDataToParent"
          />
        </el-col>
        <el-col :span="3" class="search-label">사용여부</el-col>
        <el-col :span="5" class="search-content">
          <el-select
            v-model="searchParam.useYn"
            style="min-width: 110px; width: 150px"
            placeholder="선택"
            @change="onSearchDataToParent"
          >
            <el-option
              v-for="item in useYnList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="search-label"> 사용페이지</el-col>
        <el-col :span="5" class="search-content"
          ><el-select
            v-model="searchParam.usePage"
            style="min-width: 110px; width: 150px"
            placeholder="선택"
            @change="onSearchDataToParent"
          >
            <el-option
              v-for="item in bannerTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2"> </el-col>
      </el-row>
    </div>
    <div class="flex-col my-auto">
      <el-button class="searchbox-button" @click="onSearchReset">초기화</el-button>
      <el-button class="searchbox-button mt-2" @click="onSearchDataToParent">조회</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/** Local Variable **/
const searchParam = ref({
  name: null, //  이미지명
  imageDesc: null, //  이미지 설명
  linkUrl: null, //  링크주소
  useYn: null, // 사용여부
  usePage: null, // 사용 페이지
  rowCnt: 20,
  pageNo: 1
})

//사용여부 리스트
const useYnList = [
  {
    value: 'All',
    label: '전체'
  },
  {
    value: 'Y',
    label: '사용'
  },
  {
    value: 'N',
    label: '사용안함'
  }
]

//사용페이지 리스트
const bannerTypeList = [
  {
    value: 'All',
    label: '전체'
  },
  {
    value: 'LOGIN',
    label: '로그인 배너'
  },
  {
    value: 'MAINTOP',
    label: '메인 상단 배너'
  }
]

const emit = defineEmits(['searchList', 'searchReset'])

/** Service API **/

/** Event Handler **/
const onSearchDataToParent = () => {
  console.log('searchParam : ', searchParam.value)
  emit('searchList', searchParam.value)
}

const onSearchReset = () => {
  searchParam.value.name = null
  searchParam.value.imageDesc = null
  searchParam.value.linkUrl = null
  searchParam.value.useYn = null
  searchParam.value.usePage = null
  searchParam.value.rowCnt = 20
  searchParam.value.pageNo = 1

  emit('searchReset', searchParam.value)
}
/** Local Functions **/
</script>

<style scoped lang="scss"></style>
