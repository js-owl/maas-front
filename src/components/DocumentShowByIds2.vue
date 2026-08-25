<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue";
import { fileToBase64, req_json_auth } from "../api";
import { ElMessage } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import {
  getLocalStpFileById,
  localStpCacheVersion,
  saveFile3D,
  type LocalStpFile,
} from "../helpers/local-stp-files";
import {
  DEFAULT_PRINTING_FILE_ID,
  DEFAULT_PRINTING_FILE_NAME,
  getFileExtension,
  isAllowedModelFile,
} from "../helpers/model-file-types";

type DocumentInfo = {
  id: number;
  original_filename: string;
  created_at?: string | null;
  uploaded_at?: string | null;
};

type ListItem =
  | {
      key: string;
      kind: "stp";
      id: number;
      name: string;
      created_at?: string | null;
      localFile: LocalStpFile | null;
    }
  | {
      key: string;
      kind: "document";
      id: number;
      name: string;
      created_at?: string | null;
      uploaded_at?: string | null;
    };

const document_ids = defineModel<number[]>();
const stp_id = defineModel<number | null | undefined>("stp_id");
const props = defineProps<{
  service_id?: string;
}>();

const emit = defineEmits<{
  (e: "calculate"): void;
}>();

function canCalculate(item: ListItem): boolean {
  if (item.kind === "stp") return true;
  return isAllowedModelFile(item.name, props.service_id);
}

const isLoading = ref<boolean>(false);
const allDocuments = ref<DocumentInfo[]>([]);

const filteredDocuments = computed<DocumentInfo[]>(() => {
  const ids = [...new Set(document_ids.value ?? [])];
  const byId = new Map(allDocuments.value.map((d) => [d.id, d]));
  return ids.map((id) => byId.get(id)).filter((d): d is DocumentInfo => d != null);
});

const localStpFile = computed(() => {
  localStpCacheVersion.value;
  if (stp_id.value == null) return null;
  return getLocalStpFileById(stp_id.value);
});

function getStpDisplayName(): string | null {
  if (stp_id.value == null) return null;
  if (localStpFile.value?.file_name) return localStpFile.value.file_name;
  if (stp_id.value === DEFAULT_PRINTING_FILE_ID) return DEFAULT_PRINTING_FILE_NAME;
  return null;
}

function isSameModelName(name: string, stpName: string | null): boolean {
  return Boolean(stpName) && name === stpName;
}

function hasDocumentForCurrentModel(docs: DocumentInfo[] = filteredDocuments.value): boolean {
  const stpName = getStpDisplayName();
  return docs.some((d) => isSameModelName(d.original_filename, stpName));
}

function isCalculationModel(item: ListItem): boolean {
  if (item.kind === "stp") return true;
  return isSameModelName(item.name, getStpDisplayName());
}

const listItems = computed<ListItem[]>(() => {
  const items: ListItem[] = [];
  const docs = filteredDocuments.value;
  const local = localStpFile.value;
  const stpName = getStpDisplayName();

  // Local STP is a working copy of a document already in the list — don't show it twice.
  if (stp_id.value != null && !hasDocumentForCurrentModel(docs)) {
    items.push({
      key: `stp-${stp_id.value}`,
      kind: "stp",
      id: stp_id.value,
      name: stpName ?? "3D-модель",
      created_at: local?.created_at ?? null,
      localFile: local,
    });
  }

  for (const doc of docs) {
    items.push({
      key: `doc-${doc.id}`,
      kind: "document",
      id: doc.id,
      name: doc.original_filename,
      created_at: doc.created_at,
      uploaded_at: doc.uploaded_at,
    });
  }

  return items;
});

async function loadUserDocuments() {
  isLoading.value = true;
  try {
    const ids = [...new Set(document_ids.value ?? [])];
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
    console.error("Error loading user documents:", e);
  }
  isLoading.value = false;
}

