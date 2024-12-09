<template>
    <div class="flex justify-center !p-10">
        <div class="w-full">
            <div class="grid grid-cols-4 border w-full h-32">
                <div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../store'

const authStore = useAuthStore()
const currentUsere = computed(() => authStore.currentUser)
</script>