/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs'
import { dateToString } from './gridFormatter'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'
const day = dayjs(new Date())
export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format)
}

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format)
}
export function toDay(day?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(day).format('YYYY.MM.DD')
}
export function fromDay(day?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(day).add(+1, 'month').format('YYYY.MM.DD')
}

export const dateUtil = dayjs
