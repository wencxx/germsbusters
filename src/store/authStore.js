import { defineStore } from 'pinia'

const useAuthStore =  defineStore('authStore', {
    state: () => ({
        currentUser: null,
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null
    }),  
    actions: {
        async login(token, user, role){
            this.token = token
            this.currentUser = user
            this.role = role

            localStorage.setItem('token', token)
            localStorage.setItem('role', role)
        },
        async logout(){
            this.token = null
            this.currentUser = null
            this.role = null

            localStorage.removeItem('token')
            localStorage.removeItem('role')
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token
    }
})


export default useAuthStore