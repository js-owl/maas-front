<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue";
import { req_json_auth } from "../api";
import { useProfileStore } from "../stores/profile.store";
import DialogPdf from "./dialog/DialogPdf.vue";
import { ElMessage } from "element-plus";

type DocumentInfo = {
  id: number;
  original_filename: string;
};

const document_ids = defineModel<number[]>();

const profileStore = useProfileStore();
const isLoading = ref<boolean>(false);
const allDocuments = ref<DocumentInfo[]>([]);
const pdfViewerVisible = ref<boolean>(false);
const currentPdfUrl = ref<string>("");
const currentDocumentTitle = ref<string>("");

const filteredDocuments = computed<DocumentInfo[]>(() => {
  const ids = new Set(document_ids.value ?? []);
  return allDocuments.value.filter((d) => ids.has(d.id));
});

async function ensureProfileLoaded() {
  if (!profileStore.profile) await profileStore.getProfile();
}

async function loadUserDocuments() {
  isLoading.value = true;
  try {
    await ensureProfileLoaded();
    const userId = (profileStore.profile as unknown as { id?: number })?.id;
    if (!userId) {
      isLoading.value = false;
      return;
    }
    const r = await req_json_auth(`/users/${userId}/documents`, "GET");
    const data = (await r?.json()) as Array<{
      id: number;
      original_filename: string;
    }>;
    allDocuments.value = Array.isArray(data)
      ? data.map((d) => ({ id: d.id, original_filename: d.original_filename }))
      : [];
  } catch (e) {
    console.error(e);
  }
  isLoading.value = false;
}

async function openDocument(id: number) {
  try {
    const document = filteredDocuments.value.find(doc => doc.id === id);
    if (!document) {
      ElMessage.error("Документ не найден");
      return;
    }

    // Загружаем PDF файл через API
    const response = await req_json_auth(`/documents/${id}/download`, "GET");
    
    if (!response) {
      ElMessage.error("Ошибка загрузки документа");
      return;
    }

    // Создаем blob URL для PDF
    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);
    
    // Устанавливаем данные для просмотрщика
    currentPdfUrl.value = pdfUrl;
    currentDocumentTitle.value = document.original_filename;
    pdfViewerVisible.value = true;
    
  } catch (error) {
    console.error("Ошибка при открытии документа:", error);
    ElMessage.error("Ошибка при открытии документа");
  }
}

function removeDocument(id: number) {
  if (!Array.isArray(document_ids.value)) return;
  const idx = document_ids.value.indexOf(id);
  if (idx >= 0) document_ids.value.splice(idx, 1);
}

// Очищаем blob URL при закрытии диалога
watch(pdfViewerVisible, (newVal) => {
  if (!newVal && currentPdfUrl.value) {
    URL.revokeObjectURL(currentPdfUrl.value);
    currentPdfUrl.value = "";
  }
});

onMounted(() => {
  if (Array.isArray(document_ids.value) && document_ids.value.length > 0) {
    loadUserDocuments();
  }
});
watch(
  () => document_ids.value,
  (ids) => {
    if (
      Array.isArray(ids) &&
      ids.length > 0 &&
      allDocuments.value.length === 0
    ) {
      loadUserDocuments();
    }
    if (!ids || ids.length === 0) {
      // если список очистили — очистим отображение
      allDocuments.value = [];
    }
  }
);
</script>

<template>
  <div>
    <el-skeleton :loading="isLoading" animated>
      <template #default>
        <div
          v-if="filteredDocuments.length === 0"
          style="color: #577aad; font-size: 14px"
        >
          Документы не выбраны
        </div>
        <div v-else>
          <div v-for="doc in filteredDocuments" :key="doc.id" class="doc-row">
            <span class="doc-name">{{ doc.original_filename }}</span>
            <span class="doc-actions">
              <el-button size="small" link @click="openDocument(doc.id)">
                <span class="action-link">open</span>
              </el-button>
              <el-button size="small" link @click="removeDocument(doc.id)">
                <span class="action-remove">✖</span>
              </el-button>
            </span>
          </div>
        </div>
      </template>
    </el-skeleton>
    
    <!-- PDF Viewer Modal -->
    <DialogPdf
      v-model="pdfViewerVisible"
      v-model:pdf-url="currentPdfUrl"
      v-model:title="currentDocumentTitle"
    />
  </div>
</template>

<style scoped>
.doc-row {
  padding: 6px 0;
}

.doc-name {
  color: white;
  font-size: 14px;
  padding-right: 10px;
}

.doc-actions {
  padding-right: 10px;
}

.action-link {
  color: #577aad;
  font-weight: 700;
}

.action-remove {
  color: #bc2b55;
  font-weight: 700;
}
</style>
