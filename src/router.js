import Vue from 'vue'
import Router from 'vue-router'
import main from './views/main/index.vue'
import login from './views/login/index.vue'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: "/login"
    }, {
      path: '/login',
      component: login,
      meta: {
        auth: false,
      }
    },
    // {
    //   path: '/app',
    //   meta: {
    //     name: '应用管理',
    //     menuKey: 'yygl',
    //     auth: false
    //   },
    //   component: () =>
    //     import('@/views/application/index.vue'),
    // },
    {
      path: '/main/:IP/:AppId',
      component: main,
      meta: {
        name: '首页',
        auth: true
      },
      children: [
        {
          path: '/',
          redirect: "/base/:IP/:AppId"
        },
        {
          path: '/base/:IP/:AppId',
          meta: {
            name: '基础配置',
            menuKey: 'jcpz',
            auth: true
          },
          component: () =>
            import('@/views/base/index.vue'),
          children: [{
              path: '/',
              meta: {
                auth: true
              },
              redirect: "/base/AppManage/:IP/:AppId",
              component: () =>
                import('@/views/home/index.vue')
            },
            {
              path: '/base/AppManage/:IP/:AppId',
              meta: {
                name: 'App管理',
                menuKey: '1',
                auth: true
              },
              component: resolve => require(["@/views/base/AppManage/index.vue"], resolve)
            },
            {
              path: '/base/urlManage/:IP/:AppId',
              meta: {
                name: 'URL管理',
                menuKey: '2',
                auth: true
              },
              component: resolve => require(["@/views/base/urlManage/index.vue"], resolve)
            },
            {
              path: '/base/tokenManage/:IP/:AppId',
              meta: {
                name: 'Token管理',
                menuKey: '3',
                auth: true
              },
              component: () =>
                import('@/views/base/tokenManage/index.vue')
            }, {
              path: '/base/userManage/:IP/:AppId',
              meta: {
                name: '用户管理',
                menuKey: '4',
                auth: true
              },
              component: () =>
                import('@/views/base/userManage/index.vue')
            }, {
              path: '/base/roleManage/:IP/:AppId',
              meta: {
                name: '角色管理',
                menuKey: '5',
                auth: true
              },
              component: () =>
                import('@/views/base/roleManage/index.vue')
            }, {
              path: '/base/userPermission/:IP/:AppId',
              meta: {
                name: '角色权限',
                menuKey: '6',
                auth: true
              },
              component: () =>
                import('@/views/base/userPermission/index.vue')
            },
          ]
        },
        {
          path: '/data/:IP/:AppId',
          meta: {
            name: '数据配置',
            menuKey: 'sjpz',
            auth: true
          },
          component: () =>
            import('@/views/data/index.vue'),
          children: [{
            path: '/',
            redirect: "/data/iSearch/:IP/:AppId",

          }, {
            path: '/data/iSearch/:IP/:AppId',
            meta: {
              name: 'List模板',
              menuKey: '1',
              auth: true
            },
            component: () =>
              import('@/views/data/iSearch/index.vue')
          }, {
            path: '/data/Grid/:IP/:AppId',
            meta: {
              name: 'Grid模板',
              menuKey: '2',
              auth: true
            },
            component: () =>
              import('@/views/data/Grid/index.vue')
          }, {
            path: '/data/EmailMsgTmpl/:IP/:AppId',
            meta: {
              name: '邮件管理',
              menuKey: '8-1',
              auth: true
            },
            component: () =>
              import('@/views/data/EmailMsgTmpl/index.vue')
          }, {
            path: '/data/shortMsgTmpl/:IP/:AppId',
            meta: {
              name: '短信管理',
              menuKey: '8-2',
              auth: true
            },
            component: () =>
              import('@/views/data/shortMsgTmpl/index.vue')
          }]
        },
        {
          path: '/resource/:IP/:AppId',
          meta: {
            name: '资源配置',
            menuKey: 'zypz',
            auth: true
          },
          component: () =>
            import('@/views/resource/index.vue'),
          children: [{
              path: '/',
              redirect: "/resource/layerManage/:IP/:AppId"
            },
            {
              path: '/resource/layerManage/:IP/:AppId',
              meta: {
                name: '图层管理',
                menuKey: '9',
                auth: true,
                //keepAlive指示路由容器是否需要被keep-alive标签包裹起来
                keepAlive: true
              },
              component: () =>
                import('@/views/resource/layerManage/index.vue')
            },
            {
              path: '/resource/mapInfo/:IP/:AppId',
              meta: {
                name: '地图信息',
                menuKey: '11-4',
                auth: true
              },
              component: () =>
                import('@/views/resource/mapInfo/index.vue')
            }, {
              path: '/resource/menu/:IP/:AppId',
              meta: {
                name: '菜单管理',
                menuKey: '11-5',
                auth: true
              },
              component: () =>
                import('@/views/resource/menu/index.vue')
            }, {
              path: '/resource/moduleManager/:IP/:AppId',
              meta: {
                name: '模块管理',
                menuKey: '11-6',
                auth: true
              },
              component: () =>
                import('@/views/resource/moduleManager/index.vue')
            }, {
              path: '/resource/toolsManage/:IP/:AppId',
              meta: {
                name: '地图工具',
                menuKey: '11-7',
                auth: true
              },
              component: () =>
                import('@/views/resource/toolsManage/index.vue')
            }, {
              path: '/resource/ContactUser/:IP/:AppId',
              meta: {
                name: '联系人管理',
                menuKey: '11-0',
                auth: true
              },
              component: () =>
                import('@/views/resource/ContactUser/index.vue')
            },
            {
              path: '/resource/ContactUserGroup/:IP/:AppId',
              meta: {
                name: '分组配置',
                menuKey: '11-1',
                auth: true
              },
              component: () =>
                import('@/views/resource/ContactUserGroup/index.vue')
            },
            {
              path: '/resource/ContactgetFgroup/:IP/:AppId',
              meta: {
                name: '分组管理',
                menuKey: '11-2',
                auth: true
              },
              component: () =>
                import('@/views/resource/ContactgetFgroup/index.vue')
            }
          ]
        },
        {
          path: '/function/:IP/:AppId',
          meta: {
            name: '功能配置',
            menuKey: 'gnpz',
            auth: true
          },
          component: () =>
            import('@/views/funct/index.vue'),
          children: [{
              path: '/',
              redirect: "/function/serviceManage/:IP/:AppId"
            },
            {
              path: '/function/serviceManage/:IP/:AppId',
              meta: {
                name: '服务管理',
                menuKey: '1',
                auth: true,
                keepAlive: true
              },
              component: () =>
                import('@/views/funct/serviceManage/index.vue')
            },
            {
              path: '/function/search/:IP/:AppId',
              meta: {
                name: '查询模块',
                menuKey: '2',
                auth: true,
                keepAlive: true
              },
              component: () =>
                import('@/views/funct/search/index.vue')
            },
            {
              path: '/function/BusinessStats/:IP/:AppId',
              meta: {
                name: '统计模块',
                menuKey: '3',
                auth: true,
                keepAlive: true
              },
              component: () =>
                import('@/views/funct/BusinessStats/index.vue')
            }, {
              path: '/function/quickQuery/:IP/:AppId',
              meta: {
                name: '快查模块',
                menuKey: '4',
                auth: true,
                keepAlive: true
              },
              component: () =>
                import('@/views/funct/quickQuery/index.vue')
            }
          ]
        },
        {
          path: '/examine/:IP/:AppId',
          meta: {
            name: '资源审核',
            menuKey: 'zysh',
            auth: true
          },
          component: () =>
            import('@/views/verify/index.vue'),
          children: [{
              path: '/',
              redirect: "/examine/waitCheck/:IP/:AppId"
            },
            {
              path: '/examine/waitCheck/:IP/:AppId',
              meta: {
                name: '待审核项',
                menuKey: '16',
                auth: true
              },
              component: () =>
                import('@/views/verify/waitCheck/index.vue')
            },
            {
              path: '/examine/checked/:IP/:AppId',
              meta: {
                name: '已审核项',
                menuKey: '17',
                auth: true
              },
              component: () =>
                import('@/views/verify/checked/index.vue')
            },
          ]
        },
        {
          path: '/gataway/:IP/:AppId',
          meta: {
            name: '网关管理',
            menuKey: 'wggl',
            auth: true
          },
          component: () =>
            import('@/views/gateway/index.vue'),
          children: [{
              path: '/',
              redirect: "/gataway/gateWayManage/:IP/:AppId"
            },
            {
              path: '/gataway/gateWayManage/:IP/:AppId',
              meta: {
                name: '网关管理',
                menuKey: '1',
                auth: true
              },
              component: () =>
                import('@/views/gateway/gateWayManage/index.vue')
            },
          ]
        },
        // {
        //   path: '/application/:IP/:AppId',
        //   meta: {
        //     name: '应用管理',
        //     menuKey: 'yygl',
        //     auth: true
        //   },
        //   component: () =>
        //     import('@/views/application/index.vue'),
        // }
      ]
    }
  ]
})