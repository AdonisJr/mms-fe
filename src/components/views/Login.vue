<template>
    <main class="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-teal-400 to-blue-500 p-4">
        <form class="flex flex-col gap-6 w-full md:w-[350px] rounded-md shadow-lg p-6 bg-white text-sm"
            @submit.prevent="login">
            <!-- Logo Section -->
            <div class="flex flex-col justify-center items-center gap-2">
                <!-- <img :src="`${app_url}/logo.png`" alt="App Logo" class="w-24 h-24 object-cover" /> -->
                <div class="flex flex-col items-center">

                    <v-icon name="fa-tools" width="60" height="60" />
                    <p class="text-sm text-slate-400 font-bold">GSMMS</p>
                </div>
                <p class="text-xl font-bold text-slate-700">Welcome Back</p>
                <p class="text-2xl font-bold text-slate-700">ADMIN</p>
                <p class="text-sm text-slate-500">Login to your account</p>
            </div>

            <!-- Input Fields -->
            <div class="flex flex-col gap-4">
                <input
                    class="py-2 px-3 border-2 border-slate-300 rounded-md focus:outline-none focus:ring focus:ring-teal-400 placeholder-slate-400"
                    type="email" v-model="credentials.email" placeholder="Email" />
                <input
                    class="py-2 px-3 border-2 border-slate-300 rounded-md focus:outline-none focus:ring focus:ring-teal-400 placeholder-slate-400"
                    type="password" v-model="credentials.password" placeholder="Password" />
            </div>

            <!-- Forgot Password -->
            <div class="flex justify-between items-center text-xs">
                <a href="/forgot_password"
                    class="text-teal-500 hover:underline hover:text-teal-700 duration-200 cursor-pointer">
                    Forgot Password?
                </a>
            </div>

            <!-- Sign In Button -->
            <button
                class="bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-md py-2 px-4 transition-all duration-200">
                Sign In
            </button>

            <!-- Register Section -->
            <div class="flex justify-center items-center text-xs">
                <p class="text-slate-600">
                    No account yet?
                    <a href="/register"
                        class="text-teal-500 font-semibold hover:underline hover:text-teal-700 duration-200">
                        Register
                    </a>
                </p>
            </div>
        </form>

        <!-- Loading Component -->
        <Loading v-if="isLoading" />
    </main>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import Loading from '../Loading.vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import { messaging, onMessage, getToken } from '../../../firebase';

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();
const notifToken = ref('');
const vapidKey = import.meta.env.VITE_VAPID_KEY

const app_url = import.meta.env.VITE_API_BASE_URL;

const isLoading = ref(false);
const credentials = ref({
    email: '',
    password: '',
    expo_push_token: notifToken
})

const getNotifToken = async () => {
    const token = await getToken(messaging, { vapidKey });
    notifToken.value = token;
}

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
    
    console.log(app_url)
    try {
        isLoading.value = true;
        // const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        const response = await axios.post(`${app_url}/login`, credentials.value, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        if (response.data.user.type !== 'general_service') return toast.error('Error, only admin are allowed to login')
        userStore.setUser(response.data.user, response.data.token)
        router.push({ path: '/requested-services' })
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    getNotifToken();
    console.log(userStore.isAuthenticated)
});

</script>