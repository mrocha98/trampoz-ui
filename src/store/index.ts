import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocalStorage = new VuexPersistence({
  storage: window.localStorage,
  key: '@trampoz'
})

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    vuexLocalStorage.plugin
  ]
})
