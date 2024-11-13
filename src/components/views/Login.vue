<template>
    <main class="w-screen h-screen flex justify-center items-center bg-slate-100 p-4">
        <form class="flex flex-col gap-4 w-full md:w-[350px] rounded-md shadow-md p-4 bg-white text-md"
            @submit.prevent="login">
            <div class="flex flex-col justify-center items-center">
                <img :src="`${app_url}/logo.png`" class="w-32" />
                <p class="text-xl text-slate-600">Login here</p>
            </div>
            <input class="py-1 px-2 border-2 border-slate-200" type="text" v-model="credentials.email"
                placeholder="Email" />
            <input class="py-1 px-2 border-2 border-slate-200" type="password" v-model="credentials.password"
                placeholder="Password" />
            <div class="flex justify-center text-xs font-bold">
                <a href="/forgot_password"
                    class="cursor-pointer hover:underline hover:text-blue-500 duration-200">Forgot Password?</a>
            </div>
            <button class="bg-teal-500 text-white rounded-lg py-1 px-2">Sign In</button>
            <div class="flex justify-center text-xs">
                <p clpss="font-normal">No account yet?
                    <a href="/register"
                        class="font-semibold hover:underline duration-200 cursor-pointer hover:text-blue-500">Register
                    </a>
                </p>
            </div>
        </form>
        <p @click="userStore.logout">logout</p>
        <Loading v-if="isLoading" />
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import Loading from '../Loading.vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const toast = useToast();

const app_url = import.meta.env.VITE_API_BASE_URL;

const isLoading = ref(false);
const credentials = ref({
    email: '',
    password: '',
    expo_push_token: generateRandomExpoPushToken()
})

function generateRandomExpoPushToken() {
    const prefix = 'ExponentPushToken[';
    const suffix = ']';
    const tokenLength = 22; // Typical length of the token part (adjust as needed)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < tokenLength; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return `${prefix}${token}${suffix}`;
}

const login = async () => {
    isLoading.value = false;
    try {
        isLoading.value = true;
        // const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        const response = await axios.post(`${app_url}/login`, credentials.value, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        console.log(response)
        userStore.setUser(response.data.user, response.data.token)

    } catch (error) {
        console.log(error)
        // toast.error(error.response.data.message)
    } finally {
        isLoading.value = false;
    }
    toast.success('wewew')
}

onMounted(()=>{
    console.log(userStore.isAuthenticated)   
})

</script>