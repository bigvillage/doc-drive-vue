import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

import Login from '@/views/LoginView.vue'
import Signup from '@/views/SignupView.vue'

import HomeView from '@/views/HomeView.vue'
import MyPage from '@/views/MyPageView.vue'

import DocumentList from '@/components/DocumentList.vue'
import DocumentDetail from '@/components/DocumentDetail.vue'
import Upload from '@/components/Upload.vue'
import Settings from '@/components/SettingsView.vue'
import FavoriteList from '@/components/FavoriteList.vue'
import Dashboard from '@/components/Dashboard.vue'
import Test from '@/views/TestView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                redirect: '/home',
            },
            {
                path: 'home',
                component: Dashboard,
                meta: { requiresAuth: true },
            },
            {
                path: 'doclist',
                component: DocumentList,
                meta: { requiresAuth: true },
            },
            {
                path: 'docdetail',
                component: DocumentDetail,
            },
            {
                path: 'upload',
                component: Upload,
            },
            {
                path: 'favorites',
                component: FavoriteList,
                meta: { requiresAuth: true },
            },
            {
                path: 'settings',
                component: Settings,
            },
            {
                path: 'mypage',
                component: MyPage,
                meta: { requiresAuth: true },
            },
            {
                path: 'test',
                component: Test,
            },
        ],
    },

    {
        path: '/',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                component: Login,
            },
            {
                path: 'signup',
                component: Signup,
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    if (!authStore.user) {
        await authStore.checkAuth()
    }

    if (to.meta.requiresAuth && !authStore.user) {
        return '/login'
    }
})

export default router
