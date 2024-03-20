import { get, post, postForm } from '@/config/axios'

export const URL_BANNER_GROUP = 'admin/banner-group'
export const URL_BANNER_GROUP_LIST = URL_BANNER_GROUP + '/list' // 배너그룹관리 목록
export const URL_BANNER_GROUP_DETAIL = URL_BANNER_GROUP + '/detail' // 배너그룹관리 상세정보
export const URL_SAVE_BANNER_GROUP = URL_BANNER_GROUP + '/save' // 배너그룹관리 저장
export const URL_DELETE_BANNER_GROUP_LIST = URL_BANNER_GROUP + '/delete' // 배너그룹관리 삭제

export const URL_BANNER_IMAGE = 'admin/banner-image'
export const URL_BANNER_IMAGE_LIST = URL_BANNER_IMAGE + '/list' // 배너이미지관리 목록
export const URL_BANNER_IMAGE_DETAIL = URL_BANNER_IMAGE + '/detail' // 배너이미지관리 상세정보
export const URL_SAVE_BANNER_IMAGE = URL_BANNER_IMAGE + '/save' // 배너이미지관리 저장
export const URL_DELETE_BANNER_IMAGE_LIST = URL_BANNER_IMAGE + '/delete' // 배너이미지관리 삭제
export const URL_BANNER_IMAGE_SELECT_LIST = URL_BANNER_IMAGE + '/select-list' // 배너이미지관리 목록

export const URL_BANNER_LOGIN_IMAGE = 'admin/banner-login-image'
export const URL_BANNER_IMAGE_LOGIN_LIST = URL_BANNER_LOGIN_IMAGE + '/list' // 배너로그인이미지 관리 목록
export const URL_BANNER_IMAGE_LOGIN_DETAIL = URL_BANNER_LOGIN_IMAGE + '/detail' // 배너 로그인이미지 상세정보
export const URL_SAVE_IMAGE_LOGIN = URL_BANNER_LOGIN_IMAGE + '/save'
export const URL_DELETE_BANNER_LOGIN_IMAGE_LIST = URL_BANNER_LOGIN_IMAGE + '/delete'
export const URL_BANNER_IMAGE_LOGIN_GET_LIST = URL_BANNER_LOGIN_IMAGE + '/getLoginBanner'

const getBannerGroupList = (param) => post(URL_BANNER_GROUP_LIST, param)
const getBannerGroupDetail = (param) => get(URL_BANNER_GROUP_DETAIL, param)
const saveBannerGroup = (param) => post(URL_SAVE_BANNER_GROUP, param)
const deleteBannerGroupList = (param) => post(URL_DELETE_BANNER_GROUP_LIST, param)

const getBannerImageList = (param) => post(URL_BANNER_IMAGE_LIST, param)
const getBannerImageDetail = (param) => get(URL_BANNER_IMAGE_DETAIL, param)
const saveBannerImage = (param, config) => postForm(URL_SAVE_BANNER_IMAGE, param, config)
const deleteBannerImageList = (param) => post(URL_DELETE_BANNER_IMAGE_LIST, param)
const getBannerImageSelectList = (param) => get(URL_BANNER_IMAGE_SELECT_LIST, param)

const getBannerLoginImageList = (param) => post(URL_BANNER_IMAGE_LOGIN_LIST, param)
const getBannerLoginImageDetail = (param) => get(URL_BANNER_IMAGE_LOGIN_DETAIL, param)
const saveBannerLoginImage = (param) => post(URL_SAVE_IMAGE_LOGIN, param)
const deleteBannerLoginImageList = (param) => post(URL_DELETE_BANNER_LOGIN_IMAGE_LIST, param)
const getBannerLoginList = () => get(URL_BANNER_IMAGE_LOGIN_GET_LIST)

const BannerService = {
  getBannerLoginImageList,
  getBannerLoginImageDetail,
  saveBannerLoginImage,
  deleteBannerLoginImageList,
  getBannerLoginList,
  getBannerGroupList,
  getBannerGroupDetail,
  saveBannerGroup,
  getBannerImageList,
  getBannerImageDetail,
  saveBannerImage,
  deleteBannerImageList,
  getBannerImageSelectList,
  deleteBannerGroupList
}
export default BannerService
