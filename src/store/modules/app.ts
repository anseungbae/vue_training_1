import { defineStore } from 'pinia'
import { store } from '@/store'
import { useDark, useCssVar } from '@vueuse/core'
import { humpToUnderline, setCssVar } from '@/utils'
import { colorIsDark, hexToRGB, lighten, mix } from '@/utils/color'
import { type ComponentSize } from 'element-plus'
import { unref } from 'vue'

interface AppState {
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  size: boolean
  locale: boolean
  tagsView: boolean
  tagsViewIcon: boolean
  fixedHeader: boolean
  greyMode: boolean
  dynamicRouter: boolean
  serverDynamicRouter: boolean
  pageLoading: boolean
  title: string
  isDark: boolean
  currentSize: ComponentSize
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  fixedMenu: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      mobile: false, // 모바일
      title: import.meta.env.VITE_APP_TITLE, // 타이틀
      pageLoading: false, // 페이지로딩
      breadcrumb: true, //   페이지 네비
      breadcrumbIcon: true, // 페이지 이동 아이콘
      collapse: false, // 메뉴 접기
      uniqueOpened: false, // 하위메뉴 확장
      hamburger: true, // 접기 아이콘
      screenfull: true, // 전체 화면 아이콘
      size: true, // 크기 아이콘
      locale: true, // 다국어 아이콘
      tagsView: true, // 북마크 페이지
      tagsViewIcon: true, // 라벨 아이콘 표시 여부
      fixedHeader: true, //  toolheader
      footer: true, // 바닥글 표시
      greyMode: false, // 그레이 모드
      dynamicRouter: true, // 동적으로 라우팅할지 여부
      serverDynamicRouter: true, // 서버 측에서 동적 라우팅을 렌더링할지 여부
      fixedMenu: false, // 메뉴 수정 여부
      theme: {
        // 테마색
        elColorPrimary: '#409eff',
        // 왼쪽 메뉴 경계 색상
        leftMenuBorderColor: 'inherit',
        // 왼쪽 메뉴 배경색
        leftMenuBgColor: '#001529',
        // 왼쪽 메뉴의 밝은 배경색
        leftMenuBgLightColor: '#0f2438',
        // 왼쪽 메뉴 배경색 선택
        leftMenuBgActiveColor: '--el-color-primary)',
        // 왼쪽 메뉴 선택 배경색 끄기
        leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
        // 왼쪽 메뉴 글꼴 색상
        leftMenuTextColor: '#bfcbd9',
        // 왼쪽 메뉴에서 글꼴 색상 선택
        leftMenuTextActiveColor: '#fff',
        // 로고 글꼴 색상
        logoTitleTextColor: '#fff',
        // 로고 테두리 색상
        logoBorderColor: 'inherit',
        // Header 배경색
        topHeaderBgColor: '#fff',
        // Header 글자 색상
        topHeaderTextColor: 'inherit',
        // Header Hover 색상
        topHeaderHoverColor: '#f6f6f6',
        // Header Border 색상
        topToolBorderColor: '#eee'
      },
      isDark: false, // 다크모드 여부
      currentSize: 'default'
    }
  },
  getters: {
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    getCollapse(): boolean {
      return this.collapse
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    getHamburger(): boolean {
      return this.hamburger
    },
    getScreenfull(): boolean {
      return this.screenfull
    },
    getSize(): boolean {
      return this.size
    },
    getLocale(): boolean {
      return this.locale
    },
    getTagsView(): boolean {
      return this.tagsView
    },
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    getGreyMode(): boolean {
      return this.greyMode
    },
    getDynamicRouter(): boolean {
      return this.dynamicRouter
    },
    getServerDynamicRouter(): boolean {
      return this.serverDynamicRouter
    },
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    getPageLoading(): boolean {
      return this.pageLoading
    },

    getTitle(): string {
      return this.title
    },
    getIsDark(): boolean {
      return this.isDark
    },
    getCurrentSize(): ComponentSize {
      return this.currentSize
    },

    getFooter(): boolean {
      return this.footer
    }
  },
  actions: {
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb
    },
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened
    },
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger
    },
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull
    },
    setSize(size: boolean) {
      this.size = size
    },
    setLocale(locale: boolean) {
      this.locale = locale
    },
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon
    },
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    setDynamicRouter(dynamicRouter: boolean) {
      this.dynamicRouter = dynamicRouter
    },
    setServerDynamicRouter(serverDynamicRouter: boolean) {
      this.serverDynamicRouter = serverDynamicRouter
    },
    setFixedMenu(fixedMenu: boolean) {
      this.fixedMenu = fixedMenu
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },

    setTitle(title: string) {
      this.title = title
    },

    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      this.setPrimaryLight()
    },
    setTheme(theme: ThemeTypes) {
      this.theme = Object.assign(this.theme, theme)
    },
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key as keyof ThemeTypes])
      }
      this.setPrimaryLight()
    },
    setPrimaryLight() {
      if (this.theme.elColorPrimary) {
        const elColorPrimary = this.theme.elColorPrimary
        const color = this.isDark ? '#000000' : '#ffffff'
        const lightList = [3, 5, 7, 8, 9]
        lightList.forEach((v) => {
          setCssVar(`--el-color-primary-light-${v}`, mix(color, elColorPrimary, v / 10))
        })
        setCssVar(`--el-color-primary-dark-2`, mix(color, elColorPrimary, 0.2))
      }
    },
    setMenuTheme(color: string) {
      const primaryColor = useCssVar('--el-color-primary', document.documentElement)
      const isDarkColor = colorIsDark(color)
      const theme: Recordable = {
        // 왼쪽 메뉴 Border 색상
        leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
        // 왼쪽 메뉴 배경 색상
        leftMenuBgColor: color,
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
        // 왼쪽 메뉴의 밝은 배경색
        leftMenuBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor), 0.1),
        // 왼쪽 메뉴 선택 배경색 끄기
        leftMenuCollapseBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor), 0.1),
        // 왼쪽 메뉴 글꼴 색상
        leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
        // 왼쪽 메뉴에서 글꼴 색상 선택
        leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
        // 로고 글꼴 색상
        logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
        // 로고 Border 색상
        logoBorderColor: isDarkColor ? color : '#eee'
      }
      this.setTheme(theme)
      this.setCssVarTheme()
    },
    setHeaderTheme(color: string) {
      const isDarkColor = colorIsDark(color)
      const textColor = isDarkColor ? '#fff' : 'inherit'
      const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
      const topToolBorderColor = isDarkColor ? color : '#eee'
      setCssVar('--top-header-bg-color', color)
      setCssVar('--top-header-text-color', textColor)
      setCssVar('--top-header-hover-color', textHoverColor)
      this.setTheme({
        topHeaderBgColor: color,
        topHeaderTextColor: textColor,
        topHeaderHoverColor: textHoverColor,
        topToolBorderColor
      })
    },

    setCurrentSize(currentSize: ComponentSize) {
      this.currentSize = currentSize
    },

    setMobile(mobile: boolean) {
      this.mobile = mobile
    },

    setFooter(footer: boolean) {
      this.footer = footer
    },

    initTheme() {
      const isDark = useDark({
        valueDark: 'dark',
        valueLight: 'light'
      })
      isDark.value = this.getIsDark
    }
  },
  persist: true
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
