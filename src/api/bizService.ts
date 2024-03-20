import { get, post } from '@/config/axios'

export const URL_BIZ = 'admin/biz'
export const URL_BIZ_LIST = URL_BIZ + '/list' // 사업장 목록
export const URL_BIZ_DETAIL = URL_BIZ + '/detail' // 사업장 상세 정보(전체다, 약관, 사용자 등)
export const URL_BIZ_DETAIL_INFO = URL_BIZ + '/detail-info' // 사업장 상세 정보(순수 사업장 상세정보만)
export const URL_BIZ_USER_LIST = URL_BIZ + '/user-list' // 사업장에 대한 User 목록 가져오기
export const URL_SAVE_BIZ_INFO = URL_BIZ + '/save-info' // 사업장 상세 정보 저장
export const URL_CHANGE_BIZ_APPROVAL_STS_START = URL_BIZ + '/change-approval-sts-start' // 승인시작으로 승인상태 변경.
export const URL_CHANGE_BIZ_APPROVAL_STS_FINISH = URL_BIZ + '/change-approval-sts-finish' // 승인완료로 승인상태 변경.
export const URL_CHANGE_BIZ_USE_STS_LOCK = URL_BIZ + '/change-use-sts-lock' // 사용여부를 사용중지로 변경.
export const URL_CHANGE_BIZ_USE_STS_LOCK_CLEAR = URL_BIZ + '/change-use-sts-lock-clear' // 사용여부를 사용중지 해제한다.
export const URL_BIZ_QUIT = URL_BIZ + '/quit' // 사업장 탈퇴를 한다.
export const URL_CHECK_BIZ_QUIT = URL_BIZ + '/check-quit' // 사업장 탈퇴 가능한지 체크를 한다.
export const URL_BIZ_LEVEL_LIST = URL_BIZ + '/biz-level-list' // 사업장 등급 목록 가져오기.
export const URL_BIZ_ROLE_LIST = URL_BIZ + '/role-list' //  사업장 권한 목록 가져오기.
export const URL_SEND_MSG = URL_BIZ + '/send-message' // 카카오 알림톡 보내기
export const URL_PAID_HISTORY = URL_BIZ + '/paid-history' // 결제 내역 조회
export const URL_PLAN_CHANGE = URL_BIZ + '/bizplan-change' // 요금제 변경
export const URL_RATE_PLAN_LIST = URL_BIZ + '/rate-plan-list' // 사업장 등급 목록 가져오기.

const getBizList = (param) => post(URL_BIZ_LIST, param)
const getBizDetail = (param) => get(URL_BIZ_DETAIL, param)
const getBizDetailInfo = (param) => get(URL_BIZ_DETAIL_INFO, param)
const getBizUserList = (param) => get(URL_BIZ_USER_LIST, param)
const saveBizInfo = (param) => post(URL_SAVE_BIZ_INFO, param)
const changeBizApprovalStsStart = (param) => post(URL_CHANGE_BIZ_APPROVAL_STS_START, param)
const changeBizApprovalStsFinish = (param) => post(URL_CHANGE_BIZ_APPROVAL_STS_FINISH, param)
const changeBizUseStsLock = (param) => post(URL_CHANGE_BIZ_USE_STS_LOCK, param)
const changeBizUseStsLockClear = (param) => post(URL_CHANGE_BIZ_USE_STS_LOCK_CLEAR, param)
const bizQuit = (param) => post(URL_BIZ_QUIT, param)
const checkBizQuit = (param) => get(URL_CHECK_BIZ_QUIT, param)
const getBizLevelList = () => get(URL_BIZ_LEVEL_LIST)
const getBizRoleList = (param) => post(URL_BIZ_ROLE_LIST, param)
const sendMessage = (param) => post(URL_SEND_MSG, param)
const getPaidHistory = (param) => get(URL_PAID_HISTORY, param)
const updateBizPlan = (param) => post(URL_PLAN_CHANGE, param)
const getRatePlanList = () => get(URL_RATE_PLAN_LIST)

const BizService = {
  getBizList,
  getBizDetail,
  getBizDetailInfo,
  getBizUserList,
  saveBizInfo,
  changeBizApprovalStsStart,
  changeBizApprovalStsFinish,
  changeBizUseStsLock,
  changeBizUseStsLockClear,
  bizQuit,
  checkBizQuit,
  getBizLevelList,
  getBizRoleList,
  sendMessage,
  getPaidHistory,
  updateBizPlan,
  getRatePlanList
}

export default BizService
