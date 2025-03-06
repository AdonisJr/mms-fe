<template>
    <section class="py-4 px-10 h-[100%] overflow-y-auto text-sm">
        <h2 class="font-semibold mb-4 sticky top-0 z-30 ps-6">Requests</h2>
        <!-- display cards -->
        <div class="flex gap-4">
            <!-- 1st row -->
            <div class="flex items-center shadow-md p-1 bg-white w-3/12 h-48 border-l-4 border-red-200 rounded-md"
                v-for="(item, index) in cardsData" :key="index">
                <div class="flex p-3 flex-col gap-4 w-5/12">
                    <p>{{ item.title }}</p>
                    <p class="text-4xl font-semibold text-slate-500">{{ item.count }}</p>
                </div>
                <div class="h-full w-7/12 overflow-y-auto">
                    <ul class="flex flex-col h-full py-4 justify-evenly ">
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <p><span class="font-bold">{{ item.new }}</span> New</p>
                        </li>
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-emerald-300"></div>
                            <p><span class="font-bold">{{ item.good }}</span> Good</p>
                        </li>
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-emerald-200"></div>
                            <p><span class="font-bold">{{ item.fair }}</span> Fair</p>
                        </li>
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-red-400"></div>
                            <p><span class="font-bold">{{ item.damaged }}</span> Damaged</p>
                        </li>
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-red-300 text-xs"></div>
                            <p><span class="font-bold">{{ item.under_maintainance }}</span> Maintenance</p>
                        </li>
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-black"></div>
                            <p><span class="font-bold">{{ item.retired }}</span> Retired</p>
                        </li>
                        <li class="flex gap-1 items-center text-slate-500">
                            <div class="w-3 h-3 rounded-full bg-slate-500"></div>
                            <p><span class="font-bold">{{ item.lost }}</span> Lost</p>
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
                    <th class="p-3">Name</th>
                    <th>Equipment Type</th>
                    <th>Model</th>
                    <th>Acquisition Date</th>
                    <th>Warranty</th>
                    <th>Condition</th>
                    <th><p>Health</p><p class="text-xs">(1-10)</p></th>
                    <th>Assigned To</th>
                    <th>Department</th>
                    <th>Released Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody class="text-xs text-center">
                <tr class="border-b-2 border-slate-300 bg-slate-100" v-for="(item, index) in paginatedEquipment"
                    :key="index">
                    <td class="p-6">{{ item?.name }}</td>
                    <td class="p-6">{{ item?.equipment_type }}</td>
                    <td class="p-6">{{ item?.model }}</td>
                    <td class="p-6">{{ formatDate(item?.acquisition_date) }}</td>
                    <td class="p-6">{{ item?.warranty }}</td>
                    <td class="p-3"> 
                        <span :class="['p-1', getStatusColor(item?.condition)]">{{ item?.condition }}</span>
                    </td>
                    <td class="p-3">{{ item?.health }}</td>
                    
                    <td class="p-6">
                        <span :class="['p-1', item.requested ? 'bg-green-200' : 'bg-red-100']">
                            {{ !item?.requested ? 'NotSet' : `${item?.requested?.lastname},
                            ${item?.requested?.firstname}` }}
                        </span>
                    </td>
                    <td class="p-6">
                        <span :class="['p-1', item.requested ? 'bg-green-200' : 'bg-red-100']">
                            {{ !item?.requested ? 'NotSet' : `${item?.requested?.department}` }}
                        </span>
                    </td>

                    <td :class="p - 3">
                        <span :class="['bg-yellow-100 p-1', item?.requested ? '' : 'bg-red-100']">
                            {{ !item?.requested ? 'NotSet' : formatDate(item?.updated_at) }}
                        </span>
                    </td>
                    <td class="p-3 text-gray-700">
                        <!-- MdEditSharp, RiDeleteBin6Line -->
                        <div class="cursor-pointer text-blue-700 hover:text-blue-800 duration-200" title="Edit User"
                            @click="[isModalVisible = true, selectedInventory = item, formData = item]">
                            <v-icon name="md-edit-sharp" width="22" height="22" />
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

        <Modal v-if="isModalVisible">
            <div class="relative bg-white rounded-md z-30 p-4 w-3/6 border-2 border-slate-300">
                <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                    @click="[isModalVisible = false, selectInventory = '', clearForm()]">
                    x
                </p>
                <p class="text-xl font-bold border-b-2 border-slate-200 pb-2">{{ formData.id ? 'EDIT' : '' }} INVENTORY
                    EQUIPMENT</p>

                <div class="pt-1 mt-2">
                    <p>Name</p>
                    <input type="text" placeholder="Name" class="border-2 border-slate-200 w-full p-2"
                        v-model="formData.name" />
                </div>
                <div class="pt-1 mt-2">
                    <p>Equipment Type</p>
                    <select id="options" class="border border-gray-300 rounded p-2 w-full"
                        v-model="formData.equipment_type">
                        <option disabled value="">Please select equipment type...</option>
                        <option value="Electrical Equipment">Electrical Equipment</option>
                        <option value="Office Equipment">Office Equipment</option>
                        <option value="HVAC Equipment">HVAC Equipment</option>
                        <option value="Cleaning Equipment">Cleaning Equipment</option>
                        <option value="Safety Equipment">Safety Equipment</option>
                        <option value="Lighting Equipment">Lighting Equipment</option>
                        <option value="Power Tools">Power Tools</option>
                        <option value="Hand Tools">Hand Tools</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Sports Equipment">Sports Equipment</option>
                    </select>
                </div>
                <div class="flex gap-2 mt-2">
                    <div class="w-3/6">
                        <p>Model</p>
                        <input type="text" placeholder="Model" class="border-2 border-slate-200 w-full p-2"
                            v-model="formData.model" />
                    </div>
                    <div class="w-3/6">
                        <p>Acquisition Date</p>
                        <input type="date" class="border-2 border-slate-200 w-full p-2"
                            v-model="formData.acquisition_date" />
                    </div>
                </div>
                <div class="mt-2">
                    <p>Warranty</p>
                    <input type="text" placeholder="Warranty" class="border-2 border-slate-200 w-full p-2"
                        v-model="formData.warranty" />
                </div>
                <div class="flex gap-2 mt-2">
                    <div class="w-3/6">
                        <p>Condition</p>
                        <select id="options" class="border border-gray-300 rounded p-2 w-full"
                            v-model="formData.condition">
                            <option disabled value="">Please select condition...</option>
                            <option value="New">New</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Under Maintenance">Under Maintenance</option>
                            <option value="Retired/Decommissioned">Retired/Decommissioned</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>
                    <div class="w-3/6">
                        <p>Health (1-10)</p>
                        <input type="number" placeholder="0" class="border-2 border-slate-200 w-full p-2"
                            v-model="formData.health" />
                    </div>
                </div>

                <div class="py-4 px-2 mt-2">
                    <button class="bg-blue-500 w-full text-center p-2 font-bold text-white rounded-md"
                        @click="handleSubmit">
                        Submit
                    </button>
                </div>
            </div>
        </Modal>

        <Loading v-if="isLoading" />

    </section>
