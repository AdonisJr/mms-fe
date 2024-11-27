<template>
    <section class="p-4 h-[90%] gap-10 overflow-y-auto">
        <div class="bg-white p-2 shadow-md sticky top-0 mb-2">
            <h2 class="text-2xl font-bold mb-2">USERS LIST</h2>
            <p>Filter</p>
            <div class="flex justify-between gap-10">
                <select id="options" v-model="filter" class="border border-gray-300 rounded p-2 w-full">
                    <option value="all">All</option>
                    <option value="general_service">General Service</option>
                    <option value="faculty">Faculty</option>
                    <option value="utility_worker">Personnel</option>
                </select>
                <div class="w-36 p-2 bg-blue-500 text-white rounded-md flex items-center gap-1 cursor-pointer hover:bg-blue-700 duration-200"
                    @click="[isModalVisible = true, selectedUser = '']" title="Add new user">
                    <v-icon name="md-personaddalt1" width="22" height="22" />
                    ADD NEW
                </div>
            </div>

        </div>


        <!-- Loading Spinner -->
        <Loading v-if="isLoading" />

        <!-- Available Services Table -->
        <div v-else class="overflow-x-auto text-sm">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead>
                    <tr class="bg-slate-700 text-white text-left">
                        <th class="p-3 font-semibold text-sm">First Name</th>
                        <th class="p-3 font-semibold text-sm">Last Name</th>
                        <th class="p-3 font-semibold text-sm">Email</th>
                        <th class="p-3 font-semibold text-sm">Gender</th>
                        <th class="p-3 font-semibold text-sm">Type</th>
                        <th class="p-3 font-semibold text-sm">Department</th>
                        <th class="p-3 font-semibold text-sm">Created At</th>
                        <th class="p-3 font-semibold text-sm">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in paginatedServices" :key="index"
                        :class="{ 'bg-gray-50': index % 2 === 0, 'bg-white': index % 2 !== 0 }"
                        class="hover:bg-slate-100 border-b border-gray-200">
                        <td class="p-3 text-gray-700">{{ data.firstname }}</td>
                        <td class="p-3 text-gray-700">{{ data.lastname }}</td>
                        <td class="p-3 text-gray-700">{{ data.email }}</td>
                        <td class="p-3 text-gray-700">{{ data.gender }}</td>
                        <td class="p-3 text-gray-700">{{ data.type }}</td>
                        <td class="p-3 text-gray-700">{{ data.department }}</td>
                        <td class="p-3 text-gray-700">{{ formatDate(data.created_at) }}</td>
                        <td class="flex flex-col gap-2 items-center p-3 text-gray-700">
                            <!-- MdEditSharp, RiDeleteBin6Line -->
                            <div class="cursor-pointer text-emerald-500 hover:text-emerald-700 duration-200"
                                title="Edit User" @click="[isModalVisible = true, selectedUser = data]">
                                <v-icon name="md-edit-sharp" width="22" height="22" />
                            </div>
                            <!-- delete -->
                            <!-- <div class="cursor-pointer text-red-500 hover:text-red-700 duration-200" title="Delete User">
                                <v-icon name="ri-delete-bin-6-line" width="22" height="22" />
                            </div> -->
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
        <Modal v-if="isModalVisible">
            <div class="relative bg-white rounded-md z-30 p-4 w-3/6 border-2 border-slate-300">
                <p class="text-lg absolute top-2 cursor-pointer hover:text-slate-400 duration-200 right-4"
                    @click="isModalVisible = false">x</p>
                <p class="text-xl font-bold">{{ selectedUser ? 'EDIT' : 'ADD' }} USER</p>

                <div class="py-4" v-if="selectedUser">
                    <!-- firstname -->
                    <p class="ps-2 text-slate-700">First Name</p>
                    <input type="text" v-model="selectedUser.firstname"
                        class="border-2 border-slate-200 p-2 rounded-md w-full">
                    <!-- lastname -->
                    <p class="ps-2 text-slate-700 mt-2">Last Name</p>
                    <input type="text" v-model="selectedUser.lastname"
                        class="border-2 border-slate-200 p-2 rounded-md w-full">

                    <!-- gender -->
                    <p class="ps-2 text-slate-700 mt-2">Gender</p>
                    <select id="options" v-model="selectedUser.gender"
                        class="border border-gray-300 rounded p-2 w-full">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    <!-- department -->
                    <p class="ps-2 text-slate-700 mt-2">Department</p>
                    <select id="options" v-model="selectedUser.department" v-if="selectedUser.type === 'faculty'"
                        class="border border-gray-300 rounded p-2 w-full">
                        <option disabled value="">Please select department...</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Physical Education">Physical Education</option>
                        <option value="Health and Nursing">Health and Nursing</option>
                        <option value="Library">Library</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Art">Art</option>
                        <option value="Business">Business</option>
                    </select>
                    <select id="options" v-model="selectedUser.department" v-else
                        class="border border-gray-300 rounded p-2 w-full">
                        <option disabled value="">Please select department...</option>
                        <option value="Maintenance Department">Maintenance Department</option>
                        <option value="Housekeeping Department">Housekeeping Department</option>
                        <option value="Security Department">Security Department</option>
                        <option value="Transportation Department">Transportation Department</option>
                        <option value="Waste Management Department">Waste Management Department</option>
                        <option value="Groundskeeping Department">Groundskeeping Department</option>
                        <option value="Utility Services Department">Utility Services Department</option>
                    </select>
                </div>

                <!-- ADD NEW -->
                <div class="py-4 flex flex-col gap-2" v-else>
                    <!-- firstname -->
                    <input type="text" placeholder="First Name" v-model="payload.firstname"
                        class="border-2 border-slate-200 p-2 rounded-md w-full">
                    <!-- lastname -->
                    <input type="text" placeholder="Last Name" v-model="payload.lastname"
                        class="border-2 border-slate-200 p-2 rounded-md w-full">
                    <!-- email -->
                    <input type="text" placeholder="Email" v-model="payload.email"
                        class="border-2 border-slate-200 p-2 rounded-md w-full">
                    <!-- gender -->
                    <select id="options" v-model="payload.gender" class="border border-gray-300 rounded p-2 w-full">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    <select id="options" v-model="payload.type" class="border border-gray-300 rounded p-2 w-full">
                        <option disabled value="">Please select type...</option>
                        <option value="general_service">Admin</option>
                        <option value="faculty">Faculty</option>
                        <option value="utility_worker">General Services Personnel</option>
                    </select>

                    <select id="options" v-model="payload.department" v-if="payload.type === 'faculty'"
                        class="border border-gray-300 rounded p-2 w-full">
                        <option disabled value="">Please select department...</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Physical Education">Physical Education</option>
                        <option value="Health and Nursing">Health and Nursing</option>
                        <option value="Library">Library</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Art">Art</option>
                        <option value="Business">Business</option>
                    </select>
                    <select id="options" v-model="payload.department" v-else
                        class="border border-gray-300 rounded p-2 w-full">
                        <option disabled value="">Please select department...</option>
                        <option value="Maintenance Department">Maintenance Department</option>
                        <option value="Housekeeping Department">Housekeeping Department</option>
                        <option value="Security Department">Security Department</option>
                        <option value="Transportation Department">Transportation Department</option>
                        <option value="Waste Management Department">Waste Management Department</option>
                        <option value="Groundskeeping Department">Groundskeeping Department</option>
                        <option value="Utility Services Department">Utility Services Department</option>
                    </select>

                    <!-- password -->
                    <input type="password" placeholder="Password" v-model="payload.password"
                        class="border-2 border-slate-200 p-2 rounded-md w-full">

                    <!-- password confirmation -->
                    <input type="password" placeholder="Confirm Password" v-model="payload.password_confirmation"
                        class="border-2 border-slate-200 p-2 rounded-md w-full">
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
import { ref, computed, onMounted, watch } from 'vue';
import { fetchUserByType, insertUser, updateUser } from '../services/apiServices';
import Loading from '../Loading.vue';
import { useToast } from 'vue-toastification';
import { useUserStore } from '../stores/userStore';
import { formatDate } from '../utils/convertDate';
import Modal from '../modal/Modal.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();
const isLoading = ref(false);
const users = ref([]);
const isModalVisible = ref(false);
const selectedUser = ref('')
const filter = ref('all');
const payload = ref({
    firstname: '',
    lastname: '',
    email: '',
    gender: 'male',
    type: 'utility_worker',
    role: 'user',
    department: '',
    password: '',
    password_confirmation: ''
});

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust as needed for items per page

