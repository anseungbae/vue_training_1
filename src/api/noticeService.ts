import { get, post } from '@/config/axios'

export const URL_NOTICE = 'admin/notice'
export const URL_NOTICE_LIST = URL_NOTICE + '/list' // 공지사항 목록
export const URL_NOTICE_DETAIL = URL_NOTICE + '/detail' // 공지사항 상세정보
export const URL_SAVE_NOTICE = URL_NOTICE + '/save' // 공지사항 저장
export const URL_DELETE_NOTICE_LIST = URL_NOTICE + '/delete' // 공지사항 목록 삭제

const getNoticeList = (param) => post(URL_NOTICE_LIST, param)
const getNoticeDetail = (param) => get(URL_NOTICE_DETAIL, param)
const saveNotice = (param, config) => post(URL_SAVE_NOTICE, param, config)
const deleteNoticeList = (param) => post(URL_DELETE_NOTICE_LIST, param)

const NoticeService = {
  getNoticeList,
  getNoticeDetail,
  saveNotice,
  deleteNoticeList
}

export default NoticeService
