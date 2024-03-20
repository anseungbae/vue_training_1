<template>
  <el-dialog
    v-model="memberDetailPopupOpened"
    align-center
    class="modal-title modal-large"
    title="회원상세"
    :before-close="handleClose"
  >
    <hr />
    <div class="flex justify-end my-3">
      <el-button class="basic-button" @click="onSaveBtnClick">저장</el-button>
    </div>

    <div class="modal-box">
      <el-scrollbar ref="scrollbarRef" max-height="700" min-width="920px">
        <div>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">회원ID</el-col>
            <el-col :span="9" class="input-content input-text-font">
              {{ detailParam.emailId }}
            </el-col>
            <el-col :span="3" class="input-label">비밀번호</el-col>
            <el-col :span="9" class="input-content">
              <el-button class="basic-button" @click="onResetPasswordBtnClick"
                >비밀번호 초기화</el-button
              >
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">회원명</el-col>
            <el-col :span="9" class="input-content">
              <el-input
                v-model="detailParam.userName"
                :input-style="{ fontSize: '12px' }"
                placeholder="회원명"
                maxlength="25"
                clearable
              />
            </el-col>
            <el-col :span="3" class="input-label">생년월일</el-col>
            <el-col :span="9" class="input-content">
              <el-input
                v-model="detailParam.userBirthDt"
                :input-style="{ fontSize: '12px' }"
                oninput="value = value.replace(/[^0-9.]/g, '')"
                placeholder="생년월일"
                maxlength="10"
                clearable
              />
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">전화번호</el-col>
            <el-col :span="9" class="input-content">
              <el-input
                v-model="detailParam.contactNo"
                :input-style="{ fontSize: '12px' }"
                oninput="value = value.replace(/[^0-9.]/g, '')"
                placeholder="전화번호"
                maxlength="15"
                clearable
              />
            </el-col>
            <el-col :span="3" class="input-label">현재 요금제</el-col>
            <el-col :span="9" class="input-content">
              {{ detailParam.planTypeNm }}
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">마케팅 수신여부</el-col>
            <el-col :span="9" class="input-content">
              <el-checkbox v-model="detailParam.maktSmsYn"
                ><span class="checkbox-font">SMS</span></el-checkbox
              >
              <el-checkbox v-model="detailParam.maktEmailYn"
                ><span class="checkbox-font">이메일</span></el-checkbox
              >
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">가입일자</el-col>
            <el-col :span="9" class="input-content input-text-font">
              {{ detailParam.joinedAt }}
            </el-col>
            <el-col :span="3" class="input-label">회원 상태</el-col>
            <el-col :span="9" class="input-content input-text-font">
              {{ detailParam.userStsName }}
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">최종비밀번호 변경일</el-col>
            <el-col :span="9" class="input-content input-text-font">
              {{ detailParam.lastChangePwAt }}
            </el-col>
            <el-col :span="3" class="input-label">비밀번호변경 예정일</el-col>
            <el-col :span="9" class="input-content input-text-font">
              {{ detailParam.planChangePwAt }}
            </el-col>
          </el-row>
          <el-row class="row-box">
            <el-col :span="3" class="input-label">최종로그인 일자</el-col>
            <el-col :span="9" class="input-content input-input-text-font">
              {{ detailParam.lastLoginAt ? detailParam.lastLoginAt : '-' }}
            </el-col>
            <el-col :span="3" class="input-label">로그인 실패 횟수</el-col>
            <el-col :span="9" class="input-content">
              <el-input
                v-model="detailParam.failPwCnt"
                :input-style="{ fontSize: '12px' }"
                oninput="value = value.replace(/[^0-9.]/g, '')"
                placeholder="로그인 실패 횟수"
                maxlength="3"
                clearable
              />
            </el-col>
          </el-row>

          <el-row class="row-box">
            <el-col :span="3" class="input-label">
              {{ isQuitUser ? '탈퇴일자' : '회원탈퇴' }}
            </el-col>
            <el-col :span="20" class="input-content">
              <template v-if="isQuitUser">
                <el-input
                  v-model="detailParam.quitAt"
                  :input-style="{ fontSize: '12px' }"
                  disabled
                  clearable
                  placeholder="탈퇴일자"
                />
                <el-input
                  v-model="detailParam.quitReason"
                  :input-style="{ fontSize: '12px' }"
                  disabled
                  clearable
                  placeholder="탈퇴사유"
                />
              </template>
              <template v-else>
                <el-button class="basic-button" @click="onForceUserQuitBtnClick"
                  >강제 회원탈퇴</el-button
                >
              </template>
            </el-col>
          </el-row>
        </div>
        <div class="grid-box my-5">
          <div class="grid-header-box">
            <p class="subtitle-font">이용요금제</p>
            <div class="button-box">
              <el-button class="grid-button" @click="onUsePayChangeBtnClick">요금제 변경</el-button>
              <el-button class="grid-button" @click="onPaidHistoryBtnClick">결제내역</el-button>
            </div>
          </div>
          <DataGrid
            ref="usePayGridRef"
            class="ag-theme-quartz data-grid-small-box"
            :rowData="getUsePayGridItems"
            :columnDefs="usePayColDefs"
          />
        </div>
        <div class="grid-box my-5">
          <div class="grid-header-box">
            <p class="subtitle-font">연계사업장</p>
          </div>
          <DataGrid
            ref="businessGridRef"
            class="ag-theme-quartz data-grid-small-box"
            :columnDefs="businessColDefs"
            :rowData="getBusinessGridItems"
          />
        </div>
        <div class="grid-box mt-5">
          <div class="grid-header-box">
            <p class="subtitle-font">약관</p>
          </div>
          <DataGrid
            ref="termsGridRef"
            class="ag-theme-quartz data-grid-small-box"
            :rowData="getTermsGridItems"
            :columnDefs="termsColDefs"
            @onGridCellClick="onTermsGridCellClick"
          />
        </div>
      </el-scrollbar>
    </div>
  </el-dialog>
  <TermsDetailPopup ref="termsDetailPopRef" />
  <PaidHistoryPopup ref="paidHistoryPopRef" />
  <UsePayChangePopup ref="usePayChangePopRef" @onUsePayChangeComplete="getMemberDetailApi" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UserService from '@/api/userService'
