<template>
    <div class="space-y-8">
        <div class="flex gap-x-4 items-center border-b-2 pb-5">
            <div class="bg-gray-200/75 w-12 aspect-square rounded-full flex items-center justify-center">
                <Icon icon="mdi:user"  class="text-3xl" />
            </div>
            <div>
                <h1 class="text-gray-400 tracking-wide">Welcome,</h1>
                <p class="text-sm font-semibold text-gray-700 -mt-1">{{ currentUser?.displayName }}</p>
            </div>
        </div>
        <nav v-if="role === 'admin'">
            <ul class="space-y-1">
                <li>
                    <router-link :to="{ name: 'dashboard' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-200">
                        <Icon icon="uil:chart" class="text-2xl" />
                        <span class="text-lg">Dashboard</span>
                    </router-link>
                </li>
                <li>
                    <div class="flex items-center gap-x-3 w-full p-2 rounded-md cursor-pointer hover:bg-gray-200" @click="openMenu('Employee')">
                        <Icon icon="mdi:user-group-outline" class="text-2xl" />
                        <span class="text-lg">Employee</span>
                        <Icon icon="weui:arrow-filled" class="text-2xl ml-auto rotate-90 duration-150" :class="{ 'rotate-180': openedMenu.includes('Employee') }" />
                    </div>
                    <div v-if="openedMenu.includes('Employee')" class="ml-5 pl-2 border-l space-y-1">
                        <router-link :to="{ name: 'employees' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-100">
                            <span class="text-lg">Employees</span>
                        </router-link>
                        <router-link :to="{ name: 'pendingEmployees' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-100">
                            <span class="text-lg">Pending Employees</span>
                        </router-link>
                    </div>
                </li>
                <li>
                    <router-link :to="{ name: 'services' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-200">
                        <Icon icon="hugeicons:cleaning-bucket" class="text-2xl" />
                        <span class="text-lg">Services</span>
                    </router-link>
                </li>
                <li>
                    <div class="flex items-center gap-x-3 w-full p-2 rounded-md cursor-pointer hover:bg-gray-200" @click="openMenu('Reservations')">
                        <Icon icon="mdi:user-group-outline" class="text-2xl" />
                        <span class="text-lg">Reservations</span>
                        <Icon icon="weui:arrow-filled" class="text-2xl ml-auto rotate-90 duration-150" :class="{ 'rotate-180': openedMenu.includes('Reservations') }" />
                    </div>
                    <div v-if="openedMenu.includes('Reservations')" class="ml-5 pl-2 border-l space-y-1">
                        <router-link :to="{ name: 'pendingReservations' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-100">
                            <span class="text-lg">Pending</span>
                        </router-link>
                        <router-link :to="{ name: 'completedReservations' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-100">
                            <span class="text-lg">Completed</span>
                        </router-link>
                        <router-link :to="{ name: 'rejectedReservations' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-100">
                            <span class="text-lg">Rejected</span>
                        </router-link>
                        <router-link :to="{ name: 'canceledReservations' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-100">
                            <span class="text-lg">Canceled</span>
                        </router-link>
                    </div>
                </li>
            </ul>
        </nav>
        <nav v-if="role === 'employee'">
             <ul class="space-y-1">
                <li>
                    <router-link :to="{ name: 'assignedReservations' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-200">
                        <Icon icon="icon-park-outline:list" class="text-2xl" />
                        <span class="text-lg">Assinged Reservations</span>
                    </router-link>
                </li>
             </ul>
        </nav>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../store'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)
const role = computed(() => authStore.role)

const openedMenu = ref([])

const openMenu = (menu) => {
    if(openedMenu.value.includes(menu)){
        const index = openedMenu.value.indexOf(menu)
        openedMenu.value.splice(index, 1)
    }else{
        openedMenu.value.push(menu)
    }
}
</script>

<style scoped>
.router-link-active {
    background-color: #0cb632;
    color: white;
}
</style>