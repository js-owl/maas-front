<script setup lang="ts">
import { ref } from 'vue'
let file_id = ref(4)
</script>

<template>
  <el-row :gutter="0" class="section-basic">
    <el-col :span="10" :xs="{ span: 24, offset: 0 }">
      <div style="padding-top: 10px">
        <div class="model-title">ЦЕНТР КОЛЛЕКТИВНОГО ПОЛЬЗОВАНИЯ АЭРОМАКС</div>
        <p class="model-subtitle">
          Загрузите 3D-модель и получите быстрый расчет стоимости.
        </p>
        <div style="display: flex; justify-content: space-between;">
          <div class="model-icon">металл</div>
          <div class="model-icon">пластики</div> 
          <div class="model-icon">дерево</div>
        </div>
      </div>
    </el-col>
    <el-col :offset="2" :span="12" :xs="{ span: 24, offset: 0 }" class="model-right">
      <el-row :gutter="20">
        <el-col :span="24">
          <div style="border: 2px dashed red; border-radius: 8px;">
            <CadShowById v-model="file_id" />
          </div>
        </el-col>
        <!-- <el-col :span="24">
          <el-button type="primary" plain class="model-cta" @click="$router.push('/machining')">
            Узнать цену изготовления данной детали
          </el-button>
        </el-col> -->
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
.model-title {
  text-align: left;
  font-size:44px;
  font-weight: bold;
  color: black;
}

.model-subtitle {
  padding-top: 30px;
  font-size: 24px;
  font-weight: bold;
  color: var(--gray-footer);
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

.model-icon {
  width: 123px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  font-size: 20x;
  font-weight: normal;
  color: var(--gray-footer);
  background-color: var(--whity);
  border-radius: 10px;
  margin-top: 100px;
  /* padding: 10px; */
}

@media (max-width: 767px) {
  .section-basic {
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

  .model-icon {
    display: none;
  }
}
</style>
