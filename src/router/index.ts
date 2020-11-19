import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
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

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
