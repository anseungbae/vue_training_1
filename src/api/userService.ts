import { get, post } from '@/config/axios'

export const URL_USER = 'admin/users'
export const URL_USER_LIST = URL_USER + '/list' // 회원 목록
export const URL_USER_DETAIL = URL_USER + '/user-detail' // 회원 상세

export const URL_USER_LIST_OLD = URL_USER + '/list-old' // 회원 목록-old
export const URL_USER_DETAIL_OLD = URL_USER + '/user-detail-old' // 회원 상세-old
export const URL_USER_REST_LOCK_CLEAR = URL_USER + '/lock-clear' // 회원 휴면/잠금 해제 처리.
export const URL_USER_USE_STOP = URL_USER + '/use-stop' // 회원 사용중지 처리.
export const URL_USER_USE_STOP_CLEAR = URL_USER + '/use-stop-clear' // 회원 사용중지 해제 처리.
export const URL_RESET_USER_PASSWORD = URL_USER + '/user-reset-password' //  회원 비밀번호 초기화
export const URL_USER_UPDATE = URL_USER + '/user-payment-change'
export const URL_USER_HISTORY = URL_USER + '/paid-user-history'
export const URL_USER_MODIFY = URL_USER + '/modify' // 회원 정보 저장
export const URL_SAVE_USER_ROLE = URL_USER + '/save-user-role' //  회원 RoleId 정보 저장하기.
export const URL_USER_OUT = URL_USER + '/user-out' //  사업장에서 회원 내보내기.
export const URL_REST_USER = 'admin/rest-users'
export const URL_REST_USER_LIST = URL_REST_USER + '/list' // 휴면예정/휴면 회원 목록
export const URL_REST_USER_CLEAR = URL_REST_USER + '/rest-clear' // 휴면예정/휴면 회원 휴면 해제
export const URL_REST_USER_SMS_SEND = URL_REST_USER + '/sms-send' // 휴면예정/휴면 회원 SMS 발송
export const URL_REST_USER_MAIL_SEND = URL_REST_USER + '/mail-send' // 휴면예정/휴면 회원 MAIL 발송
export const URL_QUIT_USER = 'admin/quit-users'
export const URL_QUIT_USER_LIST = URL_QUIT_USER + '/list' // 탈퇴회원 목록
export const URL_USER_QUIT_CHECK = URL_QUIT_USER + '/quit-check' // 회원 탈퇴가 가능한지 체크를 한다.
export const URL_CHANGE_USER_STS_QUIT = URL_QUIT_USER + '/quit' // 회원 탈퇴처리하기.
export const URL_USER_REMOVE = URL_QUIT_USER + '/remove' // 회원 강제 탈퇴처리.
export const URL_USER_MULTIPLE_REMOVE = URL_QUIT_USER + '/multiple-remove'
export const URL_VENDOR = 'admin/vendor'
export const URL_VENDOR_DELETE = URL_VENDOR + '/delete'
export const URL_VENDOR_MULTIPLE_DELETE = URL_VENDOR + '/multiple-delete' // 연동 해제

const getUserList = (param: any) => post(URL_USER_LIST, param)
const getUserDetail = (param: any) => get(URL_USER_DETAIL, param)

const getUserListOld = (param: any) => post(URL_USER_LIST_OLD, param)
const getUserDetailOld = (param: any) => get(URL_USER_DETAIL_OLD, param)
const execUserRestLockClear = (param: any) => post(URL_USER_REST_LOCK_CLEAR, param)
const execUserUseStop = (param: any) => post(URL_USER_USE_STOP, param)
const execUserUseStopClear = (param: any) => post(URL_USER_USE_STOP_CLEAR, param)
const resetUserPassword = (param: any) => get(URL_RESET_USER_PASSWORD, param)
const updateUserPaid = (param: any) => post(URL_USER_UPDATE, param)
const getUserPaidHistory = (param: any) => get(URL_USER_HISTORY + param)
const userModify = (param: any) => post(URL_USER_MODIFY, param)
const saveUserRole = (param: any) => post(URL_SAVE_USER_ROLE, param)
const userOut = (param: any) => post(URL_USER_OUT, param)
const getRestUserList = (param: any) => post(URL_REST_USER_LIST, param)
const execRestUserClear = (param: any) => post(URL_REST_USER_CLEAR, param)
const sendSmsRestUser = (param: any) => post(URL_REST_USER_SMS_SEND, param)
const sendMailRestUser = (param: any) => post(URL_REST_USER_MAIL_SEND, param)
const getQuitUserList = (param: any) => post(URL_QUIT_USER_LIST, param)
const checkQuitUser = (param: any) => post(URL_USER_QUIT_CHECK, param)
const removeUser = (param: any) => post(URL_USER_REMOVE, param)
const multipleRemoveUser = (param: any) => post(URL_USER_MULTIPLE_REMOVE, param)
const changeUserStsQuit = (param: any) => post(URL_CHANGE_USER_STS_QUIT, param)
const deleteVendor = (param: any) => post(URL_VENDOR_DELETE, param)
const multipleDeleteVendor = (param: any) => post(URL_VENDOR_MULTIPLE_DELETE, param)

const UserService = {
  getUserList,
  getUserDetail,
  execUserRestLockClear,
  execUserUseStop,
  execUserUseStopClear,
  updateUserPaid,
  resetUserPassword,
  userModify,
  saveUserRole,
  userOut,
  getRestUserList,
  execRestUserClear,
  sendSmsRestUser,
  sendMailRestUser,
  getQuitUserList,
  checkQuitUser,
  changeUserStsQuit,
  removeUser,
  multipleRemoveUser,
  getUserPaidHistory,
  getUserListOld,
  getUserDetailOld
}

export const VendorService = {
  deleteVendor,
  multipleDeleteVendor
}

export default UserService
