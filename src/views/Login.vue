<template>
    <div class="flex items-center justify-center gap-y-5">
        <form class="w-full max-w-sm h-96 flex flex-col items-center p-3">
            <img src="../assets/logo.png" alt="site logo" class="w-14 aspect-square">
            <h1 class="text-2xl font-medium">Welcome Back</h1>
            <div class="w-full space-y-3 mt-7">
                <div class="flex flex-col gap-y-1 w-full">
                    <label for="Username">Username</label>
                    <input type="text" class="bg-transparent border h-9 rounded pl-2">
                </div>
                <div class="flex flex-col gap-y-1 w-full">
                    <label for="Username">Password</label>
                    <input type="password" class="bg-transparent border h-9 rounded pl-2">
                </div>
                <button class="w-full bg-primary hover:bg-yellow-400 py-2 rounded-lg text-white !mt-5">Sign In</button>
                <div class="">
                    <p class="space-x-1 text-sm"><span>Don't have an account yet?</span> <router-link class="text-blue-500 underline">Sign Up</router-link></p>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>

</script>