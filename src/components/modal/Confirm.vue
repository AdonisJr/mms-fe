<template>
    <div>
      <!-- Confirmation Modal -->
      <div
        class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      >
        <div class="bg-white p-6 rounded shadow-lg w-80 text-center">
          <p class="text-lg font-medium mb-4">{{ message }}</p>
          <div class="flex justify-center gap-4">
            <button
              @click="$emit('confirm')"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Yes
            </button>
            <button
              @click="$emit('cancel')"
              class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Props
  defineProps({
    message: {
      type: String,
      default: "Are you sure?",
    }
  });
  
  </script>
  