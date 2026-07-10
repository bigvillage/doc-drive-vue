<template>
  <router-view />
</template>

<!-- <script setup>
import Sidebar from './components/SideBar.vue'
import HomeHeader from './components/home/HomeHeader.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.checkAuth()
})

</script> -->

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto,
    'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo',
    'Noto Sans KR', 'Malgun Gothic', sans-serif;
}
</style>