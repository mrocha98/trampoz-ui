import { MutationTree } from 'vuex'
import { get, map } from 'lodash'
import { Job, State, User } from './state'

export enum MutationType {
  SetUser = 'SET_USER',
  SetAuthSigned = 'SET_AUTH_SIGNED',
  SetAuthErrorMessage = 'SET_AUTH_ERROR_MESSAGE',
  ClearAuthErrorMessage = 'CLEAR_AUTH_ERROR_MESSAGE',
  SetFetchedJobs = 'SET_FETCHED_JOBS',
  SetFetchedJobsPages = 'SET_FETCHED_JOBS_PAGES',
  SetFetchedJobsHasPreviousPage = 'SET_FETCHED_JOBS_HAS_PREVIOUS_PAGE',
  SetFetchedJobsHasNextPage = 'SET_FETCHED_JOBS_HAS_NEXT_PAGE',
  SetFetchedJobsTotal = 'SET_FETCHED_JOBS_TOTAL'
}

export type Mutations = {
  [MutationType.SetUser](state: State, user: User | Omit<User, 'id'>): void
  [MutationType.SetAuthSigned](state: State, signed: boolean): void
  [MutationType.SetAuthErrorMessage](state: State, errorMessage: string): void
  [MutationType.ClearAuthErrorMessage](state: State): void
  [MutationType.SetFetchedJobs](state: State, jobs: Job[]): void
  [MutationType.SetFetchedJobsPages](state: State, pages: number): void
  [MutationType.SetFetchedJobsHasPreviousPage](state: State, hasPreviousPage: boolean): void
  [MutationType.SetFetchedJobsHasNextPage](state: State, hasNextPage: boolean): void
  [MutationType.SetFetchedJobsTotal](state: State, total: number): void
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
  },

  [MutationType.SetFetchedJobs] (state, jobs) {
    const mappedJobs = map(jobs, (job) => ({
      id: get(job, 'id'),
      title: get(job, 'title'),
      description: get(job, 'description'),
      city: get(job, 'city'),
      state: get(job, 'state'),
      isOpen: get(job, 'isOpen'),
      isRemote: get(job, 'isRemote'),
      contractor: {
        id: get(job, 'contractor.id'),
        companyName: get(job, 'contractor.companyName'),
        companyLogoLink: get(job, 'contractor.companyLogoLin')
      }
    } as Job))

    state.fetchedJobs.jobs = mappedJobs
  },

  [MutationType.SetFetchedJobsHasPreviousPage] (state, hasPreviousPage) {
    state.fetchedJobs.hasPreviousPage = !!hasPreviousPage
  },

  [MutationType.SetFetchedJobsHasNextPage] (state, hasNextPage) {
    state.fetchedJobs.hasNextPage = !!hasNextPage
  },

  [MutationType.SetFetchedJobsPages] (state, pages) {
    state.fetchedJobs.pages = Math.abs(pages)
  },

  [MutationType.SetFetchedJobsTotal] (state, total) {
    state.fetchedJobs.total = Math.abs(total)
  }
}
