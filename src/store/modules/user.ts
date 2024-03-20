import { defineStore } from 'pinia'
import { store } from '../index'

import { ElMessageBox } from 'element-plus'

import { useTagsViewStore } from './tagsView'
import router from '@/router'
import type { UserLoginType, UserType } from '@/api/login/types'
import AuthService from '@/api/authService.ts'

interface UserState {
  userInfo?: UserType
  tokenKey: string
  token: string
  refreshToken: string
  roleRouters?: string[] | AppCustomRouteRecordRaw[]
  rememberMe: boolean
  loginInfo?: UserLoginType
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: undefined,
      tokenKey: 'Authorization',
      token: '',
      refreshToken: '',
      roleRouters: undefined,
      rememberMe: true,
      loginInfo: undefined,
      isLoggedIn: false
    }
  },
  getters: {
    getTokenKey(): string {
      return this.tokenKey
    },
    getToken(): string {
      return this.token
    },
    getRefreshToken(): string {
      return this.refreshToken
    },
    getUserInfo(): UserType | undefined {
      return this.userInfo
    },
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters
    },
    getRememberMe(): boolean {
      return this.rememberMe
    },
    getLoginInfo(): UserLoginType | undefined {
      return this.loginInfo
    },
    getIsLoggedIn(): boolean {
      return this.isLoggedIn
    }
  },
  actions: {
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey
    },
    setToken(token: string) {
      this.token = token
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
    },
    setUserInfo(userInfo?: UserType) {
      this.userInfo = userInfo
    },
    setIsLoggedIn(isLoggedIn: boolean) {
      this.isLoggedIn = isLoggedIn
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },
    logoutConfirm() {
      // const { t } = useI18n()
      ElMessageBox.confirm('Exit the system?', 'Reminder', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          AuthService.logout().then((res) => {
            if (res) {
              this.logout()
            }
          })
        })
        .catch(() => {})
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setToken('')
      this.setRefreshToken('')
      this.setUserInfo(undefined)
      this.setIsLoggedIn(false)
    },
    logout() {
      this.reset()
      router.replace('/login')
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },
    setLoginInfo(loginInfo: UserLoginType | undefined) {
      this.loginInfo = loginInfo
    }
  },
  persist: true
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
