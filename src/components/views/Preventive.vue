<template>
    <section class="py-4 px-10 h-[100%] overflow-y-auto text-sm">
        <div class="flex justify-between items-center py-1">
            <h2 class="font-semibold mb-4 sticky top-0 z-30 ps-6">Preventive Maintenance</h2>
            <button class="text-xs p-1 px-3 bg-blue-800 hover:bg-blue-900 rounded-sm duration-200 text-white"
                @click="isModalVisible = true">
                NEW REQUEST
            </button>
        </div>
        <!-- display cards -->
        <div class="flex gap-4">
            <!-- 1st row -->
            <div class="flex items-center shadow-md p-3 bg-white w-3/12 h-32 border-l-4 border-red-200 rounded-md"
                v-for="(item, index) in cardsData" :key="index">
                <div class="flex flex-col gap-4 w-5/12">
                    <p>{{ item.title }}</p>
                    <p class="text-4xl font-semibold text-slate-500">{{ item.count }}</p>
                </div>
                <div class="h-full w-7/12">
                    <ul class="flex flex-col h-full py-4 justify-evenly ">
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-orange-200"></div>
                            <p>{{ item.pending }} Pending</p>
                        </li>
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-red-300"></div>
                            <p>{{ item.in_progress }} In Progress</p>
                        </li>
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-emerald-200"></div>
                            <p>{{ item.completed }} Approved</p>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        <div class="flex justify-between items-center mt-5">
            <!-- search -->
            <input type="text" placeholder="Search (Services, Status)" v-model="searchQuery"
                class="bg-white border-2 px-2 border-slate-300 py-2 rounded-md w-96" />

            <div class="flex gap-2">
                <select v-model="selectedYear" class="w-32 py-2 px-2 rounded-md border-2 border-slate-300">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
        </div>

        <!-- TABLE -->

        <table class="table w-full mt-5 border-2 border-slate-200">
            <thead>
                <tr class="bg-white p-2">
                    <th class="p-4">Service</th>
                    <th>Description</th>
                    <th class="p-4">Date Requested</th>
                    <th>Date From</th>
                    <th>Date To</th>
                    <th>Assigned Personnel</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody class="text-xs text-center">
                <tr class="border-b-2 border-slate-300 bg-slate-100" v-for="(item, index) in paginatedServices"
                    :key="index">
                    <td class="p-3">{{ item?.name }}</td>
                    <td class="p-3">{{ item?.description }}</td>
                    <td class="p-3">
                        <span class="bg-yellow-100 p-1">{{ formatDate(item?.created_at) }}</span>
                    </td>
                    <td class="p-3">{{ formatDate(item?.scheduled_date_from) }}</td>
                    <td class="p-3">{{ formatDate(item?.scheduled_date_to) }}</td>
                    <td class="p-3 text-start">
                        <ul class="list-disc pl-5">
                            <!-- Pass the task's workers and index to the function -->
                            <li v-for="(worker, workerIndex) in visibleWorkers(index, item.users)" :key="workerIndex">
                                {{ worker.firstname + " " + worker.lastname }}
                            </li>
                        </ul>
                        <!-- See more toggle -->
                        <button v-if="item.users.length > 3" @click="toggleSeeMore(index)"
                            class="text-blue-500 hover:underline mt-2">
                            {{ showAll[index] ? 'See less' : 'See more...' }}
                        </button>
                    </td>
                    <td class="p-3">
                        <span :class="['p-2', getStatusColor(item?.status)]">{{ item?.status }}</span>
                    </td>
                    <td class="p-3 flex flex-col gap-2">
                        <div class="flex py-1 p-1 cursor-pointer duration-200 rounded-sm text-emerald-600 hover:text-emerald-700
                            " @click="updateStatus(item, 'completed')" v-if="item.status === 'in_progress'">
                            <v-icon name="gi-check-mark" width="18" height="18" />
                            Complete
                        </div>
                        <!-- MdImportexport -->
                        <div class="flex mt-2 cursor-pointer text-blue-600 hover:text-blue-700 duration-200"
                            title="View Reports" @click="[isShowReportsModal = true, selectedPreventive = item]">
                            <v-icon name="md-importexport" width="22" height="22" />Reports
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

        <!-- users modal -->

        <Modal v-if="isUsersModalVisible" :style="'w-screen h-screen bg-black absolute top-0 left-0 opacity-50 z-40'">
            <div class="relative flex flex-col bg-white rounded-md z-50 border-2 w-3/6 p-4 border-slate-300">
                <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                    @click="isUsersModalVisible = false">x</p>
                <p class="text-xl font-bold">SELECT USERS</p>
                <div class="flex items-center gap-2 pt-4">
                    <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 rounded my-2"
                        v-model="selectAll">Select All
                </div>
                <div class="border-2 border-slate-200 p-4 mt-5">
                    <div class="flex items-center gap-2" v-for="(item, index) in users" :key="index">
                        <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 rounded my-2" :value="item.id" :disabled="hasPendingTask(item.preventive_maintenances)"
                            v-model="selectedUsers">
                            {{ item.firstname + " " +
                                    item.lastname + ` ${hasPendingTask(item.preventive_maintenances) ? '(This user still has pending task)' : ''}`}}
                    </div>
                </div>
                <button class="bg-blue-500 my-5 p-3 text-white hover:bg-blue-600 duration-200"
                    @click="isUsersModalVisible = false">
                    Submit
                </button>
            </div>
        </Modal>


        <!-- reports modal -->
        <Modal v-if="isShowReportsModal && reports">
            <div class="relative bg-white rounded-md z-30 p-4 w-5/6 h-5/6 border-2 border-slate-300">

                <p class="text-xl font-bold">Submitted Report:</p>
                <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                    @click="[isShowReportsModal = false, selectedPreventive = 'false']">x</p>


                <div class="flex justify-between items-end px-5">
                    <p class="text-lg font-normal ps-5">
                        {{ selectedPreventive.name }} <span class="text-slate-500">{{ selectedPreventive.description
                        }}</span>
                    </p>
                    <button class="bg-emerald-500 text-white py-1 px-4 rounded-md hover:bg-emerald-600 duration-200"
                        @click="download">Download</button>
                </div>

                <table class="min-w-full mt-2 bg-white border border-gray-200 rounded-lg shadow">
                    <thead>
                        <tr class="bg-slate-700 text-white text-left">
                            <th class="p-3 font-semibold text-sm">Task</th>
                            <th class="p-3 font-semibold text-sm">Description</th>
                            <th class="p-3 font-semibold text-sm">Equipment Name</th>
                            <th class="p-3 font-semibold text-sm">Model</th>
                            <th class="p-3 font-semibold text-sm">Health</th>
                            <th class="p-3 font-semibold text-sm">Condition</th>
                            <th class="p-3 font-semibold text-sm">Other Information</th>
                            <th class="p-3 font-semibold text-sm">Reported Date</th>
                        </tr>
                    </thead>
                    <tbody v-if="reports.length !== 0">
                        <tr v-for="(data, index) in reports" :key="index"
                            :class="{ 'bg-gray-50': index % 2 === 0, 'bg-white': index % 2 !== 0 }"
                            class="hover:bg-slate-100 border-b border-gray-200">
                            <td class="p-3 text-gray-700">{{ data?.preventive_maintenance?.name }}</td>
                            <td class="p-3 text-gray-700">{{ data?.preventive_maintenance?.description }}</td>
                            <td class="p-3 text-gray-700">{{ data?.equipment.name }}</td>
                            <td class="p-3 text-gray-700">{{ data?.equipment.model }}</td>
                            <td class="p-3 text-gray-700">{{ data?.health }}</td>
                            <td class="p-3 text-gray-700">{{ data?.condition }}</td>
                            <td class="p-3 text-gray-700">{{ data?.other_info }}</td>
                            <td class="p-3 text-gray-700">{{ formatDate(data?.created_at) }}</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr class="text-center">
                            No Data
                        </tr>
                    </tbody>
                </table>
            </div>
        </Modal>

        <!-- ADD NEW MODAL -->

        <Modal v-if="isModalVisible">
            <div class="relative bg-white rounded-md z-30 p-4 w-3/6 border-2 border-slate-300">
                <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                    @click="[isModalVisible = false, selectAll = false]">x</p>
                <p class="text-xl font-bold">SCHEDULE PREVENTIVE TASK</p>

                <p class="ps-2 text-slate-700 mt-2">Type</p>
                <select id="options" v-model="payload.name" class="border border-gray-300 rounded p-2 w-full mt-2">
                    <option disabled value="">Please select type...</option>
                    <option value="Preventive Maintenance">Preventive Maintenance</option>
                    <option value="Inspection">Inspection</option>
                    <option value="Repair">Repair</option>
                    <option value="Replacement">Replacement</option>
                    <option value="Calibration">Calibration</option>
                    <option value="Garbage Collection">Garbage Collection</option>
                </select>
                <div class="mt-2">
                    <p>Description</p>
                    <input type="text" class="border-2 border-slate-200 w-full p-2" v-model="payload.description" />
                </div>
                <div class="pt-4">
                    <p>Schedule Date From
                        <input type="date" class="border-2 border-slate-200 w-full p-2"
                            v-model="payload.scheduled_date_from" />
                    </p>
                </div>
                <div class="pt-1">
                    <p>Schedule Date To
                        <input type="date" class="border-2 border-slate-200 w-full p-2"
                            v-model="payload.scheduled_date_to" />
                    </p>
                </div>
                <div class="flex justify-between py-4 px-4 font-bold">
                    <div class="text-blue-600 cursor-pointer" @click="isUsersModalVisible = true">
                        <v-icon name="hi-solid-user-group" width="22" height="22" />
                        Select Users
                    </div>
                    <p>Selected Users ({{ selectedUsers.length }})</p>
                </div>
                <div class="px-2">
                    <button class="bg-blue-500 w-full text-center p-2 font-bold text-white rounded-md"
                        @click="handleSubmit">
                        Submit
                    </button>
                </div>
            </div>
        </Modal>
        <!-- // loading -->
        <Loading v-if="isLoading" />

    </section>
