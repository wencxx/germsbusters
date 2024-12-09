<template>
    <div class="w-screen h-screen fixed top-0 left-0 bg-black/10 flex items-center justify-center">
        <div class="absolute top-5 right-5 p-2 bg-gray-100 rounded-full cursor-pointer" @click="emit('closeModal')"> 
            <Icon icon="mdi:close" class="text-lg" />
        </div>
        <img :src="imageToView" alt="primary id" class="h-[60%] max-w-md">
    </div>  
</template>

<script setup>
const { imageToView } = defineProps({
    imageToView: String
})

const emit = defineEmits(['closeModal'])
</script>