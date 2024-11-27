<template>
    <section class="p-4 h-[100%] overflow-y-auto">

        <div class="flex justify-between items-center bg-white p-2 shadow-md sticky top-0 mb-2">
            <h2 class="text-2xl font-bold">INVENTORY LIST</h2>
            <div class="w-30 p-2 bg-blue-500 text-white rounded-md flex items-center gap-1 cursor-pointer hover:bg-blue-700 duration-200"
                @click="[isModalVisible = true, selectInventory = '']" title="Add new user">
                <v-icon name="md-personaddalt1" width="15" height="15" />
                ADD NEW
            </div>
        </div>

        <!-- Loading Spinner -->
        <Loading v-if="isLoading" />

        <!-- Available Services Table -->
        <div v-else class="overflow-x-auto text-sm">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead>
                    <tr class="bg-slate-700 text-white text-left">
                        <th class="p-3 font-semibold text-sm">Name</th>
                        <th class="p-3 font-semibold text-sm">Equipment Type</th>
                        <th class="p-3 font-semibold text-sm">Model</th>
                        <th class="p-3 font-semibold text-sm">Acquisition Date</th>
                        <th class="p-3 font-semibold text-sm">Warranty</th>
                        <th class="p-3 font-semibold text-sm">Assigned to</th>
                        <th class="p-3 font-semibold text-sm">Department</th>
                        <th class="p-3 font-semibold text-sm">Condition</th>
                        <th class="p-3 font-semibold text-sm">Health</th>
                        <th class="p-3 font-semibold text-sm">Release Date</th>
                        <th class="p-3 font-semibold text-sm">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in paginatedServices" :key="index"
                        :class="{ 'bg-gray-50': index % 2 === 0, 'bg-white': index % 2 !== 0 }"
                        class="hover:bg-slate-100 border-b border-gray-200">
                        <td class="p-3 text-gray-700">{{ data?.name }}</td>
                        <td class="p-3 text-gray-700">{{ data?.equipment_type }}</td>
                        <td class="p-3 text-gray-700">{{ data?.model }}</td>
                        <td class="p-3 text-gray-700">{{ data?.acquisition_date }}</td>
                        <td class="p-3 text-gray-700">{{ data?.warranty }}</td>
                        <td class="p-3 text-gray-700">{{ !data.requested ? '' : data?.requested?.firstname + ' ' + data?.requested?.lastname }}</td>
                        <td class="p-3 text-gray-700">{{ data?.requested?.department }}</td>
                        <td class="p-3 text-gray-700">{{ data?.condition }}</td>
                        <td class="p-3 text-gray-700">{{ data?.health }}</td>
                        <td class="p-3 text-gray-700">{{ formatDate(data.created_at) }}</td>
                        <td class="p-3 text-gray-700">
                            <!-- MdEditSharp, RiDeleteBin6Line -->
                            <div class="cursor-pointer text-emerald-500 hover:text-emerald-700 duration-200"
                                title="Edit User"
                                @click="[isModalVisible = true, selectedInventory = data, formData = data]">
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
        </div>
    </section>
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
                    <select id="options" class="border border-gray-300 rounded p-2 w-full" v-model="formData.condition">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchInventory, insertInventory, updateInventory, fetchRequestedServices } from '../services/apiServices';
import Loading from '../Loading.vue';
import { useToast } from 'vue-toastification';
import Modal from '../modal/Modal.vue';
import { formatDate } from '../utils/convertDate';

const toast = useToast();
const isLoading = ref(false);
const users = ref([]);
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
const requestedServices = ref([]);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5); // Adjust as needed for items per page

const getInventory = async () => {
    isLoading.value = true;
    try {
        users.value = await fetchInventory();
        toast.success('Data updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to load services.');
    } finally {
        isLoading.value = false;
    }
};

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
    getInventory();
});
</script>

<style scoped>
/* Add any custom styling as needed */
</style>
