import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
  ],
})

export default router
