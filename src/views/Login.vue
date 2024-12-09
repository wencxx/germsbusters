<template>
    <div class="flex items-center justify-center gap-y-5">
        <form @submit.prevent="signIn" class="w-full max-w-sm h-96 flex flex-col items-center p-3">
            <img src="../assets/logo.png" alt="site logo" class="w-14 aspect-square">
            <h1 class="text-2xl font-medium">Welcome Back</h1>
            <div class="w-full space-y-3 mt-7">
                <p v-if="$route.query.registered" class="bg-green-500 text-white pl-2 rounded py-1">Successfully Registered!</p>
                <p v-if="notAccepted" class="bg-green-500 text-white pl-2 rounded py-1">Wait for the admin to accept your registration</p>
                <div class="flex flex-col gap-y-1 w-full">
                    <label for="Username">Username</label>
                    <input type="text" class="bg-transparent border h-9 rounded pl-2" v-model="userCredentials.username">
                </div>
                <div class="flex flex-col gap-y-1 w-full">
                    <label for="Username">Password</label>
                    <input type="password" class="bg-transparent border h-9 rounded pl-2" v-model="userCredentials.password">
                </div>
                <button v-if="!signingIn" class="w-full bg-primary hover:bg-green-500 py-2 rounded-lg text-white !mt-5">Sign In</button>
                <button v-else class="w-full bg-primary hover:bg-green-500 py-2 rounded-lg text-white !mt-5 animate-pulse" disabled>Signing In</button>
                <div class="">
                    <p class="space-x-1"><span>Don't have an account yet?</span> <router-link :to="{ name: 'register' }" class="text-blue-500 underline">Sign Up</router-link></p>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { auth, db } from '../config/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useAuthStore } from '../store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const isAuth = computed(() => authStore.isAuthenticated)

const router = useRouter()

const userCredentials = ref({
    username: '',
    password: ''
})

const userRef = collection(db, 'users')

const signingIn = ref(false)
const notAccepted = ref(false)

const signIn = async () => {
    try {
        signingIn.value = true
        notAccepted.value = false
        const userCredential = await signInWithEmailAndPassword(auth, `${userCredentials.value.username}@gmail.com`, userCredentials.value.password)

        const user = userCredential.user

        const q = query(
            userRef,
            where('userID', '==', user.uid)
        )

        const snapshots = await getDocs(q)

        if(!snapshots.docs[0].data().isAccepted) {
            notAccepted.value = true
            router.push({
                query: ''
            })
            return
        }

        if(snapshots.docs[0].data().role === 'admin'){
            router.push('/dashboard')
        }

        authStore.login(user.accessToken, user, snapshots.docs[0].data().role)
    } catch (error) {
        console.log(error)
    } finally {
        signingIn.value = false
    }
}
</script>