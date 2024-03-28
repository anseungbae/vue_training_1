<template>
  <el-dialog
    v-model="holidayManageDetailPopupOpened"
    align-center
    class="modal-title min-w-[500px] min-h-[400px]"
    :title="modeText"
  >
    <hr />
    <div class="flex justify-end my-2">
      <el-button class="basic-button" @click="onDeleteBtnClick" v-if="isSaveType">삭제</el-button>
      <el-button class="basic-button" @click="onSaveBtnClick"
        ><span>{{ btnText }}</span>
      </el-button>
    </div>
    <div class="modal-box-bottom">
      <div>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">제목</el-col>
          <el-col :span="21" class="input-content">
            <el-input
              v-model="holidayManageDetailInfo.title"
              placeholder="제목"
              clearable
              maxlength="100"
              ref="inputTitle"
              type="text"
            />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">설명</el-col>
          <el-col :span="21" class="input-content">
            <el-input
              v-model="holidayManageDetailInfo.description"
              placeholder="설명"
              clearable
              maxlength="500"
              input-style="height:230px"
              ref="inputDescription"
              type="textarea"
            />
          </el-col>
        </el-row>

        <el-row class="row-box">
          <el-col :span="3" class="input-label">휴무기간</el-col>
          <el-col :span="10" class="input-content input-text-font">
            <el-date-picker
              v-model="dateRangeVal"
              type="daterange"
              range-separator="~"
              format="YYYY.MM.DD"
              value-format="YYYYMMDD"
              style="min-width: 210px; width: 250px"
              :clearable="false"
            />
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">휴무유형</el-col>
          <el-col :span="10" class="input-content input-text-font">
            <el-select v-model="holidayManageDetailInfo.holidayType" placeholder="전체">
              <el-option
                v-for="item in holidayTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { isEmpty } from '@/utils/is'
import HolidayService from '@/api/holidayService'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'
import { useAlert } from '@/hooks/web/usePageLoading'
/** Local Variable **/
let modeText = ''
let btnText = ''
const inputTitle = ref(null)
const inputDescription = ref(null)

const { loadStart, loadDone } = usePageLoading()
const { alert, confirm } = useAlert()
const today = dayjs(new Date())
const dateRangeVal = ref<any>([
  today.format('YYYY.MM.DD'),
  today.add(+3, 'day').format('YYYY.MM.DD')
])
const dateRangeValue = ref({
  holidayStartAt: dateRangeVal.value[0], // 게시시작일
  holidayEndAt: dateRangeVal.value[1] // 게시종료일
})
const holidayTypeList = [
  { value: 'H', label: '공휴일' },
  { value: 'E', label: '이벤트' },
  { value: 'T', label: '기타' }
]

const emit = defineEmits(['onSearchDataReload']) //
const holidayManageDetailPopupOpened = ref(false)
const holidayManageDetailInfo = ref<any>({
  id: null,
  title: null,
  description: null,
  holidayType: 'E',
  holidayStartAt: null,
  holidayEndAt: null,
  saveMode: ''
})
// Validation Check
const holidayManageDetailValidationCheck = () => {
  if (isEmpty(holidayManageDetailInfo.value)) {
    alert('저장할 데이터가 없습니다.', '알림', null, () => {})
    return false
  } else if (isEmpty(holidayManageDetailInfo.value.title)) {
    alert('제목 항목은 필수 입력 항목입니댜.', '알림', null, null)
    inputTitle.value.focus(true)
    return false
  } else if (isEmpty(holidayManageDetailInfo.value.description)) {
    alert('설멸 항목은 필수 입력 항목입니댜.', '알림', null, null)
    inputDescription.value.focus(true)
    return false
  } else if (isEmpty(holidayManageDetailInfo.value.holidayType)) {
    alert('형태 항목은 필수 입력 항목입니댜.', '알림', null, null)
    return false
  } else if (isEmpty(dateRangeVal.value)) {
    alert('휴무일자는  필수 입력 항목입니댜.', '알림', null, null)
    return false
  }
  return true
}

//저장 함수 등록/수정에 따라 API 호출
const onSaveBtnClick = () => {
  const saveType = holidayManageDetailInfo.value.id
  if (holidayManageDetailValidationCheck()) {
    // Validation Check
    if (isEmpty(saveType)) {
      insertHolidayManageDetailApi()
    } else {
      updateHolidayManageDetailApi()
    }
  }
}

// 삭제 버튼 클릭
const onDeleteBtnClick = () => {
  const saveType = holidayManageDetailInfo.value.id
  if (!isEmpty(saveType)) {
    // 삭제 API 호출
    deleteHolidayManageDetailApi()
  }
}

/** Service API **/
//삭제 API 호출
const deleteHolidayManageDetailApi = () => {
  const deleteHolidayInfo = {
    id: holidayManageDetailInfo.value.id
  }
  confirm('삭제하시겠습니까?', '삭제', null, (action) => {
    if (action === 'confirm') {
      let deleteParam = { deleteHolidayInfo }
      HolidayService.deleteHoliday(deleteParam).then((res) => {
        let alertMsg = ''
        if (res.data.saveStatus) {
          alertMsg = `삭제되었습니다.`
        } else {
          alertMsg = '삭제에 실패하였습니다.'
        }
        alert(alertMsg, '저장', null, () => {
          onCloseBtnClick()
        })
      })
    }
  })
}

