<template>
    <section class="p-4 h-[100%] overflow-y-auto">
        <div class="bg-white p-2 shadow-md sticky top-0 mb-2">
            <h2 class="text-2xl font-bold mb-2">PREVENTIVE MAINTENANCE TASK</h2>
            <div class="flex justify-end gap-10">
                <!-- <select id="options" v-model="filter" class="border border-gray-300 rounded p-2 w-full">
                    <option value="all">All</option>
                    <option value="general_service">General Service</option>
                    <option value="faculty">Faculty</option>
                    <option value="utility_worker">Personnel</option>
                </select> -->
                <div class="w-32 p-2 bg-blue-500 text-white rounded-md flex items-center gap-1 cursor-pointer hover:bg-blue-700 duration-200"
                    @click="[isModalVisible = true, selectedTask = '']" title="Add new user">
                    <v-icon name="md-personaddalt1" width="22" height="22" />
                    ADD NEW
                </div>
            </div>

        </div>
        <!-- Loading Spinner -->
        <Loading v-if="isLoading" />

        <!-- Available Services Table -->
        <div v-else class="overflow-auto text-sm">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead>
                    <tr class="bg-slate-700 text-white text-left">
                        <th class="p-3 font-semibold text-sm">Name</th>
                        <th class="p-3 font-semibold text-sm">Description</th>
                        <th class="p-3 font-semibold text-sm">Date From</th>
                        <th class="p-3 font-semibold text-sm">Date To</th>
                        <th class="p-3 font-semibold text-sm">Assigned Personnel</th>
                        <th class="p-3 font-semibold text-sm">Assigned Date</th>
                        <th class="p-3 font-semibold text-sm">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in paginatedServices" :key="index"
                        :class="{ 'bg-gray-50': index % 2 === 0, 'bg-white': index % 2 !== 0 }"
                        class="hover:bg-slate-100 border-b border-gray-200">
                        <td class="p-3 text-gray-700">{{ data.name }}</td>
                        <td class="p-3 text-gray-700">{{ data.description }}</td>
                        <td class="p-3 text-gray-700">{{ formatDate(data.scheduled_date_from) }}</td>
                        <td class="p-3 text-gray-700">{{ formatDate(data.scheduled_date_to) }}</td>
                        <!-- <td class="p-3 text-gray-700">{{ data.service_request.requested.department }}</td> -->
                        <td class="p-3 text-gray-700">
                            <ul class="list-disc pl-5">
                                <!-- Pass the task's workers and index to the function -->
                                <li v-for="(worker, workerIndex) in visibleWorkers(index, data.users)"
                                    :key="workerIndex">
                                    {{ worker.firstname + " " + worker.lastname }}
                                </li>
                            </ul>
                            <!-- See more toggle -->
                            <button v-if="data.users.length > 3" @click="toggleSeeMore(index)"
                                class="text-blue-500 hover:underline mt-2">
                                {{ showAll[index] ? 'See less' : 'See more...' }}
                            </button>
                        </td>

                        <td class="p-3 text-gray-700">{{ formatDate(data.created_at) }}</td>

                        <td class="p-3 text-gray-700">
                            <!-- MdEditSharp, RiDeleteBin6Line -->
                            <div class="cursor-pointer text-emerald-500 hover:text-emerald-700 duration-200"
                                title="Edit User"
                                @click="[isModalVisible = true, selectedTask = data, selectedUsers = data.users.map(user => user.id)]">
                                <v-icon name="md-edit-sharp" width="22" height="22" />Edit
                            </div>
                            <!-- MdImportexport -->
                            <div class="flex mt-2 cursor-pointer text-blue-500 hover:text-blue-700 duration-200"
                                title="View Reports" @click="[isShowReportsModal = true, selectedPreventive = data]">
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
        </div>
    </section>
    <!-- image view modal -->
    <Modal v-if="isShowImageModal">
        <div class="relative bg-white rounded-md z-30 p-4 w-3/6 h-3/6 border-2 border-slate-300">
            <img :src="`${path}${imgUrl}`" alt="Preview Image" class="w-full h-auto object-cover" />
            <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                @click="isShowImageModal = false">x</p>

            {{ path }}{{ imgUrl }}
        </div>
    </Modal>

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
                    <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 rounded my-2" :value="item.id"
                        v-model="selectedUsers">{{ item.firstname + " " + item.lastname }}
                </div>
            </div>
            <button class="bg-blue-500 my-5 p-3 text-white hover:bg-blue-600 duration-200"
                @click="isUsersModalVisible = false">
                Submit
            </button>
        </div>
    </Modal>

    <Modal v-if="isModalVisible && selectedTask">
        <div class="relative bg-white rounded-md z-30 p-4 w-3/6 border-2 border-slate-300">
            <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                @click="[isModalVisible = false, selectedUsers = [], selectAll = false, selectedTask = '']">x</p>
            <p class="text-xl font-bold">UPDATE PREVENTIVE TASK</p>
            <p class="ps-2 text-slate-700 mt-2">Type</p>
            <select id="options" v-model="selectedTask.name" class="border border-gray-300 rounded p-2 w-full mt-2">
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
                <input type="text" class="border-2 border-slate-200 w-full p-2" v-model="selectedTask.description" />
            </div>
            <div class="pt-4">
                <p>Schedule Date From
                    <input type="date" class="border-2 border-slate-200 w-full p-2"
                        :value="selectedTask.scheduled_date_from" />
                </p>
            </div>
            <div class="pt-1">
                <p>Schedule Date To
                    <input type="date" class="border-2 border-slate-200 w-full p-2"
                        :value="selectedTask.scheduled_date_to" />
                </p>
            </div>
            <div class="flex justify-between py-4 px-4 font-bold">
                <div class="text-blue-600 cursor-pointer" @click="isUsersModalVisible = true">
                    <v-icon name="hi-solid-user-group" width="22" height="22" />
                    Select Users
                </div>
                <p>Selected Users ({{ selectedUsers.length }})</p>
            </div>
            <div class="py-4 px-2">
                <button class="bg-blue-500 w-full text-center p-2 font-bold text-white rounded-md"
                    @click="handleSubmit">
                    Submit
                </button>
            </div>
        </div>
    </Modal>
    <Modal v-if="!selectedTask && isModalVisible">
        <div class="relative bg-white rounded-md z-30 p-4 w-3/6 border-2 border-slate-300">
            <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                @click="[isModalVisible = false, selectedUsers = [], selectAll = false, selectedTask = '']">x</p>
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
                <tbody v-if="filteredReports.length !== 0">
                    <tr v-for="(data, index) in filteredReports" :key="index"
                        :class="{ 'bg-gray-50': index % 2 === 0, 'bg-white': index % 2 !== 0 }"
                        class="hover:bg-slate-100 border-b border-gray-200">
                        <td class="p-3 text-gray-700">{{ data?.preventive_maintenance?.name }}</td>
                        <td class="p-3 text-gray-700">{{ data?.preventive_maintenance?.description }}</td>
                        <td class="p-3 text-gray-700">{{ data?.service_request?.equipment[0]?.name }}</td>
                        <td class="p-3 text-gray-700">{{ data?.service_request?.equipment[0]?.model }}</td>
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
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { fetchAllPreventiveMaintenance, updateTaskStatus, fetchUserByType, fetchRequestedServices, schedulePreventiveMaintenance, fetchReportsByPreventiveId } from '../services/apiServices';
import Loading from '../Loading.vue';
import { useToast } from 'vue-toastification';
import { formatDate } from '../utils/convertDate';
import Modal from '../modal/Modal.vue';
import { useUserStore } from '../stores/userStore';
import * as XLSX from 'xlsx';


