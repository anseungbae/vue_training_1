<template>
  <div class="searchbox-box">
    <div>
      <el-row>
        <el-col :span="2" class="search-label">회원명/ID</el-col>
        <el-col :span="5">
          <el-input
            v-model="props.searchParam.userNmId"
            style="width: 250px"
            @keyup.enter="onSearchDataToParent"
            placeholder="회원명 or 회원ID"
            clearable
            @clear="onSearchDataToParent"
          />
        </el-col>
      </el-row>
      <el-row class="mt-2">
        <el-col :span="2" class="search-label">탈퇴 일자</el-col>
        <el-col :span="5" class="search-content">
          <el-date-picker
            v-model="dateRangeVal"
            type="daterange"
            range-separator="~"
            format="YYYY.MM.DD"
            value-format="YYYYMMDD"
            @change="onSearchDataToParent"
            :clearable="false"
            style="min-width: 210px; width: 250px"
          />
        </el-col>
        <el-col :span="2" class="search-label">사업장명/ID</el-col>
        <el-col :span="5">
          <el-input
            v-model="props.searchParam.bizNmId"
            style="width: 250px"
            @keyup.enter="onSearchDataToParent"
            placeholder="사업장명 or 사업장ID"
            clearable
            @clear="onSearchDataToParent"
          />
        </el-col>
        <el-col :span="7"></el-col>
      </el-row>
    </div>
    <div class="flex-col my-auto">
      <el-button class="searchbox-button" @click="onRefreshBtnClick">초기화</el-button>
      <el-button class="searchbox-button mt-2" @click="onSearch">조회</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'

/********* Local Variable *********/
const props = defineProps({
  searchParam: {
    type: Object
  }
}) // 부모컨포넌트에서 데이터 전달받음
const emit = defineEmits(['getSearchList'])
const today = dayjs(new Date())
const dateRangeVal = ref([today.add(-1, 'month').format('YYYY.MM.DD'), today.format('YYYY.MM.DD')])
// 게시여부
const searchPostYnList = [
  { value: '', label: '전체' },
  { value: 'Y', label: '게시' },
  { value: 'N', label: '게시안함' }
]

/********* Service API *********/

/********* Event Handler *********/
// 초기화버튼클릭
const onRefreshBtnClick = () => {
  props.searchParam.userNmId = ''
  props.searchParam.bizNmId = ''
  dateRangeVal.value = [today.add(-1, 'month').format('YYYY.MM.DD'), today.format('YYYY.MM.DD')]
  onSearchDataToParent()
}
// 조회
const onSearch = () => {
  emit('getSearchList', props.searchParam)
}

/********* Local Functions *********/
//조회버튼시 부모컨포넌트 데이터 전달
const onSearchDataToParent = () => {
  props.searchParam.fromQuitAt = dayjs(dateRangeVal.value[0]).format('YYYYMMDD')
  props.searchParam.toQuitAt = dayjs(dateRangeVal.value[1]).format('YYYYMMDD')
  onSearch()
}
</script>
<style lang="scss" scoped></style>
