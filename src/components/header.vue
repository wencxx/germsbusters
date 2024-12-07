<template>
    <div class="flex items-center justify-between px-5">
        <Icon icon="mdi:menu" class="text-3xl cursor-pointer" @click="emit('toggleSidebar')" />
        <Icon icon="mdi:logout" class="text-3xl cursor-pointer" @click="logout" />
    </div>
</template>

<script setup>
import { auth } from '../config/firebaseConfig'
import { signOut } from 'firebase/auth'
import { useAuthStore } from '../store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const emit = defineEmits(['toggleSidebar'])

const logout = async () => {
    try {
        await signOut(auth)

        router.push('/')
    } catch (error) {
        console.log()
    }
}
</script>