<script lang="ts" setup>
import { computed } from "vue";
import { API_BASE } from "../api";
import IconDrawing from "../icons/IconDrawing.vue";
import { useAuthStore } from "../stores/auth.store";

const document_ids = defineModel<number[]>({ default: [] });
const { color = "white" } = defineProps({
  color: String,
});

const authStore = useAuthStore();

const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${authStore.getToken}`,
}));

const isDisabled = () => {
  if (authStore.getToken) {
    return false;
  }
  return true;
};
const loadDoc = (response: any) => {
  const id = Number(response?.document_id);
  console.log("loadDoc", id);
  if (!Array.isArray(document_ids.value)) {
    document_ids.value = [];
  }
  if (!Number.isFinite(id)) return;
  if (!document_ids.value.includes(id)) document_ids.value.push(id);
};
</script>

<template>
  <el-upload
    class="upload"
    :style="{ '--border-color': color }"
    drag
    :headers="uploadHeaders"
    :action="`${API_BASE}/documents/upload`"
    multiple
    :on-success="loadDoc"
    :disabled="isDisabled()"
  >
    <div class="custom">
      <IconDrawing
        :color="color"
        style="display: block; width: 100px; height: 100px"
      />
      <div class="el-upload__text" :style="{ color }" style="font-size: 20px">
        Чертежи, документация
      </div>
    </div>
  </el-upload>
</template>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 10px;
  border: 1px solid var(--border-color);
  background-color: var(--left-section-bg) !important;
}
:deep(.el-upload.is-disabled .el-upload-dragger) {
  background-color: var(--left-section-bg) !important;
  padding: 10px;
  border: 1px solid var(--border-color);
}
.custom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
