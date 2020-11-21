import { ActionContext, ActionTree } from 'vuex'
import { get } from 'lodash'
import { MutationType } from './mutations'
import { State, User } from './state'
import { api } from '@/services/api'

export enum ActionTypes {
  Login = 'LOGIN'
}

type Context = ActionContext<State, State>

export type Actions = {
  [ActionTypes.Login](context: Context, payload: User): void
}

export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.Login] ({ commit }, user) {
    const { email: username, password } = user

    try {
      await api.get<User>('/ping', { auth: { username, password } })

      commit(MutationType.SetUser, user)
      commit(MutationType.SetAuthSigned, true)
      commit(MutationType.ClearAuthErrorMessage)

      api.defaults.auth = { username, password }
    } catch (error) {
      const errorMessage = get(error, 'response.data.message', 'Cannot login')
      commit(MutationType.SetAuthErrorMessage, errorMessage)
      commit(MutationType.SetAuthSigned, false)

      throw error
    }
  }
}
