import { defineStore } from 'pinia'
import axios from 'axios'
axios.defaults.withCredentials = true

export const useUploadStore = defineStore('upload', () => {
  const UPLOAD_API = 'http://localhost:3000/api/documents/upload'

  // 문서 업로드
  const uploadDocument = async (formData) => {
    try {
      // POST /api/documents/upload
      const response = await axios.post(UPLOAD_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      console.error('업로드 스토어 에러:', error)
      throw error
    }
  }

  // 문서 수정
  const editDocument = async (id, formData) => {
    try {
      // PUT /api/documents/upload (기존 /api/update/${id} 에서 변경)
      // id는 formData에 포함되어 있거나 쿼리로 보냄 (백엔드 설계에 맞춰 qObj에 포함)
      formData.append('id', id); 
      const response = await axios.put(UPLOAD_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      console.error('수정 에러:', error)
      throw error
    }
  }

  // 문서 삭제
  const deleteDocument = async (id) => {
    // DELETE /api/documents/upload (id를 바디에 담아 보냄)
    return axios.delete(UPLOAD_API, { data: { id } })
  }

  return { uploadDocument, editDocument, deleteDocument }
})