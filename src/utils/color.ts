/**
 * 16진수 색상 값의 여부를 판단합니다.
 * 입력 형식은 #fff000 #f00일 수 있습니다
 *
 * @param String color 16진수 색상 값
 * * @return Boolean
 */
export const isHexColor = (color: string) => {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/
  return reg.test(color)
}

/**
 * RGB 색상 값을 16진수 색상 값으로 변환합니다.
 * r, g, 와 b는 [0, 255] 범위 내에 있어야 함
 *
 * * @return String #ff00ff
 * * @param r
 * * @param g
 * * @param b
 */
export const rgbToHex = (r: number, g: number, b: number) => {
  // // tslint:disable-next-line:no-bitwise
  const hex = ((r << 16) | (g << 8) | b).toString(16)
  return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex
}

/**
 * * HEX 색상을 RGB 표현으로 변환합니다
 * * @param {string} hex 변환할 색
 * * @RGB를 반환합니다. 통과된 색상의 RGB 표현입니다
 */
export const hexToRGB = (hex: string, opacity?: number) => {
  let sHex = hex.toLowerCase()
  if (isHexColor(hex)) {
    if (sHex.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
      }
      sHex = sColorNew
    }
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sHex.slice(i, i + 2)))
    }
    return opacity
      ? 'RGBA(' + sColorChange.join(',') + ',' + opacity + ')'
      : 'RGB(' + sColorChange.join(',') + ')'
  }
  return sHex
}

export const colorIsDark = (color: string) => {
  if (!isHexColor(color)) return
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, '')
    .split(',')
    .map((item: any) => Number(item))
  return r * 0.299 + g * 0.578 + b * 0.114 < 192
}

/**
 * 통과된 비율이 주어지면 HEX 색상을 어둡게 합니다
 * @param {string} 색 처리할 색
 * @param {number}량 색상을 변경할 양은 다음과 같습니다
 * @{string} 처리된 색상의 HEX 표현을 반환합니다
 */
export const darken = (color: string, amount: number) => {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
    color.substring(2, 4),
    amount
  )}${subtractLight(color.substring(4, 6), amount)}`
}

/**
 * 통과된 비율에 따라 6char HEX 색상을 점등합니다
 * @param {string} 색 변경할 색
 * @param {number}량 색상을 변경할 양은 다음과 같습니다
 * @{string} 처리된 색상이 HEX로 표시됩니다
 */
export const lighten = (color: string, amount: number) => {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`
}

/* Sumael porcentaje indicado un color (RR, GGo BB) 16진수 파라칼라로 */
/**
 * 통과된 백분율을 HEX 색상의 R, G 또는 B로 합합니다
 * @param {string} 색 변경할 색
 * @param {number}량 색상을 변경할 양은 다음과 같습니다
 * @{string} 색상의 처리된 부분을 반환합니다
 */
const addLight = (color: string, amount: number) => {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * RGB 색상의 휘도를 계산합니다
 * @param {number} 빨간색
 * @param {number}g 녹색
 * @param {number} b blue
 */
const luminanace = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 * Calculates contrast between two rgb colors
 * @param {string} rgb1 rgb color 1
 * @param {string} rgb2 rgb color 2
 */
const contrast = (rgb1: string[], rgb2: number[]) => {
  return (
    (luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) /
    (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
  )
}

/**
 * 배경과 대비하여 최상의 텍스트 색상(검정 또는 흰색)을 결정합니다
 * @paramhexColor - 사용자가 마지막으로 선택한 색상
 */
export const calculateBestTextColor = (hexColor: string) => {
  const rgbColor = hexToRGB(hexColor.substring(1))
  const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0])

  return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF'
}

/**
 * HEX 색상의 R, G 또는 B에 표시된 백분율을 뺀 값
 * @param {string} 색 변경할 색
 * @param {number}량 색상을 변경할 양은 다음과 같습니다
 * @{string} 색상의 처리된 부분을 반환합니다
 */
const subtractLight = (color: string, amount: number) => {
  const cc = parseInt(color, 16) - amount
  const c = cc < 0 ? 0 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * 두 가지 색상을 혼합합니다.
 *
 * @param {string} color1 - 첫 번째 색상은 '#'으로 시작하는 6자리 16진수 색상 코드여야 합니다.
 * @param {string} color2 - 두 번째 색상은 '#'으로 시작하는 6자리 16진수 색상 코드여야 합니다.
 * @param {number} [weight=0.5] - 혼합물에서 색상 1의 가중치는 0과 1 사이의 숫자여야 하며, 여기서 0은 색상 2의 100%를 나타내고, 1은 색상 1의 100%를 나타냅니다.
 * @{string} '#'으로 시작하는 6자리 16진수 색상 코드인 혼합 색상을 반환합니다.
 */
export const mix = (color1: string, color2: string, weight: number = 0.5): string => {
  let color = '#'
  for (let i = 0; i <= 2; i++) {
    const c1 = parseInt(color1.substring(1 + i * 2, 3 + i * 2), 16)
    const c2 = parseInt(color2.substring(1 + i * 2, 3 + i * 2), 16)
    const c = Math.round(c1 * weight + c2 * (1 - weight))
    color += c.toString(16).padStart(2, '0')
  }
  return color
}
