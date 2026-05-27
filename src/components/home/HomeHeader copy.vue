<template>
    <header class="main-header">
        <SearchBar />

        <div class="user-menu">
            <template v-if="true">
                <div class="user-actions">
                    <button @click="router.push('/mypage')" class="nav-link">마이페이지</button>
                    <button @click="router.push('/settings')" class="nav-link">설정</button>

                    <div class="divider"></div> <span class="user-info"><b>{{ authStore.user?.name }}</b> 님</span>
                    <button @click="handleLogout" class="logout-btn">로그아웃</button>
                </div>
            </template>

            <template v-else>
                <button @click="router.push('/login')" class="login-btn">로그인</button>
            </template>
        </div>
    </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SearchBar from '../SearchBar.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
    await authStore.logout()

    ElMessage.success('로그아웃 되었습니다.')

    // 2. 로그인 페이지로 강제 이동
    router.push('/login')
}
</script>

<style scoped>
.main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    height: 70px;
    background-color: white;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.logo {
    font-size: 1.5rem;
    font-weight: 800;
    color: #4a90e2;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* 마이페이지, 설정 버튼 스타일 */
.nav-link {
    background: none;
    border: none;
    font-size: 0.9rem;
    color: #666;
    cursor: pointer;
    padding: 5px 10px;
    transition: color 0.2s;
}

.nav-link:hover {
    color: #4a90e2;
    text-decoration: underline;
}

/* 중간 구분선 */
.divider {
    width: 1px;
    height: 16px;
    background-color: #ddd;
    margin: 0 5px;
}

.user-info {
    font-size: 0.9rem;
    color: #333;
}

.logout-btn,
.login-btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
}

.logout-btn:hover {
    background: #fff5f5;
    color: #e74c3c;
    border-color: #e74c3c;
}

.login-btn {
    background-color: #4a90e2;
    color: white;
    border: none;
}

.login-btn:hover {
    background-color: #357abd;
}
</style>