<template>
  <div class="card" @click="showModal = true">
    <div class="card-header">
      <img :src="`/src/assets/icons/icon_${document.attachments[0]?.ext?.toLowerCase()}.png`" class="file-icon" />
      <h3 class="title">{{ document.title }}</h3>
      <el-icon class="favorite-icon" :class="{ active: document.isFavorite }" @click.stop="handleFavoriteClick">
        <component :is="document.isFavorite ? StarFilled : Star" />
      </el-icon>
    </div>

    <el-tooltip effect="light" :content="document.content" placement="top" :show-after="300" raw-content>
      <p class="content-preview">
        {{ document.content }}
      </p>
    </el-tooltip>

    <div class="meta">
      <div class="tag-group">
        <span v-for="tag in document.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
      <span class="views">조회수 {{ document.views || 0 }}</span>
    </div>
  </div>

  <DocumentDetail v-model="showModal" :document="document" @download="downloadFile" />
</template>

<script setup>
import { ref } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { useListStore } from '@/stores/list'
import DocumentDetail from './DocumentDetail.vue'

const props = defineProps({
  document: {
    type: Object,
    default: () => ({
      attachments: []
    })
  },
  isFavoritePage: {
    type: Boolean,
    default: false
  }
})

const listStore = useListStore()

const showModal = ref(false)

const handleFavoriteClick = async () => {
  // const newValue = !props.document.isFavorite

  await listStore.toggleFavorite(
    props.document.id,
    props.document.isFavorite,
    props.isFavoritePage
  )

  // props.document.isFavorite = newValue
}

const downloadFile = (file) => {
  window.open(
    `http://localhost:3000/api/documents/list/download?url=${encodeURIComponent(file.url)}&name=${file.name}`
  )
}
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: white;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #409EFF;
}

/* 🔥 헤더 */
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  position: relative;
}

.file-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.title {
  margin: 0;
  font-size: 1.1rem;
  color: #303133;
}

/* ⭐ 별 (우측 상단) */
.favorite-icon {
  margin-left: auto;
  font-size: 20px;
  color: #ccc;
  cursor: pointer;
  transition: 0.2s;
}

.favorite-icon.active {
  color: gold;
}

.content-preview {
  color: #606266;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 10px 0;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: gray;
}

.tag {
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 5px;
}
</style>