import { get, post } from '@/config/axios'

export const URL_USER_CS = 'admin/cs-users'
export const URL_USER_CS_LIST = URL_USER_CS + '/list' // 고객 상담내역 목록 가져오기.
export const URL_USER_CS_DETAIL = URL_USER_CS + '/detail' // 고객 상담내역 상세 등록하기.
export const URL_USER_CS_SAVE = URL_USER_CS + '/save' // 고객 상담내역 저장하기.
export const URL_USER_CS_SAVES = URL_USER_CS + '/saves' // 고객 상담내역 저장하기(파일 멀티 업로드).

const getUserCsList = (param) => get(URL_USER_CS_LIST, param)
const getUserCsDetail = (param) => get(URL_USER_CS_DETAIL, param)
const saveUserCsDetail = (param) => post(URL_USER_CS_SAVE, param)
const savesUserCsDetail = (param, config) => post(URL_USER_CS_SAVES, param, config)

const UserCsService = {
  getUserCsList,
  getUserCsDetail,
  saveUserCsDetail,
  savesUserCsDetail
}

export default UserCsService
