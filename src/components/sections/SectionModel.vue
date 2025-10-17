<script setup lang="ts">
import { ref } from "vue";
let file_id = ref(4);
</script>

<template>
  <el-row :gutter="0" class="model-row">
    <el-col :offset="3" :span="7" :xs="{ span: 24, offset: 0 }">
      <div class="model-title">ЦЕНТР КОЛЛЕКТИВНОГО ПРОИЗВОДСТВА</div>
      <p class="model-subtitle">
        Получите доступ к огромному выбору производственных процессов,
        материалов и отделки.
      </p>
    </el-col>
    <el-col :offset="3" :span="8" :xs="{ span: 24, offset: 0 }" class="model-right">
      <el-row :gutter="20">
        <el-col :span="24">
          <CadShowById v-model="file_id" />
        </el-col>
        <el-col :span="24">
          <el-button type="primary" plain class="model-cta" @click="$router.push('/machining')">
            Узнать цену изготовления данной детали
          </el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
.model-row {
  min-height: 600px;
  background-color: var(--left-section-bg);
  padding: 100px 0 50px 20px;
}

.model-title {
  text-align: left;
  font-size: 60px;
  color: white;
}

.model-subtitle {
  font-size: 30px;
  color: white;
}

.model-right {
  text-align: center;
}

.model-cta {
  margin: 20px 0;
  background-color: #aaa;
  color: white;
  font-size: 24px;
  padding: 24px;
}

@media (max-width: 767px) {
  .model-row {
    min-height: auto;
    padding: 24px 12px 24px 12px;
  }

  .model-title {
    font-size: 28px;
    text-align: center;
    line-height: 1.2;
  }

  .model-subtitle {
    font-size: 16px;
    text-align: center;
  }

  .model-cta {
    font-size: 16px;
    padding: 12px 16px;
    width: 100%;
  }
}
</style>
