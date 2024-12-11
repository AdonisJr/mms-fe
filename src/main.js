import { createApp } from 'vue';
// import './style.css'
import './assets/css/tailwind.css';
import router from './router';
import App from './App.vue';
import Toast, { POSITION, useToast } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import { createPinia } from 'pinia';
import { OhVueIcon } from 'oh-vue-icons';
import './ohVueIcons';
import sound from '../public/bell.mp3';

const app = createApp(App);
const pinia = createPinia();
app.component('v-icon', OhVueIcon);
const toast = useToast();

app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 1500,
    maxToasts: 1,
    newestOnTop: true,
    filterBeforeCreate: (toastInstance, toasts) => {
        toast.clear();
        return toastInstance;
    }
});

let isUserInteracted = false;

// Add a button to the DOM for enabling notifications
const enableNotificationsButton = document.createElement('button');
enableNotificationsButton.textContent = "Enable Notifications";
enableNotificationsButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1000;
`;
document.body.appendChild(enableNotificationsButton);

enableNotificationsButton.addEventListener('click', () => {
    isUserInteracted = true;
    alert('Notifications and sounds are now enabled.');
    enableNotificationsButton.style.display = 'none'; // Hide the button after enabling
});

// Listen for service worker messages
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'PLAY_AUDIO') {
            if (isUserInteracted) {
                const audio = new Audio(sound);
                audio.play().then(() => {
                    alert(event.data.notification.body);
                }).catch(error => {
                    console.error('Audio playback failed:', error);
                    alert(event.data.notification.body);
                });
            } else {
                toast.info('Please click "Enable Notifications" to hear sounds.');
            }
        }
    });
}

app.use(pinia);
app.use(router);
app.mount('#app');
