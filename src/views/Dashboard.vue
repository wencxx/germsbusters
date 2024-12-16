<template>
  <div class="flex justify-center !p-10">
    <div class="w-full flex justify-center">
      <div class="grid grid-cols-4 w-full max-w-6xl h-fit gap-10">
        <div class="w-full h-32 bg-white shadow-sm rounded-lg border p-3 px-5 flex flex-col justify-around">
          <div class="w-full flex justify-between items-center">
            <p class="text-gray-600 font-medium text-lg">Total Employee</p>
            <Icon icon="weui:arrow-filled" class="text-gray-600 text-2xl" />
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-gray-700">{{ count }}</h1>
          </div>
        </div>
        <div class="w-full h-32 bg-white shadow-sm rounded-lg border p-3 px-5 flex flex-col justify-around">
          <div class="w-full flex justify-between items-center">
            <p class="text-gray-600 font-medium text-lg w-5/6">Completed Reservations</p>
            <Icon icon="weui:arrow-filled" class="text-gray-600 text-2xl" />
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-gray-700">{{ reservationCount }}</h1>
          </div>
        </div>
        <div class="w-full h-32 bg-white shadow-sm rounded-lg border p-3 px-5 flex flex-col justify-around">
          <div class="w-full flex justify-between items-center">
            <p class="text-gray-600 font-medium text-lg w-5/6">Services</p>
            <Icon icon="weui:arrow-filled" class="text-gray-600 text-2xl" />
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-gray-700">{{ servicesCount }}</h1>
          </div>
        </div>
        <div class="w-full h-32 bg-white shadow-sm rounded-lg border p-3 px-5 flex flex-col justify-around">
          <div class="w-full flex justify-between items-center">
            <p class="text-gray-600 font-medium text-lg">Total Revenue</p>
            <Icon icon="weui:arrow-filled" class="text-gray-600 text-2xl" />
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-gray-700">{{ revenue }}</h1>
            <!-- <div>
                <p v-if="percentageChange >= 0" class="text-green-500 font-medium">
                +{{ percentageChange }}% Increase
                </p>
                <p v-else class="text-red-500 font-medium">
                {{ percentageChange }}% Decrease
                </p>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../store'
import { db } from '../config/firebaseConfig'
import { collection, getDocs, where, query, getCountFromServer, and } from 'firebase/firestore'

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

onMounted(() => {
    getCompleted()
    countEmployee()
    countCompletedReservation()
    countServices()
})

const completedServices = ref([])

const getCompleted = async () => {
    const q = query(
        collection(db, 'reservations'),
        where('status', '==', 'completed')
    )
    try {
        const snapshots = await getDocs(q)

        snapshots.docs.forEach(doc => {
            completedServices.value.push({
                id: doc.id,
                ...doc.data()
            })
        })
    } catch (error) {
        console.log(error)
    }
}

const getRevenueForMonth = (month) => {
    const totalRevenue = completedServices.value
        .filter(service => {
            const serviceDate = new Date(service.dateAccepted) 
            return serviceDate.getMonth() === month && serviceDate.getFullYear() === new Date().getFullYear()
        })
        .reduce((acc, next) => acc + next.total, 0)
    return totalRevenue
}

const revenueThisMonth = computed(() => {
    return getRevenueForMonth(new Date().getMonth())
})

const revenueLastMonth = computed(() => {
    return getRevenueForMonth(new Date().getMonth() - 1)
})

const percentageChange = computed(() => {
    const currentRevenue = revenueThisMonth.value
    const lastRevenue = revenueLastMonth.value
    if (lastRevenue === 0) return currentRevenue > 0 ? 100 : 0
    const change = ((currentRevenue - lastRevenue) / lastRevenue) * 100
    return Math.round(change)
})

const revenue = computed(() => {
    const totalRevenue = completedServices.value.reduce((acc, next) => {
        return acc + next.total 
    }, 0)

    return totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })
})


// get employee
const count = ref(0)

const countEmployee = async () => {
    try {
        const q = query(
            collection(db, 'users'),
            and(
                where('isAccepted', '==', true),
                where('role', '==', 'employee'),
            )
        )
        
        const snapshot = await getCountFromServer(q)

        count.value = snapshot.data().count
    } catch (error) {
        console.log(error)
    }
}

// get reservation
const reservationCount = ref(0)

const countCompletedReservation = async () => {
    try {
        const q = query(
            collection(db, 'reservations'),
            where('status', '==', 'completed'),
        )
        
        const snapshot = await getCountFromServer(q)

        reservationCount.value = snapshot.data().count
    } catch (error) {
        console.log(error)
    }
}

// get servecies
const servicesCount = ref(0)

const countServices = async () => {
    try {
        const q = collection(db, 'services')
        
        const snapshot = await getCountFromServer(q)

        servicesCount.value = snapshot.data().count
    } catch (error) {
        console.log(error)
    }
}
</script>

