<template>
    <div class="signup-container">
        <div class="signup-card">
            <div class="signup-header">
                <h2>회원가입</h2>
                <p>DocSearch의 새로운 회원이 되어보세요.</p>
            </div>

            <form @submit.prevent="handleSignup" class="signup-form">
                <div class="input-group">
                    <label for="name">이름</label>
                    <input type="text" id="name" v-model="form.name" placeholder="..." required />
                </div>

                <div class="input-group">
                    <label for="email">이메일</label>
                    <input type="email" id="email" v-model="form.email" placeholder="..." required />
                </div>

                <div class="input-group">
                    <label for="password">비밀번호</label>
                    <input type="password" id="password" v-model="form.password" placeholder="..." required />
                </div>

                <div class="input-group">
                    <label for="passwordConfirm">비밀번호 확인</label>
                    <input type="password" id="passwordConfirm" v-model="passwordConfirm" placeholder="..." required />
                </div>

                <button type="submit" class="signup-btn" :disabled="authStore.loading">
                    {{ authStore.loading ? '처리 중...' : '가입하기' }}
                </button>
            </form>

            <div class="signup-footer">
                <span>이미 계정이 있으신가요?</span>
                <router-link to="/login">로그인</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
    name: '',
    email: '',
    password: ''
})
const passwordConfirm = ref('')

// 유효성 검사 로직
const validateForm = () => {
    // 1. 이름 검사 (특수문자 제외, 한글 2~4자 또는 영어 12자 이내)
    const nameRegex = /^[a-zA-Z가-힣]+$/ // 특수문자 제외 정규식
    const isKorean = /[가-힣]/.test(form.name)

    if (!nameRegex.test(form.name)) {
        alert('이름에 특수문자를 포함할 수 없습니다.')
        return false
    }

    if (isKorean) {
        if (form.name.length < 2 || form.name.length > 4) {
            alert('한글 이름은 2~4글자 사이여야 합니다.')
            return false
        }
    } else {
        if (form.name.length > 12) {
            alert('영어 이름은 12글자 이내여야 합니다.')
            return false
        }
    }

    // 2. 이메일 적합성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
        alert('올바른 이메일 형식을 입력해주세요.')
        return false
    }

    // 3. 비밀번호 길이 검사 (16자 이하)
    if (form.password.length > 16) {
        alert('비밀번호는 16자 이하여야 합니다.')
        return false
    }

    // 4. 비밀번호 일치 확인
    if (form.password !== passwordConfirm.value) {
        alert('비밀번호 확인이 일치하지 않습니다.')
        return false
    }

    return true
}

const handleSignup = async () => {
    if (!validateForm()) return

    // Store를 통해 Node 서버로 데이터 전송
    console.log("{ ...form } ==> ", { ...form });
    console.log("authStore ==> ", authStore);
    const result = await authStore.signup({ ...form })
    console.log("result ==> ", result);

    if (result.result) {
        alert(result.message)
        router.push('/login')
    } else {
        alert(result.message)
    }
}
</script>

<style scoped>
@import '@/assets/auth.css';
</style>