<script lang="ts" setup>
import { computed, ref } from "vue";
import { uploadDocument, fileToBase64 } from "../api";
import IconDrawing from "../icons/IconDrawing.vue";
import { useAuthStore } from "../stores/auth.store";
import DialogLogin from "./dialog/DialogLogin.vue";
import { ElMessage } from "element-plus";

const document_ids = defineModel<number[]>({ default: [] });
const { color = "white" } = defineProps({
  color: String,
});

const authStore = useAuthStore();
const isLoginDialogVisible = ref(false);
const uploadingCount = ref(0);

const isUploading = computed(() => uploadingCount.value > 0);

const isDisabled = () => {
  if (authStore.getToken) return false;
  return true;
};

const saveDocumentToLocalStorage = (id: number, fileName: string) => {
  const documentInfo = { id, original_filename: fileName };
  try {
    const stored = localStorage.getItem("uploaded_documents");
    const documents = stored ? JSON.parse(stored) : [];
    if (!documents.find((d: any) => d.id === id)) {
      documents.push(documentInfo);
      localStorage.setItem("uploaded_documents", JSON.stringify(documents));
    }
  } catch (e) {
    console.error("Error saving document to storage:", e);
  }
};

const processUploadedFile = async (file: File) => {
  const base64Data = await fileToBase64(file);
  const response = await uploadDocument(file.name, base64Data, "technical_spec");

  if (!response?.ok) throw new Error("Upload failed");

  const data = await response.json();
  console.log("Document upload response:", data);
  const id = Number(data.document_id);

  if (!Array.isArray(document_ids.value)) document_ids.value = [];

  if (Number.isFinite(id) && !document_ids.value.includes(id)) {
    document_ids.value.push(id);
    saveDocumentToLocalStorage(id, file.name);
  }
};

type CustomUploadRequestOptions = {
  file: File;
  onSuccess?: (response: unknown, file: File) => void;
  onError?: (error: unknown) => void;
};

const handleBeforeUpload = () => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    return false;
  }
  return true;
};

const handleCustomRequest = async (options: CustomUploadRequestOptions) => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    options.onError?.(new Error("Unauthorized"));
    return;
  }

  uploadingCount.value += 1;

  try {
    await processUploadedFile(options.file);
    ElMessage.success("Документ успешно загружен!");
    options.onSuccess?.({}, options.file);
  } catch (error) {
    console.error("Document upload error:", error);
    ElMessage.error("Ошибка загрузки документа");
    options.onError?.(error);
  } finally {
    uploadingCount.value -= 1;
  }
};
</script>

<template>
  <div>
    <el-upload
      class="upload"
      drag
      :style="{ '--border-color': color }"
      :class="{ 'is-disabled': isDisabled(), 'is-uploading': isUploading }"
      :disabled="isDisabled() || isUploading"
      :multiple="true"
      :show-file-list="false"
      :auto-upload="true"
      :before-upload="handleBeforeUpload"
      :http-request="handleCustomRequest"
    >
      <div class="custom">
        <IconDrawing :color="color" style="display: block; width: 30px; height: 30px" />
        <div class="el-upload__text" :style="{ color }" style="font-size: 20px">
          {{ isUploading ? "Загрузка..." : "Перетащите или выберите файлы для расчета" }}
        </div>
      </div>
    </el-upload>

    <DialogLogin v-model="isLoginDialogVisible" />
  </div>
</template>

<style scoped>
.upload {
  padding: 10px;
  border: 1px solid var(--bgcolor);
  background-color: var(--bgcolor) !important;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload:hover:not(.is-disabled) {
  border-color: #409eff;
}

.upload.is-disabled {
  opacity: 0.6;
  cursor: default;
}

.upload.is-uploading {
  opacity: 0.8;
  cursor: wait;
}

.custom {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
</style>

