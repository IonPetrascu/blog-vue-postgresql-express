import { createWebHistory, createRouter } from 'vue-router'

import Auth from './views/AuthView.vue'
import Reg from './views/RegView.vue'
import Welcome from './views/WelcomeView.vue'
import ProfileUserView from './views/ProfileUserView.vue'

const routes = [
  { path: '/', component: Welcome },
  { path: '/auth', component: Auth },
  { path: '/registration', component: Reg },
  { path: '/profile', component: ProfileUserView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
