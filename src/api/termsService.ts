import { get, post } from '@/config/axios'

export const URL_TERMS = 'admin/terms'
export const URL_TERMS_DETAIL = URL_TERMS + '/termsDetail' // 약관 상세 정보 가져오기.
export const URL_TERMS_LIST = URL_TERMS + '/list' // 약관 목록 가져오기.
export const URL_CREATE_TERMS = URL_TERMS + '/create' // 약관 등록하기.
export const URL_MODIFY_TERMS = URL_TERMS + '/modify' // 약관 등록하기.
export const URL_TERMS_INFO = URL_TERMS + '/terms-info' // 약관 Version Up 정보 가져오기
export const URL_VERSION_UP_TERMS = URL_TERMS + '/version-up' // 약관 Version Up 하기

const getTermsDetail = (param) => get(URL_TERMS_DETAIL, param)
const getTermsList = (param) => post(URL_TERMS_LIST, param)
const createTerms = (param) => post(URL_CREATE_TERMS, param)
const modifyTerms = (param) => post(URL_MODIFY_TERMS, param)
const getTermsInfo = (param) => get(URL_TERMS_INFO, param)
const versionUpTerms = (param) => post(URL_VERSION_UP_TERMS, param)

const TermsService = {
  getTermsDetail,
  getTermsList,
  createTerms,
  modifyTerms,
  getTermsInfo,
  versionUpTerms
}

export default TermsService
