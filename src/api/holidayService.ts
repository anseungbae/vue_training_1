import { get, post } from '@/config/axios'

export const URL_HOLIDAY = 'admin/holiday-schedule'
export const URL_HOLIDAY_LIST = URL_HOLIDAY + '/list' // 휴무관리 목록
export const URL_POPUP_DETAIL = URL_HOLIDAY + '/detail' // 휴무관리 상세정보
export const URL_HOLIDAY_INSERT = URL_HOLIDAY + '/insert' // 휴무관리 저장
export const URL_HOLIDAY_UPDATE = URL_HOLIDAY + '/update' // 휴무관리 수정
export const URL_HOLIDAY_DELETE = URL_HOLIDAY + '/delete' // 휴무관리 삭제

const getHolidayList = (param) => post(URL_HOLIDAY_LIST, param)
const getHolidayDetail = (param) => get(URL_POPUP_DETAIL, param)
const insertHoliday = (param) => post(URL_HOLIDAY_INSERT, param)
const updateHoliday = (param) => post(URL_HOLIDAY_UPDATE, param)
const deleteHoliday = (param) => post(URL_HOLIDAY_DELETE, param)

const HolidayService = {
  getHolidayList,
  getHolidayDetail,
  insertHoliday,
  updateHoliday,
  deleteHoliday
}
export default HolidayService