</template>

<script setup>

import { onMounted, ref, computed, watch } from "vue";
import { fetchInventory, updateInventory, insertInventory } from "../services/apiServices";
import { useToast } from "vue-toastification";
import Loading from "../Loading.vue";
import { formatDate } from "../utils/convertDate";
import Modal from "../modal/Modal.vue";

const toast = useToast();
const currentYear = new Date().getFullYear();
const years = ref([...Array(10)].map((_, i) => currentYear - i)); // Generates last 10 years
const selectedYear = ref(currentYear);
const searchQuery = ref('');
const inventories = ref([]);
const isLoading = ref(false);
const showAll = ref(false);
const isModalVisible = ref(false);
const selectInventory = ref('');
const selectedInventory = ref('');
const formData = ref({
    name: '',
    equipment_type: '',
    model: '',
    acquisition_date: '',
    location: '',
    warranty: '',
    condition: '',
    health: '',
    department: '',
    location: '',
    status: 'available'
});


// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust as needed for items per page

const getStatusColor = (status) => {
    const colors = {
        New: "bg-emerald-400",
        Good: "bg-emerald-300",
        Fair: "bg-emerald-200",
        Damaged: "bg-red-400",
        "Under Maintenance": "bg-red-300",
        "Retired/Decommissioned": "bg-black",
        Lost: "bg-slate-500",
    };

    return colors[status] || "bg-gray-300"; // Default color if status is unknown
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
const filteredInventories = computed(() => {
    return inventories.value.filter((service) => {
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
    inventories.value.filter((s) => new Date(s.created_at).getTime() >= startDate);

// Count services by status
const countByStatus = (services, status) => services.filter((s) => s.condition === status).length;

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
        new: countByStatus(services, "New"),
        good: countByStatus(services, "Good"),
        fair: countByStatus(services, "Fair"),
        damaged: countByStatus(services, "Damaged"),
        under_maintainance: countByStatus(services, "Under Maintenance"),
        retired: countByStatus(services, "Retired/Decommissioned"),
        lost: countByStatus(services, "Lost"),
    }));
});

