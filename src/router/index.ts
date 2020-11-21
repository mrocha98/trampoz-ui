import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useStore } from '@/store'
import Login from '@/views/Login.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: () => import('@/views/Jobs.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const store = useStore()

router.beforeEach((to, from, next) => {
  const IS_SIGNED = store.state.auth.signed
  const TO_LOGIN_PAGE = to.path === '/'
  const FROM_LOGIN_PAGE = from.path === '/'

  if (TO_LOGIN_PAGE && FROM_LOGIN_PAGE) {
    next()
    return
  }

  if (IS_SIGNED && TO_LOGIN_PAGE) {
    next(false)
    return
  }

  IS_SIGNED ? next() : next('/')
})
