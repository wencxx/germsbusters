<template>
    <div class="p-10 flex justify-center">
        <div class="w-full max-w-7xl h-96 mt-14 grid lg:grid-cols-4 gap-5">
            <h1 class="col-span-4 font-semibold text-gray-700 text-xl">Reservations</h1>
            <div v-for="reservation in reservations" :key="reservation.id" class="bg-white p-3 rounded-md shadow h-fit">
                <h1 class="font-medium text-gray-700">{{ reservation.name }}</h1>
                <h1 class="font-bold text-gray-800">Service:</h1>
                <h1 class="font-medium text-gray-700">{{ getServiceDetails(reservation.serviceID).title }}</h1>
                <h1 class="font-bold text-gray-800">Location:</h1>
                <h1 class="font-medium text-gray-700">{{ reservation.block + ', ' + reservation.street + ', ' + reservation.barangay + ', ' + reservation.city }}</h1>
                <h1 class="font-bold text-gray-800">Date:</h1>
                <h1 class="font-medium text-gray-700">{{ moment(reservation.date).format('lll') }}</h1>
                <hr>
                <div class="flex justify-between mt-2">
                    <button class="bg-green-500 px-3 rounded w-2/5 text-white">Complete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { db } from '../config/firebaseConfig'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useAuthStore, useDataStore } from '../store'
import moment from 'moment'

const authStore = useAuthStore()
const dataStore = useDataStore()

const currentUser = computed(() => authStore.currentUser)

onMounted(() => {
    watch(() => currentUser.value?.uid, (newVal, oldVal) => {
        if(newVal){
            getAssignedReservations()
        }
    })
})

// get reservations
const reservations = ref([])

const getAssignedReservations = async () => {
    try {
        const q = query(
            collection(db, 'reservations'),
            where('assignedEmployees', 'array-contains', currentUser.value?.uid)
        )

        const snapshots = await getDocs(q)

        snapshots.docs.forEach(doc => {
            reservations.value.push({
                id: doc.id,
                ...doc.data()
            })
        })

        console.log(snapshots)
    } catch (error) {
        console.log(error)
    }
}

const getServiceDetails = (serviceID) => {
    return dataStore.getServiceDetails(serviceID)
}
</script>