<template>
    <div class="fixed top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
        <div class="bg-white p-5 rounded-lg border shadow-sm h-fit w-full max-w-lg flex flex-col items-center gap-y-5">
            <h1 class="text-xl text-gray-800 font-bold">Reject Reservation</h1>
            <div class="w-full space-y-2">
                <label class="text-lg">Enter reason for rejection</label>
                <textarea class="min-h-10 w-full border rounded p-2" v-model="reason"></textarea>
            </div>
            <div class="w-full flex justify-end gap-x-2 text-white rounded py-1">
                <button class="w-1/4 py-1 bg-red-500 rounded" @click="emit('closeModal')">Close</button>
                <button class="w-1/4 py-1 bg-green-500 rounded" @click="emit('rejected', reason)">Reject</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['closeModal', 'rejected'])

const reason = ref('')
</script>