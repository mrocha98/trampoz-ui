export type User = {
  email: string
  password: string
}

export type Auth = {
  signed: boolean
  errorMessage: string
}

export type Contractor = {
  id: string
  companyName: string
  companyLogoLink: string
}

export type Job = {
  id: string
  title: string
  description: string
  publishingDate: string
  state: string
  city: string
  isRemote: boolean
  isOpen: boolean
  contractor: Contractor
}

export type PaginationInfo = {
  pages: number,
  hasPreviousPage: boolean
  hasNextPage: boolean
  total: number
}

export interface FetchedJobs extends PaginationInfo {
  jobs: Job[]
}

export type State = {
  user: User
  auth: Auth
  fetchedJobs: FetchedJobs
}

export const state: State = {
  user: {} as User,
  auth: {
    signed: false,
    errorMessage: ''
  },
  fetchedJobs: {
    jobs: [],
    hasNextPage: false,
    hasPreviousPage: false,
    pages: 0,
    total: 0
  }
}
