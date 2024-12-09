<template>
    <div class="bg-black/10 w-screen h-screen flex items-center justify-center fixed top-0 left-0">
        <div class="bg-white rounded-md h-fit w-full max-w-sm flex flex-col items-center justify-center gap-y-5 p-5">
            <Icon icon="mdi:warning" class="text-8xl text-orange-500" />
            <slot></slot>
            <div class="w-full flex justify-center gap-x-2">
                <button class="w-1/3 bg-green-500 text-white py-1 rounded text-sm" @click="emit('closeModal')">No</button>
                <button class="w-1/3 bg-red-500 text-white py-1 rounded text-sm" @click="emit('confirmAccept')">Yes</button>
            </div>
        </div>
    </div>
</template>

<script setup>

const { type } = defineProps({
    type: String
})

const emit = defineEmits(['closeModal', 'confirmAccept'])
</script>