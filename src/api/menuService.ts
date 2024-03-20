import { get, post } from '@/config/axios'

export const MENU = 'admin/menu'
export const MENU_LIST_ALL = MENU + '/all' // 전체 메뉴 목록
export const MENU_SAVE_INFO = MENU + '/save-info' // 메뉴 정보 저장하기
export const MENU_SAVE_LIST_ALL = MENU + '/save-list-all' // 메뉴 보고있는 메뉴 목록 전체 저장하기.(위험하니 가급적 아래 saveMenuList를 쓰길 바람)
export const MENU_SAVE_LIST = MENU + '/save-list' // 메뉴 목록 추가, 수정, 삭제 목록 각각 저장하기.
export const PAGE = 'admin/page'
export const PAGE_LIST_ALL = PAGE + '/all' // 전체 페이지 목록
export const PAGE_SAVE_ALL = PAGE + '/save-all-list' // DELETE 후 목록 새로 저장
export const PAGE_SAVE_LIST = PAGE + '/save-list' // 추가, 수정, 삭제

const getMenuListAll = () => get(MENU_LIST_ALL)
const setMenuSaveInfo = (param) => post(MENU_SAVE_INFO, param)
const setMenuSaveListAll = (param) => post(MENU_SAVE_LIST_ALL, param)
const setMenuSaveList = (param) => post(MENU_SAVE_LIST, param)
const getPageListAll = () => get(PAGE_LIST_ALL)
const setPageSaveAll = (param) => post(PAGE_SAVE_ALL, param)
const setPageSaveList = (param) => post(PAGE_SAVE_LIST, param)

const MenuService = {
  getMenuListAll,
  setMenuSaveInfo,
  setMenuSaveListAll,
  setMenuSaveList,
  getPageListAll,
  setPageSaveAll,
  setPageSaveList
}

export default MenuService
