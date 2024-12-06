import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginView
    }
]


const router = createRouter({
    routes,
    history: createWebHistory()
})



export default router