// PAGINATION

// Calculate paginated services based on current page
const paginatedEquipment = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredInventories.value.slice(start, end);
});

// Calculate the total number of pages
const totalPages = computed(() => Math.ceil(inventories.value.length / itemsPerPage.value));

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

// handle submit

const handleSubmit = async () => {
    const isValid = validateForm();
    if (isValid === true) {
        // Proceed with form submission logic
        if (formData.value.id) {
            try {
                isLoading.value = true;
                await updateInventory(formData.value);
                toast.success('Successfullly updated')
                selectedInventory.value = '';
                clearForm();
                isModalVisible.value = false;
                getInventory();
            } catch (error) {
                console.log(error)
                toast.error('Failed to update user')
            } finally {
                isLoading.value = false;
            }
        } else {
            try {
                isLoading.value = true;
                await insertInventory(formData.value);
                toast.success('Successfullly updated')
                selectedInventory.value = '';
                clearForm();
                isModalVisible.value = false;
                getInventory();
            } catch (error) {
                console.log(error)
                toast.error('Failed to update user')
            } finally {
                isLoading.value = false;
            }
        }

    }
};

const clearForm = () => {
    formData.value = {
        name: '',
        equipment_type: '',
        model: '',
        acquisition_date: '',
        location: '',
        warranty: '',
        condition: '',
        health: '',
        department: '',
        location: '',
        status: 'available'
    }
}

const validateForm = () => {
    if (!formData.value.name || formData.value.name.trim() === '') {
        return toast.error('Name is required');
    }
    if (!formData.value.equipment_type || formData.value.equipment_type.trim() === '') {
        return toast.error('Equipment Type is required');
    }
    if (!formData.value.model || formData.value.model.trim() === '') {
        return toast.error('Model is required');
    }
    if (!formData.value.acquisition_date) {
        return toast.error('Acquisition Date is required');
    }
    if (!formData.value.condition || formData.value.condition.trim() === '') {
        return toast.error('Condition is required');
    }
    if (!formData.value.health || isNaN(formData.value.health) || formData.value.health < 1 || formData.value.health > 10) {
        return toast.error('Health must be a number between 1 and 10');
    }

    // If all validations pass
    return true;
};


// END PAGINATION

const getInventory = async () => {
    isLoading.value = true;
    try {
        const response = await fetchInventory();
        inventories.value = response;
        console.log(response)
        toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load services.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    getInventory();
    console.log(cardsData.value)
});


</script>