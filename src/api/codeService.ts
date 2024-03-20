import { get, post } from '@/config/axios'

export const URL_CODE = 'admin/common/code'
export const URL_CODE_LIST = URL_CODE + '/list' // 공통코드 목록 가져오기.
export const URL_CODE_DETAIL = URL_CODE + '/detail' // 공통코드 상세 등록하기.
export const URL_CODE_SAVE = URL_CODE + '/save' // 공통코드 저장하기.
export const URL_CODE_DELETE = URL_CODE + '/delete' // 공통코드 삭제하기.

export const URL_CODE_LIST_BY_PCODE = (pCode) => {
  return URL_CODE + '/' + pCode + '/list'
} //  pCode에 해당하는 코드 목록 가져오기

const getCodeList = (param) => post(URL_CODE_LIST, param)
const getCodeDetail = (param) => get(URL_CODE_DETAIL, param)
const saveCode = (param) => post(URL_CODE_SAVE, param)
const deleteCodeList = (param) => post(URL_CODE_DELETE, param)
const getCodeListByPCode = (pCode) => get(URL_CODE_LIST_BY_PCODE(pCode), null)

const CodeService = {
  getCodeList,
  getCodeDetail,
  saveCode,
  deleteCodeList,
  getCodeListByPCode
}

export default CodeService
