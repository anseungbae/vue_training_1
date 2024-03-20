<template>
  <el-dialog
    v-model="usePayChangePopupOpened"
    align-center
    class="modal-title modal-small"
    title="요금제 변경"
  >
    <hr />
    <div class="modal-box">
      <div class="mt-5">
        <el-row class="row-box">
          <el-col :span="3" class="input-label">현재요금제</el-col>
          <el-col :span="21" class="input-content input-text-font">
            {{ param.planTypeNm }} {{ '(' + getPeriodStr + ')' }}
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">변경 구분</el-col>
          <el-col :span="21" class="input-content">
            <el-radio-group v-model="param.changeType">
              <el-radio label="accountTransfer">결제(계좌이체)</el-radio>
              <el-radio label="bonus">Bonus</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row class="row-box" v-if="!isBonusType">
          <el-col :span="3" class="input-label">변경요금제</el-col>
          <el-col :span="21" class="input-content">
            <el-select
              v-model="param.newPlanType"
              placeholder="선택"
              style="min-width: 110px; width: 150px"
            >
              <el-option
                v-for="item in planTypeList"
                :key="item.planType"
                :label="item.planTypeNm"
                :value="item.planType"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="3" class="input-label">요금제 이용기간</el-col>
          <el-col :span="21" class="input-content">
            <div class="mr-5">
              <el-button class="basic-button" @click="onPeriodDateBtnClick('1M')">1달</el-button>
              <el-button class="basic-button" @click="onPeriodDateBtnClick('3M')">3달</el-button>
              <el-button class="basic-button" @click="onPeriodDateBtnClick('6M')">6달</el-button>
              <el-button class="basic-button" @click="onPeriodDateBtnClick('1Y')">1년</el-button>
            </div>
            <el-date-picker
              v-model="param.periodStartDate"
              format="YYYY.MM.DD"
              value-format="YYYYMMDD"
              :disabled="isBonusType"
              :clearable="false"
              style="min-width: 120px; width: 150px"
            />
            <p class="mx-3">~</p>
            <el-date-picker
              v-model="param.periodEndDate"
              format="YYYY.MM.DD"
              value-format="YYYYMMDD"
              :clearable="false"
              style="width: 150px"
            />
          </el-col>
        </el-row>

        <el-row class="row-box" v-if="!isBonusType">
          <el-col :span="3" class="input-label">결제금액</el-col>
          <el-col :span="21" class="input-content">
            <el-input
              v-model="param.paidAmount"
              style="width: 200px"
              placeholder="결재한 금액(원)"
              :input-style="{ fontSize: '12px' }"
              clearable
              maxlength="10"
              oninput="value = value.replace(/[^0-9.]/g, '')"
            />
          </el-col>
        </el-row>
        <el-row class="row-box" v-if="!isBonusType">
          <el-col :span="3" class="input-label">결제일자</el-col>
          <el-col :span="20" class="input-content">
            <el-date-picker
              v-model="param.paidDate"
              type="datetime"
              placeholder="결제일자"
              format="YYYY.MM.DD HH:mm:ss"
              value-format="YYYY.MM.DD HH:mm:ss"
              style="width: 200px"
              :clearable="false"
            />
          </el-col>
        </el-row>

        <el-row class="row-box" v-if="isBonusType">
          <el-col :span="3" class="input-label">비고</el-col>
          <el-col :span="21" class="input-content">
            <el-input
              v-model="param.note"
              placeholder="비고"
              :input-style="{ fontSize: '12px' }"
              clearable
              maxlength="65"
            />
          </el-col>
        </el-row>
      </div>
      <div class="flex justify-center mt-5">
        <el-button class="basic-button" @click="onChangeTypeSaveBtnClick">저장</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import BizService from '@/api/bizService'
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useAlert } from '@/hooks/web/usePageLoading.ts'

/********* Local Variable *********/
const { confirm, alert } = useAlert()
// 요금제 변경 파라미터
const emit = defineEmits(['onUsePayChangeComplete'])
// 파라미터.
const param = ref({
  bizId: null,
  planTypeNm: null,
  changeType: 'bonus',
  newPlanType: 'trial',
  vendorCnt: null,
  periodStartDate: null,
  periodEndDate: null,
  paidAmount: null,
  paidDate: null,
  note: null,
  startDate: null,
  endDate: null
})

// 변경요금제 Select 목록
const planTypeList = ref([])
// 팝업
const usePayChangePopupOpened = ref(false)

// 현재요금제 기간
const getPeriodStr = computed(() => {
  if (param.value.startDate !== 'Invalid Date' && param.value.endDate !== 'Invalid Date') {
    return `${param.value.startDate}  ~  ${param.value.endDate}`
  } else if (param.value.startDate !== 'Invalid Date') {
    return `${param.value.startDate} ~ 없음`
  } else if (param.value.endDate !== 'Invalid Date') {
    return `없음 ~ ${param.value.endDate}`
  } else {
    return `없음  ~  없음`
  }
})

