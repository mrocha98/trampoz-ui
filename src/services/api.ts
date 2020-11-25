import axios from 'axios'
import { get } from 'lodash'
import { extractUser } from '@/utils/extractFromLocalStorage'

const user = extractUser()
const username = get(user, 'email')
const password = get(user, 'password')

const auth = (username && password) ? { username, password } : undefined

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  auth
})