</template>

<script setup>

import { onMounted, ref, computed, watch, reactive } from "vue";
import {
    fetchAllPreventiveMaintenance,
    fetchUserByType,
    updatePreventiveStatus,
    fetchReportsByPreventiveId,
    schedulePreventiveMaintenance
} from "../services/apiServices";
import { useToast } from "vue-toastification";
import Loading from "../Loading.vue";
import { formatDate } from "../utils/convertDate";
import Modal from "../modal/Modal.vue";
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const selectAll = ref(false);
const toast = useToast();
const currentYear = new Date().getFullYear();
const years = ref([...Array(10)].map((_, i) => currentYear - i)); // Generates last 10 years
const selectedYear = ref(currentYear);
const searchQuery = ref('');
const preventiveData = ref([]);
const isLoading = ref(false);
const showAll = reactive({});
const users = ref([]);
const reports = ref([]);
const isShowReportsModal = ref(false);
const selectedPreventive = ref();

const isModalVisible = ref(false);
const isUsersModalVisible = ref(false);

const selectedUsers = ref([]);
const payload = ref({
    name: '',
    description: '',
    status: 'pending',
    scheduled_date_from: '',
    scheduled_date_to: '',
    created_by: userStore.user.id
});

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust as needed for items per page

const getStatusColor = (status) => {
    const colors = {
        pending: "bg-red-300",
        in_progress: "bg-orange-300",
        completed: "bg-green-300",
    };

    return colors[status] || "bg-gray-300"; // Default color if status is unknown
};

