<template>
    <section class="py-4 px-10 h-[100%] overflow-y-auto text-sm">
        <h2 class="font-semibold mb-4 sticky top-0 z-30 ps-6">Requests</h2>
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
                            <p>{{ item.rejected }} Rejected</p>
                        </li>
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-emerald-200"></div>
                            <p>{{ item.approved }} Approved</p>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        <div class="flex justify-between items-center mt-5">
            <!-- search -->
            <input type="text" placeholder="Search (Services, Department, Status)" v-model="searchQuery"
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
                    <th class="p-3">ID</th>
                    <th class="p-3">Service</th>
                    <th>Date Requested</th>
                    <th>Department</th>
                    <th>Details</th>
                    <th>Personnel Needed</th>
                    <th>Assigned Personnel</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Comments</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody class="text-xs text-center">
                <tr class="border-b-2 border-slate-300 bg-slate-100" v-for="(item, index) in paginatedServices"
                    :key="index">
                    <td class="p-6">{{ item?.id }}</td>
                    <td class="p-6">{{ item?.service?.name }}</td>
                    <td class="p-3">
                        <span class="bg-yellow-100 p-1">{{ formatDate(item?.created_at) }}</span>
                    </td>
                    <td class="p-3">{{ item?.requested?.department }}</td>
                    <td class="p-3">{{ item?.description }}</td>
                    <td class="p-3">{{ item?.number_of_personnel }}</td>
                    <td class="p-3 text-start" v-if="item.tasks.length !== 0">
                        <ul class="list-disc pl-5">
                            <!-- Pass the task's workers and index to the function -->
                            <li v-for="(worker, workerIndex) in visibleWorkers(index, item?.tasks[0].utility_workers)"
                                :key="workerIndex">
                                {{ worker.firstname + " " + worker.lastname }}
                            </li>
                        </ul>
                        <!-- See more toggle -->
                        <button v-if="item.tasks[0].utility_workers.length > 3" @click="toggleSeeMore(index)"
                            class="text-blue-500 hover:underline mt-2">
                            {{ showAll[index] ? 'See less' : 'See more...' }}
                        </button>
                    </td>
                    <td class="p-3 pl-8 text-start" v-else>None</td>
                    <td class="p-3">{{ formatDate(item?.expected_start_date) }}</td>
                    <td class="p-3">{{ formatDate(item?.expected_end_date) }}</td>
                    <td class="p-3">{{ item?.reason }}</td>
                    <!-- <td class="p-3"><span :class="['p-2', getStatusColor(item?.status)]">{{ item?.status?.toUpperCase() }}</span></td> -->

                    <td class="hover:font-semibold cursor-pointer duration-200" @click="selectedShowComments = item">
                        <p>Show Comments</p>
                        <p>({{ item.comments.length }})</p>
                    </td>
                    <td>
                        <!-- @change="() => handleStatusChange(data)" -->
                        <select v-model="item.status" :disabled="item.status !== 'pending'"
                            @change="[isStatusModalVisible = true, selectedStatusUpdate = item]"
                            :class="['border border-gray-300 rounded p-2 w-full', getStatusColor(item.status)]">
                            <option disabled value="" class="bg-white">Please select</option>
                            <option v-for="(option, optIndex) in options" :key="optIndex" :value="option.value"
                                class="bg-white">
                                {{ option.label }}
                            </option>
                        </select>
                    </td>
                    <td :title="item.tasks.length > 0 ? 'Assigned' : 'Assign Task'"
                        :class="['text-center text-blue-500', item.tasks.length > 0 || item.status === 'rejected' ? 'text-slate-300 cursor-not-allowed' : 'text-blue-500 cursor-pointer']"
                        @click="item.tasks.length > 0 ? '' : [selected = item, isModalVisible = true]">
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

        <!-- Status change modal -->
        <Modal v-if="isStatusModalVisible">
            <div class="relative bg-white rounded-md z-30 p-4 w-2/6 border-2 border-slate-300">

                <p class="text-xl text-slate-600 textce pb-2">
                    Confirmation

                </p>
                <!-- BiQuestionDiamond -->
                <div class="flex justify-center">
                    <v-icon name="bi-question-diamond" width="50" height="50" />
                </div>
                <p class="text-center">Are you sure you want to update status to {{ selectedStatusUpdate.status }}?
                </p>
                <div class="py-4" v-if="selectedStatusUpdate.status === 'rejected'">
                    <p>Please provide a reason for rejecting
                        <input type="text" class="border-2 border-slate-200 w-full p-2 rounded-full" v-model="reason" />
                    </p>
                </div>
                <div class="w-full flex gap-5 justify-center pt-5">
                    <button class="bg-emerald-500 text-white p-2 rounded-lg px-5 hover:bg-emerald-600 duration-200"
                        @click="handleStatusChange">Submit</button>
                    <!-- @click="[isStatusModalVisible = false, selectedStatusUpdate = '', reason = '', getRequestedServices()]" -->
                    <button class="bg-red-500 text-white p-2 rounded-lg px-5 hover:bg-red-600 duration-200"
                        @click="handleCancel">
                        Cancel
                    </button>
                </div>
            </div>

        </Modal>

        <Modal v-if="selectedShowComments">
            <div class="relative bg-white rounded-md z-30 p-4 w-3/6 h-5/6 overflow-y-scroll border-2 border-slate-300">
                <div class="sticky top-0 bg-white">
                    <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                        @click="[selectedShowComments = '', comments = '']">
                        x
                    </p>
                    <p class="text-2xl">{{ selectedShowComments.service.name }}</p>
                    <p class="text-lg text-slate-500 border-b-2 border-slate-200 pb-5">{{
                        selectedShowComments.description
                        }}</p>
                    <div class="mt-2">
                        <p class="p-1 text-md">Comments</p>
                        <div class="flex gap-2">
                            <input type="text" placeholder="Write something.."
                                class="border-2 border-slate-200 w-full p-2" v-model="comment" />
                            <button class="w-32 bg-blue-700 text-white hover:bg-blue-800 duration-200 rounded-md"
                                @click="handleComment">
                                SEND
                            </button>
                        </div>
                    </div>
                </div>

                <div class="p-4 overflow-y-auto">
                    <div class="flex gap-2 mt-2" v-for="(item, index) in comments" :key="index">
                        <!-- <v-icon name="co-user-female" width="45" height="45" /> -->
                        <div class="bg-slate-200 p-1 rounded-full">
                            <v-icon v-if="item.user.gender === 'male'" name="co-user" width="45" height="45" />
                            <v-icon v-else name="co-user-female" width="45" height="45" />
                        </div>
                        <div class="bg-slate-100 w-5/6 p-2 rounded-md">
                            <p class="font-semibold text-slate-500s">{{ item.user.lastname }}, {{ item.user.firstname }}
                            </p>
                            <p class="text-slate-700">{{ item.comment }}</p>
                        </div>
                    </div>
                </div>

            </div>
        </Modal>

        <Loading v-if="isLoading" />

    </section>
