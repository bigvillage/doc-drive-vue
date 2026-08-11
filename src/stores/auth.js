import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

// axios가 요청 보낼 때 쿠키(JWT 등)를 같이 보내게 하는 설정
axios.defaults.withCredentials = true

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // 중앙화된 API 기본 URL (필요 시 수정)
    const API_BASE_URL = 'http://localhost:3000/api/login/auth'

    // 회원가입
    const signup = async (payload) => {
        loading.value = true
        error.value = null
        try {
            const response = await axios.post(API_BASE_URL, {
                ...payload,
                isSignup: true,
            })
            if (response.data.result) {
                user.value = {
                    name: response.data.name,
                    email: response.data.email,
                }
            }
        } catch (err) {
            error.value = err.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
            return { success: false, message: error.value }
        } finally {
            loading.value = false
        }
    }

    // 로그인
    const login = async (payload) => {
        loading.value = true
        error.value = null
        try {
            const response = await axios.post(API_BASE_URL, payload)
            console.log('response => ', response)
            if (response.data.result) {
                // user.value = {
                //   name: response.data.name,
                //   email: response.data.email
                // };
                user.value = response.data.user
                return { success: true }
            } else {
                return { success: false, message: response.data.message }
            }
        } catch (err) {
            const msg = err.response?.data?.message || '서버 통신 오류가 발생했습니다.'
            return { success: false, message: msg }
        } finally {
            loading.value = false
        }
    }

    // 로그아웃
    const logout = async () => {
        try {
            await axios.post(API_BASE_URL, { isLogout: true })
        } catch (err) {
            console.error('서버 로그아웃 처리 중 오류 발생:', err)
        } finally {
            user.value = null
            error.value = null
        }
    }

    // 인증 상태 확인
    const checkAuth = async () => {
        try {
            const response = await axios.get(API_BASE_URL)
            console.log('checkAuth response =', response.data)
            if (response.data.result) {
                user.value = response.data.user
                return true
            }

            user.value = null
            return false
        } catch (err) {
            user.value = null
            return false
        }
    }

    // 비밀번호 확인 (마이페이지 진입 등)
    const verifyPassword = async (password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/verify`, {
                email: user.value.email,
                password,
            })
            return response.data
        } catch (err) {
            return { result: false, message: '서버 오류' }
        }
    }

    // 비밀번호 변경
    const changePassword = async (newPassword) => {
        try {
            const response = await axios.patch(API_BASE_URL, {
                email: user.value.email,
                newPassword,
            })
            return response.data
        } catch (err) {
            return { result: false, message: '서버 오류' }
        }
    }

    return {
        user,
        loading,
        error,
        signup,
        login,
        logout,
        verifyPassword,
        changePassword,
        checkAuth,
    }
})
