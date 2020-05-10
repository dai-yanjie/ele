import Vue from 'vue'
import Vuex from 'vuex'
import login from './login'
import location from './location'
import shop from './shop'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    login,
    location,
    shop
  }
})
