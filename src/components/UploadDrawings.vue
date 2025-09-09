<script lang="ts" setup>
import { computed } from "vue";
import { API_BASE } from "../api";
import IconDrawing from "../icons/IconDrawing.vue";
import { useAuthStore } from "../stores/auth.store";

const document_ids = defineModel<string>();
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
  console.log("loadDoc", response.document_id);
  document_ids.value = response.document_id;
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
      <div class="el-upload__text" :style="{ color }" style="font-size: 22px">
        Чертежи, документация
      </div>
    </div>
  </el-upload>
</template>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 10px;
  border: 1px solid var(--border-color);
}
:deep(.el-upload.is-disabled .el-upload-dragger) {
  background-color: #283d5b;
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
