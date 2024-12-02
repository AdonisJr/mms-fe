<template>
    <section class="p-4 h-[100%] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4 sticky top-0 z-30 bg-white p-2 shadow-lg">TASKS LIST</h2>

        <!-- Loading Spinner -->
        <Loading v-if="isLoading" />

        <!-- Available Services Table -->
        <div v-else class="overflow-x-auto text-sm">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead>
                    <tr class="bg-slate-700 text-white text-left">
                        <th class="p-3 font-semibold text-sm">Task</th>
                        <th class="p-3 font-semibold text-sm">Department</th>
                        <th class="p-3 font-semibold text-sm">Task Status</th>
                        <th class="p-3 font-semibold text-sm">Requested By</th>
                        <th class="p-3 font-semibold text-sm">Approved By</th>
                        <th class="p-3 font-semibold text-sm">Assigned Personnel</th>
                        <th class="p-3 font-semibold text-sm">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in paginatedServices" :key="index"
                        :class="{ 'bg-gray-50': index % 2 === 0, 'bg-white': index % 2 !== 0 }"
                        class="hover:bg-slate-100 border-b border-gray-200">
                        <td class="p-3 text-gray-700">{{ data?.service_request?.service?.name }}</td>
                        <td class="p-3 text-gray-700">{{ data?.service_request?.requested?.department }}</td>
                        <td class="p-3 text-gray-700">{{ data?.status === 'in_progress' && data?.proof ? 'In Review' : data?.status }}</td>
                        <td class="p-3 text-gray-700">{{ data?.service_request?.requested?.firstname + " " +
                            data?.service_request?.requested?.lastname }}</td>
                        <td class="p-3 text-gray-700">{{ data.service_request.approver ? `${data?.service_request?.approver?.firstname} ${data?.service_request?.approver?.lastname}` : 'Pending'  }}</td>
                        <!-- <td class="p-3 text-gray-700">{{ data.service_request.requested.department }}</td> -->
                        <td class="p-3 text-gray-700">
                            <ul class="list-disc pl-5">
                                <!-- Pass the task's workers and index to the function -->
                                <li v-for="(worker, workerIndex) in visibleWorkers(index, data.utility_workers)"
                                    :key="workerIndex">
                                    {{ worker.firstname + " " + worker.lastname }}
                                </li>
                            </ul>
                            <!-- See more toggle -->
                            <button v-if="data.utility_workers.length > 3" @click="toggleSeeMore(index)"
                                class="text-blue-500 hover:underline mt-2">
                                {{ showAll[index] ? 'See less' : 'See more...' }}
                            </button>
                        </td>
                        <td class="p-3 text-center">
                            <!-- IoCheckmarkDoneSharp, BiFileImage -->
                            <div class="flex gap-1 py-1 bg-emerald-500 p-1 cursor-pointer hover:bg-emerald-700 duration-200 rounded-sm text-white"
                                @click="updateStatus(data.id, 'completed')"
                                v-if="data.proof && data.status !== 'completed'">
                                <v-icon name="io-checkmark-done-sharp" width="22" height="22" />
                                Complete
                            </div>
                            <div :class="['flex items-center justify-center mt-2 py-1 rounded-sm hover:shadow-sm cursor-pointer bg-white border-2 border-slate-200', data.proof ? 'flex' : 'hidden']"
                                @click="[imgUrl = data.proof, isShowImageModal = true]">
                                <v-icon name="bi-file-image" width="22" height="22" />
                                View Image
                            </div>
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
    <!-- image view modal -->
    <Modal v-if="isShowImageModal">
        <div class="relative bg-white rounded-md z-30 p-4 w-3/6 h-6/6 border-2 border-slate-300">
            <img :src="`${path}${imgUrl}`" alt="Preview Image" class="w-full h-auto object-cover" />
            <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                @click="isShowImageModal = false">x</p>
        </div>
    </Modal>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { fetchTasks, updateTaskStatus, fetchInventory } from '../services/apiServices';
import Loading from '../Loading.vue';
import { useToast } from 'vue-toastification';
import { formatDate } from '../utils/convertDate';
import Modal from '../modal/Modal.vue';

const path = import.meta.env.VITE_API_BASE_URL;
const toast = useToast();
const isLoading = ref(false);
const tasks = ref([]);
const imgUrl = ref('');
const isShowImageModal = ref(false);
// Reactive object to track 'showAll' state for each list
const showAll = reactive({});

// Function to compute visible workers for a specific task
const visibleWorkers = (taskIndex, workers) => {
    return showAll[taskIndex]
        ? workers
        : workers.slice(0, 3); // Show only the first 3 workers if "See more" is not toggled
};

// Toggle function for "See more" and "See less"
const toggleSeeMore = (taskIndex) => {
    if (!showAll[taskIndex]) {
        showAll[taskIndex] = false; // Initialize the index if not already present
    }
    showAll[taskIndex] = !showAll[taskIndex];
};

// Function to update task status
const updateStatus = async (id, status) => {
    isLoading.value = false;
    try {
        isLoading.value = true;
        await updateTaskStatus({ id, status });
        toast.success(`Task updated, task is now ${status}`)
        getTasks(); // Refresh tasks
    } catch (error) {
        console.log(error)
        toast.error('Failed to update status')
    } finally {
        isLoading.value = false;
    }
};

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5); // Adjust as needed for items per page

const getTasks = async () => {
    isLoading.value = true;
    try {
        tasks.value = await fetchTasks();
        toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load tasks.');
    } finally {
        isLoading.value = false;
    }
};

// Calculate paginated services based on current page
const paginatedServices = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return tasks.value.slice(start, end);
});

// Calculate the total number of pages
const totalPages = computed(() => Math.ceil(tasks.value.length / itemsPerPage.value));

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
    getTasks();
});
</script>

<style scoped>
/* Add any custom styling as needed */
</style>
