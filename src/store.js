import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentMainKey: 'jcpz',
    currentSubKey: '1'
  },
  mutations: {
    setMainMenuKey(state,key){
      state.currentMainKey = key;
    },
    setSubMenuKey(state,key){
      state.currentSubKey = key;
    }
  },
  actions: {

  }
})