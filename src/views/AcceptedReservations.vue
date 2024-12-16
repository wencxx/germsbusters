<template>
    <div class="flex justify-center">
        <div class="mt-14 p-10 bg-white w-full max-w-[80%] h-fit min-h-96 rounded-md border space-y-3">
            <div class="flex justify-between">
                <h1 class="text-gray-500 font-semibold tracking-wide text-lg">Canceled Reservations</h1>
                <div class="flex gap-x-2">
                    <input type="text" class="border pl-2 rounded" placeholder="Search" v-model="searchFilter">
                </div>
            </div>
            <div class="w-full overflow-x-auto pb-10">
                <table class="w-[130%]">
                    <thead>
                        <tr class="border-y text-gray-600">
                            <th class="py-2">Name</th>
                            <th class="py-2">Service</th>
                            <th class="py-2">Location</th>
                            <th class="py-2">Date</th>
                            <th class="py-2">Contact Number</th>
                            <th class="py-2">Floor Area</th>
                            <th class="py-2">No. of Workers</th>
                            <th class="py-2">Total</th>
                            <th class="py-2">MOP</th>
                            <th class="py-2">Reference</th>
                            <th class="py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="!fetching && filteredReservations.length">
                        <tr v-for="(reservation, index) in filteredReservations" :key="index" class="border-y text-center text-gray-600" :class="{ 'animate-pulse bg-gray-100': rejecting && reservationIndexToReject === index }">
                            <td class="py-2 capitalize">{{ reservation.name }}</td>
                            <td class="py-2">{{ getServiceDetails(reservation.serviceID)?.title }}</td>
                            <td class="py-2">{{ reservation.block + ', ' + reservation.street + ', ' + reservation.barangay + ', ' + reservation.city  }}</td>
                            <td class="py-2 capitalize">{{ moment(reservation.date).format('lll') }}</td>
                            <td class="py-2 capitalize">{{ reservation.contactNumber }}</td>
                            <td class="py-2 capitalize">{{ reservation.floorArea }}</td>
                            <td class="py-2 capitalize">{{ reservation.noOfWorkers }}</td>
                            <td class="py-2 capitalize">{{ formatTotal(reservation.total) }}</td>
                            <td class="py-2 capitalize">{{ reservation.paymentMethod }}</td>
                            <td class="py-2 capitalize">{{ reservation.referenceNumber }}</td>
                            <td class="py-2">
                                <div class="space-x-1">
                                    <button>
                                        <Icon icon="mdi:check" @click="confirmReservation(reservation)" class="text-green-500 text-xl" />
                                    </button>
                                    <button>
                                        <Icon icon="mdi:trash" class="text-red-500 text-xl" @click="rejectReservation(reservation.id, index)" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <!-- no data -->
                    <tbody v-else-if="!fetching && !filteredReservations.length">
                        <tr class="border-y text-center text-gray-600">
                            <td colspan="11" class="py-2">No services available</td>
                        </tr>
                    </tbody>
                    <!-- loader -->
                    <tbody v-else>
                        <tr v-for="i in 5" :key="i" class="border-y">
                            <td class="py-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-8/12 mx-auto rounded"></div>
                            </td>
                            <td class="py-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-8/12 mx-auto rounded"></div>
                            </td>
                            <td class="py-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-8/12 mx-auto rounded"></div>
                            </td>
                            <td class="py-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-8/12 mx-auto rounded"></div>
                            </td>
                            <td class="py-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-8/12 mx-auto rounded"></div>
                            </td>
                            <td class="py-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-8/12 mx-auto rounded"></div>
                            </td>
                            <td class="py-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-8/12 mx-auto rounded"></div>
                            </td>
                            <td class="py-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-8/12 mx-auto rounded"></div>
                            </td>
                            <td class="py-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-9/12 mx-auto rounded"></div>
                            </td>
                            <td class="py-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-5/12 mx-auto rounded"></div>
                            </td>
                            <td class="py-2">
                                <div class="flex justify-center gap-x-2">
                                    <div class="h-6 bg-gray-200 animate-pulse w-2/12 rounded"></div>
                                    <div class="h-6 bg-gray-200 animate-pulse w-2/12 rounded"></div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <acceptReservation v-if="showAcceptModal" :reservationData="reservationData" @closeModal="showAcceptModal = false" @accepted="accepted" />
        <rejectReservationModal v-if="showRejectModal" :reservationIdToReject="reservationIdToReject" @closeModal="showRejectModal = false" @rejected="rejected"/>
    </div>
</template>

<script setup>
import acceptReservation from '../components/acceptReservation.vue'
import rejectReservationModal from '../components/rejectReservation.vue'
import { computed, onMounted, ref } from 'vue'
import { useDataStore } from '../store'
import moment from 'moment'
import { db } from '../config/firebaseConfig'
import { doc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const dataStore = useDataStore()

onMounted(() => {
    getCanceledReservations()
})

const canceledReservations = ref([])
const fetching = ref(false)

const getServiceDetails = (serviceID) => {
    return dataStore.getServiceDetails(serviceID)
}

const getCanceledReservations = async () => {
    const q = query(
        collection(db, 'reservations'),
        where('status', '==', 'accepted')
    )
    try {
        fetching.value = true
        const snapshots = await getDocs(q)

        snapshots.docs.forEach(doc => {
            canceledReservations.value.push({
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

// filtered employees
const searchFilter = ref('')
const limitPerPage = ref(5)    

const filteredReservations = computed(() => {
    if (!searchFilter.value) return canceledReservations.value;

    const searchTerm = searchFilter.value.toLowerCase();

    return canceledReservations.value
        .filter(reservation => 
            Object.values(reservation).some(field => 
                typeof field === 'string' && field.toLowerCase().includes(searchTerm)
            )
        )
        .splice(0, limitPerPage.value);
});

const formatTotal = (total) => {
    return Number(total).toLocaleString('en-US', {
        style: 'currency',
        currency: 'PHP'
    })
} 

// accept reservation
const showAcceptModal = ref(false)
const reservationData = ref({})

const confirmReservation = (reservation) => {
    reservationData.value = reservation
    showAcceptModal.value = true
}

const accepted = () => {
    showAcceptModal.value = false
    const index = canceledReservations.value.indexOf(reservationData.value)
    canceledReservations.value.splice(index, 1)
}

// reject reservation
const showRejectModal = ref(false)
const reservationIdToReject = ref('')
const reservationIndexToReject = ref('')
const rejecting = ref(false)

const rejectReservation = (reservationID, index) => {
    reservationIdToReject.value = reservationID
    reservationIndexToReject.value = index
    showRejectModal.value = true
}

const rejected = async (data) => {
    try {
        rejecting.value = true
        showRejectModal.value = false
        const docRef = doc(db, 'reservations', reservationIdToReject.value)

        await updateDoc(docRef, {
            status: 'rejected',
            reason: data
        })

        canceledReservations.value.splice(reservationIndexToReject.value, 1)
        $toast.success("Successfully rejected reservation")
    } catch (error) {
        $toast.error("Failed rejecting reservation")
        console.log(error)
    } finally {
        rejecting.value = false
    }
}
</script>