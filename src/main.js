import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import '@/assets/css/main.less';
Vue.config.productionTip = false
Vue.use(iView, {
  transfer: true
})
router.beforeEach((to, from, next) => {
  // var auth = to.meta.auth || null;
  // if (auth === true) {
  //   debugger;
  //   var isLogin = sessionStorage.getItem("userInfo") || null;
  //   if (isLogin === null) {
  //     next({
  //       path: '/login'
  //     });
  //     return;
  //   } else {
  //     next()
  //   }
  // } else {
  //   next()
  // }
  next();

  
  //选中一级菜单
  if (to.matched[1] && to.matched[1].meta.menuKey) {
    store.commit("setMainMenuKey", to.matched[1].meta.menuKey);
  }
  //选中二级菜单
  if (to.matched[2] && to.matched[2].meta.menuKey) {
    store.commit("setSubMenuKey", to.matched[2].meta.menuKey);
  }
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')