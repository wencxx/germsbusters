import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'

const pinia = createPinia()

const app = createApp(App)

app.component('Icon', Icon)

app.use(router)
app.use(pinia)
app.mount('#app')
