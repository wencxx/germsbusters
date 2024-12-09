<template>
    <div class="flex justify-center">
        <div class="bg-white w-full max-w-6xl h-96 rounded-md border p-10 space-y-3 mt-14">
            <div class="flex justify-between">
                <h1 class="text-gray-500 font-semibold tracking-wide text-lg">Pending Employees</h1>
                <div class="flex gap-x-2">
                    <select v-model="limitPerPage" class="border rounded px-2">
                        <option value="5">5 rows</option>
                        <option value="10">10 rows</option>
                        <option value="15">15 rows</option>
                        <option value="20">20 rows</option>
                        <option value="25">25 rows</option>
                    </select>
                    <input type="text" class="border pl-2 rounded" placeholder="Search" v-model="searchFilter">
                </div>
            </div>
            <table class="w-full">
                <thead>
                    <tr class="border-y text-gray-600">
                        <th class="py-2 w-2/12">Full Name</th>
                        <th class="py-2 w-2/12">Birthday</th>
                        <th class="py-2 w-2/12">Gender</th>
                        <th class="py-2 w-3/12">Expertise</th>
                        <th class="py-2 w-2/12">Status</th>
                        <th class="py-2 w-1/12">Action</th>
                    </tr>
                </thead>
                <tbody v-if="!fetching && filteredEmployee.length">
                    <tr v-for="(employee, index) in filteredEmployee" :key="index" class="border-y text-center text-gray-600" :class="{ 'animate-pulse bg-gray-100': deleting && employeeIndexToDelete === index }">
                        <td class="py-2 capitalize">{{ employee.fullName }}</td>
                        <td class="py-2">{{ moment(employee.birthday).format('ll') }}</td>
                        <td class="py-2">{{ employee.gender }}</td>
                        <td class="py-2">
                            <div class="flex w-full gap-1 flex-wrap">
                                <p v-for="expertise in employee.expertise" :key="expertise" class="text-sm bg-blue-500 text-white px-1 rounded text-start">{{ expertise }}</p>
                            </div>
                        </td>
                        <td class="py-2">
                            <p class="bg-orange-500 text-white rounded text-sm py-1 w-1/2 mx-auto">Pending</p>
                        </td>
                        <td class="py-2">
                            <div class="text-lg space-x-1">
                                <button>
                                    <Icon icon="mdi:check" @click="acceptEmployee(employee.id, index)" class="text-green-500" />
                                </button>
                                <button>
                                    <Icon icon="mdi:trash" class="text-red-500" @click="deleteEmployee(employee.id, index)" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <!-- no data -->
                <tbody v-else-if="!fetching && !filteredEmployee.length">
                    <tr class="border-y text-center text-gray-600">
                        <td colspan="6" class="py-2">No pending employee to show</td>
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
                            <div class="h-6 bg-gray-200 animate-pulse w-5/12 mx-auto rounded"></div>
                        </td>
                        <td class="py-2">
                            <div class="h-6 bg-gray-200 animate-pulse w-5/12 mx-auto rounded"></div>
                        </td>
                        <td class="py-2">
                            <div class="flex justify-center gap-x-2">
                                <div class="h-6 bg-gray-200 animate-pulse w-3/12 rounded"></div>
                                <div class="h-6 bg-gray-200 animate-pulse w-3/12 rounded"></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>

            </div>
        </div>

        <!-- accept confirmation modal -->
        <confirmationModal v-if="showConfirmationModal" @closeModal="showConfirmationModal = false" @confirmAccept="confirmAccept">
            <h1 class="text-center text-xl font-semibold text-gray-600 uppercase w-full">Are you sure you want to accept this employee?</h1>
        </confirmationModal>

        <!-- delete confirmation modal -->
        <deleteModal v-if="showDeleteModal" @closeModal="showDeleteModal = false" @confirmDelete="confirmDelete">
            <h1 class="text-center text-xl font-semibold text-gray-600 uppercase w-full">Are you sure you want to decline this employee</h1>
        </deleteModal>
    </div>
</template>

<script setup>
import { db } from '../config/firebaseConfig'
import { collection, query, where, and, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { onMounted, ref, computed } from 'vue'
import moment from 'moment'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

// import components
import confirmationModal from '../components/confirmationModal.vue'
import deleteModal from '../components/deleteModal.vue'

onMounted(() => {
    getPendingEmployee()
})

const $toast = useToast()

// get pending employees
const pendingEmployees = ref([])
const fetching = ref(false)

const getPendingEmployee = async () => {
    try {
        fetching.value = true
        const q = query(
            collection(db, 'users'),
            and(
                where('isAccepted', '==', false),
                where('role', '==', 'employee'),
            )
        )

        const snapshots = await getDocs(q)

        snapshots.docs.forEach(doc => {
            pendingEmployees.value.push({
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

const filteredEmployee = computed(() => {
    if (!searchFilter.value) return pendingEmployees.value

    return pendingEmployees.value.filter(employee => {
        const searchTerm = searchFilter.value.toLowerCase()

        return (
            employee.fullName.toLowerCase().includes(searchTerm) ||
            employee.gender.toLowerCase().includes(searchTerm) ||
            employee.expertise.includes(searchTerm)
        )
    }).splice(0, limitPerPage.value - 1)
})

// accept employee
const employeeIDToAccept = ref('')
const employeeIndexToAccept = ref('')
const showConfirmationModal = ref(false)

const acceptEmployee = (employeeID, index) => {
    employeeIDToAccept.value = employeeID
    employeeIndexToAccept.value = index

    showConfirmationModal.value = true
}

const confirmAccept = async () => {
    try {
        showConfirmationModal.value = false
        const docRef = doc(db, 'users', employeeIDToAccept.value)

        await updateDoc(docRef, {
            isAccepted: true
        })

        pendingEmployees.value.splice(employeeIndexToAccept.value, 1)
        $toast.success('Employee accepted successfully.')
    } catch (error) {
        console.log(error)
        $toast.error('Failed to accept employee.')
    }
}

// delete employee
const employeeIDToDelete = ref('')
const employeeIndexToDelete = ref('')
const showDeleteModal = ref(false)
const deleting = ref(false)

const deleteEmployee = (employeeID, index) => {
    employeeIDToDelete.value = employeeID
    employeeIndexToDelete.value = index

    showDeleteModal.value = true
}

const confirmDelete = async () => {
    try {
        deleting.value = true
        showDeleteModal.value = false

        const docRef = doc(db, 'users', employeeIndexToDelete.value)

        await deleteDoc(docRef)

        pendingEmployees.value.splice(employeeIndexToDelete.value, 1)
        $toast.success('Employee declined successfully')
    } catch (error) {
        $toast.error('Failed to delete employee')
    } finally {
        deleting.value = false
    }
}
</script>