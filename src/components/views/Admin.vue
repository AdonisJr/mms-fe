<template>
    <section class="p-4 h-[100%] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4 sticky top-0 z-30 bg-white p-2 shadow-lg">Admin Panel</h2>

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
                        <th class="p-3 font-semibold text-sm">Department</th>
                        <th class="p-3 font-semibold text-sm">Expected Start</th>
                        <th class="p-3 font-semibold text-sm">Expected End</th>
                        <th class="p-3 font-semibold text-sm">Status</th>
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
                        <td class="p-3 text-gray-700">{{ data?.requested?.department }}</td>
                        <td class="p-3 text-gray-700">{{ formatDate(data.expected_start_date) }}</td>
                        <td class="p-3 text-gray-700">{{ formatDate(data.expected_end_date) }}</td>
                        <td>
                            <select v-model="data.status" @change="() => handleStatusChange(data)"
                                class="border border-gray-300 rounded p-2 w-full">
                                <option disabled value="">Please select</option>
                                <option v-for="(option, optIndex) in options" :key="optIndex" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </td>
                        <td :title="data.tasks.length > 0 ? 'Assigned' : 'Assign Task'"
                            :class="['text-center text-blue-500', data.tasks.length > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-500 cursor-pointer']"
                            @click="data.tasks.length > 0 ? '' : [selected = data, isModalVisible = true]">
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
                            :disabled="hasPendingTask(item.tasks)" v-model="selectedUsers">
                        {{ item.firstname + " " +
                            item.lastname + ` ${hasPendingTask(item.tasks) ? '(This user still has pending task)' : ''}` }}
                    </div>
                </div>
                <button class="bg-blue-500 my-5 p-3 text-white hover:bg-blue-600 duration-200"
                    @click="isUsersModalVisible = false">
                    Submit
                </button>
            </div>
        </Modal>

        <Modal v-if="isModalVisible">
            <div class="relative bg-white rounded-md z-30 p-4 w-3/6 border-2 border-slate-300">
                <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                    @click="[isModalVisible = false, selectedInventory = '']">x</p>
                <p class="text-xl font-bold">ASSIGN TASK</p>
                <div class="border-2 border-slate-200 p-4 mt-5">
                    <!-- body -->
                    <p class="text-lg font-bold">{{ selected.service.name }}</p>
                    <p class="text-md">
                        Description: {{ selected.description }}
                    </p>
                    <p class="text-md">
                        No. of personnel needed: {{ selected.number_of_personnel }}
                    </p>
                    <p class="text-md">
                        Classification: {{ selected.classification }}
                    </p>
                    <p class="text-md">
                        Requested by: {{ selected.requested.firstname + ' ' + selected.requested.lastname }}
                    </p>
                    <p class="text-md">
                        Department: {{ selected.requested.department }}
                    </p>
                    <p class="text-md">
                        Requested Date: {{ formatDate(selected.created_at) }}
                    </p>
                    <p class="text-md">
                        Approved on: {{ formatDate(selected.updated_at) }}
                    </p>
                    <p class="text-md pt-2">
                        Expected Start Date: {{ formatDate(selected.expected_start_date) }}
                    </p>
                    <p class="text-md">
                        Expected End Date: {{ formatDate(selected.expected_end_date) }}
                    </p>
                    <p :class="['text-md mt-2', selected.status === 'approved' ? 'bg-emerald-500 p-2 text-white' : '']">
                        {{ selected.status.toUpperCase() }}
                    </p>
                </div>
                <div class="py-4">
                    <p>Deadline
                        <input type="date" class="border-2 border-slate-200 w-full p-2" v-model="payload.deadline" />
                    </p>
                </div>
                <div class="py-4">
                    <p>Select equipment (Optional)
                        <select id="options" v-model="selectedInventory"
                            class="border border-gray-300 rounded p-2 w-full">
                            <option disabled value="">Select Equipment...</option>
                            <option v-for="(item, index) in inventories" :key="index" :value="item"
                                :disabled="item.user_id">
                                {{ `${item.name} (${item.model})${item.user_id ? '- Not Available' : '- Available'}` }}
                            </option>
                        </select>
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

    </section>

