import dayjs from 'dayjs'
import { isEmpty } from './is'

export const dateToString = (params, format = 'YYYY-MM-DD') => {
  let tmp = ''
  if (isEmpty(params.value) || params.value == '-') {
    tmp = '-'
    return tmp
  } else {
    return dayjs(params.value).format(format)
  }
}

export const DateFormatter = (params: any) => {
  const format = params.colDef.format ? params.colDef.format : 'YYYY.MM.DD'
  return isEmpty(params.value) ? '-' : dayjs(params.value).format(format)
}

export const phoneNoFormatter = (params) => {
  let tmp = ''
  if (params !== null && params.value !== null && params.value.length >= 10) {
    let phoneNumber =
      String(params.value).indexOf('+82') > -1
        ? '0' + String(params.value).substring(3, params.value.length)
        : params.value
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

    if (phoneNumber.length < 4) {
      tmp = '-'
    } else if (phoneNumber.length < 7) {
      tmp += phoneNumber.substring(0, 3)
      tmp += '-'
      tmp += phoneNumber.substring(3)
    } else if (phoneNumber.length == 8) {
      tmp += phoneNumber.substring(0, 4)
      tmp += '-'
      tmp += phoneNumber.substring(4)
    } else if (phoneNumber.length < 10) {
      if (phoneNumber.substring(0, 2) == '02') {
        //02-123-5678
        tmp += phoneNumber.substring(0, 2)
        tmp += '-'
        tmp += phoneNumber.substring(2, 5)
        tmp += '-'
        tmp += phoneNumber.substring(5)
      }
    } else if (phoneNumber.length < 11) {
      if (phoneNumber.substring(0, 2) == '02') {
        //02-1234-5678
        tmp += phoneNumber.substring(0, 2)
        tmp += '-'
        tmp += phoneNumber.substring(2, 6)
        tmp += '-'
        tmp += phoneNumber.substring(6)
      } else {
        //010-123-4567
        tmp += phoneNumber.substring(0, 3)
        tmp += '-'
        tmp += phoneNumber.substring(3, 6)
        tmp += '-'
        tmp += phoneNumber.substring(6)
      }
    } else {
      //010-1234-5678
      tmp += phoneNumber.substring(0, 3)
      tmp += '-'
      tmp += phoneNumber.substring(3, 7)
      tmp += '-'
      tmp += phoneNumber.substring(7)
    }
  } else {
    tmp = '-'
    return tmp
  }
  return tmp
}

export const dateFormatterRemain = (params) => {
  let tmp = '-'
  // if (params.data.endDate) {
  //   const periodMonth = date.getDateDiff(params.data.endDate, params.data.startDate, 'months')
  //   const tempDate =
  //     periodMonth > 0
  //       ? date.subtractFromDate(params.data.endDate, { months: periodMonth })
  //       : params.data.endDate
  //   const periodDay = date.getDateDiff(tempDate, params.data.startDate, 'days')
  //   tmp = `${periodMonth > 0 ? periodMonth + '개월' : ''}${periodDay > 0 ? periodDay + '일' : ''}`
  // }
  return tmp
}

export const marketYnFormatter = (params) => {
  return params.value !== null ? 'Y' : '-'
}
export const etcMarketYnFormatter = (params) => {
  return params.value !== null && params.value !== 'NONE' ? params.value : '-'
}
export const linkStsFormatter = (params) => {
  return params.value === null ? '-' : String(params.value)
}

export const emptyFormatter = (params) => {
  return isEmpty(params.value) ? '-' : params.value
}

export const numberFormatter = (params) => {
  let tmp = ''
  if (params.value !== null) {
    tmp = String(params.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } else {
    tmp = '-'
  }
  return tmp
}
