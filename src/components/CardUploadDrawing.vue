<script lang="ts" setup>
import { ref } from "vue";
import Icon3D from "../icons/Icon3D.vue";
import IconDrawing from "../icons/IconDrawing.vue";

const volume = ref(0);
const handleSuccess = (response: any) => {
  volume.value = response.volume_cm3;
  console.log({ response });
};
</script>

<template>
  <el-row :gutter="20" style="background-color: #283d5b; padding-bottom: 30px">
    <el-col
      :span="24"
      style="padding-bottom: 10px; font-size: 30px; color: #577aad"
    >
      Загрузите файлы для расчета
    </el-col>
    <el-col :span="12">
      <el-upload
        class="upload"
        drag
        action="http://mdgkd-vlabal.int.kronshtadt.ru:7000/calculate-volume/"
        multiple
        :on-success="handleSuccess"
      >
        <div class="custom">
          <Icon3D style="display: block; width: 100px; height: 100px" />
          <div class="el-upload__text" style="font-size: 22px; color: white">
            3D-модель (STEP/STP/STL)
          </div>
        </div>
      </el-upload>
    </el-col>
    <el-col :span="12">
      <el-upload
        class="upload-demo"
        drag
        action="http://mdgkd-vlabal.int.kronshtadt.ru:7000/calculate-volume/"
        multiple
        :on-success="handleSuccess"
      >
        <div class="custom">
          <IconDrawing style="display: block; width: 100px; height: 100px" />
          <div style="font-size: 22px; color: white">Чертежи, документация</div>
        </div>
      </el-upload>
    </el-col>
    <el-col :span="24" style="font-size: 20px; color: #577aad">
      Максимальный размер 100Мб
    </el-col>
  </el-row>
</template>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 10px;
  background-color: #283d5b;
}

.custom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
