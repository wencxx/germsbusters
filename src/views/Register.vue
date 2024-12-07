<template>
    <div class="flex items-center justify-center">
        <form @submit.prevent="register" class="w-full max-w-lg h-fit flex flex-col items-center p-">
            <img src="../assets/logo.png" alt="site logo" class="w-14 aspect-square">
            <h1 class="text-2xl font-medium">Sign Up</h1>
            <p v-if="err" class="bg-red-500 w-full pl-2 text-white rounded py-1">{{ err }}</p>
            <div class="w-full mt-7 grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-y-1 w-full">
                    <label>Full Name</label>
                    <input type="text" class="bg-transparent border h-9 rounded pl-2" v-model="registrationData.fullName">
                </div>
                <div class="flex flex-col gap-y-1 w-full">
                    <label>Birthday</label>
                    <input type="date" class="bg-transparent border h-9 rounded pl-2" v-model="registrationData.birthday">
                </div>
                <div class="flex flex-col gap-y-1 w-full">
                    <label>Gender</label>
                    <select class="bg-transparent border h-9 rounded pl-2" v-model="registrationData.gender">
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
                <div class="flex flex-col gap-y-1 w-full">
                    <label>Address</label>
                    <input type="text" class="bg-transparent border h-9 rounded pl-2" v-model="registrationData.address">
                </div>
                <div class="flex flex-col gap-y-1 w-full">
                    <label for="picture">Primary ID</label>
                    <input id="picture" type="file" class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium" @change="uploadId">
                </div>
                <div class="flex flex-col gap-y-1 w-full">
                    <label>Username</label>
                    <input type="text" class="bg-transparent border h-9 rounded pl-2" v-model="registrationData.username">
                </div>
                <div class="flex flex-col gap-y-1 w-full">
                    <label>Password</label>
                    <input type="password" class="bg-transparent border h-9 rounded pl-2" v-model="registrationData.password">
                </div>
                <div class="flex flex-col gap-y-1 w-full">
                    <label>Confirm Password</label>
                    <input type="password" class="bg-transparent border h-9 rounded pl-2" v-model="registrationData.confirmPassword">
                </div>
                <div class="flex flex-col gap-y-1 w-full col-span-2">
                    <h1 class="text-lg font-medium">Select Expertise</h1>
                    <div class="flex flex-wrap gap-2">
                        <label for="Post-Construction Cleaning" class="bg-gray-200 w-fit px-3 rounded-full py-1 cursor-pointer" :class="{ '!bg-blue-500 !text-white': registrationData.expertise.includes('Post-Construction Cleaning') }">Post-Construction Cleaning <Icon icon="mdi:add" class="inline-block" /></label>
                        <input id="Post-Construction Cleaning" type="checkbox" class="hidden" value="Post-Construction Cleaning" v-model="registrationData.expertise">
                        <label for="Deep Cleaning" class="bg-gray-200 w-fit px-3 rounded-full py-1 cursor-pointer" :class="{ '!bg-blue-500 !text-white': registrationData.expertise.includes('Deep Cleaning') }">Deep Cleaning <Icon icon="mdi:add" class="inline-block" /></label>
                        <input id="Deep Cleaning" type="checkbox" class="hidden" value="Deep Cleaning" v-model="registrationData.expertise">
                        <label for="Floor Polishing and Buffing" class="bg-gray-200 w-fit px-3 rounded-full py-1 cursor-pointer" :class="{ '!bg-blue-500 !text-white': registrationData.expertise.includes('Floor Polishing and Buffing') }">Floor Polishing and Buffing <Icon icon="mdi:add" class="inline-block" /></label>
                        <input id="Floor Polishing and Buffing" type="checkbox" class="hidden" value="Floor Polishing and Buffing" v-model="registrationData.expertise">
                        <label for="Residential Cleaning" class="bg-gray-200 w-fit px-3 rounded-full py-1 cursor-pointer" :class="{ '!bg-blue-500 !text-white': registrationData.expertise.includes('Residential Cleaning') }">Residential Cleaning <Icon icon="mdi:add" class="inline-block" /></label>
                        <input id="Residential Cleaning" type="checkbox" class="hidden" value="Residential Cleaning" v-model="registrationData.expertise">
                    </div>
                </div>
                <div class="col-span-2">
                    <button v-if="!registering" class="w-full bg-primary hover:bg-green-500 py-2 rounded-lg text-white !mt-5">Register</button>
                    <button v-else class="w-full bg-primary hover:bg-green-500 py-2 rounded-lg text-white !mt-5 animate-pulse" disabled>Registering</button>
                    <div class="">
                        <p class="space-x-1"><span>Already have an account?</span> <router-link :to="{ name: 'login' }" class="text-blue-500 underline">Login</router-link></p>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { auth, db } from '../config/firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore' 
import { useRouter } from 'vue-router'

const router = useRouter()


const registrationData = ref({
    fullName: '',
    birthday: '',
    gender: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    isAccepted: 'employee',
    expertise: []
})

const primaryID = ref(null)

const uploadId = () => {
    const file = event.target.files[0]

    primaryID.value = file
}

const registering = ref(false)
const err = ref('')

const hasEmptyKeys = (obj) => {
  for (let key in obj) {
    if (!obj[key]) {
        return true;
    }
  }
  return false; 
}

const userRef = collection(db, 'users')

const register = async () => {
    registering.value = true

    if(hasEmptyKeys(registrationData.value)){
        registering.value = false
        err.value = 'Fill out all fields.'
        return
    }

    if (!primaryID.value) {
        registering.value = false
        err.value = 'The primary ID field cannot be empty.'
        return
    } 

    if(registrationData.value.password !== registrationData.value.confirmPassword){
        registering.value = false
        err.value = "Password does'nt match."
        return
    }

    const formData = new FormData();
    formData.append("file", primaryID.value);
    formData.append("upload_preset", "primary_id"); 

    try {
        const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dqgfea32w/image/upload",
        formData
        );

        const userCredentials = await createUserWithEmailAndPassword(auth, `${registrationData.value.username}@gmail.com`, registrationData.value.password)

        const user = userCredentials.user

        await updateProfile(user, {
            displayName: registrationData.value.fullName,
        })

        const { password, confirmPassword, ...otherData } = registrationData.value

        const addedUser =  await addDoc(userRef, {
            ...otherData,
            userID: user.uid,
            primaryID:  response.data.secure_url
        }) 

        if(!addedUser.empty){
            router.push({
                name: 'login',
                query: {
                    registered: 'true'
                }
            })
        }
    } catch (error) {
        console.error("Error registering", error);
    } finally {
        registering.value = false
    }
};
</script>