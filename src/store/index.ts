// https://github.com/jsbroks/vuex-typescript-todoapp/blob/master/src/store/index.ts
import { createStore, createLogger } from 'vuex'
import { VuexPersistence } from 'vuex-persist'
import { State, state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { stateKey } from '@/constants/localStorage'

const { plugin: persistencePlugin } = new VuexPersistence({
  key: stateKey,
  storage: window.localStorage
})

export const store = createStore<State>({
  plugins: [persistencePlugin, createLogger()],
  state,
  mutations,
  actions
})

export function useStore () {
  return store
}
