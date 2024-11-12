<template>
    <section class="p-4 h-[70%]">
        <h2 class="text-2xl font-bold mb-4">Admin Panel</h2>

        <!-- Loading Spinner -->
        <Loading v-if="isLoading" />

        <!-- Available Services Table -->
        <div v-else class="overflow-x-auto text-sm">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead>
                    <tr class="bg-slate-700 text-white text-left">
                        <th class="p-3 font-semibold text-sm">Service</th>
                        <th class="p-3 font-semibold text-sm">Description</th>
                        <th class="p-3 font-semibold text-sm">Classification</th>
                        <th class="p-3 font-semibold text-sm">Personnel Needed</th>
                        <th class="p-3 font-semibold text-sm">Requested By</th>
                        <th class="p-3 font-semibold text-sm">Expected Start</th>
                        <th class="p-3 font-semibold text-sm">Expected End</th>
                        <th class="p-3 font-semibold text-sm">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in paginatedServices" :key="index"
                        :class="{ 'bg-gray-50': index % 2 === 0, 'bg-white': index % 2 !== 0 }"
                        class="hover:bg-slate-100 border-b border-gray-200">
                        <td class="p-3 text-gray-700">{{ data.service.name }}</td>
                        <td class="p-3 text-gray-700">{{ data.description }}</td>
                        <td class="p-3 text-gray-700">{{ data.classification }}</td>
                        <td class="p-3 text-gray-700">{{ data.number_of_personnel }}</td>
                        <td class="p-3 text-gray-700">{{ data.requested.firstname + ' ' + data.requested.lastname }}
                        </td>
                        <td class="p-3 text-gray-700">{{ formatDate(data.expected_start_date) }}</td>
                        <td class="p-3 text-gray-700">{{ formatDate(data.expected_end_date) }}</td>
                        <td :title="data.tasks.length > 0 ? 'Assign Task': 'Assigned'" :class="['text-center cursor-pointer text-blue-500', data.tasks.length > 0 ? 'text-blue-500' : 'text-blue-300 cursor-not-allowed']">
                            <v-icon name="md-assignment" width="22" height="22" />
                        </td>
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
import { fetchRequestedServices } from '../services/apiServices';
import Loading from '../Loading.vue';
import { useToast } from 'vue-toastification';
import { formatDate } from '../utils/convertDate';

const toast = useToast();
const isLoading = ref(false);
const requestedServices = ref([]);


// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust as needed for items per page

const getRequestedServices = async () => {
    isLoading.value = true;
    try {
        requestedServices.value = await fetchRequestedServices();
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
    return requestedServices.value.slice(start, end);
});

// Calculate the total number of pages
const totalPages = computed(() => Math.ceil(requestedServices.value.length / itemsPerPage.value));

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
    getRequestedServices();
});
</script>

<style scoped>
/* Add any custom styling as needed */
</style>
