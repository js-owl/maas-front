<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElDialog, ElButton } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

type Props = {
  visible: boolean
  pdfUrl?: string
  title?: string
}

type Emits = {
  'update:visible': [value: boolean]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: 'Просмотр документа'
})

const emit = defineEmits<Emits>()

const dialogVisible = ref(false)

// Синхронизируем видимость диалога с пропсом
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

const handleClose = () => {
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="90%"
    :before-close="handleClose"
    class="pdf-viewer-dialog"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog-header">
        <h4 :id="titleId" :class="titleClass">{{ title }}</h4>
        <el-button
          type="danger"
          :icon="Close"
          circle
          @click="close"
          class="close-button"
        />
      </div>
    </template>
    
    <div class="pdf-container" v-if="pdfUrl">
      <iframe
        :src="pdfUrl"
        width="100%"
        height="600px"
        frameborder="0"
        class="pdf-iframe"
      />
    </div>
    
    <div v-else class="no-pdf">
      <p>PDF файл не найден</p>
    </div>
  </el-dialog>
</template>

<style scoped>
.pdf-viewer-dialog {
  --el-dialog-border-radius: 8px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.close-button {
  margin-left: auto;
}

.pdf-container {
  width: 100%;
  height: 600px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 4px;
}

.no-pdf {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #909399;
  font-size: 16px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
}
</style>
