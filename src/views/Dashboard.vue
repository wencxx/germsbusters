<template>
    <div>
        this is dashboard
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../store'

const authStore = useAuthStore()
const currentUsere = computed(() => authStore.currentUser)
</script>