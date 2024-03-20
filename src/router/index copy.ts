import Vue, { type App } from 'vue'
import Router, { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import routesBasic from './routes.json' // 1. 외부 파일 로드(JSON 형태)

//2. 데이타 파싱 => 라우트 목록 형태로 변경
const getRoutes = (routes = []): RouteRecordRaw[] => {
  return routes.map((route: any) => {
    return {
      ...route,
      component: () => import(/* webpackChunkName: "view-[request]" */ '@' + route.component),
      children: getRoutes(route.children)
    }
  })
}

// export default (function () {
//   const router = new Router({
//     mode: 'history',
//     routes: getRoutes(routes)
//   })

//   // 라우터 접근시 메뉴권한 체크
//   router.beforeEach((to, from, next) => {
//     ready().then(() => {
//       const path = to.path
//       const user = $x().user

//       // 비밀번호 변경 후 90일 초과, 비밀번호 초기화 계정 pwChange 로 이동
//       if (
//         path !== '/rms/pwChange' &&
//         (user.userState === 'LOCKED_PWDAYS' || user.userState === 'LOCKED_PWINIT')
//       ) {
//         next('/rms/pwChange')
//       } else {
//         next()
//       }
//     })
//   })

//   return router
// })()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  strict: true,
  routes: getRoutes(routesBasic as any) as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
