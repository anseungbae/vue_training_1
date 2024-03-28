<template>
  <div class="grid-box flex flex-col flex-1 mt-5 h-full min-w-[1200px]">
    <el-tabs type="border-card" class="demo-tabs">
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><calendar /></el-icon>
            <span>휴무 Calendar</span>
          </span>
        </template>
        <HolidayManageTabCalendar ref="holidayManageTabCalendarRef" :data="holidayCalendarItems" />
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><List /></el-icon>
            <span>휴무 List</span>
          </span>
        </template>
        <HolidayManageTabGrid ref="holidayManageTabGridRef" :data="holidayGridItems" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import HolidayManageTabCalendar from '@/views/holidayManage/HolidayManageTabCalendar.vue'
import HolidayManageTabGrid from '@/views/holidayManage/HolidayManageTabGrid.vue'
import { Calendar, List } from '@element-plus/icons-vue'
/** Local Variable **/
const holidayGridItems = ref()
const holidayCalendarItems = ref<any>([null])
const holidayManageTabCalendarRef = ref(null)
const holidayManageTabGridRef = ref(null)
//부모컨포넌트에서 데이터 전달받음
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

/** Event Handler **/
watch(props, () => {
  console.log('holidayItems.value 1   ::::')
  setHolidayManageInfo()
})
/** Local Functions **/
const setHolidayManageInfo = () => {
  holidayGridItems.value = props.data // 조회해온 목록을 넣는다.
  holidayCalendarItems.value = props.data // 조회해온 목록을 넣는다.
  console.log('holidayItems.value::::', holidayGridItems.value)
  console.log('holidayCalendarItems.value::::', holidayCalendarItems.value)
}
</script>
<style lang="scss" scoped></style>
