import axios from "axios"
import { useUserStore } from "../stores/userStore";
const apiClient = axios.create({
    // baseURL: 'http://192.168.1.6:8000/api',
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use(async (config) => {
    const userStore = useUserStore();
    const accessToken = userStore.accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, error => Promise.reject(error))


export const fetchAvailableServices = async () => {
    try {
        const response = await apiClient.get(`/service`)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchAvailableServices : ', error)
        throw new Error('Failed to fetch available services.')
    }
}

export const insertAvailableServices = async (data) => {
    try {
        console.log(data)
        const response = await apiClient.post(`/service`, data)
        // console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/insertAvailableServices : ', error)
        throw new Error('Failed to insert available services.')
    }
}

export const updateAvailableServices = async (payload) => {
    try {
        const response = await apiClient.put(`/service/${payload.id}`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/updateAvailableServices : ', error)
        throw new Error('Failed to update available services.')
    }
}

export const deleteAvailableServices = async (id) => {
    try {
        const response = await apiClient.delete(`/service/${id}`)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/updateAvailableServices : ', error)
        throw new Error('Failed to update available services.')
    }
}

// USER

export const fetchUserByType = async (type) => {
    try {
        // const response = await apiClient.get(`/getUserByType/${type}`)
        const response = await apiClient.get(`/getUserByType/${type}`)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/getUserByType : ', error)
        throw new Error('Failed to fetch users available services.')
    }
}

export const insertUser = async (data) => {
    try {
        const response = await apiClient.post(`/users`, data)
        // console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Failed to insert user.')
    }
}

export const updateUser = async (payload) => {
    try {
        const response = await apiClient.put(`/users/${payload.id}`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/updateUser : ', error.response.data)
        throw new Error('Failed to update available services.')
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await apiClient.delete(`/service/${id}`)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/deleteUser : ', error)
        throw new Error('Failed to delete user.')
    }
}

// requested services

export const fetchRequestedServices = async () => {
    try {
        const response = await apiClient.get(`/service-requests`)
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchRequestedServices : ', error.response.data.message)
        throw new Error('Failed to fetch requested services')
    }
}

export const sendRequest = async (payload) => {
    try {
        const response = await apiClient.post(`/service-requests`, payload)
        console.log('requested services: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/sendRequest : ', error.response.data.message)
        throw new Error('Failed to send request')
    }
}


export const updateRequestedStatus = async (id, status) => {
    console.log({ id: id })
    console.log({ status: status })
    try {
        const response = await apiClient.put(`/service-requests/${id}`, { status: status })
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/updateRequestedStatus : ', error.response.data.message)
        throw new Error('Failed to update requested services')
    }
}

// TASK

export const assignTask = async (serviceRequestId, payload) => {
    console.log(payload)
    try {
        const response = await apiClient.post(`/service-requests/${serviceRequestId}/assign-task`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/assignTask : ', error.response.data.message)
        throw new Error('Failed to assign task to a user')
    }
}

export const fetchTasks = async () => {
    try {
        const response = await apiClient.get(`/tasks`)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchTasks : ', error.response.data.message)
        throw new Error('Failed to fetch tasks')
    }
}


export const fetchMyTask = async () => {
    try {
        const response = await apiClient.get(`/assignedToMe`)
        // console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchMyTask : ', error.response.data.message)
        throw new Error('Failed to fetch your tasks')
    }
}

export const updateTaskStatus = async (payload) => {
    try {
        const response = await apiClient.put(`/updateTaskStatus/${payload.id}`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/updateTask : ', error.response.data.message)
        throw new Error('Failed to to update task')
    }
}

export const uploadProof = async (id, uri) => {
    console.log('/uploadProof');
    const formData = new FormData();

    if (uri) {
        formData.append('proof', {
            uri: uri,
            type: 'image/jpeg', // or the correct mime type
            name: 'proof.jpg', // you can set a default name
        });
    }

    try {
        const response = await apiClient.post(`/uploadProof/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Response data: ', response.data);
        return response.data;
    } catch (error) {
        console.log('apiServices/uploadProof: ', error.response?.data?.message || error.message);
        throw new Error('Failed to upload proof');
    }
};






// Preventive maintenance

export const updatePreventiveStatus = async (payload) => {
    try {
        const response = await apiClient.put(`/updatePreventiveStatus/${payload.id}`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/updateTask : ', error.response.data.message)
        throw new Error('Failed to to update task')
    }
}

export const schedulePreventiveMaintenance = async (payload) => {
    try {
        const response = await apiClient.post(`/preventive-maintenance`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Failed to insert preventive maintenance')
    }
}

export const updatePreventiveTaskStatus = async (payload) => {
    console.log({ id: payload })
    try {
        const response = await apiClient.put(`/preventive-maintenance/${payload.id}`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/updatePreventiveTaskStatus : ', error.response.data.message)
        throw new Error('Failed to update preventive maintenance status')
    }
}

export const fetchAllPreventiveMaintenance = async () => {
    try {
        const response = await apiClient.get(`/preventive-maintenance`)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchAllPreventiveMaintenance : ', error.response.data.message)
        throw new Error('Failed to fetch all preventive maintenance')
    }
}

export const fetchMyPreventiveMaintenanceTasks = async () => {
    try {
        const response = await apiClient.get(`/getMyPreventiveMaintenanceTasks`)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchTasksForUser(preventive maintenance) : ', error.response.data.message)
        throw new Error('Failed to fetch all fetchTasksForUser')
    }
}

export const fetchReportsByPreventiveId = async (id) => {
    try {
        const response = await apiClient.get(`/getReportsByPreventiveId/${id}`)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchReportsByPreventiveId : ', error.response.data.message)
        throw new Error('Failed to fetch all fetchReportsByPreventiveId')
    }
}

// Inventory

export const insertInventory = async (payload) => {
    try {
        const response = await apiClient.post(`/inventory`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/insertInventory : ', error.response.data.message)
        throw new Error('Failed to insert inventory')
    }
}

export const updateInventory = async (payload) => {
    try {
        const response = await apiClient.put(`/inventory/${payload.id}`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/updateInventory : ', error.response.data.message)
        throw new Error('Failed to update inventory')
    }
}


export const fetchInventory = async (payload) => {
    try {
        const response = await apiClient.get(`/inventory`, payload)
        console.log('response data: ', response.data)
        return response.data;
    } catch (error) {
        console.log('apiServices/fetchInventory : ', error.response.data.message)
        throw new Error('Failed to fetch inventory')
    }
}
