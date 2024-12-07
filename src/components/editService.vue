<template>
    <div class="fixed top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
        <form @submit.prevent="updateService" class="bg-white w-full max-w-sm h-fit p-5 rounded-lg border border-gray-300 space-y-3">
            <h1 class="text-center text-lg">Add Service</h1>
            <div class="space-y-1">
                <p v-if="err" class="pl-2 bg-red-500 text-white rounded-md py-1 text-sm">Failed updating service</p>
                <div class="flex flex-col space-y-1">
                    <label for="title">Title</label>
                    <input id="title" type="text" class="border h-8 rounded pl-2" v-model="serviceData.title">
                </div>
                <div class="flex flex-col space-y-1">
                    <label for="description">Title</label>
                    <textarea id="description" class="border min-h-14 rounded p-2" v-model="serviceData.description"></textarea>
                </div>
                <div class="flex flex-col space-y-1">
                    <label for="rate">Rate (per sqm)</label>
                    <input id="rate" type="number" class="border h-8 rounded pl-2" v-model="serviceData.rate">
                </div>
            </div>
            <div class="flex  gap-x-3 justify-end">
                <button class="bg-red-500 hover:bg-red-600 w-1/4 py-1 rounded text-white text-sm" type="button" @click="emit('closeModal')">Close</button>
                <button v-if="!updating" class="bg-green-500 hover:bg-green-600 w-1/4 py-1 rounded text-white text-sm">Update</button>
                <button v-else class="bg-green-500 hover:bg-green-600 w-1/4 py-1 rounded text-white text-sm animate-pulse" disabled>Updating</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../config/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore' 
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const { service } = defineProps({
    service: Object
})
const emit = defineEmits(['closeModal', 'updated'])
const $toast = useToast()

const serviceData = ref({
    title: service.title || '',
    description: service.description || '',
    rate: service.rate || '',
})


// add services
const serviceDoc = doc(db, 'services', service.id)
const updating = ref(false)
const err = ref(false)

const updateService = async () => {
    err.value = false
    updating.value = true
    try {
        await updateDoc(serviceDoc, serviceData.value)

        $toast.success('Updated service successfully.')
        emit('updated', { ...serviceData.value, id: service.id})
    } catch (error) {
        err.value = true
        console.log(error)
    } finally {
        updating.value = false
    }
}
</script>