// has task
const hasPendingTask = (tasks) => {
    return tasks.some(task => task.status === 'pending' || task.status === 'in_progress');
};

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


// Computed property for filtering by selected year and search query
const filteredPreventiveData = computed(() => {
    return preventiveData.value.filter((service) => {
        // Ensure service data exists
        if (!service?.created_at) return false;

        // Filter by selected year
        const serviceYear = new Date(service.created_at).getFullYear();
        if (serviceYear !== selectedYear.value) return false;

        // If there's no search query, return all matching year data
        if (!searchQuery.value) return true;

        // Convert search query and service fields to lowercase for case-insensitive matching
        const query = searchQuery.value.toLowerCase();
        return (
            service?.name?.toLowerCase().includes(query) ||
            service.status?.toLowerCase().includes(query)
        );
    });
});

// Helper functions
const getStartOf = (type) => {
    const today = new Date();
    if (type === "day") return new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    if (type === "week") {
        const currentDate = new Date();
        const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); // Get start of current week (Sunday)
        if (firstDayOfWeek.getFullYear() !== today.getFullYear()) {
            return new Date(today.getFullYear(), 0, 1).getTime(); // Ensure week falls within the selected year
        }
        return firstDayOfWeek.getTime();
    }
    if (type === "month") return new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    if (type === "year") return new Date(today.getFullYear(), 0, 1).getTime();
};

