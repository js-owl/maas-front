<template>
  <el-upload
    class="upload-demo"
    drag
    :action="`${API_BASE_CAD}/calculate-dimensions/`"
    :on-change="handleFileChange"
    :on-success="handleSuccess"
    multiple
  >
    <div class="el-upload__text" style="height: 100px; font-size: 24px">
      Загрузить ваши файлы
    </div>
    <div class="el-upload__text" style="height: 70px; font-size: 24px">
      <div style="color: black">STEP STP SLDPRT STL DXR</div>
      <div style="color: black">IPT X_T X_B 3DXML CATPART PRT SAT 3MF</div>
    </div>
    <template #tip>
      <div class="el-upload__tip" style="font-size: 20px; color: black">
        Сертификация по ISO ISO 9001:2015, ISO 13485:2016 и ГОСТ
      </div>
      <div v-if="dims" class="el-upload__tip">
        Размеры детали: {{ dims.width_x }} мм x {{ dims.depth_y }} мм x
        {{ dims.height_z }} мм
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { ref } from "vue";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { API_BASE, API_BASE_CAD } from "../api";
import { useAuthStore } from "../stores/auth.store";

const authStore = useAuthStore();

const emit = defineEmits(["file-loaded"]);

const dims = ref({
  width_x: 0,
  depth_y: 0,
  height_z: 0,
});

const handleFileChange = (uploadFile) => {
  const file = uploadFile.raw;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const contents = e.target.result;
    const geometry = new STLLoader().parse(contents);
    emit("file-loaded", geometry); // Передаем геометрию в ShowModel
  };
  reader.readAsArrayBuffer(file);
};

const handleSuccess = (response) => {
  dims.value.width_x = response.dimensions_mm.width_x.toFixed(0);
  dims.value.depth_y = response.dimensions_mm.depth_y.toFixed(0);
  dims.value.height_z = response.dimensions_mm.height_z.toFixed(0);
};
</script>

<style scoped>
/* Стили для UploadModel (если нужны) */
</style>
