import { createApp } from 'vue'
// import './style.css'
import './assets/css/tailwind.css'
import router from './router';
import App from './App.vue'
import Toast, { POSITION, useToast } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import { createPinia } from 'pinia';
import { OhVueIcon } from 'oh-vue-icons';
import './ohVueIcons';

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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/public/firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
};

app.use(pinia);
app.use(router);
app.mount('#app');
