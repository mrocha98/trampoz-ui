import { MutationTree } from 'vuex'
import { State, User } from './state'

export enum MutationType {
  SetUser = 'SET_USER',
  SetAuthSigned = 'SET_AUTH_SIGNED',
  SetAuthErrorMessage = 'SET_AUTH_ERROR_MESSAGE',
  ClearAuthErrorMessage = 'CLEAR_AUTH_ERROR_MESSAGE'
}

export type Mutations = {
  [MutationType.SetUser](state: State, user: User | Omit<User, 'id'>): void
  [MutationType.SetAuthSigned](state: State, signed: boolean): void
  [MutationType.SetAuthErrorMessage](state: State, errorMessage: string): void
  [MutationType.ClearAuthErrorMessage](state: State): void
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.SetUser] (state, user) {
    state.user = user
  },
  [MutationType.SetAuthSigned] (state, signed) {
    state.auth.signed = !!signed
  },
  [MutationType.SetAuthErrorMessage] (state, errorMessage) {
    state.auth.errorMessage = errorMessage
  },
  [MutationType.ClearAuthErrorMessage] (state) {
    state.auth.errorMessage = ''
  }
}
