<template>
    <div class="app-layout">
        <Sidebar />

        <div class="main-container">
            <HomeHeader />

            <div class="page-content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
import Sidebar from '@/components/SideBar.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
    await authStore.checkAuth()
})
</script>

<style scoped>
.app-layout {
    display: flex;
    min-height: 100vh;
}

.main-container {
    flex: 1;
    margin-left: 230px;
    background: #f3f4f6;
    display: flex;
    flex-direction: column;
}

.page-content {
    flex: 1;
    overflow-y: auto;
}
</style>