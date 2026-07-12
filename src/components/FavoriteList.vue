<template>
    <div class="page-container">
        <div class="header-section">
            <div class="title-group">
                <h1>즐겨찾기</h1>
                <p class="subtitle">총 {{ documents.length }}개의 문서가 있습니다.</p>
            </div>

            <div class="action-group">
                <el-button-group class="view-toggle">
                    <el-button
                        :type="viewMode === 'grid' ? 'primary' : ''"
                        @click="viewMode = 'grid'"
                    >
                        <el-icon>
                            <Grid />
                        </el-icon>
                    </el-button>
                    <el-button
                        :type="viewMode === 'list' ? 'primary' : ''"
                        @click="viewMode = 'list'"
                    >
                        <el-icon>
                            <List />
                        </el-icon>
                    </el-button>
                </el-button-group>

                <router-link to="/upload">
                    <el-button type="primary" size="large" class="upload-btn">
                        <el-icon style="margin-right: 5px">
                            <Plus />
                        </el-icon>
                        새 문서 업로드
                    </el-button>
                </router-link>
            </div>
        </div>

        <div :class="viewMode === 'grid' ? 'document-grid' : 'document-list'">
            <template v-if="viewMode === 'grid'">
                <DocumentCard
                    v-for="doc in documents"
                    :key="'grid-' + doc.id"
                    :document="doc"
                    :is-favorite-page="true"
                />
            </template>

            <template v-else>
                <DocumentListItem
                    v-for="doc in documents"
                    :key="'list-' + doc.id"
                    :document="doc"
                    :is-favorite-page="true"
                />
            </template>
        </div>

        <div v-if="documents.length === 0" class="empty-state">
            <el-empty description="즐겨찾기 문서가 없습니다." />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useListStore } from '@/stores/list'
import { storeToRefs } from 'pinia'

import { Grid, List, Plus } from '@element-plus/icons-vue'
import DocumentCard from '@/components/DocumentCard.vue'
import DocumentListItem from '@/components/DocumentListItem.vue'

const viewMode = ref('grid')

const listStore = useListStore()
const { documents } = storeToRefs(listStore)

onMounted(() => {
    listStore.fetchFavoriteDocuments()
})
</script>

<style scoped>
.page-container {
    width: 100%;
    min-height: 100vh;
    padding: 30px 40px;
    box-sizing: border-box;
    background-color: #f8f9fa;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.title-group h1 {
    font-size: 1.8rem;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0;
}

.subtitle {
    color: #6c757d;
    margin: 4px 0 0 0;
    font-size: 0.9rem;
}

.action-group {
    display: flex;
    align-items: center;
    gap: 12px;
}

.view-toggle :deep(.el-button) {
    padding: 8px 12px;
}

.document-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.document-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.upload-btn {
    border-radius: 10px;
    font-weight: 700;
    padding: 12px 20px;
    font-size: 0.95rem;
    height: auto;
}

.empty-state {
    margin-top: 50px;
    text-align: center;
}
</style>
