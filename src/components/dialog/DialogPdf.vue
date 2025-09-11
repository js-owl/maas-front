<script lang="ts" setup>
let dialogFormVisible = defineModel<boolean>()

const pdfUrl = defineModel<string>('pdfUrl')
const title = defineModel<string>('title', { default: 'Просмотр документа' })
</script>

<template>
  <el-dialog v-model="dialogFormVisible" :title="title" width="90%">
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
</style>
