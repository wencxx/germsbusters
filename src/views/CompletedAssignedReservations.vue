<template>
    <div class="p-10 flex justify-center">
        <div class="w-full max-w-7xl h-fit mt-14 space-y-5">
            <h1 class="col-span-4 font-semibold text-gray-700 text-xl">Assigned Reservations</h1>
            <div v-if="fetching" class="grid lg:grid-cols-4 gap-5">
                <div class="bg-gray-200 animate-pulse w-full rounded-md shadow h-64" v-for="i in 8" :key="i">

                </div>
            </div>
            <div v-else-if="!fetching && reservations.length" class="grid lg:grid-cols-4 gap-5">
                <div v-for="(reservation, index) in reservations" :key="reservation.id" class="bg-white p-3 rounded-md shadow h-fit">
                    <h1 class="font-medium text-gray-700">{{ reservation.name }}</h1>
                    <h1 class="font-bold text-gray-800">Service:</h1>
                    <h1 class="font-medium text-gray-700">{{ getServiceDetails(reservation.serviceID).title }}</h1>
                    <h1 class="font-bold text-gray-800">Location:</h1>
                    <h1 class="font-medium text-gray-700">{{ reservation.block + ', ' + reservation.street + ', ' + reservation.barangay + ', ' + reservation.city }}</h1>
                    <h1 class="font-bold text-gray-800">Date:</h1>
                    <h1 class="font-medium text-gray-700">{{ moment(reservation.date).format('lll') }}</h1>
                    <hr>
                    <h1 class="flex justify-between">
                        <span class="font-bold text-gray-800">Total</span>
                        <span>{{ formatTotal(reservation.total) }}</span>
                    </h1>
                    <div class="flex justify-between mt-2">
                        <button class="bg-green-500 px-3 rounded w-2/5 text-white" @click="completeReservation(reservation, index)">Complete</button>
                    </div>
                </div>
            </div>
            <div v-else-if="!fetching && !reservations.length" class="text-gray-500">
                <p>No assigned reservations to show</p>
            </div>
        </div>

        <completeModalVue v-if="showCompleteModal" :reservationDataToComplete="reservationDataToComplete" @closeModal="showCompleteModal = false" @completed="completed" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { db } from '../config/firebaseConfig'
import { collection, query, where, getDocs, and } from 'firebase/firestore'
import { useAuthStore, useDataStore } from '../store'
import moment from 'moment'
import completeModalVue from '../components/CompleteModal.vue'


const authStore = useAuthStore()
const dataStore = useDataStore()

const currentUser = computed(() => authStore.currentUser)

onMounted(() => {
    getAssignedReservations()
    watch(() => currentUser.value?.uid, (newVal, oldVal) => {
        if(newVal){
            getAssignedReservations()
        }
    })
})

const formatTotal = (total) => {
    return Number(total).toLocaleString('en-US', {
        style: 'currency',
        currency: 'PHP'
    })
}

// get reservations
const reservations = ref([])
const fetching = ref(false)

const getAssignedReservations = async () => {
    try {
        fetching.value = true
        const q = query(
            collection(db, 'reservations'),
            and(
                where('assignedEmployees', 'array-contains', currentUser.value?.uid),
                where('status', '==', 'completed')
            )
        )

        const snapshots = await getDocs(q)

        snapshots.docs.forEach(doc => {
            reservations.value.push({
                id: doc.id,
                ...doc.data()
            })
        })
    } catch (error) {
        console.log(error)
    } finally {
        fetching.value = false
    }
}

const getServiceDetails = (serviceID) => {
    return dataStore.getServiceDetails(serviceID)
}

// complete reservation
const showCompleteModal = ref(false)
const reservationDataToComplete = ref({})
const reservationIndexToComplete = ref({})

const completeReservation = (reservation, index) =>{
    showCompleteModal.value = true

    reservationDataToComplete.value = reservation
    reservationIndexToComplete.value = index
}

const completed = () => {
    showCompleteModal.value = false

    reservations.value.splice(reservationIndexToComplete.value, 1)
}
</script>