import { createWebHistory, createRouter } from 'vue-router'

import Auth from './views/AuthView.vue'
import Reg from './views/RegView.vue'
import Welcome from './views/WelcomeView.vue'
import ProfileUserView from './views/ProfileUserView.vue'
import SinglePostView from './views/SinglePostView.vue'
import Posts from './views/Posts.vue'
import CreatePost from './views/CreatePost.vue'
import ChatsView from './views/ChatsView.vue'
import ChatSingle from './views/ChatSingle.vue'
import ProfilePage from './views/ProfilePage.vue'

const routes = [
  { path: '/', component: Welcome },
  { path: '/add-post', component: CreatePost },
  { path: '/login', component: Auth },
  { path: '/registration', component: Reg },
  { path: '/my-profile', component: ProfileUserView },
  { path: '/posts', component: Posts },
  { path: '/post/:id', component: SinglePostView },
  { path: '/chats', component: ChatsView },
  { path: '/profile/:id', component: ProfilePage },
  { path: '/chats/:id', component: ChatSingle }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
