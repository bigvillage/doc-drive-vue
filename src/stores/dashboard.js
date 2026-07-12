import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true

export const useDashboardStore = defineStore('dashboard', () => {
    const totalDocuments = ref(0)
    const todayUploads = ref(0)
    const favoriteCount = ref(0)
    const recentDocuments = ref([])
    const loading = ref(false)
    const error = ref(null)
    const recentDocs = ref([])

    const API_URL = 'http://localhost:3000/api/dashboard'

    const fetchDashboard = async () => {
        loading.value = true
        error.value = null

        try {
            const response = await axios.get(API_URL)

            if (response.data.result) {
                const data = response.data.data

                totalDocuments.value = response.data.data.totalDocuments
                todayUploads.value = response.data.data.todayUploads
                favoriteCount.value = response.data.data.favoriteCount
                recentDocuments.value = response.data.data.recentDocuments
                console.log('recentDocuments.value =-=> ', recentDocuments.value)
                recentDocs.value = recentDocuments.value.map((doc) => ({
                    id: doc._id,
                    title: doc.title,
                    time: formatTime(doc.createdAt),
                    date: new Date(doc.createdAt).toLocaleDateString(),
                    type: doc.files?.[0]?.type?.split('/')[1]?.toUpperCase() || 'FILE',
                    content: doc.content,
                    isFavorite: doc.isFavorite || false,
                    attachments:
                        doc.files?.map((file) => ({
                            name: file.originalName,
                            size: (file.size / 1024).toFixed(1) + 'KB',
                            ext: file.originalName?.split('.').pop()?.toLowerCase() || '',
                            url: file.fileUrl,
                            fileKey: file.fileKey,
                        })) || [],
                }))
                console.log('recentDocs @=> ', recentDocs.value)
            }
        } catch (err) {
            error.value = err.response?.data?.message || '대시보드 정보를 불러오지 못했습니다.'
        } finally {
            loading.value = false
        }
    }

    const formatTime = (date) => {
        const diff = Date.now() - new Date(date).getTime()

        const minute = Math.floor(diff / 60000)

        if (minute < 60) {
            return `${minute}분 전`
        }

        const hour = Math.floor(minute / 60)

        if (hour < 24) {
            return `${hour}시간 전`
        }

        return `${Math.floor(hour / 24)}일 전`
    }

    const updateFavorite = (id, value) => {
        const target = recentDocs.value.find((doc) => doc.id === id)

        if (target) {
            target.isFavorite = value
        }
    }

    return {
        updateFavorite,
        totalDocuments,
        todayUploads,
        favoriteCount,
        recentDocs,
        loading,
        error,
        fetchDashboard,
    }
})
