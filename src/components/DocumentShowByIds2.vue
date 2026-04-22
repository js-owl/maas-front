<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue";
import { req_json_auth } from "../api";
import { ElMessage } from "element-plus";

type DocumentInfo = {
  id: number;
  original_filename: string;
};

const document_ids = defineModel<number[]>();

const isLoading = ref<boolean>(false);
const allDocuments = ref<DocumentInfo[]>([]);

const filteredDocuments = computed<DocumentInfo[]>(() => {
  const ids = new Set(document_ids.value ?? []);
  return allDocuments.value.filter((d) => ids.has(d.id));
});

async function loadUserDocuments() {
  isLoading.value = true;
  try {
    const ids = document_ids.value ?? [];
    if (ids.length === 0) {
      allDocuments.value = [];
      isLoading.value = false;
      return;
    }

    // Загружаем каждый документ отдельно по его ID
    const documentPromises = ids.map(async (documentId) => {
      try {
        const r = await req_json_auth(`/documents/${documentId}`, "GET");
        const data = (await r?.json()) as {
          id: number;
          original_filename: string;
        };
        return { id: data.id, original_filename: data.original_filename };
      } catch (e) {
        console.error(`Error loading document ${documentId}:`, e);
        return null;
      }
    });

    const documents = await Promise.all(documentPromises);
    allDocuments.value = documents.filter((d): d is DocumentInfo => d !== null);
  } catch (e) {
    console.error('Error loading user documents:', e);
    // If API fails, try to load from localStorage as fallback
    // loadDocumentsFromStorage();
  }
  isLoading.value = false;
}

// function loadDocumentsFromStorage() {
//   try {
//     const stored = localStorage.getItem('uploaded_documents');
//     if (stored) {
//       const documents = JSON.parse(stored);
//       allDocuments.value = documents;
//     }
//   } catch (e) {
//     console.error('Error loading documents from storage:', e);
//   }
// }

// function saveDocumentsToStorage() {
//   try {
//     localStorage.setItem('uploaded_documents', JSON.stringify(allDocuments.value));
//   } catch (e) {
//     console.error('Error saving documents to storage:', e);
//   }
// }

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
      // saveDocumentsToStorage();
    }
  }
}

function handleMenuCommand(command: string, id: number) {
  if (command === "download") {
    downloadDoc(id);
    return;
  }
  removeDocument(id);
}

onMounted(() => {
  if (Array.isArray(document_ids.value) && document_ids.value.length > 0) {
    loadUserDocuments();
  } else {
    // Try to load from localStorage as fallback
    // loadDocumentsFromStorage();
  }
});
watch(
  document_ids,
  (newVal) => {
    console.log('DocumentShowByIds.vue document_ids', newVal)
    loadUserDocuments();
  },
  { deep: true },
)
</script>

<template>
  <div>
    <el-skeleton :loading="isLoading" animated>
      <template #default>
        <div
          v-if="filteredDocuments.length === 0"
          style="color: #577aad; font-size: 14px"
        >
          
        </div>
        <div v-else>
          <div v-for="doc in filteredDocuments" :key="doc.id" class="doc-row">
            <span class="doc-name">{{ doc.original_filename }}</span>
            <el-dropdown
              trigger="click"
              placement="bottom-end"
              @command="(command: string) => handleMenuCommand(command, doc.id)"
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
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped>
.doc-row {
  min-height: 54px;
  background: #f4f6f8;
  border-radius: 10px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.doc-name {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  flex: 1;
}

.file-menu {
  font-size: 28px;
  color: #667085;
  cursor: pointer;
  user-select: none;
}
</style>
