<template>
  <div class="searchbox-box">
    <div>
      <el-row>
        <el-col :span="2" class="search-label">제목</el-col>
        <el-col :span="5">
          <el-input
            v-model="props.searchParam.title"
            placeholder="제목"
            maxlength="100"
            @keyup.enter="onSearchDataToParent"
            @clear="onSearchDataToParent"
            style="width: 250px"
            clearable
          />
        </el-col>
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
            :clearable="false"
            style="width: 250px"
          />
        </el-col>
        <el-col :span="2" class="search-label">게시여부</el-col>
        <el-col :span="5">
          <el-select
            v-model="props.searchParam.postYn"
            placeholder="전체"
            @change="onSearchDataToParent"
            style="min-width: 110px; width: 150px"
          >
            <el-option
              v-for="item in getsearchPostYnList"
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
      <el-button class="searchbox-button mt-2" @click="onSearchDataToParent">조회</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

/********* Local Variable *********/
const emit = defineEmits(['getSearchList']) // 조회조건 부모컨포넌트로 보냄  searchList
const props = defineProps({
  searchParam: {
    type: Object
  }
}) // 부모컨포넌트에서 데이터 전달받음

// 게시여부
const searchPostYnList = [
  { value: '', label: '전체' },
  { value: 'Y', label: '게시' },
  { value: 'N', label: '게시안함' }
]
const today = dayjs(new Date())
const dateRangeVal = ref([today.add(-1, 'month').format('YYYY.MM.DD'), today.format('YYYY.MM.DD')])

/********* Service API *********/

/********* Event Handler *********/
// 조회버튼시 부모컨포넌트 데이터 전달
const onSearchDataToParent = () => {
  props.searchParam.fromCreatedAt = dayjs(dateRangeVal.value[0]).format('YYYYMMDD')
  props.searchParam.toCreatedAt = dayjs(dateRangeVal.value[1]).format('YYYYMMDD')
  emit('getSearchList', props.searchParam)
}

// 초기화버튼클릭
const onRefreshBtnClick = () => {
  props.searchParam.postYn = ''
  props.searchParam.title = null
  dateRangeVal.value = [today.add(-1, 'month').format('YYYY.MM.DD'), today.format('YYYY.MM.DD')]
  onSearchDataToParent()
}

/********* Local Functions *********/

/********* lifeCycle *********/
const getsearchPostYnList = computed(() => {
  return searchPostYnList
})
</script>
<style lang="scss" scoped></style>
