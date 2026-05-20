import { createRouter, createWebHistory } from "vue-router"

import Login from "../views/LoginView.vue"
import Signup from "../views/SignupView.vue"
import test from "../views/TestView.vue"
import DocumentList from "../components/DocumentList.vue"
import DocumentDetail from "../components/DocumentDetail.vue"
import Upload from "../components/Upload.vue"
import Settings from '../components/SettingsView.vue'
import MyPage from '../views/MyPageView.vue'
import { useAuthStore } from '@/stores/auth'


const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/docdetail",
    component: DocumentDetail
  },
  {
    path: "/doclist",
    component: DocumentList
  },
  {
    path: "/upload",
    component: Upload
  },
  {
    path: "/signup",
    component: Signup
  },
  {
    path: "/test",
    component: test
  },
  {
    path: '/favorites',
    component: () => import('../components/FavoriteList.vue')
  },
  {
    path: '/settings',
    component: Settings
  },
  {
    path: '/mypage',
    component: MyPage
  }
]

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 로그인 필요 없는 페이지
  const publicPages = ['/login', '/signup']
  const isPublic = publicPages.includes(to.path)

  // 서버에 로그인 상태 확인 (쿠키 기반)
  const isLoggedIn = await authStore.checkAuth()

  if (!isPublic && !isLoggedIn) {
    return next('/login')
  }

  next()
})

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router