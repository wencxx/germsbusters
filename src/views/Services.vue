<template>
    <div class="flex justify-center">
        <div class="bg-white w-full max-w-6xl h-96 rounded-md border p-10 space-y-3 mt-14">
            <div class="flex justify-between">
                <h1 class="text-gray-500 font-semibold tracking-wide text-lg">Services</h1>
                <div class="flex gap-x-2">
                    <input type="text" class="border pl-2 rounded" placeholder="Search" v-model="searchFilter">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm" @click="openAddModal = true">Add Service</button>
                </div>
            </div>
            <table class="w-full">
                <thead>
                    <tr class="border-y text-gray-600">
                        <th class="py-2 w-1/5">Title</th>
                        <th class="py-2 w-2/5">Description</th>
                        <th class="py-2 w-1/5">Rate   (per sqm)</th>
                        <th class="py-2 w-1/5">Action</th>
                    </tr>
                </thead>
                <tbody v-if="!fetching && filteredServices.length">
                    <tr v-for="(service, index) in filteredServices" :key="index" class="border-y text-center text-gray-600" :class="{ 'animate-pulse bg-gray-100': deleting && indexToDelete === index }">
                        <td class="py-2 capitalize">{{ service.title }}</td>
                        <td class="py-2">{{ service.description }}</td>
                        <td class="py-2">₱{{ service.rate }}</td>
                        <td class="py-2">
                            <div>
                                <button>
                                    <Icon icon="mdi:pencil" @click="updateService(service)" class="text-green-500" />
                                </button>
                                <button>
                                    <Icon icon="mdi:trash" class="text-red-500" @click="deleteService(service.id, index)" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <!-- no data -->
                <tbody v-else-if="!fetching && !filteredServices.length">
                    <tr class="border-y text-center text-gray-600">
                        <td colspan="4" class="py-2">No services available</td>
                    </tr>
                </tbody>
                <!-- loader -->
                <tbody v-else>
                    <tr v-for="i in 5" :key="i" class="border-y">
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

        <!-- add service component -->
        <addService v-if="openAddModal" @closeModal="openAddModal = false" @added="added" />
        <!-- edit service component -->
        <editService v-if="openEditModal" @closeModal="openEditModal = false" :service="serviceToEdit" @updated="updated" />
        <!-- delete modal -->
        <deleteModal v-if="openDeleteModal" type="Service" @closeModal="openDeleteModal = false" @confirmDelete="confirmedDelete">
            <h1 class="text-center text-xl font-semibold text-gray-600 uppercase w-3/4">Are you sure you want to delete this service</h1>
        </deleteModal>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { db } from '../config/firebaseConfig'
import {collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

// component
import addService from '../components/addService.vue'
import editService from '../components/editService.vue'
import deleteModal from '../components/deleteModal.vue'

onMounted(() => {
    getServices()
})

const $toast = useToast()

// get services
const servicesCollection = collection(db, 'services')
const fetching = ref(false)
const services = ref([])

const getServices = async () => {
    fetching.value = true 
    try {
        const snapshots = await getDocs(servicesCollection)

        snapshots.docs.forEach(doc => {
            services.value.push({
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

// filter services 
const searchFilter = ref('')
const limitPerPage = ref(10)

const filteredServices = computed(() => {
    if (!searchFilter.value) return services.value

    return services.value.filter(service => {
        const rate = service.rate?.toString().toLowerCase() || ''
        const searchTerm = searchFilter.value.toLowerCase()

        return (
            service.title.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm) ||
            rate.includes(searchTerm)
        )
    }).splice(0, limitPerPage.value - 1)
})


// add service
const openAddModal = ref(false)

const added = (data) => {
    services.value.unshift(data)

    openAddModal.value = false
}

// edit service
const openEditModal = ref(false)

const serviceToEdit = ref({})

const updateService = (service) => {
    serviceToEdit.value = service
    openEditModal.value = true
}

const updated = (data) => {
    const editedService = services.value.find(service => service.id === data.id)

    if (editedService) {
        Object.assign(editedService, data)
    }

    openEditModal.value = false
}


// delete service
const openDeleteModal = ref(false)
const indexToDelete = ref('')
const serviceIdToDelete = ref('')
const deleting = ref(false)

const deleteService = async (serviceId, index) => {
    openDeleteModal.value = true
    indexToDelete.value = index
    serviceIdToDelete.value = serviceId
}

const confirmedDelete = async () => {
    openDeleteModal.value = false
    const serviceDoc = doc(db, 'services', serviceIdToDelete.value)
    try {
        deleting.value = true
        await deleteDoc(serviceDoc)

        services.value.splice(indexToDelete.value, 1)
        $toast.success("Service deleted successfully.")
    } catch (error) {
        console.log('error')
        $toast.error("Failed deleting service.")
    } finally {
        deleting.value = false
    }
}
</script>