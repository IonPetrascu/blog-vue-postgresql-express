import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'

const gauthClientId = '760622232735-5fur749g7000mpdvtrr0h3ksvefl5jl7.apps.googleusercontent.com'
const pinia = createPinia()

createApp(App).use(vue3GoogleLogin, {
  clientId: gauthClientId
})
  .use(pinia)
  .use(router)
  .mount('#app')
