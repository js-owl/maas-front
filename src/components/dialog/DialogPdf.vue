<script lang="ts" setup>
let dialogFormVisible = defineModel<boolean>()

const pdfUrl = defineModel<string>('pdfUrl')
const title = defineModel<string>('title', { default: 'Просмотр документа' })

const downloadPdf = () => {
  if (pdfUrl.value) {
    const link = document.createElement('a')
    link.href = pdfUrl.value
    link.download = title.value || 'document.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<template>
  <el-dialog v-model="dialogFormVisible" :title="title" width="90%">
    <div class="pdf-container" v-if="pdfUrl">
      <object
        :data="pdfUrl"
        type="application/pdf"
        width="100%"
        height="600px"
        class="pdf-object"
      >
        <p>Ваш браузер не поддерживает отображение PDF. 
          <a :href="pdfUrl" target="_blank">Скачать PDF</a>
        </p>
      </object>
    </div>
    
    <div v-else class="no-pdf">
      <p>PDF файл не найден</p>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Закрыть</el-button>
        <el-button type="primary" @click="downloadPdf" v-if="pdfUrl">
          Скачать PDF
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.pdf-container {
  width: 100%;
  height: 600px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pdf-object {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
