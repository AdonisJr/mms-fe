import { createRouter, createWebHistory } from "vue-router";
import BlankPanelLayout from './components/layout/BlankPanel.vue';
import AdminPanelLayout from './components/layout/AdminPanel.vue';
import Login from './components/views/Login.vue';
import Admin from './components/views/Admin.vue';
import { useUserStore } from "./components/stores/userStore";
import Users from "./components/views/Users.vue";
import Tasks from "./components/views/Tasks.vue";
import Maintenance from "./components/views/Maintenance.vue";
import Inventory from "./components/views/Inventory.vue";
import Dashboard from "./components/views/Dashboard.vue";
import Preventive from "./components/views/Preventive.vue";
import Equipment from "./components/views/Equipment.vue";

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/',
        component: BlankPanelLayout,
        children: [
            {
                path: '/login',
                name: 'Login',
                component: Login
            }
        ]
    },
    {
        path: '/',
        component: BlankPanelLayout,
        children: [
            {
                path: '/home',
                name: 'Home',
                component: Login // Home 
            }
        ]
    },
    {
        path: '/admin',
        component: AdminPanelLayout,
        children: [
            {
                path: '/requested-services',
                name: 'Requested',
                component: Dashboard // Home 
            },
            {
                path: '/preventive',
                name: 'Preventive',
                component: Preventive // Preventive 
            },
            {
                path: '/equipment',
                name: 'Equipment',
                component: Equipment // Preventive 
            },
            {
                path: '/requested-servicesssss',
                name: 'Requesteds',
                component: Admin // Home 
            },
            {
                path: '/users',
                name: 'Users',
                component: Users // Users 
            },
            {
                path: '/tasks',
                name: 'Tasks',
                component: Tasks // Users 
            },
            {
                path: '/maintenance',
                name: 'Maintenance',
                component: Maintenance // Users 
            },
            {
                path: '/inventory',
                name: 'Inventory',
                component: Inventory // Users 
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Load user data before any route navigation
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    userStore.loadUserFromStorage();  // Ensure user data is loaded before navigating

    // If the user is authenticated, redirect to the /admin page
    if (userStore.isAuthenticated && to.path === '/login') {
        next('/dashboard'); // Redirect authenticated users to /admin
    }
    // If the user is not authenticated and trying to access protected routes
    else if (to.path !== '/login' && !userStore.isAuthenticated) {
        next('/login'); // Redirect to login if not authenticated
    } else {
        next(); // Continue navigation
    }
});


// Function for checking the user if already logged in
// router.beforeEach(async (to, from, next) =>{
//     const accessToken = getToken('auth');
//     const publicPaths = ['/login', '/register', '/forgot_password', '/reset_password'];

//     if(accessToken){
//         const userStore = useUserStore();
//         const user = userStore.getUser();
//         if(!user){
//             userStore.setUser(await fetchUserDetails()) //set user on store/pinia
//         }
//         if(to.path === '/login'){
//             next('/home')
//         }else{
//             next();
//         }
//     }else{
//         if(publicPaths.some(path => to.path.startsWith(path))){
//             next();
//         }else{
//             next('/login');
//         }
//     }
// })

export default router;