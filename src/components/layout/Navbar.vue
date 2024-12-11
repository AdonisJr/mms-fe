<template>
  <nav class="bg-white border-b-2 border-slate-200 sticky top-0 w-12/12 flex justify-between items-center py-4 px-4">
    <v-icon name="oi-three-bars" width="22" height="22"
      class="hover:cursor-pointer text-slate-500 hover:text-slate-700 duration-200"
      @click="sidePanelStore.toggleSidePanel()" />
    <div class="flex gap-5 items-center text-black cursor-pointer">
      <div class="relative" title="Notification" @click="isNotificationModalVisible = true">
        <span class="text-black bg-yellow-200 px-1 rounded-full text-xs absolute -right-1 -top-1">
          {{ notifications.length }}
        </span>
        <v-icon name="io-notifications-circle-sharp" width="25" height="25" />
      </div>
      <p @click="isConfirmVisible = true" class="text-red-700 font-bold cursor-pointer hover:text-red-500 duration-200">
        Logout
      </p>
    </div>
  </nav>
  <Confirm v-if="isConfirmVisible" message="Are you sure you want to logout?" @confirm="logout"
    @cancel="isConfirmVisible = false" />
  <NotificationModal v-if="isNotificationModalVisible" :notifications="notifications"
    :visible="isNotificationModalVisible" @close="isNotificationModalVisible = false" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useSidePanelStore } from '../stores/sidePanelStore';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import Confirm from '../modal/Confirm.vue';
import NotificationModal from '../modal/NotificationModal.vue';
import { fetchNotifications } from '../services/apiServices';
import { messaging, onMessage, getToken } from '../../../firebase';
import sound from '../../../public/bell.mp3';

const toast = useToast();
const router = useRouter();
const userStore = useUserStore();
const sidePanelStore = useSidePanelStore();
const isSidePanelOpen = computed(() => sidePanelStore.isSidePanelOpen);
const isConfirmVisible = ref(false);
const isNotificationModalVisible = ref(false);
const notifications = ref([]);
const vapidKey = import.meta.env.VITE_VAPID_KEY;

const notifAudio = import('../../../public/bell.mp3')

const logout = () => {
  userStore.logout();
  isConfirmVisible.value = false;
  toast.success('Successfully logout');
  setTimeout(() => {
    router.push({ path: '/login' });
  }, 1000);
};

const getNotification = async () => {
  try {
    notifications.value = await fetchNotifications();
  } catch (error) {
    console.error(error);
    toast.error('Failed to load notifications.');
  }
};

const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey });
    console.log('FCM Token:', token);
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

onMounted(() => {
  requestNotificationPermission();
  getNotification();

  onMessage(messaging, (payload) => {
    console.log('Notification received:', payload);

    // Call your custom function to handle notifications
    getNotification();

    // Play notification sound
    const audio = new Audio(sound); // Replace notifAudio with the path to your MP3 file
    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });

    // Show alert after a delay
    setTimeout(() => {
      alert(payload.notification.body);
    }, 3000);
  });

});
</script>