function downloadLocalStp(file: LocalStpFile) {
  try {
    const base64 = file.file_data.includes(",")
      ? file.file_data.split(",")[1]
      : file.file_data;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const blob = new Blob([bytes], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Ошибка при скачивании STP:", error);
    ElMessage.error("Ошибка при скачивании файла");
  }
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
  if (idx < 0) return;

  const removed = allDocuments.value.find((d) => d.id === id);
  document_ids.value.splice(idx, 1);

  const docIdx = allDocuments.value.findIndex((d) => d.id === id);
  if (docIdx >= 0) {
    allDocuments.value.splice(docIdx, 1);
  }

  const stpName = getStpDisplayName();
  if (
    removed &&
    isSameModelName(removed.original_filename, stpName) &&
    !hasDocumentForCurrentModel()
  ) {
    stp_id.value = undefined;
  }
}

function removeStp() {
  stp_id.value = undefined;
}

async function activateDocumentAsModel(item: Extract<ListItem, { kind: "document" }>): Promise<boolean> {
  try {
    const response = await req_json_auth(`/documents/${item.id}/download`, "GET");
    if (!response?.ok) {
      ElMessage.error("Не удалось загрузить модель для расчета");
      return false;
    }

    const blob = await response.blob();
    const file = new File([blob], item.name);
    const base64Data = await fileToBase64(file);
    const extension = getFileExtension(item.name);
    const id = await saveFile3D(item.name, base64Data, extension);
    stp_id.value = id;
    return true;
  } catch (error) {
    console.error("Ошибка подготовки модели к расчету:", error);
    ElMessage.error("Не удалось отправить модель на расчет");
    return false;
  }
}

async function handleMenuCommand(command: string, item: ListItem) {
  if (command === "calculate") {
    if (!canCalculate(item)) return;
    if (item.kind === "document") {
      const activated = await activateDocumentAsModel(item);
      if (!activated) return;
    }
    emit("calculate");
    return;
  }

  if (command === "download") {
    if (item.kind === "stp") {
      if (item.localFile) downloadLocalStp(item.localFile);
      else ElMessage.warning("Скачивание недоступно для этого файла");
      return;
    }
    downloadDoc(item.id);
    return;
  }

  if (command !== "remove") return;

  if (item.kind === "stp") {
    removeStp();
    return;
  }
  removeDocument(item.id);
}

const getItemDateSource = (item: ListItem): string | null | undefined =>
  item.kind === "stp" ? item.created_at : item.created_at ?? item.uploaded_at;

const formatItemDate = (item: ListItem): string => {
  const sourceDate = getItemDateSource(item);
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

const formatItemDatePart = (item: ListItem): string => {
  const sourceDate = getItemDateSource(item);
  if (!sourceDate) return "";

  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const formatItemTimePart = (item: ListItem): string => {
  const sourceDate = getItemDateSource(item);
  if (!sourceDate) return "";

  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

function downloadItem(item: ListItem) {
  if (item.kind === "stp") {
    if (item.localFile) downloadLocalStp(item.localFile);
    else ElMessage.warning("Скачивание недоступно для этого файла");
    return;
  }
  downloadDoc(item.id);
}

onMounted(() => {
  if (Array.isArray(document_ids.value) && document_ids.value.length > 0) {
    loadUserDocuments();
  }
});
watch(
  document_ids,
  (newVal) => {
    console.log("DocumentShowByIds.vue document_ids", newVal);
    loadUserDocuments();
  },
  { deep: true }
);
</script>

<template>
  <div>
    <el-skeleton :loading="isLoading" animated>
      <template #default>
        <div v-if="listItems.length === 0" style="color: #577aad; font-size: 14px" />
        <div v-else class="doc-list">
          <div
            v-for="item in listItems"
            :key="item.key"
            class="doc-row"
            :class="{ 'is-calc-model': isCalculationModel(item) }"
            :aria-current="isCalculationModel(item) ? 'true' : undefined"
          >
            <div class="doc-row-left">
              <span class="doc-name">{{ item.name }}</span>
              <span class="doc-date doc-date--desktop">{{ formatItemDate(item) }}</span>
              <button
                type="button"
                class="doc-download"
                aria-label="Скачать"
                @click="downloadItem(item)"
              >
                <el-icon :size="20"><Download /></el-icon>
              </button>
            </div>
            <div class="doc-row-right">
              <span class="doc-date doc-date--mobile">{{ formatItemDatePart(item) }}</span>
              <span class="doc-time doc-time--mobile">{{ formatItemTimePart(item) }}</span>
              <el-dropdown
                trigger="click"
                placement="bottom-end"
                popper-class="calc-doc-dropdown"
                @command="(command: string) => handleMenuCommand(command, item)"
              >
                <button class="file-menu" type="button" aria-label="Действия с документом">
                  <span class="menu-dots" />
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="canCalculate(item)" command="calculate">
                      Расчет
                    </el-dropdown-item>
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

.doc-row.is-calc-model {
  background: #ffffff;
  box-shadow: inset 0 0 0 2px #3d4146;
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
