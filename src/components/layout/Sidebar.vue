<template>
    <aside :class="[
        'h-screen w-16 flex flex-col gap-5 bg-slate-700 border-r-2 font-semibold border-slate-100 shadow-lg duration-200',
        isSidePanelOpen ? 'w-64' : 'w-16'
    ]">

        <div :class="[
            'flex items-center justify-center px-1 py-8 bg-gradient-to-r from-teal-400 to-blue-500 text-white'
        ]">
            <v-icon name="gi-auto-repair" width="50" height="50" color="yellow" />
            <div class="flex flex-col" v-if="isSidePanelOpen">
                <p class="text-lg">GSMMS</p>
                <span class="text-xs font-normal text-slate-200">Management & Monitoring</span>
            </div>
        </div>

        <div :class="['flex flex-col justify-center gap-2 overflow-y-auto text-slate-400 text-sm font-sans',
            isSidePanelOpen ? 'pss-4' : '']">
            <!-- SERVICES / HOME -->
            <div :class="['flex items-center gap-2 px-5 py-2 cursor-pointer hover:font-bold hover:text-white',
                pageName === 'Requested' ? 'text-white' : 'text-slate-400']"
                @click="router.push({ path: '/requested-services' })">
                <!-- <v-icon name="md-dashboard-round" width="22" height="22" /> -->
                <v-icon name="fa-tools" width="22" height="22" />
                <p v-if="isSidePanelOpen">REQUESTED</p>
            </div>
            <!-- PREVENTIVE -->
            <div :class="['flex items-center gap-2 px-5 py-2 cursor-pointer hover:font-bold hover:text-white',
                pageName === 'Preventive' ? 'text-white' : 'text-slate-400']"
                @click="router.push({ path: '/preventive' })">
                <v-icon name="md-mapshomework-sharp" width="22" height="22" />
                <p v-if="isSidePanelOpen">MAINTENANCE</p>
            </div>
            <!-- MdDashboardRound  -->

            <!-- EQUIPMENT -->
            <div :class="['flex items-center gap-2 px-5 py-2 cursor-pointer hover:font-bold hover:text-white',
                pageName === 'Equipment' ? 'text-white' : 'text-slate-400']"
                @click="router.push({ path: '/equipment' })">
                <v-icon name="ri-insert-row-top" width="22" height="22" />
                <p v-if="isSidePanelOpen">EQUIPMENT</p>
            </div>


            <!-- TASKS -->
            <div :class="['flex items-center gap-2 px-5 py-2 cursor-pointer hover:font-bold hover:text-white',
                pageName === 'Tasks' ? 'text-white' : 'text-slate-400']" @click="router.push({ path: '/tasks' })">
                <v-icon name="fa-tools" width="22" height="22" />
                <p v-if="isSidePanelOpen">TASKS</p>
            </div>

            <!-- USERS -->
            <div :class="['flex items-center gap-2 px-5 py-2 cursor-pointer hover:font-bold hover:text-white',
                pageName === 'Users' ? 'text-white' : 'text-slate-400']" @click="router.push({ path: '/users' })">
                <v-icon name="hi-solid-user-group" width="22" height="22" />
                <p v-if="isSidePanelOpen">USERS</p>
            </div>



        </div>
    </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useSidePanelStore } from '../stores/sidePanelStore';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const sidePanelStore = useSidePanelStore();
const isSidePanelOpen = computed(() => sidePanelStore.isSidePanelOpen);
const pageName = computed(() => route.name)

// const 


</script>