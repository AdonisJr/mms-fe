<template>
    <nav class="bg-white border-b-2 border-slate-200 sticky top-0 w-12/12 flex justify-between items-center py-4 px-4">
        <v-icon name="oi-three-bars" width="22" height="22"
            class="hover:cursor-pointer text-slate-500 hover:text-slate-700 duration-200"
            @click="sidePanelStore.toggleSidePanel();" />
        <div>
            <p>User</p>
        </div>
    </nav>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useSidePanelStore } from '../stores/sidePanelStore';

const sidePanelStore = useSidePanelStore();
const isSidePanelOpen = computed(() => sidePanelStore.isSidePanelOpen)

watch(isSidePanelOpen, (newVal) => {
    console.log(newVal)
});

</script>