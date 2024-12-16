<template>
    <div class="w-screen h-screen bg-black/10 fixed top-0 left-0 flex items-center justify-center">
        <form @submit.prevent="confirmReservation" class="h-fit w-full max-w-md p-5 bg-white rounded-md border flex flex-col items-center gap-y-5">
            <h1 class="text-lg font-gray-600 font-semibold">Complete Reservation</h1>
            <div class="w-full space-y-2">
                <p v-if="missingImage" class="bg-red-500 pl-2 rounded text-white">{{ missingImage }}</p>
                <h1 class="text-lg text-gray-600">Upload Photos</h1>
                <div class="space-y-2 !mt-2">
                    <div>
                        <label class=" text-gray-600">Before Service</label>
                        <input type="file" accept=".jpg, .jpeg, .png" @change="handleImageUpload('before')">
                    </div>
                    <div>
                        <label class=" text-gray-600">After Service</label>
                        <input type="file" accept=".jpg, .jpeg, .png" @change="handleImageUpload('after')">
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-x-5 w-full">
                <button class="w-1/4 bg-red-500 rounded text-white py-1" type="button" @click="emit('closeModal')">Close</button>
                <button class="w-1/4 bg-green-500 rounded text-white py-1" v-if="!confirming">Confirm</button>
                <button class="w-1/4 bg-green-500 rounded text-white py-1 animate-pulse" type="button" v-else>Confirming</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../config/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import axios from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const { reservationDataToComplete } = defineProps({
    reservationDataToComplete: Object
})

const emit = defineEmits(['closeModal', 'completed'])

const beforeImage = ref(null)
const afterImage = ref(null)

const handleImageUpload = (type) => {
    if(type === 'before'){
        beforeImage.value = event.target.files[0]
    }else{
        afterImage.value = event.target.files[0]
    }
}

// confirm reservation
const missingImage = ref('')
const confirming = ref(false)
const docRef = doc(db, 'reservations', reservationDataToComplete.id)

const confirmReservation = async () => {
    missingImage.value = ''
    if(beforeImage.value === null || afterImage.value === null) return missingImage.value = 'Please upload all images'

    const beforeData = new FormData();
    beforeData.append("file", beforeImage.value);
    beforeData.append("upload_preset", "beforeService");

    const afterData = new FormData();
    afterData.append("file", afterImage.value);
    afterData.append("upload_preset", "afterService");
    
    try {
        confirming.value = true
        
        const responseBefore = await axios.post(
        "https://api.cloudinary.com/v1_1/dqgfea32w/image/upload",
        beforeData
        );

        const responseAfter = await axios.post(
        "https://api.cloudinary.com/v1_1/dqgfea32w/image/upload",
        afterData
        );

        await updateDoc(docRef, {
            status: 'completed',
            beforeImage: responseBefore.data.secure_url,
            after: responseAfter.data.secure_url
        })

        emit('completed')
        $toast.success('Completed reservation successfully')
    } catch (error) {
        $toast.error('Failed to complete reservation')
    } finally {
        confirming.value = false
    }
}
</script>