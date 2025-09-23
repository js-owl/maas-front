<script lang="ts" setup>
import { ref } from "vue";
import { API_BASE_CAD } from "../api";

const volume = ref(0);
const handleSuccess = (response: any) => {
  volume.value = response.volume_cm3;
  console.log({ response });
};
</script>

<template>
  <el-upload
    class="upload-demo"
    drag
    :action="`${API_BASE_CAD}/calculate-volume/`"
    multiple
    :on-success="handleSuccess"
  >
    <div class="el-upload__text" style="font-size: 22px; height: 150px">
      Загрузите модель
    </div>
    <template #tip>
      <div class="el-upload__tip">Максимальный размер 100Мб</div>
      <div v-if="volume !== 0" class="el-upload__tip">
        {{ `Объем детали: ${volume * 1000} мм` }}
      </div>
    </template>
  </el-upload>
</template>

<style scoped></style>
