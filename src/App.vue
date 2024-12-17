<template>
  <div class="h-screen w-screen flex font-inter">
    <sidebarComponent v-if="isAuthenticated && showSidebar" class="w-full max-w-xs border-r h-full p-5 duration-150 hidden lg:block" />
    <sidebarComponent v-if="isAuthenticated && showSidebar" class="w-full max-w-xs border-r h-full p-5 duration-150 fixed left-0 top-0 z-20 bg-white block lg:hidden" />
    <Icon v-if="showSidebar" icon="mdi:menu" class="text-3xl cursor-pointer block lg:hidden absolute top-5 left-3/4 -translate-x-10 z-50" @click="showSidebar = !showSidebar" />
    <div class="w-full flex flex-col">
      <headerComponent v-if="isAuthenticated" class="w-full h-[7dvh] border-b bg-gray-100" @toggleSidebar="showSidebar = !showSidebar" />
      <router-view class="h-full w-full" :class="{ '!h-[93dvh] bg-gray-100 px-5': isAuthenticated }"/>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore, useDataStore } from './store'
import { auth } from './config/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'

// component
import sidebarComponent from './components/sidebar.vue'
import headerComponent from './components/header.vue'

const showSidebar = ref(true)

const authStore = useAuthStore()
const dataStore = useDataStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      authStore.currentUser = currentUser
      dataStore.getReservations()
      dataStore.getServices()
      dataStore.getAvailalableEmployees()
    } else {
      authStore.logout()
    }
  })
})
</script>