import TermsDetailPopup from '@/views/member/popup/TermsDetailPopup.vue'
import PaidHistoryPopup from '@/views/member/popup/PaidHistoryPopup.vue'
import UsePayChangePopup from '@/views/member/popup/UsePayChangePopup.vue'
import { dateFormatterRemain, dateToString } from '@/utils/gridFormatter'
import dayjs from 'dayjs'
import { ElScrollbar } from 'element-plus'
import { isEmpty } from '@/utils/is'
import { useAlert } from '@/hooks/web/usePageLoading'

/********* Local Variable *********/
const emit = defineEmits(['onSearchDataReload'])
const { alert, confirm } = useAlert()
// 성별 Select 목록
const genderList = [
  { value: 'M', label: '남자' },
  { value: 'W', label: '여자' }
]

// 이용요금제 Grid Columns
const usePayColDefs = [
  {
    headerName: 'No.',
    cellClass: 'centered',
    valueGetter: 'node.rowIndex + 1',
    sortable: false,
    width: 40,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'updatedAt',
    headerName: '최종 변경일자',
    flex: 2,
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD HH:mm:ss')
    },
    cellStyle: {
      width: 170,
      textAlign: 'center'
    }
  },
  {
    field: 'planTypeNm',
    headerName: '이용 요금제',
    flex: 1.5,
    sortable: false,
    cellStyle: {
      width: 100,
      textAlign: 'center'
    }
  },
  {
    field: 'paymentMethod',
    headerName: '결제 수단',
    flex: 1.5,
    sortable: false,
    valueFormatter: (param) => {
      return (param.value = param.value ? param.value : '-')
    },
    cellStyle: {
      width: 100,
      textAlign: 'center'
    }
  },
  {
    field: 'remainingDays',
    headerName: '남은 일수 (금일 ~ 만료일)',
    valueFormatter: dateFormatterRemain,
    flex: 2.5,
    sortable: false,
    cellStyle: {
      width: 180,
      textAlign: 'center'
    }
  },
  {
    field: 'paidDate',
    headerName: '결제일',
    flex: 2,
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD HH:mm:ss')
    },
    cellStyle: {
      width: 170,
      textAlign: 'center'
    }
  },
  {
    field: 'startDate',
    headerName: '요금제 시작일',
    flex: 2,
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD HH:mm:ss')
    },
    cellStyle: {
      width: 170,
      textAlign: 'center'
    }
  },
  {
    field: 'endDate',
    headerName: '요금제 만료일',
    flex: 2,
    sortable: false,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD HH:mm:ss')
    },
    cellStyle: {
      width: 170,
      textAlign: 'center'
    }
  }
]
// 연계사업장 Grid Columns
const businessColDefs = [
  {
    headerName: 'No.',
    valueGetter: 'node.rowIndex + 1',
    width: 40,
    sortable: false,
    cellStyle: { textAlign: 'center' }
  },
  {
    field: 'bizName',
    headerName: '사업장명',
    flex: 4,
    sortable: false
  },
  {
    field: 'bizLevelName',
    headerName: '사업장등급',
    flex: 1,
    sortable: false,
    cellStyle: {
      width: 120,
      textAlign: 'center'
    }
  },
  {
    field: 'joinedAt',
    headerName: '사업장 가입일',
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD HH:mm:ss')
    },
    cellStyle: {
      width: 170,
      textAlign: 'center'
    }
  },
  {
    field: 'bizApprovalStsName',
    headerName: '사업장상태',
    flex: 1,
    cellStyle: {
      width: 120,
      textAlign: 'center'
    }
  },
  {
    field: 'bizChargeStsName',
    headerName: '과금상태',
    flex: 1,
    cellStyle: {
      textAlign: 'center'
    }
  }
]
// 약관 Grid Columns
const termsColDefs = [
  {
    headerName: 'No.',
    cellClass: 'centered',
    valueGetter: 'node.rowIndex + 1',
    width: 40,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    field: 'termsName',
    headerName: '약관명',
    flex: 4,
    cellStyle: {
      textAlign: 'center',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  {
    field: 'version',
    headerName: '약관버전',
    flex: 1,
    cellStyle: {
      width: 120,
      textAlign: 'center'
    }
  },
  {
    field: 'agreeYn',
    headerName: '약관동의여부',
    flex: 1,
    cellStyle: {
      width: 140,
      textAlign: 'center'
    }
  },
  {
    field: 'createdAt',
    headerName: '동의/미동의 일자',
    flex: 1.5,
    valueFormatter: (param) => {
      return dateToString(param, 'YYYY.MM.DD HH:mm:ss')
    },
    cellStyle: {
      width: 180,
      textAlign: 'center'
    }
  }
]

const memberDetailPopupOpened = ref(false)
const pkUserId = ref(null)
/** Grid 관련 **/
const businessGridItems = ref(null)
const usePayGridItems = ref(null)
const termsGridItems = ref(null)
const isdisable = ref(true)
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const today = dayjs(new Date())

// Detail Info 관련
const detailParam = ref({
  userId: null,
  emailId: null,
  userName: null,
  userBirthDt: null,
  userGender: null,
  contactNo: null,
  zipCode: null,
  basicAddr: null,
  detailAddr: null,
  recommenderId: null,
  joinedAt: null,
  userSts: null,
  userStsName: null,
  lastChangePwAt: null,
  planChangePwAt: null,
  lastLoginAt: null,
  failPwCnt: null,
  quitAt: null,
  quitReason: null,
  maktSmsYn: false,
  maktEmailYn: false,
  sort: null,
  planTypeNm: null
})

// 저장 전 Validation 체크
const saveValidation = () => {
  if (isEmpty(detailParam.value.userName)) {
    alert('회원명을 입력해주세요.', '알림', null, null)
    return false
  } else if (isEmpty(detailParam.value.userBirthDt)) {
    alert('생년월일을 입력해주세요.', '알림', null, null)
    return false
  } else if (isEmpty(detailParam.value.contactNo)) {
    alert('전화번호를 입력해주세요.', '알림', null, null)
    return false
  } else if (isEmpty(detailParam.value.failPwCnt)) {
    alert('로그인 실패 횟수을 입력해주세요.', '알림', null, null)
    return false
  }
  return true
}

// Popup Ref
const termsDetailPopRef = ref(null)
const paidHistoryPopRef = ref(null)
const usePayChangePopRef = ref(null)

/********* Service API *********/
// 회원 상세조회 API 호출
const getMemberDetailApi = () => {
  const param = { userId: pkUserId.value }
  UserService.getUserDetail(param).then((res) => {
    let data = res.data.userInfo
    data.userGender = data.userGender ? data.userGender : ''
    data.maktSmsYn = data.maktSmsYn == 'Y' ? true : false
    data.maktEmailYn = data.maktEmailYn == 'Y' ? true : false
    data.joinedAt = data.joinedAt ? dayjs(data.joinedAt).format('YYYY.MM.DD HH:mm:ss') : ''
    data.lastChangePwAt = data.lastChangePwAt
      ? dayjs(data.lastChangePwAt).format('YYYY.MM.DD HH:mm:ss')
      : ''
    data.planChangePwAt = data.planChangePwAt
      ? dayjs(data.planChangePwAt).format('YYYY.MM.DD HH:mm:ss')
      : ''
    data.lastLoginAt = data.lastLoginAt ? dayjs(data.lastLoginAt).format('YYYY.MM.DD HH:mm:ss') : ''
    detailParam.value = data
    detailParam.value.planTypeNm = res.data.paidInfoList[0].planTypeNm
    // 조회한 연계 사업장 목록을 넣는다.
    businessGridItems.value = res.data.bizList
    // 조회한 약관 목록을 넣는다.
    termsGridItems.value = res.data.agreeTermsList
    // 조회한 요금제 목록을 넣는다.
    usePayGridItems.value = res.data.paidInfoList
  })
}
// 저장 서비스
const onMemberDetailSaveApi = () => {
  const param = {
    userInfo: {
      userId: pkUserId.value,
      userName: detailParam.value.userName,
      userBirthDt: detailParam.value.userBirthDt,
      contactNo: detailParam.value.contactNo,
      zipCode: detailParam.value.zipCode,
      basicAddr: detailParam.value.basicAddr,
      detailAddr: detailParam.value.detailAddr,
      userGender: detailParam.value.userGender,
      maktSmsYn: detailParam.value.maktSmsYn == true ? 'Y' : 'N',
      maktEmailYn: detailParam.value.maktEmailYn == true ? 'Y' : 'N',
      recommenderId: detailParam.value.recommenderId,
      failPwCnt: detailParam.value.failPwCnt
    }
  }
  UserService.userModify(param).then((res) => {
    let alertMsg = ''
    if (res.data) {
      alertMsg = '저장하였습니다.'
    } else {
      alertMsg = '저장에 실패하였습니다.'
    }
    alert(alertMsg, '저장', { confirmButtonText: '확인' }, () => {
      emit('onSearchDataReload')
    })
  })
}

// 비밀번호 초기화 서비스
const onResetPasswordApi = () => {
  const param = { userId: pkUserId.value }
  UserService.resetUserPassword(param).then((res) => {
    let alertMsg = ''
    if (res.data) {
      alertMsg = '초기화 된 비밀번호를 이메일로 발송하였습니다.'
    } else {
      alertMsg = '비밀번호 초기화 실패하였습니다.'
    }
    alert(alertMsg, alertReset.value.title, { confirmButtonText: '확인' }, () => {})
  })
}

// 강제 회원 탈퇴 서비스
const onForceUserQuitApi = () => {
  const param = { userId: pkUserId.value }
  UserService.removeUser(param).then((res) => {
    let alertMsg = ''
    if (res.data) {
      alertMsg = '탈퇴 처리 하였습니다.'
    } else {
      alertMsg = '탈퇴 처리에 실패하였습니다.'
    }
    alert(alertMsg, alertForceQuit.value.title, { confirmButtonText: '확인' }, () => {})
  })
}
/********* Event Handler *********/
// 화면 닫기
const onCloseModal = () => {
  emit('onSearchDataReload') // 재조회 관련 호출하기.
  memberDetailPopupOpened.value = false
}
/** 버튼 클릭**/
// 저장 클릭 이벤트
const onSaveBtnClick = () => {
  if (saveValidation()) {
    confirm('수정한 정보를 저장하시겠습니까?', '저장', null, (action) => {
      if (action === 'confirm') {
        onMemberDetailSaveApi()
      }
    })
  }
}
// 비밀번화 초기화 클릭 이벤트
const onResetPasswordBtnClick = () => {
  confirm('회원의 비밀번호를 초기화를 하시겠습니까?', '알람', null, (action) => {
    if (action === 'confirm') {
      onResetPasswordApi()
    }
  })
}
// 강제 회원탈퇴 클릭 이벤트
const onForceUserQuitBtnClick = () => {
  confirm('정말로 회원탈퇴 하시겠습니까?', '알람', null, (action) => {
    if (action === 'confirm') {
      onForceUserQuitApi()
    }
  })
}
/** Popup  **/
// 약관 Grid의 약관 명 Click
const onTermsGridCellClick = (event) => {
  if (event.colDef.field === 'termsName') {
    termsDetailPopRef.value.open(event.data.termsDetailId)
  } else {
    //  console.log('~~~~~~ etc Cell Click : ')
  }
}
// 요금제 변경 팝업 호출 Click
const onUsePayChangeBtnClick = () => {
  if (getUsePayGridItems.value.length > 0) {
    usePayChangePopRef.value.open(getUsePayGridItems.value[0])
  }
}
// 결제내역 팝업 호출 Click
const onPaidHistoryBtnClick = () => {
  if (getUsePayGridItems.value.length > 0) {
    const bizId = getUsePayGridItems.value[0].bizId
    paidHistoryPopRef.value.open(bizId)
  }
}
// 재조회 관련 호출하기.
const onClosePopupResearch = () => {
  emit('onSearchDataReload', detailParam.value)
  handleClose()
}
// 닫기 전 스크롤 올리기
const handleClose = () => {
  if (scrollbarRef && scrollbarRef.value) {
    scrollbarRef.value.setScrollTop(0)
  }
  memberDetailPopupOpened.value = false
}

/********* Local Functions *********/
// 넘어온 사용자 설정
const open = (userId) => {
  pkUserId.value = userId
  getMemberDetailApi() // 회원 상세정보 조회
  memberDetailPopupOpened.value = true
}

/********* lifeCycle *********/
// 연계사업장 데이터 그리드
const getBusinessGridItems = computed(() => {
  return businessGridItems.value || []
})
// 이용요금제 데이터 그리드
const getUsePayGridItems = computed(() => {
  return usePayGridItems.value || []
})
// 약관 데이터 그리드
const getTermsGridItems = computed(() => {
  return termsGridItems.value || []
})
// 탈퇴일자 유무
const isQuitUser = computed(() => {
  return detailParam.value.userSts === 'Q' ? true : false
})

// 조회조건 유료타입 목록
const getGenderList = computed(() => {
  return genderList
})
/** 부모 컴포넌트가 자식 컴포넌트(open)에 직접적으로 접근**/
defineExpose({
  open
})
</script>

<style lang="scss" scoped></style>
