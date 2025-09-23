<script setup lang="ts">
import { ref } from "vue";
let file_id = ref(4);
</script>

<template>
  <el-row
    :gutter="0"
    style="
      min-height: 600px;
      background-color: var(--left-section-bg);
      padding: 100px 0 50px 20px;
    "
  >
    <el-col :offset="3" :span="7">
      <div style="text-align: left; font-size: 60px; color: white">
        ЦЕНТР КОЛЛЕКТИВНОГО ПРОИЗВОДСТВА
      </div>
      <p style="font-size: 30px; color: white">
        Получите доступ к огромному выбору производственных процессов,
        материалов и отделки.
      </p>
    </el-col>
    <el-col :offset="3" :span="8" style="text-align: center">
      <el-row :gutter="20">
        <el-col :span="24">
          <CadShowById v-model="file_id" />
        </el-col>
        <el-col :span="24">
          <el-button
            type="primary"
            plain
            style="
              margin: 20px 0;
              background-color: #aaa;
              color: white;
              font-size: 24px;
              padding: 24px;
            "
            @click="$router.push('/machining')"
          >
            Узнать цену изготовления данной детали
          </el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