//등록 API 호출
const insertHolidayManageDetailApi = () => {
  const insert = {
    //   id: holidayManageDetailInfo.value.id,
    title: holidayManageDetailInfo.value.title,
    description: holidayManageDetailInfo.value.description,
    holidayType: holidayManageDetailInfo.value.holidayType,
    holidayStartAt: dayjs(dateRangeVal.value[0]).format('YYYY-MM-DD'),
    holidayEndAt: dayjs(dateRangeVal.value[1]).format('YYYY-MM-DD'),
    saveMode: holidayManageDetailInfo.value.saveMode
  }

  confirm('등록하시겠습니까?', '등록', null, (action) => {
    if (action === 'confirm') {
      let saveParam = { insert }
      HolidayService.insertHoliday(saveParam).then((res) => {
        let alertMsg = ''
        if (res.data.saveStatus) {
          alertMsg = `저장되었습니다.`
        } else {
          alertMsg = '저장에 실패하였습니다.'
        }
        alert(alertMsg, '저장', null, () => {
          onCloseBtnClick()
        })
      })
    }
  })
}

//업데이트 API 호출
const updateHolidayManageDetailApi = () => {
  const updateHolidayInfo = {
    id: holidayManageDetailInfo.value.id,
    title: holidayManageDetailInfo.value.title,
    description: holidayManageDetailInfo.value.description,
    holidayType: holidayManageDetailInfo.value.holidayType,
    holidayStartAt: dayjs(dateRangeVal.value[0]).format('YYYYMMDD'),
    holidayEndAt: dayjs(dateRangeVal.value[1]).format('YYYYMMDD'),
    saveMode: holidayManageDetailInfo.value.saveMode
  }

  confirm('수정하시겠습니까?', '수정', null, (action) => {
    if (action === 'confirm') {
      let saveParam = { updateHolidayInfo }
      HolidayService.updateHoliday(saveParam).then((res) => {
        let alertMsg = ''
        if (res.data.saveStatus) {
          alertMsg = `저장되었습니다.`
        } else {
          alertMsg = '저장에 실패하였습니다.'
        }
        alert(alertMsg, '저장', null, () => {
          onCloseBtnClick()
        })
      })
    }
  })
}

//  휴무 관리 상세 조회 API 호출
const getHolidayManageDetailInfoAPi = () => {
  const param = { id: holidayManageDetailInfo.value.id }
  loadStart()
  HolidayService.getHolidayDetail(param)
    .then((res) => {
      // grid data
      dateRangeVal.value = []
      //  조회해온 Detail Data
      holidayManageDetailInfo.value = res.data
      holidayManageDetailInfo.value.id = res.data.id
      holidayManageDetailInfo.value.title = res.data.title
      holidayManageDetailInfo.value.description = res.data.description
      holidayManageDetailInfo.value.holidayType = res.data.holidayType
      dateRangeVal.value[0] = dayjs(res.data.holidayStartAt).format('YYYY-MM-DD')
      dateRangeVal.value[1] = dayjs(res.data.holidayEndAt).format('YYYY-MM-DD')
    })
    .catch((err) => alert(err, '알림', null, null))
  loadDone()
}

/** Local Functions **/
//부모창에서 popup의 메소드 호출
const detailOpen = (id: any) => {
  console.log('popup id  :::  ', id)
  //  휴무 상세조회
  if (isEmpty(id)) {
    // insert Mod
    modeText = '휴무 등록'
    btnText = '등록'
    holidayManageDetailPopupOpened.value = true
    dateRangeVal.value[0] = dayjs(dateRangeValue.value.holidayStartAt).format('YYYYMMDD')
    dateRangeVal.value[1] = dayjs(dateRangeValue.value.holidayEndAt).format('YYYYMMDD')

    holidayManageDetailInfo.value = {
      id: null,
      title: null,
      description: null,
      holidayType: 'H',
      postStartAt: dateRangeValue.value.holidayStartAt,
      postEndAt: dateRangeValue.value.holidayEndAt
    }
  } else {
    // Update Mod
    modeText = '휴무 수정'
    btnText = '저장'
    holidayManageDetailPopupOpened.value = true
    holidayManageDetailInfo.value.id = id
    getHolidayManageDetailInfoAPi()
  }
}

const onCloseBtnClick = () => {
  //  재조회 관련 호출하기.
  emit('onSearchDataReload')
  //  화면 닫기
  holidayManageDetailPopupOpened.value = false
}

// 삭제 버튼 유무
const isSaveType = computed(() => {
  return holidayManageDetailInfo.value.id !== null ? true : false
})
defineExpose({
  detailOpen
})
</script>

<style lang="scss" scoped></style>
