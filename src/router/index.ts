import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import SidebarLayout from '@/layout/SidebarLayout/index.vue'
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePageLoading } from '@/hooks/web/usePageLoading.ts'

const { loadStart, loadDone } = usePageLoading()
export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/member',
    component: SidebarLayout,
    name: 'Member',
    meta: {
      title: '회원',
      alwaysShow: true
    },
    children: [
      {
        path: 'memberMgnt',
        fullPath: '/member/memberMgnt',
        component: () => import('../views/member/MemberManagement.vue'),
        name: 'MemberManagement',
        meta: {
          title: '회원 관리',
          icon: 'cib:telegram-plane'
        }
      },
      {
        path: 'memberRestMgnt',
        fullPath: '/member/memberRestMgnt',
        component: () => import('../views/memberRest/MemberRestManagement.vue'),
        name: 'MemberRestManagement',
        meta: {
          title: '휴면 회원 관리',
          icon: 'cib:telegram-plane'
        }
      },
      {
        path: 'quitUserManage',
        fullPath: '/member/quitUserManage',
        component: () => import('../views/quitUserManage/QuitUserManagement.vue'),
        name: 'QuitUserManagement',
        meta: {
          title: '탈퇴회원 관리',
          icon: 'cib:telegram-plane'
        }
      }
    ]
  },
  {
    path: '/site',
    component: SidebarLayout,
    name: 'Site',
    meta: {
      title: '사이트 운영',
      alwaysShow: true
    },
    children: [
      {
        path: 'notice',
        fullPath: '/site/notice',
        component: () => import('../views/notice/NoticeManagement.vue'),
        name: 'NoticeManagement',
        meta: {
          title: '공지사항 관리',
          icon: 'cib:telegram-plane'
        }
      },
      {
        path: 'popup',
        fullPath: '/site/popup',
        component: () => import('../views/popupManage/PopupManagement.vue'),
        name: 'PopupManagement',
        meta: {
          title: '팝업 관리',
          icon: 'cib:telegram-plane'
        }
      },
      {
        path: 'terms',
        fullPath: '/site/terms',
        component: () => import('../views/terms/TermsManagement.vue'),
        name: 'TermsManagement',
        meta: {
          title: '약관 관리',
          icon: 'cib:telegram-plane',
          canTo: false
        }
      },
      // {
      //   path: 'accessRoleManage',
      //   fullPath: '/site/accessRoleManage',
      //   component: () => import('../views/accessRoleManage/AccessRoleManagement.vue'),
      //   name: 'AccessRoleManagement',
      //   meta: {
      //     title: '접근권한',
      //     icon: 'cib:telegram-plane',
      //     canTo: false
      //   }
      // },
      {
        path: 'codeManage',
        fullPath: '/site/codeManage',
        component: () => import('../views/codeManage/CodeManagement.vue'),
        name: 'CodeManagement',
        meta: {
          title: '공통코드 관리',
          icon: 'cib:telegram-plane',
          canTo: false
        }
      }
    ]
  },
  {
    path: '/banner',
    component: SidebarLayout,
    name: 'Banner',
    meta: {
      title: '배너관리',
      alwaysShow: true
    },
    children: [
      {
        path: 'bannerManage',
        fullPath: '/banner/bannerManage',
        component: () => import('../views/bannerManage/BannerGroupManage.vue'),
        name: 'bannerManage',
        meta: {
          title: '메인 상단 배너 관리',
          icon: 'cib:telegram-plane'
        }
      },
      {
        path: 'bannerLoginManage',
        fullPath: '/banner/bannerLoginManage',
        component: () => import('../views/bannerLoginManage/BannerLoginManagement.vue'),
        name: 'bannerLoginManagement',
        meta: {
          title: '로그인배너 관리',
          icon: 'cib:telegram-plane',
          canTo: false
        }
      },
      {
        path: 'bannerImage',
        fullPath: '/banner/bannerImage',
        component: () => import('../views/bannerImage/BannerImageManage.vue'),
        name: 'BannerImage',
        meta: {
          title: '배너이미지관리',
          icon: 'cib:telegram-plane'
        }
      }
    ]
  }
  // ,
  // {
  //   path: '/menurole',
  //   component: SidebarLayout,
  //   name: 'menurole',
  //   meta: {
  //     title: '메뉴 관리',
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: 'menu',
  //       fullPath: '/menurole/menu',
  //       component: () => import('../views/menuRoleManage/menuRoleManage.vue'),
  //       name: 'menuRoleManage',
  //       meta: {
  //         title: '메뉴',
  //         icon: 'cib:telegram-plane',
  //         canTo: false
  //       }
  //     }
  //   ]
  // }
]
export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    fullPath: '/login',
    name: 'Login',
    meta: {
      hidden: true,
      title: '로그인',
      noTagsView: true
    },
    component: () => import('../views/login/Login.vue')
  },
  ...asyncRouterMap
]

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStoreWithOut()
  console.log('~~ router beforeEach : ', to.fullPath, userStore.getIsLoggedIn)

  //  로딩 시작
  // loadStart()

  if (to.fullPath === '/logout') {
    //  로그 아웃 일 경우
    if (userStore.getIsLoggedIn) {
      //  로그인이 되어 있을 경우 User Store에 로그아웃 처리를 한다.
      userStore.logout()
    }
    //  로그아웃 처리가 끝나면 로그인 페이지로 이동 처리.
    next('/login')
  } else if (userStore.getIsLoggedIn && (to.fullPath === '/' || to.fullPath === '/login')) {
    //  로그인이 되어 있는데 경로가 '/' 이거나 '/login' 일 경우는 초기 페이지로 이동 처리.
    //  회원 관리 페이지로 이동 처리.
    next('/member/memberMgnt')
  } else if (!userStore.getIsLoggedIn && to.fullPath !== '/' && to.fullPath !== '/login') {
    //  로그인이 안되어 있는데 이 외의 URL을 들어 갈 경우.
    //  로그인 페이지로 이동 처리.
    next('/login')
  } else {
    //  그 외에는 이동할 페이지로 이동
    next()
  }
})
router.afterEach((to) => {
  //  로딩 제거
  // loadDone()
})

export const setupRouter = async (app: App<Element>) => {
  app.use(router)
}

export default router
