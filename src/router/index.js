import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard.vue'

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: {
            requiresAuth: true,
            requiresRole: 'admin',
        }
    },
    {
        path: '/employees',
        name: 'employees',
        component: () => import('../views/AcceptedEmployees.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'admin',
        }
    },
    {
        path: '/pending-employees',
        name: 'pendingEmployees',
        component: () => import('../views/PendingEmployees.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'admin',
        }
    },
    {
        path: '/services',
        name: 'services',
        component: () => import('../views/Services.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'admin',
        }
    },
    {
        path: '/pending-reservations',
        name: 'pendingReservations',
        component: () => import('../views/PendingReservations.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'admin',
        }
    },
    {
        path: '/accepted-reservations',
        name: 'acceptedReservations',
        component: () => import('../views/AcceptedReservations.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'admin',
        }
    },
    {
        path: '/completed-reservations',
        name: 'completedReservations',
        component: () => import('../views/CompletedReservations.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'admin',
        }
    },
    {
        path: '/rejected-reservations',
        name: 'rejectedReservations',
        component: () => import('../views/RejectedReservations.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'admin',
        }
    },
    {
        path: '/rejected-reservations',
        name: 'rejectedReservations',
        component: () => import('../views/RejectedReservations.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'admin',
        }
    },
    {
        path: '/canceled-reservations',
        name: 'canceledReservations',
        component: () => import('../views/CanceledReservations.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'admin',
        }
    },
    {
        path: '/assigned-reservations',
        name: 'assignedReservations',
        component: () => import('../views/AssignedReservations.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'employee',
        }
    },
    {
        path: '/completed-reservations',
        name: 'completedAssignedReservations',
        component: () => import('../views/CompletedAssignedReservations.vue'),
        meta: {
            requiresAuth: true,
            requiresRole: 'employee',
        }
    },
    {
        path: '/not-authorized',
        name: 'notAuthorized',
        component: () => import('../views/Forbidded.vue'),
    },
]


const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuth = authStore.isAuthenticated;
    const role = authStore.role;

    if (to.meta.requiresAuth && !isAuth) {
        return next('/');
    }

    if (to.path === '/' && isAuth) {
        const rolePaths = {
            admin: '/dashboard',
            staff: '/staff-dashboard',
        };
        return next(rolePaths[role] || '/dashboard');
    }

    if (to.meta.requiresRole && to.meta.requiresRole !== role) {
        return next('/not-authorized');
    }

    next();
});




export default router