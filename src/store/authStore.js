import { defineStore } from 'pinia'

const useAuthStore =  defineStore('authStore', {
    state: () => ({
        user: null,
        isAuth
    }),  
    actions
})


export default useAuthStore