<template>
    <div class="flex flex-col items-center justify-center gap-y-5">
        <Icon icon="nimbus:forbidden" class="text-8xl" />
        <div class="text-center">
            <h1 class="text-2xl font-medium">You are not authorized</h1>
            <p class="text-gray-500">It seems that you don't have permission to access this page.</p>
            <button class="underline mt-3" @click="back">Back</button>
        </div>
    </div>
</template>

<script setup>

const back = () => {
    history.back()
}
</script>