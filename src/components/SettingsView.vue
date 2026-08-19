<template>
    <div class="settings-container">
        <!-- 🔐 인증 화면 -->
        <div v-if="!isAuthenticated" class="auth-box">
            <h2>🔒 재인증</h2>

            <el-input
                v-model="password"
                type="password"
                placeholder="비밀번호 입력"
                show-password
                style="margin-bottom: 15px"
            />

            <el-button type="primary" @click="checkAuth">확인</el-button>
        </div>

        <!-- ⚙️ 설정 화면 -->
        <div v-else>
            <h1 class="title">⚙️ 설정</h1>

            <el-card class="setting-card">
                <template #header>
                    <span>사용자 설정</span>
                </template>

                <el-form label-width="120px" class="form">
                    <el-form-item label="이름">
                        <el-input v-model="form.name" />
                    </el-form-item>

                    <el-form-item label="이메일">
                        <el-input v-model="form.email" />
                    </el-form-item>

                    <el-form-item label="다크 모드">
                        <el-switch v-model="form.darkMode" />
                    </el-form-item>

                    <el-form-item label="알림 받기">
                        <el-switch v-model="form.notification" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="saveSettings">저장</el-button>
                        <el-button @click="resetSettings">초기화</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

/* 🔐 인증 상태 */
const isAuthenticated = ref(false)
const password = ref('')

const CORRECT_PASSWORD = '1234'

const checkAuth = async () => {
    try {
        const res = await authStore.checkPassword(email, password.value)

        if (res.success) {
            isAuthenticated.value = true
            ElMessage.success('인증 성공')
        } else {
            ElMessage.error(res.message)
        }
    } catch (e) {
        ElMessage.error('서버 오류')
    }
}

/* ⚙️ 설정 */
const form = reactive({
    name: '',
    email: '',
    darkMode: false,
    notification: true,
})

const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(form))
    ElMessage.success('설정 저장 완료')
}

const resetSettings = () => {
    form.name = ''
    form.email = ''
    form.darkMode = false
    form.notification = true
    ElMessage.success('초기화 완료')
}

const saved = localStorage.getItem('settings')
if (saved) {
    Object.assign(form, JSON.parse(saved))
}
</script>

<style scoped>
.settings-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px;
}

.title {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 20px;
}

.setting-card {
    border-radius: 12px;
}

.form {
    margin-top: 10px;
}

/* 🔐 인증 UI */
.auth-box {
    max-width: 400px;
    margin: 100px auto;
    text-align: center;
}
</style>