// 변경 구분 타입
const isBonusType = computed(() => {
  return param.value.changeType === 'bonus'
})

// 데이터픽커 변경시

/********* Service API *********/
const getRatePlanListApi = () => {
  BizService.getRatePlanList().then((res) => {
    planTypeList.value = res.data.ratePlanList
  })
}
const onChangeTypeApi = () => {
  const updateParams = {
    bizId: param.value.bizId,
    changeType: param.value.changeType,
    planTypeNm: param.value.planTypeNm,
    note: param.value.note,
    newPlanType: param.value.newPlanType,
    vendorCnt: param.value.vendorCnt,
    startDate: param.value.periodStartDate,
    endDate: param.value.periodEndDate,
    paidAmount: param.value.paidAmount,
    paidDate: param.value.paidDate
      ? dayjs(param.value.paidDate, 'YYYY.MM.DD HH:mm:ss').toDate().toISOString()
      : param.value.paidDate,
    paymentMethod: param.value.changeType
  }

  BizService.updateBizPlan(updateParams).then((res) => {
    let msg = ''
    if (res.status === 200) {
      msg = '변경되었습니다.'
    } else {
      msg = '변경에 실패하였습니다.'
    }

    confirm(msg, '알람', null, (action) => {
      if (action === 'confirm') {
        if (res.status === 200) {
          emit('onUsePayChangeComplete', param.value)
          usePayChangePopupOpened.value = false
        }
      }
    })
  })
}
/********* Event Handler *********/
// 기간버튼 있으면 변경
const onPeriodDateBtnClick = (periodType) => {
  let startDt = dayjs(param.value.periodStartDate)
  let endDt = null
  if (periodType === '1M') {
    endDt = startDt.add(1, 'month').format('YYYY.MM.DD')
  } else if (periodType === '3M') {
    endDt = startDt.add(3, 'month').format('YYYY.MM.DD')
  } else if (periodType === '6M') {
    endDt = startDt.add(6, 'month').format('YYYY.MM.DD')
  } else if (periodType === '1Y') {
    endDt = startDt.add(1, 'years').format('YYYY.MM.DD')
  }
  if (endDt !== null) {
    param.value.periodEndDate = endDt
  }
}

// 요금제 변경 Click Event
const onChangeTypeSaveBtnClick = () => {
  if (isBonusType.value && param.value.planTypeNm.toLowerCase() === 'free') {
    alert('Free 사용자는 기간 연장이 불가합니다.', '알람', null, () => {})
  } else if (param.value.newPlanType === '') {
    alert('요금제를 선택해주세요.', '알람', null, () => {})
  } else {
    let changeType = param.value.changeType == 'accountTransfer' ? '계좌이체' : 'Bonus'
    let msg = `변경구분 : ${changeType}<br>`
    if (param.value.changeType == 'accountTransfer') {
      msg += `변경요금제 : ${param.value.planTypeNm}<br>`
      msg += `연동계정수 : ${param.value.vendorCnt}<br>`
      msg += `결제금액 : ${param.value.paidAmount == null ? 0 : param.value.paidAmount}<br>`
      msg += `결제일자 : ${param.value.paidDate}<br>`
      msg += `시작기간 : ${param.value.periodStartDate}<br>`
    }
    msg += `종료기간 : ${param.value.periodEndDate}`
    msg += '<br><br> 변경 내용을 확인하고 적용하세요!'

    confirm(msg, '알람', null, (action) => {
      if (action === 'confirm') {
        onChangeTypeApi()
      }
    })
  }
}

/********* Local Functions *********/
const open = (bizInfo) => {
  const newParam = { ...bizInfo }
  newParam.paidDate = dayjs(new Date()).format('YYYY.MM.DD HH:mm:ss')
  newParam.changeType = 'bonus'
  newParam.newPlanType = 'trial'
  newParam.paidAmount = null
  newParam.note = null
  newParam.startDate = dayjs(bizInfo.startDate).format('YYYY.MM.DD HH:mm:ss')
  newParam.periodStartDate = dayjs(bizInfo.startDate).format('YYYY.MM.DD HH:mm:ss')
  newParam.updatedAt = dayjs(bizInfo.updatedAt).format('YYYY.MM.DD HH:mm:ss')
  newParam.endDate = dayjs(bizInfo.endDate).format('YYYY.MM.DD HH:mm:ss')
  newParam.periodEndDate = dayjs(bizInfo.endDate).format('YYYY.MM.DD HH:mm:ss')
  param.value = newParam
  usePayChangePopupOpened.value = true
}

onMounted(() => {
  //  요금제 목록 가져오기
  getRatePlanListApi()
})
// 넘어온 데이터 설정.
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.input-content > div > el-button + .input-content > div > el-button {
  margin-left: 0px;
}
</style>