</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { fetchRequestedServices, fetchUserByType, assignTask, updateRequestedStatus, fetchInventory, updateInventory } from '../services/apiServices';
import Loading from '../Loading.vue';
import { useToast } from 'vue-toastification';
import { formatDate } from '../utils/convertDate';
import Confirm from '../modal/Confirm.vue';
import Modal from '../modal/Modal.vue';

const selectedInventory = ref('');

const toast = useToast();
const isLoading = ref(false);
const requestedServices = ref([]);
const isConfirmVisible = ref(false);
const isModalVisible = ref(false);
const selected = ref(null);
const originalStatus = ref(''); // Temporary variable to store the original status
const isUsersModalVisible = ref(false);
const users = ref([]);
const selectedUsers = ref([]);
const selectAll = ref(false);
const selectedStatus = ref();
const inventories = ref([]);


// const workerWithPendingTask = computed(() => )

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust as needed for items per page
const payload = ref({
    description: '',
    deadline: '',
    status: 'pending'
})

// Dropdown options (customize these as needed)
const options = ref([
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
]);

const handleStatusChange = async (data) => {
    if (data.tasks.length === 0 && data.status === 'approved') {
        toast.error('Please assign task before approving');
        setTimeout(() => {
            getRequestedServices();
        }, 3000);
        return;
    }

    // Confirmation alert
    const confirmUpdate = window.confirm(`Are you sure you want to update the status to "${data.status}"?`);
    if (!confirmUpdate) {
        return; // Exit if the user cancels
    }

    try {
        await updateRequestedStatus(data.id, data.status);
        toast.success('Status Updated');
    } catch (error) {
        console.log(error);
    }
};


const handleSubmit = async () => {
    const user_id = selected.value.requested.id;
    const inventoryPayload = { ...selectedInventory.value, user_id }

    isLoading.value = false;
    if (payload.value.deadline === '') return toast.error('Please select deadline.');
    if (selectedUsers.value.length === 0) return toast.error('Please assign atleast 1 user.');

    try {
        isLoading.value = true;
        await assignTask(selected.value.id, { assigned_to: selectedUsers.value, deadline: payload.value.deadline });
        // if(selectedInventory.value.length !== 0){
        if (selectedInventory) {
            await updateInventory(inventoryPayload)
        }
        toast.success('Task successfully assigned.');
        setTimeout(() => {
            getRequestedServices();
            isModalVisible.value = false;
        }, 2000)
    } catch (error) {
        toast.error(error.message);
    } finally {
        isLoading.value = false;
    }
}


const handleCancel = () => {
    // Revert the status back to the original value
    if (selected.value) {
        selected.value.status = originalStatus.value;
    }
    isConfirmVisible.value = false;
};

const hasPendingTask = (tasks) => {
    return tasks.some(task => task.status === 'pending' || task.status === 'in_progress');
};

// Computed property to filter users with pending or not completed tasks
const usersWithPendingTasks = computed(() => {
    return users.value.filter(user => {
        return user.tasks.some(task => task.status === 'pending');
    });
});


console.log(usersWithPendingTasks.value)

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

const getInventory = async () => {
    isLoading.value = true;
    try {
        const response = await fetchInventory();
        inventories.value = response;
        console.log(response)
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

watch(selectAll, (newVal) => {
    if (newVal) {
        // Only include users without pending tasks
        selectedUsers.value = users.value
            .filter(user => !hasPendingTask(user.tasks)) // Exclude users with pending tasks
            .map(user => user.id); // Map to user IDs
    } else {
        selectedUsers.value = [];
    }
});

watch(selectedStatus, (newVal, oldVal) => {
    console.log(newVal)
})


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
    getUsers();
    getInventory();
});
</script>


<style scoped>
/* Add any custom styling as needed */
</style>
