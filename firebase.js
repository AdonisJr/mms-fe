// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCBS9qjB10Mq_KFTtz-F0HJaKD4OiUAUrQ",
    authDomain: "gsmms-web.firebaseapp.com",
    projectId: "gsmms-web",
    storageBucket: "gsmms-web.firebasestorage.app",
    messagingSenderId: "915191072914",
    appId: "1:915191072914:web:8d53e765ad7a2d9cf1fe4b",
    measurementId: "G-E8YWZ8GTJL"
}

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, onMessage, getToken };