// Filtering by date range
const filterByDateRange = (startDate) =>
    preventiveData.value.filter((s) => new Date(s.created_at).getTime() >= startDate);

// Count services by status
const countByStatus = (services, status) => services.filter((s) => s.status === status).length;

// Computed: Filtered Cards Data
const cardsData = computed(() => {
    console.log(filterByDateRange(getStartOf("day")))
    console.log(filterByDateRange(getStartOf("week")))
    console.log(filterByDateRange(getStartOf("month")))
    console.log(filterByDateRange(getStartOf("year")))
    const filters = {
        Today: filterByDateRange(getStartOf("day")),
        "This Week": filterByDateRange(getStartOf("week")),
        "This Month": filterByDateRange(getStartOf("month")),
        "This Year": filterByDateRange(getStartOf("year")),
    };
    return Object.entries(filters).map(([title, services]) => ({
        title,
        count: services.length,
        pending: countByStatus(services, "pending"),
        in_progress: countByStatus(services, "in_progress"),
        completed: countByStatus(services, "completed"),
    }));
});

// PAGINATION

// Calculate paginated services based on current page
const paginatedServices = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredPreventiveData.value.slice(start, end);
});

// Calculate the total number of pages
const totalPages = computed(() => Math.ceil(preventiveData.value.length / itemsPerPage.value));

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

// END PAGINATION

// Function to update task status
const updateStatus = async (data, status) => {
    const payload = { ...data, status: status }
    isLoading.value = false;
    try {
        isLoading.value = true;
        await updatePreventiveStatus(payload);
        toast.success(`Task updated, task is now ${status}`)
        getPreventiveData(); // Refresh tasks
        getUsers(); // Refresh tasks
    } catch (error) {
        console.log(error)
        toast.error('Failed to update status')
    } finally {
        isLoading.value = false;
    }
};

// submit
const handleSubmit = async () => {
    const payloadFinal = { ...payload.value, user_ids: selectedUsers.value }
        if (payload.value.name === '') return toast.error('Type is required.');
        if (payload.value.description === '') return toast.error('Description is required.');
        if (payload.value.scheduled_date_from === '') return toast.error('Please select date from.');
        if (payload.value.scheduled_date_to === '') return toast.error('Please select date to.');
        if (selectedUsers.value.length === 0) return toast.error('Please select ateast 1 user.');
        await schedulePreventiveMaintenance(payloadFinal);
        toast.success('Preventive maintenance task created.');
        getUsers();
        setTimeout(() => {
            getPreventiveData();
            isModalVisible.value = false;
        }, 2000)
    
}

const getReports = async () => {
    isLoading.value = true;
    try {
        const response = await fetchReportsByPreventiveId(selectedPreventive.value.id);
        reports.value = response;
        console.log(response)
        // toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load preventive maintenance reports.');
    } finally {
        isLoading.value = false;
    }
};

const getPreventiveData = async () => {
    isLoading.value = true;
    try {
        const response = await fetchAllPreventiveMaintenance();
        preventiveData.value = response;
        console.log(response)
        toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load services.');
    } finally {
        isLoading.value = false;
    }
};

// get users
const getUsers = async () => {
    isLoading.value = true;
    try {
        const response = await fetchUserByType('utility_worker');
        users.value = response;
        console.log(response)
        toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load users.');
    } finally {
        isLoading.value = false;
    }
};
// fetch tasks


watch(selectAll, (newVal) => {
    if (newVal) {
        // Only include users without pending tasks
        selectedUsers.value = users.value
            .filter(user => !hasPendingTask(user.preventive_maintenances)) // Exclude users with pending tasks
            .map(user => user.id); // Map to user IDs
    } else {
        selectedUsers.value = [];
    }
});

watch(() => selectedPreventive.value, (newVal) => {
    // reports.value = newVal;
    if (newVal !== '' || newVal) {
        getReports();
    }
})

onMounted(() => {
    getPreventiveData();
    getUsers();
});


</script>