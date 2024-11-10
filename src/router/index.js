import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeLayout from '@/views/layout/HomeLayout.vue'
import LoginLayout from '@/views/layout/LoginLayout.vue'
import LoginView from '@/views/LoginView.vue'
import { useUserStore } from '@/stores/user.js'
import AccountsView from '@/views/AccountsView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import AccountFormView from '@/views/AccountFormView.vue'
import DompetkuView from '@/views/DompetkuView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { layout: LoginLayout },
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      meta: { layout: HomeLayout },
      component: HomeView,
    },
    {
      path: '/account-list',
      name: 'account list',
      meta: { layout: HomeLayout },
      component: AccountsView,
    },
    {
      path: '/change-password',
      name: 'change password',
      meta: { layout: HomeLayout },
      component: ChangePasswordView,
    },
    {
      path: '/account-form',
      name: 'account form',
      meta: { layout: HomeLayout },
      component: AccountFormView,
    },
    {
      path: '/dompetku',
      name: 'dompetku',
      meta: { layout: HomeLayout },
      component: DompetkuView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.name !== 'login' && !userStore.token) next({ name: 'login' })
  else if (to.name == 'login' && userStore.token) next({ name: 'home' })
  else next()
})

export default router
