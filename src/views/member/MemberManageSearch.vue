<template>
  <div class="searchbox-box">
    <div>
      <el-row>
        <el-col :span="2" class="search-label">날짜조건선택</el-col>
        <el-col :span="7">
          <div class="max-w-[500px] flex">
            <el-select
              v-model="props.searchParam.dateSts"
              placeholder="전체"
              style="min-width: 110px; width: 150px; margin-right: 5px"
              @change="onSearchDateStsChange"
            >
              <el-option
                v-for="item in searchDateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-if="props.searchParam.dateSts"
              v-model="dateRangeVal"
              type="daterange"
              range-separator="~"
              format="YYYY.MM.DD"
              value-format="YYYYMMDD"
              @change="onSearchDataToParent"
              :clearable="false"
              style="min-width: 210px; width: 250px"
            />
          </div>
        </el-col>
        <el-col :span="2" class="search-label">결제타입</el-col>
        <el-col :span="2">
          <el-select
            v-model="props.searchParam.planType"
            placeholder="전체"
            style="width: 110px"
            @change="onSearchDataToParent"
          >
            <el-option
              v-for="item in searchPlanTypeStsList"
              :span="3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="search-label">회원상태</el-col>
        <el-col :span="2" class="search-content">
          <el-select
            v-model="props.searchParam.userSts"
            placeholder="전체"
            style="width: 110px"
            @change="onSearchDataToParent"
          >
            <el-option
              v-for="item in searchMemberStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" class="search-label">마켓별칭</el-col>
        <el-col :span="5" class="search-content">
          <el-input
            v-model="props.searchParam.vendorNickName"
            placeholder="마켓별칭"
            clearable
            @keyup.enter="onSearchDataToParent"
            @clear="onSearchDataToParent"
            style="width: 250px"
          />
        </el-col>
      </el-row>
      <el-row class="mt-2">
        <el-col :span="2" class="search-label">회원명/email</el-col>
        <el-col :span="5" class="search-content"
          ><el-input
            v-model="props.searchParam.userNmId"
            placeholder="회원명/email"
            clearable
            style="width: 250px"
            @keyup.enter="onSearchDataToParent"
            @clear="onSearchDataToParent"
          />
        </el-col>

        <el-col :span="3" class="search-label">회원 전화번호</el-col>
        <el-col :span="5" class="search-content"
          ><el-input
            v-model="props.searchParam.userTel"
            placeholder="회원 전화번호"
            clearable
            style="width: 250px"
            @keyup.enter="onSearchDataToParent"
            @clear="onSearchDataToParent"
          />
        </el-col>
        <el-col :span="4" class="search-label">사업장명 or 사업장ID</el-col>
        <el-col :span="5" class="search-content"
          ><el-input
            v-model="props.searchParam.bizNmId"
            placeholder="사업장명 or 사업장ID"
            clearable
            @keyup.enter="onSearchDataToParent"
            @clear="onSearchDataToParent"
            style="width: 250px"
          />
        </el-col>
      </el-row>
    </div>
    <div class="flex-col my-auto">
      <el-button class="searchbox-button" @click="onRefreshBtnClick">초기화</el-button>
      <el-button class="searchbox-button mt-2" @click="onSearchDataToParent">조회</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'

/********* Local Variable *********/
// 조회 파라미터
const emit = defineEmits(['getSearchList']) // 조회조건 부모컨포넌트로 보냄
const props = defineProps({
  searchParam: {
    type: Object
  }
}) // 부모컨포넌트에서 데이터 전달받음

// 날짜조건 목록
const searchDateList = [
  { value: '', label: '전체' },
  { value: 'endDate', label: '유료회원 만료일' },
  { value: 'joinDate', label: '가입일자' }
]

// 결제타입 목록
const searchPlanTypeStsList = [
  { value: '', label: '전체' },
  { value: 'trial', label: 'trial' },
  { value: 'free', label: 'free' },
  { value: 'paid', label: '유료' }
]

// 회원상태
const searchMemberStateList = [
  { value: '', label: '전체' },
  { value: 'U', label: '정상' },
  { value: 'L', label: '잠금' },
  { value: 'P', label: '휴면예정' },
  { value: 'R', label: '휴면' },
  { value: 'Q', label: '탈퇴' }
]
const today = dayjs(new Date())
const dateRangeVal = ref<any>([
  today.add(-1, 'month').format('YYYY.MM.DD'),
  today.format('YYYY.MM.DD')
])

/********* Service API *********/

/********* Event Handler *********/
// 조회버튼시 부모컨포넌트 데이터 전달
const onSearchDataToParent = () => {
  props.searchParam.fromAt = dateRangeVal.value[0]
  props.searchParam.toAt = dateRangeVal.value[1]
  emit('getSearchList', props.searchParam)
}

const onSearchDateStsChange = () => {
  if (props.searchParam.dateSts == '') {
    dateRangeVal.value = [today.add(-1, 'month').format('YYYY.MM.DD'), today.format('YYYY.MM.DD')]
  } else {
    props.searchParam.fromAt = dateRangeVal.value[0]
    props.searchParam.toAt = dateRangeVal.value[1]
  }
  onSearchDataToParent()
}

// 초기화버튼클릭
const onRefreshBtnClick = () => {
  props.searchParam.dateSts = ''
  props.searchParam.planType = ''
  props.searchParam.userNmId = null
  props.searchParam.userTel = null
  props.searchParam.bizNmId = null
  props.searchParam.vendorNickName = null
  props.searchParam.userSts = null
  dateRangeVal.value = [today.add(-1, 'month').format('YYYY.MM.DD'), today.format('YYYY.MM.DD')]
  onSearchDataToParent()
}

/********* Local Functions *********/

/********* lifeCycle *********/
</script>

<style lang="scss" scoped></style>
