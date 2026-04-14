<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'

type UploadedDocument = {
  id: number
  original_filename: string
  uploaded_at?: string
}

const props = defineProps<{
  uploadedDocuments: UploadedDocument[]
}>()

const isFilesExpanded = ref(true)

const formatDocumentDate = (value?: string): string => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="files-section">
    <div class="files-header" @click="isFilesExpanded = !isFilesExpanded">
      <span>Загруженные файлы</span>
      <el-icon class="files-arrow" :class="{ expanded: isFilesExpanded }"><ArrowLeft /></el-icon>
    </div>
    <div v-if="isFilesExpanded" class="files-list">
      <div v-if="!props.uploadedDocuments.length" class="file-row file-row-empty">Файлы отсутствуют</div>
      <div v-for="item in props.uploadedDocuments" :key="item.id" class="file-row">
        <span class="file-name">{{ item.original_filename }}</span>
        <span class="file-date">{{ formatDocumentDate(item.uploaded_at) }}</span>
        <span class="file-menu">⋮</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.files-section {
  margin-top: 8px;
}

.files-header {
  height: 52px;
  border-radius: 10px;
  background-color: #cbd1d5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  cursor: pointer;
}

.files-arrow {
  transition: transform 0.2s ease;
  transform: rotate(-90deg);
}

.files-arrow.expanded {
  transform: rotate(-180deg);
}

.files-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-row {
  min-height: 54px;
  background: #f4f6f8;
  border-radius: 10px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-row-empty {
  justify-content: center;
  color: #98a2b3;
}

.file-name {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #000000;
}

.file-date {
  font-family: 'Montserrat-Medium', sans-serif;
  margin-left: auto;
  font-size: 16px;
  font-weight: 500;
  color: #7d8083;
}

.file-menu {
  font-size: 28px;
  color: #667085;
}
</style>
