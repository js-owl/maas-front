<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue";
import { req_json_auth } from "../api";
import { ElMessage } from "element-plus";
import { Download } from "@element-plus/icons-vue";

type DocumentInfo = {
  id: number;
  original_filename: string;
  created_at?: string | null;
  uploaded_at?: string | null;
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

    const documentPromises: Array<Promise<DocumentInfo | null>> = ids.map(async (documentId) => {
      try {
        const r = await req_json_auth(`/documents/${documentId}`, "GET");
        const data = (await r?.json()) as {
          id: number;
          original_filename: string;
          created_at?: string | null;
          uploaded_at?: string | null;
        };
        return {
          id: data.id,
          original_filename: data.original_filename,
          created_at: data.created_at,
          uploaded_at: data.uploaded_at,
        };
      } catch (e) {
        console.error(`Error loading document ${documentId}:`, e);
        return null;
      }
    });

    const documents = await Promise.all(documentPromises);
    allDocuments.value = documents.filter((d): d is DocumentInfo => d !== null);
  } catch (e) {
    console.error('Error loading user documents:', e);
  }
  isLoading.value = false;
}

async function downloadDoc(id: number) {
  try {
    const doc = filteredDocuments.value.find((d) => d.id === id);
    if (!doc) {
      ElMessage.error("Документ не найден");
      return;
    }

    const response = await req_json_auth(`/documents/${id}/download`, "GET");

    if (!response) {
      ElMessage.error("Ошибка загрузки документа");
      return;
    }

    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = doc.original_filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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

    const docIdx = allDocuments.value.findIndex(d => d.id === id);
    if (docIdx >= 0) {
      allDocuments.value.splice(docIdx, 1);
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

const getDocumentDateSource = (doc: DocumentInfo): string | null | undefined =>
  doc.created_at ?? doc.uploaded_at;

const formatDocumentDate = (doc: DocumentInfo): string => {
  const sourceDate = getDocumentDateSource(doc);
  if (!sourceDate) return "";

  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) return "";

  const datePart = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${datePart}   ${timePart}`;
};

const formatDocumentDatePart = (doc: DocumentInfo): string => {
  const sourceDate = getDocumentDateSource(doc);
  if (!sourceDate) return "";

  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const formatDocumentTimePart = (doc: DocumentInfo): string => {
  const sourceDate = getDocumentDateSource(doc);
  if (!sourceDate) return "";

  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

onMounted(() => {
  if (Array.isArray(document_ids.value) && document_ids.value.length > 0) {
    loadUserDocuments();
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
        <div v-else class="doc-list">
          <div v-for="doc in filteredDocuments" :key="doc.id" class="doc-row">
            <div class="doc-row-left">
              <span class="doc-name">{{ doc.original_filename }}</span>
              <span class="doc-date doc-date--desktop">{{ formatDocumentDate(doc) }}</span>
              <button
                type="button"
                class="doc-download"
                aria-label="Скачать"
                @click="downloadDoc(doc.id)"
              >
                <el-icon :size="20"><Download /></el-icon>
              </button>
            </div>
            <div class="doc-row-right">
              <span class="doc-date doc-date--mobile">{{ formatDocumentDatePart(doc) }}</span>
              <span class="doc-time doc-time--mobile">{{ formatDocumentTimePart(doc) }}</span>
              <el-dropdown
                trigger="click"
                placement="bottom-end"
                popper-class="calc-doc-dropdown"
                @command="(command: string) => handleMenuCommand(command, doc.id)"
              >
                <button class="file-menu" type="button" aria-label="Действия с документом">
                  <span class="menu-dots" />
                </button>
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
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped>
.doc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.doc-row {
  height: 82px;
  background: #f4f6f8;
  border-radius: 10px;
  padding: 12px 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.doc-row-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.doc-row-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.doc-name {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-date {
  font-family: "Montserrat-Medium", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: #7d8083;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-download,
.doc-date--mobile,
.doc-time--mobile {
  display: none;
}

.file-menu {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.file-menu:hover,
.file-menu:focus-visible {
  background-color: #e1e4e6;
}

.file-menu:focus-visible {
  outline: 1px solid #7d8083;
  outline-offset: 1px;
}

.menu-dots,
.menu-dots::before,
.menu-dots::after {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #7d8083;
  display: block;
}

.menu-dots {
  position: relative;
}

.menu-dots::before,
.menu-dots::after {
  content: "";
  position: absolute;
  left: 0;
}

.menu-dots::before {
  top: -7px;
}

.menu-dots::after {
  top: 7px;
}
</style>
