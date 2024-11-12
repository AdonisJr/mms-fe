<template>
    <main class="flex w-screen h-screen overflow-hidden">
        <Sidebar />
        <div class="flex w-full h-full flex-col bg-slate-100">
            <Navbar />
            <router-view></router-view>
        </div>
    </main>
</template>

<script setup>
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
import { useUserStore } from '../stores/userStore';

</script>