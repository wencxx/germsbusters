<template>
    <div class="space-y-8">
        <div class="flex gap-x-4 items-center border-b-2 pb-5">
            <div class="bg-gray-200/75 w-12 aspect-square rounded-full flex items-center justify-center">
                <Icon icon="mdi:user"  class="text-3xl" />
            </div>
            <div>
                <h1 class="text-gray-400 tracking-wide">Welcome,</h1>
                <p class="text-sm font-semibold text-gray-700 -mt-1">{{ currentUser?.displayName || 'Employee' }}</p>
            </div>
            <div v-if="role === 'employee'" class="ml-auto">
                <select class="border text-xs" v-model="status" @change="changeStatus">
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                </select>
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
                        <router-link :to="{ name: 'acceptedReservations' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-100">
                            <span class="text-lg">Accepted</span>
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
                    <div class="flex items-center gap-x-3 w-full p-2 rounded-md cursor-pointer hover:bg-gray-200" @click="openMenu('Reservations')">
                        <Icon icon="mdi:user-group-outline" class="text-2xl" />
                        <span class="text-lg">Assigned Reservations</span>
                        <Icon icon="weui:arrow-filled" class="text-2xl ml-auto rotate-90 duration-150" :class="{ 'rotate-180': openedMenu.includes('Reservations') }" />
                    </div>
                    <div v-if="openedMenu.includes('Reservations')" class="ml-5 pl-2 border-l space-y-1">
                        <router-link :to="{ name: 'assignedReservations' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-100">
                            <span class="text-lg">Pending</span>
                        </router-link>
                        <router-link :to="{ name: 'completedAssignedReservations' }" class="flex items-center gap-x-3 w-full p-2 rounded-md hover:bg-gray-100">
                            <span class="text-lg">Completed</span>
                        </router-link>
                        
                    </div>
                </li>
             </ul>
        </nav>
    </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useAuthStore } from '../store'
import { db } from '../config/firebaseConfig'
import { getDocs, where, query, updateDoc, doc, collection, limit } from 'firebase/firestore'

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

watch(() => currentUser.value?.uid, (newVal) => {
    if(newVal){
        getUserData()
    }
})

const userDetails = ref({})

const getUserData = async () => {
    try {
        const q = query(
            collection(db, 'users'),
            where('userID', '==', currentUser.value?.uid),
            limit(1)
        )

        const snapshot = await getDocs(q)

        userDetails.value = {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
        }
    } catch (error) {
        console.log(error)
    }
}

const status = ref('unavailable')

watchEffect(() => {
    status.value = userDetails.value.status
})

const changeStatus = async () => {
    try {
        const q = query(
            collection(db, 'users'),
            where('userID', '==', currentUser.value?.uid)
        );

        const querySnapshot = await getDocs(q); 

        querySnapshot.forEach(async doc => {
            const docRef = doc.ref; 
            await updateDoc(docRef, {
                status: status.value
            });
        });
    } catch (error) {
        console.log(error);
    }
};

</script>

<style scoped>
.router-link-active {
    background-color: #0cb632;
    color: white;
}
</style>