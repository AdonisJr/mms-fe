/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyCBS9qjB10Mq_KFTtz-F0HJaKD4OiUAUrQ",
    authDomain: "gsmms-web.firebaseapp.com",
    projectId: "gsmms-web",
    storageBucket: "gsmms-web.firebasestorage.app",
    messagingSenderId: "915191072914",
    appId: "1:915191072914:web:8d53e765ad7a2d9cf1fe4b",
    measurementId: "G-E8YWZ8GTJL"
}

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);

    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };

    // Show notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});
