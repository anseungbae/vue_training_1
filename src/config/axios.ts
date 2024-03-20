import axios, { type AxiosInstance } from 'axios'
// import { getRefreshToken, getToken, removeToken, setToken } from '@/helpers/authHelper.js'
import AuthService, { URL_LOGOUT, URL_REFRESH } from '@/api/authService'
import type { App } from 'vue'
import router from '@/router'
import { useUserStoreWithOut } from '@/store/modules/user'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

// apply base url for axios
const API_URL = import.meta.env.VITE_API_URL

let isAlreadyFetchingAccessToken = false
let subscribers: any[] = []

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000
  // withCredentials: true,
})

// axios.defaults.withCredentials = true;
instance.interceptors.request.use(async (config) => {
  const userStore = useUserStoreWithOut()
  const token = userStore.getToken
  if (token) {
    config.headers.Authorization = token
  }
  //  임시로 Access Token 다시 가져오는 서비스 호출 할 경우 Refresh Token 값 넣기.
  if (config.url === URL_REFRESH || config.url === URL_LOGOUT) {
    config.headers.RefreshAuthorization = userStore.getRefreshToken
  }

  // console.log('~~~~~~~~~~~~~~~~~~~~~~~ token : ', token)
  // console.log('~~~~~~~~~~~~~~~~~~~~~~~ userStore.getRefreshToken : ', userStore.getRefreshToken)

  return config
})

instance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error?.response?.status) {
      const {
        response: { status }
      } = error
      if (status === 401) {
        const userStore = useUserStoreWithOut()
        if (error.response.data.message === 'TokenExpiredError') {
          return await resetTokenAndReattemptRequest(error, userStore)
        }
        if (error.response.data.message === 'JsonWebTokenError') {
          userStore.reset()
          window.location.reload()
        } else if (error.response.data.message === 'Unauthorized') {
          // 권한없음
          userStore.logout()
        }
      }
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    error.message = message
    return Promise.reject(error)
  }
)

async function resetTokenAndReattemptRequest(error: any, store: any) {
  try {
    const { response: errorResponse } = error

    // subscribers에 access token을 받은 이후 재요청할 함수 추가 (401로 실패했던)
    // retryOriginalRequest는 pending 상태로 있다가
    // access token을 받은 이후 onAccessTokenFetched가 호출될 때
    // access token을 넘겨 다시 axios로 요청하고
    // 결과값을 처음 요청했던 promise의 resolve로 settle시킨다.
    const retryOriginalRequest = new Promise((resolve, reject) => {
      addSubscriber(async (accessToken: string) => {
        try {
          errorResponse.config.headers.Authorization = accessToken
          resolve(instance(errorResponse.config))
        } catch (err) {
          reject(err)
        }
      })
    })

    // refresh token을 이용해서 access token 요청
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true // 문닫기 (한 번만 요청)

      const { data } = await AuthService.refresh()
      // 새로운 토큰 저장
      const newAccessToken = data.accessToken
      store.setToken(newAccessToken)

      isAlreadyFetchingAccessToken = false // 문열기 (초기화)

      onAccessTokenFetched(data.access)
    }

    return retryOriginalRequest // pending 됐다가 onAccessTokenFetched가 호출될 때 resolve
  } catch (error) {
    return Promise.reject(error)
  }
}
function addSubscriber(callback: Function) {
  subscribers.push(callback)
}

function onAccessTokenFetched(accessToken: String) {
  subscribers.forEach((callback) => callback(accessToken))
  subscribers = []
}

// export const jsonTransformConfig = {
//   transformRequest: [
//     function (data: any, headers) {
//       headers['Content-Type'] = 'application/json'
//       const ret = JSON.stringify(data)
//       console.log('transform data', ret)
//       return ret
//     }
//   ]
// }

export async function get(url: string, data?: any, config = {}) {
  // return await api.get(url, { params: { ...data } }, { ...config }).then((response) => response.data);
  return instance.get(url, { params: { ...data }, ...config })
}

export async function post(url: string, data?: any, config = {}) {
  return instance.post(url, data, { ...config })
}

export async function patch(url: string, data?: any, config = {}) {
  return instance.patch(url, { ...data }, { ...config })
}

export async function put(url: string, data?: any, config = {}) {
  return instance.put(url, { ...data }, { ...config })
}

export async function del(url: string, data?: any, config = {}) {
  return instance.delete(url, { params: { ...data }, ...config })
}

export async function postForm(url: string, data?: any, config = {}) {
  return instance.post(url, data, { ...config })
}

export const setupAxios = (app: App<Element>) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = instance
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
}

export { instance }
