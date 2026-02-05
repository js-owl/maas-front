<script lang="ts" setup>
import { computed, ref } from "vue";
import { uploadDocument, fileToBase64, uploadFile3D } from "../api";
import IconDrawing from "../icons/IconDrawing.vue";
import { useAuthStore } from "../stores/auth.store";
import DialogLogin from "./dialog/DialogLogin.vue";
import { ElMessage } from "element-plus";

const document_ids = defineModel<number[]>({ default: [] });
const props = defineProps<{
  color?: string;
  stp_id?: number | null;
}>();

const emit = defineEmits<{
  (e: "update:stp_id", value: number | null): void;
}>();

const authStore = useAuthStore();
const isLoginDialogVisible = ref(false);
const uploadingCount = ref(0);
const fileInput = ref<HTMLInputElement>();

const isUploading = computed(() => uploadingCount.value > 0);

const isDisabled = () => {
  if (authStore.getToken) return false;
  return isUploading.value;
};


const processUploadedFile = async (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const isStp = extension === "stp";
  const hasMainStp = props.stp_id != null;

  const base64Data = await fileToBase64(file);

  // Первый STP-файл отправляем в /files и сохраняем как основной stp_id
  if (isStp && !hasMainStp) {
    const response = await uploadFile3D(file.name, base64Data, extension || "stp");
    if (!response?.ok) throw new Error("Upload failed");

    const data = await response.json();
    console.log("STP upload response:", data);
    const id = Number((data as any).id);
    if (!Number.isFinite(id)) return;

    emit("update:stp_id", id);
    return;
  }

  // Все остальные файлы (включая последующие STP) отправляем как документы
  const response = await uploadDocument(file.name, base64Data, "technical_spec");
  if (!response?.ok) throw new Error("Upload failed");

  const data = await response.json();
  console.log("Document upload response:", data);
  const id = Number((data as any).document_id);

  if (!Array.isArray(document_ids.value)) document_ids.value = [];
  if (!Number.isFinite(id)) return;

  if (!document_ids.value.includes(id)) {
    document_ids.value.push(id);
  }
};

const handleFilesUpload = async (files: FileList | File[]) => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    return;
  }

  const list = Array.from(files);

  for (const file of list) {
    uploadingCount.value += 1;
    try {
      await processUploadedFile(file);
      ElMessage.success("Документ успешно загружен!");
    } catch (error) {
      console.error("Document upload error:", error);
      ElMessage.error("Ошибка загрузки документа");
    } finally {
      uploadingCount.value -= 1;
    }
  }
};

const handleFileChange = (event: Event) => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    return;
  }

  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length) handleFilesUpload(files);
  if (target) target.value = "";
};

const handleUploadClick = () => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    return;
  }

  fileInput.value?.click();
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    return;
  }
  const files = event.dataTransfer?.files;
  if (files && files.length) handleFilesUpload(files);
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};
</script>

<template>
  <div>
    <el-tooltip
      content="Необходимо зарегистрироваться"
      placement="top"
      :disabled="!!authStore.getToken"
    >
      <div
        class="upload"
        :style="{ '--border-color': color }"
        :class="{ 'is-disabled': isDisabled(), 'is-uploading': isUploading }"
        @click="handleUploadClick"
        @drop="handleDrop"
        @dragover="handleDragOver"
      >
        <div class="custom">
          <IconDrawing :color="color" style="display: block; width: 30px; height: 30px" />
          <div class="el-upload__text" :style="{ color }" style="font-size: 20px">
            {{ isUploading ? "Загрузка..." : "Перетащите или выберите файлы для расчета" }}
          </div>
          <input
            type="file"
            @change="handleFileChange"
            style="display: none"
            ref="fileInput"
            multiple
            :disabled="isDisabled() || isUploading"
          />
        </div>
      </div>
    </el-tooltip>

    <DialogLogin v-model="isLoginDialogVisible" />
  </div>
</template>

<style scoped>
.upload {
  padding: 20px;
  border: 1px solid var(--bgcolor);
  background-color: var(--bgcolor) !important;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
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

