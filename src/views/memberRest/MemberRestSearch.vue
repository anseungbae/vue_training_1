<template>
  <div class="searchbox-box mb-0">
    <div>
      <el-row class="mb-2">
        <el-col :span="2" class="search-label">회원상태 </el-col>
        <el-col :span="4" class="pr-5"
          ><el-select
            v-model="searchParam.userSts"
            placeholder="전체"
            style="min-width: 110px; width: 150px"
            @change="onSearchDataToParent"
          >
            <el-option
              v-for="item in userStsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4" class="search-label">회원명/ID</el-col>
        <el-col :span="5" class="search-content"
          ><el-input
            v-model="searchParam.userNmId"
            placeholder="회원명 or 회원ID"
            clearable
            @clear="onSearchDataToParent"
            @keyup.enter="onSearchDataToParent"
            style="width: 250px"
          />
        </el-col>
        <el-col :span="9"> </el-col>
      </el-row>
      <el-row class="items-center">
        <el-col :span="2" class="search-label"> 휴면예정/휴면 </el-col>
        <el-col :span="6" class="pr-5"
          ><el-date-picker
            v-model="dateRangeVal"
            type="daterange"
            range-separator="~"
            format="YYYY.MM.DD"
            value-format="YYYYMMDD"
            @change="onChangeDate"
            style="min-width: 210px; width: 250px; margin-right: 5px"
            :clearable="false"
          />
        </el-col>
        <el-col :span="2" class="search-label"> 사업장명/ID</el-col>
        <el-col :span="5" class="pr-5">
          <el-input
            v-model="searchParam.bizNmId"
            placeholder="사업장명 or 사업장ID"
            clearable
            @clear="onSearchDataToParent"
            @keyup.enter="onSearchDataToParent"
            style="width: 250px"
          />
        </el-col>
        <el-col :span="9"> </el-col>
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
import dayjs from 'dayjs'

/** Local Variable **/
const today = dayjs(new Date())
const searchParam = ref({
  userSts: null, //  회원상태
  userNmId: null, //  회원명/ID
  fromRestAt: today.add(-1, 'month').format('YYYYMMDD'), //  휴면예정/휴면 일자
  toRestAt: today.format('YYYYMMDD'), // 휴면예정/휴면 일자
  bizNmId: null, // 사업장 명/ID
  rowCnt: 20,
  pageNo: 1
})

const dateRangeVal = ref<any>([
  today.add(-1, 'month').format('YYYY.MM.DD'),
  today.format('YYYY.MM.DD')
])

//사용여부 리스트
const userStsList = [
  { value: '', label: '전체' },
  { value: 'U', label: '정상' },
  { value: 'L', label: '잠금' },
  { value: 'P', label: '휴면예정' },
  { value: 'R', label: '휴면' },
  { value: 'Q', label: '탈퇴' }
]

const emit = defineEmits(['searchList', 'searchReset'])

/** Service API **/

/** Event Handler **/
const onSearchDataToParent = () => {
  emit('searchList', searchParam.value)
}

const onChangeDate = () => {
  searchParam.value.fromRestAt = dayjs(dateRangeVal.value[0]).format('YYYYMMDD')
  searchParam.value.toRestAt = dayjs(dateRangeVal.value[1]).format('YYYYMMDD')
  onSearchDataToParent()
}

const onSearchReset = () => {
  searchParam.value.userSts = null
  searchParam.value.userNmId = null
  searchParam.value.fromRestAt = today.add(-1, 'month').format('YYYYMMDD')
  searchParam.value.toRestAt = today.format('YYYYMMDD')
  searchParam.value.bizNmId = null
  searchParam.value.rowCnt = 20
  searchParam.value.pageNo = 1
  dateRangeVal.value = [today.add(-1, 'month').format('YYYY.MM.DD'), today.format('YYYY.MM.DD')]

  emit('searchReset', searchParam.value)
}
/** Local Functions **/
</script>

<style scoped lang="scss"></style>
