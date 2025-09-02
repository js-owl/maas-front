<script lang="ts" setup>
import { computed, ref } from "vue";
import { API_BASE } from "../api";
import Icon3D from "../icons/Icon3D.vue";
import { useAuthStore } from "../stores/auth.store";
import DialogLogin from "./dialog/DialogLogin.vue";

const file_id = defineModel<number>();
const { color = "white" } = defineProps({
  color: String,
});

const authStore = useAuthStore();
const isLoginDialogVisible = ref(false);

const isAuthorized = computed(() => Boolean(authStore.getToken));

const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${authStore.getToken}`,
}));

const isDisabled = () => {
  if (authStore.getToken) {
    return false;
  }
  return true;
};

const handleUploadClick = () => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    return;
  }
};

const loadModel = (response: any) => {
  console.log({ response });
  file_id.value = response.file_id;
};
</script>

<template>
  <div>
    <el-tooltip
      content="Необходимо зарегистрироваться"
      placement="top"
      :disabled="isAuthorized"
    >
      <el-upload
        class="upload"
        :style="{ '--border-color': color }"
        drag
        :headers="uploadHeaders"
        :action="`${API_BASE}/upload`"
        multiple
        :on-success="loadModel"
        :disabled="isDisabled()"
        @click="handleUploadClick"
      >
        <div class="custom">
          <Icon3D
            :color="color"
            style="display: block; width: 100px; height: 100px"
          />
          <div
            class="el-upload__text"
            :style="{ color }"
            style="font-size: 22px"
          >
            3D-модель (STEP/STP/STL)
          </div>
        </div>
      </el-upload>
    </el-tooltip>

    <DialogLogin v-model="isLoginDialogVisible" />
  </div>
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
