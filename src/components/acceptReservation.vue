<template>
    <div class="fixed top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
        <div class="bg-white p-5 rounded-lg border shadow-sm h-fit w-full max-w-lg flex flex-col items-center gap-y-5">
            <h1 class="text-xl text-gray-800 font-bold">Accept Reservation</h1>
            <div class="w-full space-y-2">
                <h1 class="text-lg text-gray-600 font-semibold">Assign Employee</h1>
                <div v-if="employees.length" class="flex flex-wrap gap-x-3">
                    <div v-for="employee in employees" :key="employee.id" class="flex items-center gap-x-1">
                        <input type="checkbox" class="w-5 aspect-square" @change="assignEmployee(employee.userID)">
                        <label class="text-lg text-gray-600">{{ employee.fullName }}</label>
                    </div>
                </div>
                <p v-else class="text-gray-500 text-center text-lg">No employees available</p>
            </div>
            <div class="w-full flex justify-end gap-x-2 text-white rounded py-1">
                <button class="w-1/4 py-1 bg-red-500 rounded" @click="emit('closeModal')">Close</button>
                <button v-if="!accepting" class="w-1/4 py-1 bg-green-500 rounded" @click="acceptReservation">Confirm</button>
                <button v-else class="w-1/4 py-1 bg-green-500 rounded animate-pulse" disabled>Confirming</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDataStore } from '../store'
import { db } from '../config/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const emit = defineEmits(['closeModal', 'accepted'])
const { reservationData } = defineProps({
    reservationData: Object
})

const dataStore = useDataStore()

const employees = computed(() => dataStore.availableEmployees)

const assignedEmployee = ref([])

const limitWorkers = ref([])

const assignEmployee = (employeeID) => {
    if(event.target.checked){
        if(assignedEmployee.value.length === reservationData.noOfWorkers){
            event.target = unchecked
        }else{
            assignedEmployee.value.push(employeeID)
        }
    }else{
        const index = assignedEmployee.value.indexOf(employeeID)

        assignedEmployee.value.splice(index, 1)
    }
}

// accept reservation
const docRef = doc(db, 'reservations', reservationData.id)
const accepting = ref(false)

const acceptReservation = async () => {
    try {
        accepting.value = true
        await updateDoc(docRef, {
            assignedEmployees: assignedEmployee.value,
            status: 'accepted'
        })
        emit('accepted')
        $toast.success('Accepted reservation successfully')
    } catch (error) {
        console.log(error)
        $toast('Failed accepting reservation')
    } finally {
        accepting.value = false
    }
}
</script>