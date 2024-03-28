<template>
  <div class="grid-box flex flex-col flex-1 mt-5 h-full min-w-[1200px]">
    <el-calendar ref="calendar" v-model="calendarItems.value">
      <template #date-cell="{ data }">
        <el-row :class="data.isSelected ? 'is-selected' : 'sds'">
          {{ data.day.split('-').slice(1).join('-') }}
          {{ data.isSelected ? '✔️' : '' }}
        </el-row>
        <div v-for="(item, index) in textContent(data.day)" :key="index">
          <e-row>
            <el-col class="center">
              <el-tag type="warning" class="tag">
                <el-row v-if="item.title !== ''">
                  <el-col :span="17" class="tag">
                    <span @click="holidayManageDetailPopOpen(item)">{{ item.title }}</span>
                  </el-col>
                  <el-col :span="1"></el-col>
                  <el-col :span="6" class="tag2">
                    <span @click="holidayManageDetailPopOpen(item)">{{ item.holidayType }}</span>
                  </el-col>
                </el-row>
              </el-tag>
            </el-col>
          </e-row>
        </div>
      </template>
    </el-calendar>
  </div>
  <HolidayManageDetailPopup
    ref="holidayManageDetailPopRef"
    @onSearchDataReload="onSearchDataToParent"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import HolidayManageDetailPopup from './popup/HolidayManageDetailPopup.vue'
import dayjs from 'dayjs'

//부모컨포넌트에서 데이터 전달받음
const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  searchParam: {
    type: Object,
    default: null
  }
})

const calendar = ref()
const holidayManageDetailPopRef = ref(null)
const calendarItems = ref<any>([null])

const emit = defineEmits(['getSearchList']) // 조회조건 부모컨포넌트로 보냄  searchList
const today = dayjs(new Date())
const dateRangeVal = ref<any>(today.format('YYYYMM'))

// calendar data set

const state = reactive({
  tableData: [],
  calendarData: [
    {
      day: dayjs(calendarItems.value.holidayStartAt).format('YYYY-MM-DD'),
      title: calendarItems.value.title,
      holidayType: calendarItems.value.holidayType
    }
  ]
})
/** Event Handler **/
// 부모에서 넘어온 데이터를 감지
watch(props, () => {
  setPageCalendarData()
})

// 조회버튼시 부모컨포넌트 데이터 전달
const onSearchDataToParent = () => {
  props.searchParam.month = dayjs(dateRangeVal.value).format('YYYYMM')
  emit('getSearchList', props.searchParam)
}
// data 전달
const setPageCalendarData = () => {
  calendarItems.value = props.data
}

//날짜를 처리하여 배경 데이터를 얻고 동적으로 렌더링합니다.
const textContent = (date) => {
  //현재 날짜는 위의 달력 컴포넌트에서 얻은 현재 날짜 값을 기준으로 테스트 데이터를 필터링하여 각 날짜에 해당하는 데이터를 찾아 반환합니다.
  //  console.log(date, 1111)
  return state.calendarData.filter((item) => {
    //   console.log('item.holidayStartAt :::: ' + item.holidayStartAt)
    //   console.log('data.holidayStartAt. :::: ' + item.holidayStartAt)
    return date === item.day
  })
}

// 휴무 관리 상세 팝업 호출
const holidayManageDetailPopOpen = (item) => {
  holidayManageDetailPopRef.value.detailOpen(item.id)
}
</script>

<style lang="scss" scoped>
.is-selected {
  color: #1989fa;
}
</style>