const userStore = useUserStore();
const users = ref([]);
const selectedUsers = ref([]);
const selectAll = ref(false);
const selectedTask = ref('');
const isModalVisible = ref(false);
const isUsersModalVisible = ref(false);
const path = import.meta.env.VITE_IMG_URL;
const toast = useToast();
const isLoading = ref(false);
const preventiveMaintenance = ref([]);
const imgUrl = ref('');
const isShowImageModal = ref(false);
const selected = ref('');
// Reactive object to track 'showAll' state for each list
const showAll = reactive({});
const requestedServices = ref([])
const isShowReportsModal = ref(false);
const selectedPreventive = ref('')
const reports = ref([]);
const payload = ref({
    name: '',
    description: '',
    status: 'pending',
    scheduled_date_from: '',
    scheduled_date_to: '',
    created_by: userStore.user.id
});

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

const filteredReports = computed(() => reports.value)
// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust as needed for items per page
// Pagination state

const getUsers = async () => {
    isLoading.value = true;
    try {
        users.value = await fetchUserByType('utility_worker');
        toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load users.');
    } finally {
        isLoading.value = false;
    }
};

const getTasks = async () => {
    isLoading.value = true;
    try {
        preventiveMaintenance.value = await fetchAllPreventiveMaintenance();
        toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load preventive maintenance.');
    } finally {
        isLoading.value = false;
    }
};

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


