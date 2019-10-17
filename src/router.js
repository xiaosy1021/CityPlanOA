import Vue from 'vue'
import Router from 'vue-router'
import main from './views/main/index.vue'
// import login from './views/login/index.vue'

import store from '@/store'
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc'

import SigninCallback from '@/oidc/signincallback'
import SigninCallbackError from '@/oidc/signincallbackerror'

Vue.use(Router)

const router =  new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: "/main",
    },
    {
      path: '/signincallback',
      name: 'signincallback',
      meta: {
        isOidcCallback: true,
        isPublic: true
      },
      component: SigninCallback
    },
    {
      path: '/signincallbackerror',
      name: 'signincallbackerror',
      meta: {
        isPublic: true
      },
      component: SigninCallbackError
    },
    // {
    //   path: '/login',
    //   component: login,
    //   meta: {
    //     auth: false,
    //   }
    // },
    {
      path: '/main',
      component: main,
      meta: {
        name: '首页',
        auth: true
      },
      children: [{
          path: '/',
          redirect: "/data"
        },
        {
          path: '/data',
          meta: {
            name: '办文管理',
            menuKey: '1',
            auth: true
          },
          component: () =>
            import('@/views/data/index.vue'),
          children: [{
            path: '/',
            redirect: "/data/ProjectSet",
          }, {
            path: '/data/ProjectSet',
            meta: {
              name: '项目集',
              menuKey: '1-1',
              auth: true
            },
            component: () =>
              import('@/views/data/ProjectSet/index.vue')
          }, {
            path: '/data/Project',
            meta: {
              name: '项目信息',
              menuKey: '1-2',
              auth: true
            },
            component: () =>
              import('@/views/data/Project/index.vue')
          }, {
            path: '/data/Application',
            meta: {
              name: '申请信息',
              menuKey: '1-3',
              auth: true
              ////keepAlive指示路由容器是否需要被keep-alive标签包裹起来
              //keepAlive: true
            },
            component: () =>
              import('@/views/data/Application/index.vue')
          }, {
            path: '/data/Company',
            meta: {
              name: '单位信息',
              menuKey: '1-4',
              auth: true
            },
            component: () =>
              import('@/views/data/Company/index.vue')
          }]
        },
        {
          path: '/base',
          meta: {
            name: '系统管理',
            menuKey: '8',
            auth: true
          },
          component: () =>
            import('@/views/base/index.vue'),
          children: [{
              path: '/',
              meta: {
                auth: true
              },
              redirect: "/base/userManage",
            },
            {
              path: '/base/userManage',
              meta: {
                name: '用户信息',
                menuKey: '8-1',
                auth: true
              },
              component: resolve => require(["@/views/base/userManage/index.vue"], resolve)
            },
            {
              path: '/base/roleManage',
              meta: {
                name: '角色信息',
                menuKey: '8-2',
                auth: true
              },
              component: resolve => require(["@/views/base/roleManage/index.vue"], resolve)
            },
            {
              path: '/base/userPermission',
              meta: {
                name: '权限控制',
                menuKey: '8-3',
                auth: true
              },
              component: () =>
                import('@/views/base/userPermission/index.vue')
            },
          ]
        },
      ]
    }
  ]
})

router.beforeEach(vuexOidcCreateRouterMiddleware(store, 'oidcStore'))
export default router