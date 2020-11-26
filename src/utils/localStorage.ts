import { get } from 'lodash'
import { stateKey } from '@/constants/localStorage'
import { User } from '@/store/state'

export const extractState = () => localStorage.getItem(stateKey)

export const clearState = () => localStorage.removeItem(stateKey)

export const extractUser = (): User | null => {
  const state = extractState()
  const parsedState = JSON.parse(state + '')

  return get(parsedState, 'user')
}
