import { get, post } from '@/config/axios'

export const URL_POPUP = 'admin/popup'
export const URL_POPUP_LIST = URL_POPUP + '/list' // 팝업관리 목록
export const URL_POPUP_DETAIL = URL_POPUP + '/detail' // 팝업관리 상세정보
export const URL_SAVE_POPUP = URL_POPUP + '/save' // 팝업관리 저장
export const URL_DELETE_POPUP_LIST = URL_POPUP + '/delete' // 팝업관리 삭제

const getPopupList = (param) => post(URL_POPUP_LIST, param)
const getPopupDetail = (param) => get(URL_POPUP_DETAIL, param)
const savePopup = (param, config) => post(URL_SAVE_POPUP, param, config)
const deletePopupList = (param) => post(URL_DELETE_POPUP_LIST, param)

const PopupService = {
  getPopupList,
  getPopupDetail,
  savePopup,
  deletePopupList
}
export default PopupService
