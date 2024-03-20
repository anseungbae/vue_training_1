import type { RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'

/**
* redirect: noredirect        noredirect 설정을 할 때 빵 부스러기 탐색에서 이 경로를 클릭할 수 없습니다
* name:'router-name'          라우팅 이름을 반드시 기입하십시오. 그렇지 않으면 <keep-alive>를 사용할 경우 여러 가지 문제가 발생할 수 있습니다.
* meta : {
    hidden: true               설정 시 404, login 등의 페이지가 나타나지 않습니다 (기본 false)

    alwaysShow: true          다음 children 선언의 루틴이 1개 이상일 때 자동으로 중첩된 모드가 됩니다.
                              하나만 있으면 그 서브루틴이 루트 루틴으로 사이드바에 표시됩니다.
                              루트 아래에 있는 children 선언의 개수에 관계없이 루트 루트를 표시하고 싶다면,
                              당신은 alwaysShow를 설정할 수 있습니다. true, 이렇게 하면 이전에 정의한 규칙을 무시합니다.
                              루트 경로 계속 보이기 (기본 false)

    title: 'title'            이 루틴이 사이드바와 빵 부스러기에 보일 이름을 설정합니다

    icon: 'svg-name'          이 경로의 아이콘 설정

    noCache: true             true를 true로 설정하면 <keep-alive> 캐시되지 않습니다. (기본 false)

    breadcrumb: false         false로 설정하면 breadcrumb 빵 부스러기에 표시되지 않습니다(기본 true)

    affix: true               true로 설정하면 tag 항목에 고정됩니다 (기본 false)

    noTagsView: true          true로 설정하면 태그에 나타나지 않습니다 (기본 false)

    activeMenu: '/dashboard'  강조된 경로 표시

    canTo: true               true로 설정되어 있어도 hidden이 true가 되어도 라우팅이 가능합니다(기본 false)

    permission: ['edit','add', 'delete']    경로 설정 권한
  }
**/

interface RouteMetaCustom extends Record<string | number | symbol, unknown> {
  hidden?: boolean
  alwaysShow?: boolean
  title?: string
  icon?: string
  noCache?: boolean
  breadcrumb?: boolean
  affix?: boolean
  activeMenu?: string
  noTagsView?: boolean
  canTo?: boolean
  permission?: string[]
}

declare module 'vue-router' {
  interface RouteMeta extends RouteMetaCustom {}
}

type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

declare global {
  declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
    name?: string
    meta?: RouteMetaCustom
    component?: Component | string
    children?: AppRouteRecordRaw[]
    props?: Recordable
    fullPath?: string
  }

  declare interface AppCustomRouteRecordRaw
    extends Omit<RouteRecordRaw, 'meta' | 'component' | 'children'> {
    name: string
    meta: RouteMetaCustom
    component: string
    path: string
    redirect: string
    children?: AppCustomRouteRecordRaw[]
    fullPath?: string
  }
}
