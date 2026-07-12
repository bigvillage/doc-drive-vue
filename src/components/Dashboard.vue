<template>
    <div class="dashboard">
        <div class="welcome">
            <h1>안녕하세요 👋</h1>
            <p>문서를 빠르게 검색하고 관리해보세요.</p>
        </div>

        <div class="cards">
            <div class="card">
                <div class="title">전체 문서</div>
                <div class="value">{{ totalDocuments }}</div>
            </div>

            <div class="card">
                <div class="title">오늘 업로드</div>
                <div class="value">{{ todayUploads }}</div>
            </div>

            <div class="card">
                <div class="title">즐겨찾기</div>
                <div class="value">{{ favoriteCount }}</div>
            </div>
            <div class="card">
                <div class="title">저장 용량</div>
                <div class="value">63%</div>
            </div>
        </div>

        <div class="row">
            <div class="panel">
                <h2>최근 문서</h2>

                <div class="doc" v-for="doc in recentDocs" :key="doc.id">
                    <span class="doc-title" @click="openDetail(doc)"
                        ><img
                            :src="`/src/assets/icons/icon_${doc.attachments[0]?.ext?.toLowerCase()}.png`"
                            class="file-icon"
                        />
                        {{ doc.title }}</span
                    >
                    <!-- <small>{{ new Date(doc.createdAt).toLocaleDateString() }}</small> -->
                    <small>{{ doc.time }}</small>
                </div>
                <DocumentDetail
                    v-if="selectedDocument"
                    v-model="showModal"
                    :document="selectedDocument"
                    @download="downloadFile"
                />
            </div>

            <div class="panel">
                <h2>문서 유형</h2>

                <div class="type">
                    <span>PDF</span>
                    <div class="bar">
                        <div class="fill" style="width: 70%"></div>
                    </div>
                </div>

                <div class="type">
                    <span>DOCX</span>
                    <div class="bar">
                        <div class="fill" style="width: 50%"></div>
                    </div>
                </div>

                <div class="type">
                    <span>HWP</span>
                    <div class="bar">
                        <div class="fill" style="width: 35%"></div>
                    </div>
                </div>

                <div class="type">
                    <span>XLSX</span>
                    <div class="bar">
                        <div class="fill" style="width: 20%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel upload">
            <h2>최근 업로드</h2>

            <table>
                <thead>
                    <tr>
                        <th>문서명</th>
                        <th>작성자</th>
                        <th>업로드 시간</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in uploads" :key="item.id">
                        <td>{{ item.name }}</td>

                        <td>{{ item.user }}</td>

                        <td>{{ item.time }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard'
import DocumentDetail from './DocumentDetail.vue'

const dashboardStore = useDashboardStore()
const showModal = ref(false)
const selectedDocument = ref(null)

const { totalDocuments, todayUploads, favoriteCount, recentDocs } = storeToRefs(dashboardStore)

onMounted(async () => {
    await dashboardStore.fetchDashboard()
    console.log('recentDocs ==> ', recentDocs.value)
})

const openDetail = (doc) => {
    selectedDocument.value = doc
    console.log('selectedDocument.value ==> ', selectedDocument.value)
    showModal.value = true
}

const downloadFile = (file) => {
    window.open(
        `http://localhost:3000/api/documents/list/download?url=${encodeURIComponent(file.url)}&name=${file.name}`,
    )
}

// const recentDocs = [
//     { id: 1, name: '계약서.pdf', time: '5분 전' },
//     { id: 2, name: '회의록.docx', time: '30분 전' },
//     { id: 3, name: '설계서.hwp', time: '1시간 전' },
//     { id: 4, name: 'API명세.pdf', time: '어제' },
// ]

const uploads = [
    { id: 1, name: '계약서.pdf', user: '김재환', time: '5분 전' },
    { id: 2, name: 'API명세.docx', user: '관리자', time: '30분 전' },
    { id: 3, name: '회의록.hwp', user: '홍길동', time: '2시간 전' },
    { id: 4, name: '설계서.pdf', user: '김철수', time: '어제' },
]
</script>

<style scoped>
.dashboard {
    padding: 40px;
}

.welcome h1 {
    margin: 0;
    font-size: 30px;
}

.welcome p {
    color: #777;
    margin-top: 10px;
}

.cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 30px;
}

.card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.title {
    color: #888;
}

.value {
    font-size: 34px;
    font-weight: bold;
    margin-top: 10px;
}

.row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 25px;
}

.panel {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.doc {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
}

.type {
    margin: 20px 0;
}

.bar {
    background: #eee;
    height: 10px;
    border-radius: 20px;
    overflow: hidden;
    margin-top: 8px;
}

.fill {
    background: #4a90e2;
    height: 100%;
}

.upload {
    margin-top: 25px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 15px;
    text-align: left;
}

thead {
    background: #f5f5f5;
}

tbody tr {
    border-bottom: 1px solid #eee;
}

.doc-title {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: color 0.2s;
}

.doc-title:hover {
    color: #409eff;
}

.doc-title:hover .file-icon {
    transform: scale(1.05);
    transition: transform 0.2s;
}

.file-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
}
</style>
