import { createWebHistory, createRouter } from 'vue-router'

import Auth from './views/AuthView.vue'
import Reg from './views/RegView.vue'
import Welcome from './views/WelcomeView.vue'
import ProfileUserView from './views/ProfileUserView.vue'
import PostsView from './views/PostsView.vue'
import SinglePostView from './views/SinglePostView.vue'

const routes = [
  { path: '/', component: Welcome },
  { path: '/login', component: Auth },
  { path: '/registration', component: Reg },
  { path: '/profile', component: ProfileUserView },
  { path: '/posts', component: PostsView },
  { path: '/post/:id', component: SinglePostView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
