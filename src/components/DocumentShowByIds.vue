<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue";
import { req_json_auth } from "../api";
import { useProfileStore } from "../stores/profile.store";
import { ElMessage } from "element-plus";
import { Download } from "@element-plus/icons-vue";

type DocumentInfo = {
  id: number;
  original_filename: string;
};

const document_ids = defineModel<number[]>();

const profileStore = useProfileStore();
const isLoading = ref<boolean>(false);
const allDocuments = ref<DocumentInfo[]>([]);

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
    console.error('Error loading user documents:', e);
    // If API fails, try to load from localStorage as fallback
    loadDocumentsFromStorage();
  }
  isLoading.value = false;
}

function loadDocumentsFromStorage() {
  try {
    const stored = localStorage.getItem('uploaded_documents');
    if (stored) {
      const documents = JSON.parse(stored);
      allDocuments.value = documents;
    }
  } catch (e) {
    console.error('Error loading documents from storage:', e);
  }
}

function saveDocumentsToStorage() {
  try {
    localStorage.setItem('uploaded_documents', JSON.stringify(allDocuments.value));
  } catch (e) {
    console.error('Error saving documents to storage:', e);
  }
}

async function downloadDoc(id: number) {
  try {
    const doc = filteredDocuments.value.find((d) => d.id === id);
    if (!doc) {
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

    // Создаем ссылку для скачивания
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = doc.original_filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Очищаем blob URL через некоторое время
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 1000);
  } catch (error) {
    console.error("Ошибка при открытии документа:", error);
    ElMessage.error("Ошибка при открытии документа");
  }
}

function removeDocument(id: number) {
  if (!Array.isArray(document_ids.value)) return;
  const idx = document_ids.value.indexOf(id);
  if (idx >= 0) {
    document_ids.value.splice(idx, 1);
    
    // Also remove from allDocuments and save to localStorage
    const docIdx = allDocuments.value.findIndex(d => d.id === id);
    if (docIdx >= 0) {
      allDocuments.value.splice(docIdx, 1);
      saveDocumentsToStorage();
    }
  }
}

onMounted(() => {
  if (Array.isArray(document_ids.value) && document_ids.value.length > 0) {
    loadUserDocuments();
  } else {
    // Try to load from localStorage as fallback
    loadDocumentsFromStorage();
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
      saveDocumentsToStorage();
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
              <el-button size="small" link @click="downloadDoc(doc.id)">
                <el-icon color="black">
                  <Download />
                </el-icon>
              </el-button>
              <el-button size="small" link @click="removeDocument(doc.id)">
                <span class="action-remove">✖</span>
              </el-button>
            </span>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped>
.doc-row {
  padding: 6px 0;
}

.doc-name {
  color: black;
  font-size: 14px;
  padding-right: 10px;
}

.doc-actions {
  padding-right: 10px;
}
/* 
.action-link {
  color: #577aad;
  font-weight: 700;
} */

.action-remove {
  color: #bc2b55;
  font-weight: 700;
}
</style>
