import Vue from 'vue'
import Vuex from 'vuex'
import { vuexOidcCreateStoreModule } from 'vuex-oidc'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    currentMainKey: 'jcpz',
    currentSubKey: '1'
  },
  mutations: {
    setMainMenuKey (state, key) {
      state.currentMainKey = key;
    },
    setSubMenuKey (state, key) {
      state.currentSubKey = key;
    }
  },
  actions: {

  },
  modules: {
    oidcStore: vuexOidcCreateStoreModule(
      {
        authority: 'http://192.168.84.124:8610',
        client_id: 'xuzhouoa-js',
        client_secret: 'secret',
        response_type: 'code',
        scope: 'openid xuzhou-oa-fullaccess',
        loadUserInfo: true,
        revokeAccessTokenOnSignout: true,
        redirect_uri: window.document.location.origin + '/#/signincallback',
        silent_redirect_uri: window.document.location.origin + '/#/silentcallback',
        post_logout_redirect_uri: '',
        automaticSilentRenew: true
        // userStore: new oidc.WebStorageStateStore({
        //   store: window.localStorage
        // })
      },
      {
        namespaced: true,
        dispatchEventsOnWindow: true
      },
      {
        userLoaded: (user) => console.log('OIDC user is loaded:', user),
        userUnloaded: () => console.log('OIDC user is unloaded'),
        accessTokenExpiring: () => console.log('Access token will expire'),
        accessTokenExpired: () => console.log('Access token did expire'),
        silentRenewError: () => console.log('OIDC user is unloaded'),
        userSignedOut: () => console.log('OIDC user is signed out')
      })
  }
})