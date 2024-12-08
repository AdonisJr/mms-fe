<template>
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg w-11/12 max-w-md p-4 shadow-lg absolute top-12 right-5">
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b pb-3">
          <h2 class="text-lg font-bold text-gray-800">Notifications</h2>
          <button
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
            title="Close"
            @click="close"
          >
            ✕
          </button>
        </div>
  
        <!-- Notifications List -->
        <div class="mt-4 max-h-96 overflow-y-auto">
          <ul>
            <li
              v-for="(notification, index) in notifications"
              :key="index"
              class="flex items-start gap-3 p-3 border-b hover:bg-gray-100 duration-150 cursor-pointer"
            >
              <!-- Notification Icon -->
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-blue-500">
                  <i class="icon-notification"></i>
                </div>
              </div>
  
              <!-- Notification Details -->
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-700">{{ notification.type }}</p>
                <p class="text-xs font-bold mt-1">{{ notification.message }}</p>
                <p class="text-xs mt-1 text-blue-500">{{ timeAgo(notification.created_at) }}</p>
              </div>
            </li>
          </ul>
  
          <!-- Empty State -->
          <p v-if="notifications.length === 0" class="text-center text-gray-500 py-4">
            No notifications available.
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import {timeAgo} from '../utils/convertDate';
  
  const props = defineProps({
    notifications: {
      type: Array,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['close']);
  
  const close = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  /* Custom styles for notification icon if needed */
  .icon-notification {
    font-size: 1.5rem;
    font-weight: bold;
  }
  </style>
  