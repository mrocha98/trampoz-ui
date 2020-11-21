// https://github.com/jsbroks/vuex-typescript-todoapp/blob/master/src/store/index.ts
import { createStore, createLogger } from 'vuex'
import { State, state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'

export const store = createStore<State>({
  plugins: [createLogger()],
  state,
  mutations,
  actions
})

export function useStore () {
  return store
}
