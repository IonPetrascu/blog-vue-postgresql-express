import { createWebHistory, createRouter } from 'vue-router'

import Auth from './views/AuthView.vue'
import Reg from './views/RegView.vue'
import ProfileUserView from './views/ProfileUserView.vue'
import SinglePostView from './views/SinglePostView.vue'
import PostsView from './views/PostsView.vue'
import CreatePost from './views/CreatePost.vue'
import ProfilePage from './views/ProfilePage.vue'
import ChatView from './views/ChatView.vue'

const routes = [
  { path: '/', component: PostsView },
  { path: '/add-post', component: CreatePost },
  { path: '/login', component: Auth },
  { path: '/registration', component: Reg },
  { path: '/my-profile', component: ProfileUserView },
  { path: '/post/:id', component: SinglePostView },
  { path: '/chats', component: ChatView },
  { path: '/profile/:id', component: ProfilePage }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
