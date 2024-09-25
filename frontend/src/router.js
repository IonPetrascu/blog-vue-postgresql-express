import { createWebHistory, createRouter } from 'vue-router'
import { useStore } from './store'

import Auth from './views/AuthView.vue'
import Reg from './views/RegView.vue'
import ProfileUserView from './views/ProfileUserView.vue'
import SinglePostView from './views/SinglePostView.vue'
import PostsView from './views/PostsView.vue'
import CreatePost from './views/CreatePost.vue'
import ProfilePage from './views/ProfilePage.vue'
import ChatView from './views/ChatView.vue'

const routes = [
  { path: '/', component: PostsView, meta: { requiresAuth: true } },
  { path: '/add-post', component: CreatePost, meta: { requiresAuth: true } },
  { path: '/login', component: Auth, meta: { requiresGuest: true } },
  { path: '/registration', component: Reg, meta: { requiresGuest: true } },
  { path: '/my-profile', component: ProfileUserView, meta: { requiresAuth: true } },
  { path: '/post/:id', component: SinglePostView, meta: { requiresAuth: true } },
  { path: '/chats', component: ChatView, meta: { requiresAuth: true } },
  { path: '/profile/:id', component: ProfilePage, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useStore();
  const isAuth = store.isAuth;

  //if need auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuth) {
      return next('/login');
    }
  }

  //if dont nead auth
  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuth) {
      return next('/');
    }
  }
  //continue next
  next();
})


export default router
