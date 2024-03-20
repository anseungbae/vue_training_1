import { get, post } from '@/config/axios'

export const URL_LOGIN = '/auth/login'
export const URL_LOGOUT = '/auth/logout'
export const URL_USER = '/auth/user'
export const URL_ADD_INFORMATION = '/question/optionlist/joinRoute' // 회원 가입 경로 목록 서비스
export const URL_REQUEST_EMAIL_AUTH = '/auth/sendVerificationCode' // 이메일 인증 요청 서비스
export const URL_CONFIRM_EMAIL_AUTH = '/auth/confirmVerificationCode' // 이메일 인증 확인 서비스
export const URL_REGISTER = '/auth/register' // 회원 가입 서비스
export const URL_REFRESH = '/auth/refresh' // 토큰 갱신 서비스
export const URL_USERS_PROFILE = '/users/profile' // User 정보 가져오기
export const URL_MODIFY = '/users/modify' //User 정보 수정
export const URL_CHANGE_PASSWORD = '/auth/change-password' //  비밀번호 변경 서비스
export const URL_FORGOT_PASSWORD = '/auth/forgot-password' //  비밀번호 잊어버림
export const URL_FIND_USER_ID_BY_BIZ_NO = '/auth/findUserIdByBizNo' //
export const URL_FIND_USER_ID_BY_NM_TEL_NO = '/auth/findUserIdByNmTelNo' //
export const URL_GET_BIZ_STATUS = '/auth/getBizStatus' //사업자 등록번호로 국세청 사업자 찾기
export const URL_GET_TERMS_LIST = '/auth/terms/list' //Terms 목록 가져오기

const login = (data: any) => post(URL_LOGIN, data)
const logout = () => get(URL_LOGOUT)
const user = () => get(URL_USER)
const registerAddInformation = () => get(URL_ADD_INFORMATION)
const requestEmailAuth = (data: any) => post(URL_REQUEST_EMAIL_AUTH, data)
const confirmEmailAuth = (data: any) => post(URL_CONFIRM_EMAIL_AUTH, data)
const register = (data: any) => post(URL_REGISTER, data)
const refresh = () => get(URL_REFRESH)
const usersProfile = () => get(URL_USERS_PROFILE)
const modify = (data: any) => post(URL_MODIFY, data)
const changePassword = (data: any) => post(URL_CHANGE_PASSWORD, data)
const forgotPassword = (data: any) => post(URL_FORGOT_PASSWORD, data)
const findUserIdByBizNo = (data: any) => get(URL_FIND_USER_ID_BY_BIZ_NO, data)
const findUserIdByNmTelNo = (data: any) => get(URL_FIND_USER_ID_BY_NM_TEL_NO, data)
const getBizStatus = (data: any) => post(URL_GET_BIZ_STATUS, data)
const getTermsList = () => get(URL_GET_TERMS_LIST)

const authService = {
  login,
  logout,
  user,
  requestEmailAuth,
  confirmEmailAuth,
  registerAddInformation,
  register,
  refresh,
  usersProfile,
  modify,
  changePassword,
  forgotPassword,
  findUserIdByBizNo,
  findUserIdByNmTelNo,
  getBizStatus,
  getTermsList
}

export default authService
