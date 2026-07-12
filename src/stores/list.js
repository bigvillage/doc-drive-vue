import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
axios.defaults.withCredentials = true

export const useListStore = defineStore('list', () => {
    const documents = ref([])
    const total = ref(0)
    const API_URL = 'http://localhost:3000/api/documents/list'

    // 문서 리스트 조회
    const fetchDocuments = async (page = 1, pageSize) => {
        try {
            const response = await axios.get(`${API_URL}?page=${page}&limit=${pageSize}`, {
                withCredentials: true,
            })

            const resData = response.data.data || response.data
            total.value = resData.total

            documents.value = resData.documents.map((post) => ({
                id: post._id,
                title: post.title,
                author: '익명',
                date: new Date(post.createdAt).toLocaleDateString(),
                type: post.files?.[0]?.type?.split('/')[1]?.toUpperCase() || 'FILE',
                content: post.content,
                isFavorite: post.isFavorite || false,
                attachments:
                    post.files?.map((file) => ({
                        name: file.originalName,
                        size: (file.size / 1024).toFixed(1) + 'KB',
                        ext: file.originalName?.split('.').pop()?.toLowerCase() || '',
                        url: file.fileUrl,
                        fileKey: file.fileKey,
                    })) || [],
            }))
        } catch (error) {
            console.error('리스트 불러오기 에러:', error)
        }
    }

    // 즐겨찾기 토글 (이제 PATCH /api/documents/upload 사용)
    const toggleFavorite = async (id, current, isFavoritePage = false) => {
        try {
            const newValue = !current
            await axios.patch('http://localhost:3000/api/documents/upload', {
                id,
                isFavorite: newValue,
            })

            // 1. 일단 현재 화면 데이터의 별 상태를 토글해줍니다. (UI 반영)
            const target = documents.value.find((doc) => doc.id === id)
            if (target) target.isFavorite = newValue

            // 2. [수정 핵심] 즐겨찾기 페이지에서 '해제'할 때만 목록에서 즉시 제거합니다.
            if (isFavoritePage && !newValue) {
                documents.value = documents.value.filter((doc) => doc.id !== id)
            }

            // 일반 리스트 페이지일 때는 위 if문에 안 걸리므로,
            // 1번에서 target.isFavorite 값만 바뀌고 리스트에 그대로 유지됩니다.
        } catch (e) {
            console.error('즐겨찾기 변경 실패:', e)
        }
    }

    // 즐겨찾기 목록 조회 (GET /api/documents/list?isFavorite=true)
    const fetchFavoriteDocuments = async () => {
        try {
            const response = await axios.get(`${API_URL}?isFavorite=true`, {
                withCredentials: true,
            })

            const resData = response.data
            console.log('resData ==> ', resData)

            if (resData && resData.documents) {
                documents.value = resData.documents.map((post) => ({
                    id: post._id,
                    title: post.title,
                    author: '익명',
                    date: new Date(post.createdAt).toLocaleDateString(),
                    type: post.files?.[0]?.type?.split('/')[1]?.toUpperCase() || 'FILE',
                    content: post.content,
                    isFavorite: post.isFavorite || false, // DB에 값이 없으면 false로 처리
                    attachments:
                        post.files?.map((file) => ({
                            name: file.originalName,
                            size: (file.size / 1024).toFixed(1) + 'KB',
                            ext: file.originalName?.split('.').pop()?.toLowerCase() || '',
                            url: file.fileUrl,
                            fileKey: file.fileKey,
                        })) || [],
                }))
            }
        } catch (error) {
            console.error('즐겨찾기 불러오기 에러:', error)
        }
    }

    // 검색 (POST /api/documents/list)
    const searchDocuments = async (keyword) => {
        try {
            const response = await axios.post(API_URL, { q: keyword })
            const resData = response.data.data

            documents.value = resData.map((post) => ({
                id: post._id,
                title: post.title,
                author: '익명',
                date: new Date(post.createdAt).toLocaleDateString(),
                type: post.files?.[0]?.type?.split('/')[1]?.toUpperCase() || 'FILE',
                content: post.content,
                isFavorite: post.isFavorite || false,
                attachments:
                    post.files?.map((file) => ({
                        name: file.originalName,
                        size: file.size ? (file.size / 1024).toFixed(1) + 'KB' : '',
                        ext: file.originalName?.split('.').pop()?.toLowerCase() || '',
                        url: file.fileUrl,
                        fileKey: file.fileKey,
                    })) || [],
            }))
            total.value = documents.value.length
        } catch (e) {
            console.error('검색 실패:', e)
        }
    }

    return {
        documents,
        total,
        fetchDocuments,
        toggleFavorite,
        fetchFavoriteDocuments,
        searchDocuments,
    }
})
