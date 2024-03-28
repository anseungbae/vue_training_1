<template>
  <div class="searchbox-box">
    <div>
      <el-row>
        <el-col :span="2" class="search-label">휴무</el-col>
        <el-col :span="5" class="search-content">
          <el-date-picker
            v-model="dateRangeVal"
            type="month"
            format="YYYY.MM"
            value-format="YYYYMM"
            @change="onSearchDataToParent"
            :clearable="false"
            style="min-width: 210px; width: 250px"
          />
        </el-col>
        <el-col :span="2" class="search-label">제목/설명</el-col>
        <el-col :span="5" class="search-content">
          <el-input
            v-model="props.searchParam.searchValue"
            placeholder="제목/설명"
            maxlength="150"
            @keyup.enter="onSearchDataToParent"
            @clear="onSearchDataToParent"
            style="width: 250px"
            clearable
          />
        </el-col>

        <el-col :span="2" class="search-label">유형</el-col>
        <el-col :span="5">
          <el-select
            v-model="props.searchParam.holidayType"
            @change="onSearchDataToParent"
            style="min-width: 110px; width: 150px"
          >
            <el-option
              v-for="item in holidayTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="7"></el-col>
      </el-row>
    </div>
    <div>
      <el-button class="searchbox-button" @click="onRestBtnClick">초기화</el-button>
      <el-button class="searchbox-button" @click="onSearchDataToParent">조회</el-button>
      <el-button class="searchbox-button" @click="openHolidayDetailPopup">등록</el-button>
    </div>
  </div>
  <HolidayManageDetailPopup
    ref="holidayManageDetailPopRef"
    @onSearchDataReload="onSearchDataToParent"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import HolidayManageDetailPopup from './popup/HolidayManageDetailPopup.vue'

/********* Local Variable *********/
const holidayManageDetailPopRef = ref(null)
const emit = defineEmits(['getSearchList']) // 조회조건 부모컨포넌트로 보냄  searchList
const props = defineProps({
  searchParam: {
    type: Object,
    default: null
  }
}) // 부모컨포넌트에서 데이터 전달받음

// 휴무 타입
const holidayTypeList = [
  { value: 'H', label: '공휴일' },
  { value: 'E', label: '이벤트' },
  { value: 'T', label: '기타' }
]

const today = dayjs(new Date())
const dateRangeVal = ref<any>(today.format('YYYYMM'))

/********* Service API *********/

/********* Event Handler *********/
// 조회버튼시 부모컨포넌트 데이터 전달
const onSearchDataToParent = () => {
  props.searchParam.month = dayjs(dateRangeVal.value).format('YYYYMM')
  emit('getSearchList', props.searchParam)
}

// 초기화버튼클릭
const onRestBtnClick = () => {
  props.searchParam.holidayType = 'H'
  props.searchParam.searchValue = null
  dateRangeVal.value = today.format('YYYYMM')
  onSearchDataToParent()
}
// 휴무 관리 상세 팝업 호출
const openHolidayDetailPopup = () => {
  holidayManageDetailPopRef.value.detailOpen()
}

/** Local Functions **/
</script>
<style lang="scss" scoped></style>