const getUsers = async () => {
    isLoading.value = true;
    try {
        users.value = await fetchUserByType(filter.value);
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

const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isLoading.value = false;

    if (selectedUser.value) {
        if (selectedUser?.value.firstname === '' || !selectedUser?.value.firstname) return toast.error('First Name is required');
        if (selectedUser?.value.lastname === '' || !selectedUser?.value.lastname) return toast.error('Last Name is required');
        if (selectedUser.value.email === '' || !selectedUser.value.email) return toast.error('Email is required');
        if (!emailRegex.test(selectedUser.value.email)) return toast.error('Invalid email format');
        if (selectedUser.value.type === '') return toast.error('Type is required');
        if (selectedUser.value.department === '') return toast.error('Please select department');
        try {
            isLoading.value = true;
            await updateUser(selectedUser.value);
            toast.success('Successfullly updated')
            selectedUser.value = '';
            isModalVisible.value = false;
        } catch (error) {
            console.log(error)
            toast.error('Failed to update user')
        } finally {
            isLoading.value = false;
        }
    } else {
        if (payload?.value.firstname === '' || !payload?.value.firstname) return toast.error('First Name is required');
        if (payload?.value.lastname === '' || !payload?.value.lastname) return toast.error('Last Name is required');
        if (payload.value.email === '' || !payload.value.email) return toast.error('Email is required');
        if (!emailRegex.test(payload.value.email)) return toast.error('Invalid email format');
        if (payload.value.type === '') return toast.error('Type is required');
        if (payload.value.department === '') return toast.error('Please select department');
        if (payload.value.password.length < 6) return toast.error('Password must be alteast 6 characters long');
        if (payload.value.password !== payload.value.password_confirmation) return toast.error('Password not match');

        try {
            isLoading.value = true;
            await insertUser(payload.value);
            toast.success('Successfullly added')
            clear();
            isModalVisible.value = false;
        } catch (error) {
            console.log(error)
            toast.error('Failed to inser user')
        } finally {
            isLoading.value = false;
        }
    }
}

const clear = () => {
    payload.value = {
        firstname: '',
        lastname: '',
        email: '',
        gender: 'male',
        type: 'utility_worker',
        role: 'user',
        department: '',
        password: '',
        password_confirmation: ''
    };
}

watch(filter, (newVal) => {
    getUsers();
    currentPage.value = 1;
})

onMounted(() => {
    getUsers();
});
</script>

<style scoped>
/* Add any custom styling as needed */
</style>
