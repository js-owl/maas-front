<script lang="ts" setup>
import { computed } from "vue";
import { API_BASE } from "../api";
import Icon3D from "../icons/Icon3D.vue";
import { useAuthStore } from "../stores/auth.store";

const file_id = defineModel<number>();
const { color = "white" } = defineProps({
  color: String,
});

const authStore = useAuthStore();

const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${authStore.getToken}`,
}));

const loadModel = (response: any) => {
  console.log({ response });
  file_id.value = response.file_id;
};
</script>

<template>
  <el-upload
    class="upload"
    :style="{ '--border-color': color }"
    drag
    :headers="uploadHeaders"
    :action="`${API_BASE}/upload`"
    multiple
    :on-success="loadModel"
  >
    <div class="custom">
      <Icon3D
        :color="color"
        style="display: block; width: 100px; height: 100px"
      />
      <div class="el-upload__text" :style="{ color }" style="font-size: 22px">
        3D-модель (STEP/STP/STL)
      </div>
    </div>
  </el-upload>
</template>

<style scoped>
:deep(.el-upload-dragger) {
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
