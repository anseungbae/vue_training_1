import { get, post } from '@/config/axios'

/** 접근권한 URL **/
export const URL_ACCESS_ROLE = 'admin/access-right'
export const URL_ACCESS_ROLE_LIST = URL_ACCESS_ROLE + '/list' //  접근권한 목록 가져오기.
export const URL_ACCESS_ROLE_MENU_MAP = URL_ACCESS_ROLE + '/menu-map' //  접근권한에 대한 메뉴 Map 목록 가져오기.
export const URL_ACCESS_ROLE_USE_MENU_MAP = URL_ACCESS_ROLE + '/use-menu-map' //  접근권한에 대한 메뉴 Map 목록 가져오기.(사용여부가 'Y' 인것만)
export const URL_SAVE_ACCESS_ROLE_LIST = URL_ACCESS_ROLE + '/save-list' //  접근권한 목록 저장하기.
export const URL_SAVE_ACCESS_ROLE_MENU_MAP = URL_ACCESS_ROLE + '/save-menu-map-list' //  접근권한에 대한 메뉴 Map 정보 저장하기.

/** 기능권한 URL **/
export const URL_FUNCTION_ROLE = 'admin/function-right'
export const URL_FUNCTION_ROLE_LIST = URL_FUNCTION_ROLE + '/list' //  기능권한 목록 가져오기
export const URL_SAVE_FUNCTION_ROLE_LIST = URL_FUNCTION_ROLE + '/save' //  기능권한 목록 저장하기.
export const URL_FUNCTION_DETAIL_LIST = URL_FUNCTION_ROLE + '/detail-unpivot' //  기능권한 상세의 기능을 목록 형태로 가져온다.

/** 등급권한 URL **/
export const URL_LEVEL_ROLE = 'admin/level-right'
export const URL_LEVEL_ROLE_LIST = URL_LEVEL_ROLE + '/list' //  등급권한 목록 가져오기
export const URL_SAVE_LEVEL_ROLE_LIST = URL_LEVEL_ROLE + '/save' //  등급권한 목록 저장하기

/** 권한 URL **/
export const URL_ROLE = 'admin/role'
export const URL_CHANGE_ACCESS_FUNCTION_ROLE = URL_ROLE + '/change-access-function' //  사업장권한 상세에서 접근권한, 기능권한 변경하기.
export const URL_BIZ_ROLE_MENU_FUNCTION_LIST = URL_ROLE + '/role-menu-func-list' //  역할 별 접근 & 기능 권한 목록 가져오기.
export const URL_SAVE_BIZ_ROLE_MENU_FUNCTION_LIST = URL_ROLE + '/role-menu-func-list/save' //  역할 별 접근 & 기능 권한 목록 저장하기.
export const URL_BIZ_USER_MENU_FUNCTION_LIST = URL_ROLE + '/user-menu-func-list' //  회원 별 접근 & 기능 권한 목록 가져오기.
export const URL_SAVE_BIZ_USER_MENU_FUNCTION_LIST = URL_ROLE + '/user-menu-func-list/save' //  회원 별 접근 & 기능 권한 목록 저장하기.

const getAccessRoleList = () => get(URL_ACCESS_ROLE_LIST)
const getAccessRoleMenuMap = (param) => get(URL_ACCESS_ROLE_MENU_MAP, param)
const getAccessRoleUseMenuMap = (param) => get(URL_ACCESS_ROLE_USE_MENU_MAP, param)
const saveAccessRoleList = (param) => post(URL_SAVE_ACCESS_ROLE_LIST, param)
const saveAccessRoleMenuMap = (param) => post(URL_SAVE_ACCESS_ROLE_MENU_MAP, param)
const getFunctionRoleList = () => get(URL_FUNCTION_ROLE_LIST)
const saveFunctionRoleList = (param) => post(URL_SAVE_FUNCTION_ROLE_LIST, param)
const getFunctionDetailList = (param) => get(URL_FUNCTION_DETAIL_LIST, param)
const getLevelRightList = (param) => post(URL_LEVEL_ROLE_LIST, param)
const saveLevelRightList = (param) => post(URL_SAVE_LEVEL_ROLE_LIST, param)
const changeAccessFunctionRight = (param) => post(URL_CHANGE_ACCESS_FUNCTION_ROLE, param)
const getBizRoleMenuFunctionList = (param) => post(URL_BIZ_ROLE_MENU_FUNCTION_LIST, param)
const saveBizRoleMenuFunctionList = (param) => post(URL_SAVE_BIZ_ROLE_MENU_FUNCTION_LIST, param)
const getBizUserMenuFunctionList = (param) => post(URL_BIZ_USER_MENU_FUNCTION_LIST, param)
const saveBizUserMenuFunctionList = (param) => post(URL_SAVE_BIZ_USER_MENU_FUNCTION_LIST, param)

const RoleService = {
  getAccessRoleList,
  getAccessRoleMenuMap,
  getAccessRoleUseMenuMap,
  saveAccessRoleList,
  saveAccessRoleMenuMap,
  getFunctionRoleList,
  saveFunctionRoleList,
  getFunctionDetailList,
  getLevelRightList,
  saveLevelRightList,
  changeAccessFunctionRight,
  getBizRoleMenuFunctionList,
  saveBizRoleMenuFunctionList,
  getBizUserMenuFunctionList,
  saveBizUserMenuFunctionList
}
export default RoleService
