<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowLeft, Download } from '@element-plus/icons-vue'

type UploadedDocument = {
  id: number
  original_filename: string
  uploaded_at?: string
}

const props = defineProps<{
  uploadedDocuments: UploadedDocument[]
}>()

const emit = defineEmits<{
  (event: 'view-document', document: UploadedDocument): void
  (event: 'remove-document', document: UploadedDocument): void
}>()

const isFilesExpanded = ref(true)

const handleMenuCommand = (command: string, document: UploadedDocument): void => {
  if (command === 'download') {
    emit('view-document', document)
    return
  }
  emit('remove-document', document)
}

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

const formatDocumentDatePart = (value?: string): string => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

const formatDocumentTimePart = (value?: string): string => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
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
        <div class="file-row-left">
          <span class="file-name">{{ item.original_filename }}</span>
          <button
            type="button"
            class="file-download"
            aria-label="Скачать"
            @click="emit('view-document', item)"
          >
            <el-icon :size="20"><Download /></el-icon>
          </button>
        </div>
        <div class="file-row-right">
          <span class="file-date file-date--desktop">{{ formatDocumentDate(item.uploaded_at) }}</span>
          <span class="file-date file-date--mobile">{{ formatDocumentDatePart(item.uploaded_at) }}</span>
          <span class="file-time file-time--mobile">{{ formatDocumentTimePart(item.uploaded_at) }}</span>
          <el-dropdown
            trigger="click"
            placement="bottom-end"
            @command="(command: string) => handleMenuCommand(command, item)"
          >
            <span class="file-menu">⋮</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="download">Скачать</el-dropdown-item>
                <el-dropdown-item command="remove">Удалить</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
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

.file-row-left {
  display: contents;
}

.file-row-right {
  display: contents;
}

.file-download,
.file-date--mobile,
.file-time--mobile {
  display: none;
}

.file-menu {
  font-size: 28px;
  color: #667085;
  cursor: pointer;
  user-select: none;
}

@media (max-width: 767px) {
  .files-section {
    margin-top: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .files-header {
    height: auto;
    border-radius: 0;
    background-color: transparent;
    padding: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
    cursor: default;
    pointer-events: none;
  }

  .files-arrow {
    display: none;
  }

  .files-list {
    margin-top: 0;
    gap: 4px;
  }

  .file-row {
    min-height: auto;
    background: #f2f3f7;
    border-radius: 5px;
    padding: 8px;
    gap: 8px;
    justify-content: space-between;
  }

  .file-row-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1 1 auto;
  }

  .file-row-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .file-name {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-download {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: transparent;
    color: #000;
    cursor: pointer;
  }

  .file-date--desktop {
    display: none;
  }

  .file-date--mobile,
  .file-time--mobile {
    display: inline;
    margin-left: 0;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #000;
    white-space: nowrap;
  }

  .file-menu {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: var(--button-bg);
    font-size: 12px;
    line-height: 1;
    color: #000;
  }
}
</style>
