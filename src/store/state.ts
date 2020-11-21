export type User = {
  email: string
  password: string
}

export type Auth = {
  signed: boolean
  errorMessage: string
}

export type State = {
  user: User
  auth: Auth
}

export const state: State = {
  user: {} as User,
  auth: {
    signed: false,
    errorMessage: ''
  }
}
