<template>
    <el-dialog
        v-model="visible"
        title="문서 상세 정보"
        width="80%"
        style="max-width: 1000px"
        append-to-body
        align-center
    >
        <div class="modal-body">
            <div class="modal-header-top">
                <img
                    :src="`/src/assets/icons/icon_${document.attachments[0].ext.toLowerCase()}.png`"
                    class="modal-large-icon"
                />

                <div class="modal-title-group">
                    <!-- ⭐ 제목 + 즐겨찾기 -->
                    <div class="title-row">
                        <h2 class="modal-title">{{ document.title }}</h2>

                        <el-icon
                            class="favorite-icon"
                            :class="{ active: document.isFavorite }"
                            @click.stop="handleFavoriteClick"
                        >
                            <component :is="document.isFavorite ? StarFilled : Star" />
                        </el-icon>
                    </div>

                    <div class="modal-meta">
                        <span><strong>작성자</strong> {{ document.author }}</span>
                        <span class="divider">|</span>
                        <span><strong>작성일</strong> {{ document.date }}</span>
                    </div>
                </div>
            </div>

            <el-divider />

            <div class="content-section">
                <div class="content-label">문서 내용</div>
                <div class="content-box">
                    {{ document.content || '등록된 내용이 없습니다.' }}
                </div>
            </div>

            <div v-if="document.attachments?.length" class="attachment-section">
                <div class="content-label">첨부파일 ({{ document.attachments.length }})</div>

                <div class="attachment-list">
                    <div
                        v-for="(file, index) in document.attachments"
                        :key="index"
                        class="attachment-item"
                    >
                        <div class="file-info">
                            <img
                                :src="`/src/assets/icons/icon_${file.ext?.toLowerCase()}.png`"
                                class="mini-file-icon"
                            />
                            <span class="file-name">{{ file.name }}</span>
                            <span class="file-size">({{ file.size }})</span>
                        </div>

                        <el-button
                            type="primary"
                            link
                            :icon="Download"
                            @click="$emit('download', file)"
                        >
                            다운로드
                        </el-button>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" @click="close">닫기</el-button>
                <el-button size="large" type="primary" @click="close">확인</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { Download, Star, StarFilled } from '@element-plus/icons-vue'
import { useListStore } from '@/stores/list'
import { useDashboardStore } from '@/stores/dashboard'

const listStore = useListStore()
const dashboardStore = useDashboardStore()

// props
const props = defineProps({
    modelValue: Boolean,
    document: Object,
})

// emit
const emit = defineEmits(['update:modelValue', 'download', 'toggle-favorite'])

// dialog state
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const handleFavoriteClick = async () => {
    // listStore.toggleFavorite(props.document.id, props.document.isFavorite)
    const newValue = !props.document.isFavorite

    await listStore.toggleFavorite(props.document.id, props.document.isFavorite)

    dashboardStore.updateFavorite(props.document.id, newValue)
}

// 닫기
const close = () => {
    emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-header-top {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 10px;
}

.modal-large-icon {
    width: 50px;
    height: 50px;
    object-fit: contain;
}

/* ⭐ 핵심 레이아웃 */
.modal-title-group {
    flex: 1;
}

.title-row {
    display: flex;
    align-items: center;
    width: 100%;
}

/* 제목 */
.modal-title {
    margin: 0 10px 8px 0;
    font-size: 1.8rem;
    color: #1a1a1a;
    font-weight: 700;
}

/* ⭐ 별표 (무조건 오른쪽 끝) */
.favorite-icon {
    margin-left: auto;
    padding-right: 20px;
    /* ⭐ 클릭 영역 유지하면서 살짝 이동 */
    font-size: 22px;
    color: #ccc;
    cursor: pointer;
    transition: 0.2s;
}

.favorite-icon.active {
    color: gold;
}

/* 메타 */
.modal-meta {
    font-size: 1rem;
    color: #666;
}

.divider {
    margin: 0 12px;
    color: #eee;
}

/* 내용 */
.content-label {
    font-weight: 600;
    margin: 25px 0 12px 0;
    color: #333;
    font-size: 1.1rem;
}

.content-box {
    line-height: 1.8;
    color: #333;
    white-space: pre-wrap;
    background: #fdfdfd;
    padding: 25px;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    min-height: 200px;
    max-height: 40vh;
    overflow-y: auto;
    font-size: 1.1rem;
}

/* 첨부파일 */
.attachment-section {
    margin-top: 10px;
}

.attachment-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #eee;
}

.attachment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: white;
    border: 1px solid #eee;
    border-radius: 6px;
    transition: background 0.2s;
}

.attachment-item:hover {
    background: #f0f7ff;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mini-file-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.file-name {
    font-size: 0.95rem;
    font-weight: 500;
    color: #444;
}

.file-size {
    font-size: 0.85rem;
    color: #999;
}

.dialog-footer {
    padding-top: 10px;
}
</style>
