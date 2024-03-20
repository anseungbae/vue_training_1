<template>
  <div class="searchbox-box">
    <div>
      <el-row>
        <el-col :span="2" class="search-label">제목</el-col>
        <el-col :span="5">
          <el-input
            v-model="props.searchParam.title"
            style="width: 250px"
            @keyup.enter="onSearchDataToParent"
            placeholder="제목"
            clearable
            @clear="onSearchDataToParent"
          />
        </el-col>
        <el-col :span="2" class="search-label">적용페이지</el-col>
        <el-col :span="5" class="search-content">
          <el-select
            v-model="props.searchParam.pageIds"
            placeholder="전체"
            style="width: 200px"
            @change="onSearchDataToParent"
          >
            <el-option
              v-for="item in searchPageIdsList"
              :key="item.value"
              :label="item.codeName"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="7"></el-col>
      </el-row>

      <el-row style="margin-top: 8px">
        <el-col :span="2" class="search-label">등록일자</el-col>
        <el-col :span="5" class="search-content">
          <el-date-picker
            v-model="dateRangeVal"
            type="daterange"
            range-separator="~"
            format="YYYY.MM.DD"
            value-format="YYYYMMDD"
            @change="onSearchDataToParent"
            style="min-width: 210px; width: 250px"
            :clearable="false"
          />
        </el-col>
        <el-col :span="2" class="search-label">게시여부</el-col>
        <el-col :span="5">
          <el-select
            v-model="props.searchParam.postYn"
            placeholder="전체"
            @change="onSearchDataToParent"
            style="width: 200px"
          >
            <el-option
              v-for="item in searchPostYnList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
import { ref, computed, onBeforeMount } from 'vue'
import dayjs from 'dayjs'
import CodeService from '@/api/codeService'

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

const searchPageIdsList = ref([])

/********* Service API *********/

/********* Event Handler *********/

// 적용페이지 옵션 조회
const getSearchPageIdsCodeListApi = () => {
  CodeService.getCodeListByPCode('POP_PAGE_ID').then((res) => {
    searchPageIdsList.value = res.data
  })
}
// 초기화버튼클릭
const onRefreshBtnClick = () => {
  props.searchParam.title = ''
  props.searchParam.pageIds = ''
  props.searchParam.postYn = ''
  dateRangeVal.value = [today.add(-1, 'month').format('YYYY.MM.DD'), today.format('YYYY.MM.DD')]
  onSearchDataToParent()
}
// 조회버튼클릭
const onSearch = () => {
  emit('getSearchList', props.searchParam)
}
/********* Local Functions *********/
// 조회버튼시 부모컨포넌트 데이터 전달
const onSearchDataToParent = () => {
  props.searchParam.fromCreatedAt = dayjs(dateRangeVal.value[0]).format('YYYYMMDD')
  props.searchParam.toCreatedAt = dayjs(dateRangeVal.value[1]).format('YYYYMMDD')
  onSearch()
}
// 적용페이지 목록
onBeforeMount(() => {
  getSearchPageIdsCodeListApi()
})
</script>
<style lang="scss" scoped></style>
