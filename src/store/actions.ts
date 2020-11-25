import { ActionContext, ActionTree } from 'vuex'
import { get } from 'lodash'
import { MutationType } from './mutations'
import { FetchedJobs, State, User } from './state'
import { api } from '@/services/api'

export enum ActionTypes {
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  FetchJobs = 'FETCH_JOBS'
}

type Context = ActionContext<State, State>

export type Actions = {
  [ActionTypes.Login](context: Context, payload: User): void
  [ActionTypes.Logout](context: Context): void
  [ActionTypes.FetchJobs](context: Context, payload: { page: number, limit: number }): void
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
  },

  [ActionTypes.Logout] ({ commit }) {
    const emptyUser = { user: '', password: '' }
    commit(MutationType.SetUser, emptyUser)
    commit(MutationType.SetAuthSigned, false)
  },

  async [ActionTypes.FetchJobs] ({ commit }, { page, limit }) {
    const { data } = await api.get<FetchedJobs>('/jobs', { params: { page, limit } })

    commit(MutationType.SetFetchedJobs, get(data, 'jobs', []))
    commit(MutationType.SetFetchedJobsPages, get(data, 'pages'))
    commit(MutationType.SetFetchedJobsTotal, get(data, 'total'))
    commit(MutationType.SetFetchedJobsHasPreviousPage, get(data, 'hasPreviousPage'))
    commit(MutationType.SetFetchedJobsHasNextPage, get(data, 'hasNextPage'))
  }
}
