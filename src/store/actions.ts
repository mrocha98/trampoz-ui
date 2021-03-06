import { ActionContext, ActionTree } from 'vuex'
import { get, filter, unset, findIndex } from 'lodash'
import { MutationType } from './mutations'
import { FetchedContractors, FetchedJobs, Job, State, User } from './state'
import { api } from '@/services/api'

export enum ActionTypes {
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  FetchJobs = 'FETCH_JOBS',
  DeleteJob = 'DELETE_JOB',
  CreateJob = 'CREATE_JOB',
  UpdateJob = 'UPDATE_JOB',
  FetchContractors = 'FETCH_CONTRACTORS'
}

type Context = ActionContext<State, State>

interface JobCreation extends Omit<Job, 'contractor'> {
  contractorId: string
}

export type Actions = {
  [ActionTypes.Login](context: Context, payload: User): void
  [ActionTypes.Logout](context: Context): void
  [ActionTypes.FetchJobs](context: Context, payload: { page: number, limit: number }): void
  [ActionTypes.DeleteJob](context: Context, payload: { id: string }): void
  [ActionTypes.CreateJob](context: Context, payload: JobCreation): void
  [ActionTypes.UpdateJob](context: Context, payload: Omit<Job, 'contractor'>): void
  [ActionTypes.FetchContractors](context: Context): void
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
  },

  async [ActionTypes.DeleteJob] ({ commit, state }, { id }) {
    try {
      await api.delete('/jobs', { params: { id } })

      const jobs = get(state, 'fetchedJobs.jobs', [])
      const filteredJobs = filter(jobs, (job) => id !== get(job, 'id', ''))
      const total = state.fetchedJobs.total - 1

      commit(MutationType.SetFetchedJobs, filteredJobs)
      commit(MutationType.SetFetchedJobsTotal, total)
    } catch {}
  },

  async [ActionTypes.CreateJob] ({ commit, state }, jobPayload) {
    try {
      const { data: createdJob } = await api.post<Job>('/jobs', jobPayload)
      const jobs = get(state, 'fetchedJobs.jobs', []) as Job[]

      unset(createdJob, 'contractorId')
      jobs.unshift(createdJob)

      const total = state.fetchedJobs.total + 1

      commit(MutationType.SetFetchedJobs, jobs)
      commit(MutationType.SetFetchedJobsTotal, total)
    } catch {}
  },

  async [ActionTypes.UpdateJob] ({ commit, state }, jobPayload) {
    try {
      const id = get(jobPayload, 'id', '')
      unset(jobPayload, 'id')

      const { data: updatedJob } = await api.put<Job>('/jobs', jobPayload, { params: { id } })

      const jobs = get(state, 'fetchedJobs.jobs', []) as Job[]
      const updatedIndex = findIndex(jobs, (job) => get(job, 'id') === id)

      jobs[updatedIndex] = updatedJob

      commit(MutationType.SetFetchedJobs, jobs)
    } catch {}
  },

  async [ActionTypes.FetchContractors] ({ commit }) {
    const page = 1
    const limit = 15
    const { data } = await api.get<FetchedContractors>('/contractors', { params: { page, limit } })

    commit(MutationType.SetFetchedContractors, get(data, 'contractors', []))
  }
}