// submit
const handleSubmit = async () => {

    // name: '',
    // description: '',
    // status: 'pending',
    // scheduled_date_from: '',
    // scheduled_date_to: '',
    // created_by: userStore.user.id



    const payloadFinal = { ...payload.value, user_ids: selectedUsers.value }
    if (selectedTask.value) {
        toast.success('Successfully updated')
        isModalVisible.value = false;
    } else {
        if (payload.value.name === '') return toast.error('Type is required.');
        if (payload.value.description === '') return toast.error('Description is required.');
        if (payload.value.scheduled_date_from === '') return toast.error('Please select date from.');
        if (payload.value.scheduled_date_to === '') return toast.error('Please select date to.');
        if (selectedUsers.value.length === 0) return toast.error('Please select ateast 1 user.');
        await schedulePreventiveMaintenance(payloadFinal);
        toast.success('Preventive maintenance task created.');
        setTimeout(() => {
            getTasks();
            isModalVisible.value = false;
        }, 2000)
    }
}

// Calculate paginated services based on current page
const paginatedServices = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return preventiveMaintenance.value?.slice(start, end);
});

// Calculate the total number of pages
const totalPages = computed(() => Math.ceil(preventiveMaintenance.value.length / itemsPerPage.value));

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

const formatReports = computed(() =>
    reports.value.map((report) => ({
        Task: report.preventive_maintenance?.name || 'N/A',
        Description: report.preventive_maintenance?.description || 'N/A',
        EquipmentName: report.service_request?.equipment[0]?.name || 'N/A',
        Model: report.service_request?.equipment[0]?.model || 'N/A',
        Health: report.health || 'N/A',
        Condition: report.condition || 'N/A',
        OtherInformation: report.other_info || 'N/A',
        ReportedDate: formatDate(report.created_at),
    }))
);

const download = () => {
    // Log the formatted reports for debugging
    console.log(formatReports.value);

    // Step 1: Prepare the worksheet from the formatted reports
    const worksheet = XLSX.utils.json_to_sheet(formatReports.value);

    // Step 2: Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

    // Step 3: Write the workbook to a file
    XLSX.writeFile(workbook, 'report.xlsx');
};


watch(selectAll, (newVal) => {
    if (newVal) {
        selectedUsers.value = users.value.map(user => user.id)
    } else {
        selectedUsers.value = [];
    }
})

watch(() => selectedPreventive.value, (newVal) => {
    // reports.value = newVal;
    if (newVal !== '' || newVal) {
        getReports();
    }
})

watch(() => reports.value, (newVal) => {
    console.log(newVal)
})

onMounted(() => {
    getTasks();
    getUsers();
});
</script>

<style scoped>
/* Add any custom styling as needed */
</style>
