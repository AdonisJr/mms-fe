<template>
    <section class="p-4 h-[70%]">
        <h2 class="text-2xl font-bold mb-4">USERS LIST</h2>

        <!-- Loading Spinner -->
        <Loading v-if="isLoading" />

        <!-- Available Services Table -->
        <div v-else class="overflow-x-auto text-sm">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead>
                    <tr class="bg-slate-700 text-white text-left">
                        <th class="p-3 font-semibold text-sm">First Name</th>
                        <th class="p-3 font-semibold text-sm">Middle Name</th>
                        <th class="p-3 font-semibold text-sm">Last Name</th>
                        <th class="p-3 font-semibold text-sm">Email</th>
                        <th class="p-3 font-semibold text-sm">Gender</th>
                        <th class="p-3 font-semibold text-sm">Department</th>
                        <th class="p-3 font-semibold text-sm">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in paginatedServices" :key="index"
                        :class="{'bg-gray-50': index % 2 === 0, 'bg-white': index % 2 !== 0}"
                        class="hover:bg-slate-100 border-b border-gray-200">
                        <td class="p-3 text-gray-700">{{ data.firstname }}</td>
                        <td class="p-3 text-gray-700">{{ data.middlename }}</td>
                        <td class="p-3 text-gray-700">{{ data.lastname }}</td>
                        <td class="p-3 text-gray-700">{{ data.email }}</td>
                        <td class="p-3 text-gray-700">{{ data.gender }}</td>
                        <td class="p-3 text-gray-700">{{ data.department }}</td>
                        <td class="p-3 text-gray-700">{{ formatDate(data.created_at) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination Controls -->
            <div class="flex justify-center items-center gap-4 mt-6">
                <button @click="previousPage" :disabled="currentPage === 1"
                    class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>

                <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchUserByType } from '../services/apiServices';
import Loading from '../Loading.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const isLoading = ref(false);
const users = ref([]);
import { formatDate } from '../utils/convertDate';

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5); // Adjust as needed for items per page

const getUsers = async () => {
    isLoading.value = true;
    try {
        users.value = await fetchUserByType('general_service');
        toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load services.');
    } finally {
        isLoading.value = false;
    }
};

// Calculate paginated services based on current page
const paginatedServices = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return users.value.slice(start, end);
});

// Calculate the total number of pages
const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage.value));

// Navigation methods for pagination
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

onMounted(() => {
    getUsers();
});
</script>

<style scoped>
/* Add any custom styling as needed */
</style>