</template>

<script setup>

import { onMounted, ref, computed, watch } from "vue";
import { fetchComments, fetchRequestedServices, updateRequestedStatus, postComment } from "../services/apiServices";
import { useToast } from "vue-toastification";
import Loading from "../Loading.vue";
import { formatDate } from "../utils/convertDate";
import Modal from "../modal/Modal.vue";

const toast = useToast();
const currentYear = new Date().getFullYear();
const years = ref([...Array(10)].map((_, i) => currentYear - i)); // Generates last 10 years
const selectedYear = ref(currentYear);
const searchQuery = ref('');
const requestedServices = ref([]);
const isLoading = ref(false);
const isStatusModalVisible = ref(false);
const selectedStatusUpdate = ref('');
const reason = ref('');
const showAll = ref(false);
const selectedShowComments = ref('');
const comment = ref('');
const comments = ref([]);


// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust as needed for items per page

const getStatusColor = (status) => {
    const colors = {
        pending: "bg-orange-300",
        rejected: "bg-red-300",
        approved: "bg-green-300",
    };

    return colors[status] || "bg-gray-300"; // Default color if status is unknown
};

// Dropdown options (customize these as needed)
const options = ref([
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
]);


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
const filteredRequestedServices = computed(() => {
    return requestedServices.value.filter((service) => {
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
            service?.service?.name?.toLowerCase().includes(query) ||
            service?.requested?.department?.toLowerCase().includes(query) ||
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
    requestedServices.value.filter((s) => new Date(s.created_at).getTime() >= startDate);

// Count services by status
const countByStatus = (services, status) => services.filter((s) => s.status === status).length;

// Computed: Filtered Cards Data
const cardsData = computed(() => {
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
        rejected: countByStatus(services, "rejected"),
        approved: countByStatus(services, "approved"),
    }));
});

// PAGINATION

// Calculate paginated services based on current page
const paginatedServices = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredRequestedServices.value.slice(start, end);
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


// END PAGINATION

// handle functions

const handleStatusChange = async () => {
    const payload = selectedStatusUpdate.value
    if (payload.tasks.length === 0 && payload.status === 'approved') {
        toast.error('Please assign task before approving');
        isStatusModalVisible.value = false;
        setTimeout(() => {
            getRequestedServices();
        }, 3000);
        return;
    }

    try {
        await updateRequestedStatus(payload.id, payload.status, reason.value);
        toast.success('Status Updated');
        isStatusModalVisible.value = false;
        getRequestedServices();
    } catch (error) {
        console.log(error);
    }
};

const handleCancel = () => {
    // const oldData = originalData.value.find(data => selectedStatusUpdate.value.id === data.id);
    isStatusModalVisible.value = false;
    selectedStatusUpdate.value = '';
    getRequestedServices();
};

const handleComment = async () => {
    isLoading.value = false;
    // Validate form fields
    if (!comment) return toast.error('Please write something')
    const payload = {
        'service_request_id': selectedShowComments.value.id,
        comment: comment.value
    }

    try {

        isLoading.value = true;
        const response = await postComment(payload);
        toast.success('Comment submitted successfully');
        comment.value = "";
        getComments(selectedShowComments.value.id);
        getRequestedServices();
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    } finally {
        isLoading.value = false;
    }
};


const getRequestedServices = async () => {
    isLoading.value = true;
    try {
        const response = await fetchRequestedServices();
        requestedServices.value = response;
        console.log(response)
        toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load services.');
    } finally {
        isLoading.value = false;
    }
};
const getComments = async (id) => {
    isLoading.value = true;
    try {
        const response = await fetchComments(id);
        comments.value = response;
        console.log(response)
        toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load comments.');
    } finally {
        isLoading.value = false;
    }
};

watch(() => selectedShowComments.value, (newVal) => {
    if (newVal) {
        getComments(newVal.id)
    }
}, { deep: true });

onMounted(() => {
    getRequestedServices();
});


</script>