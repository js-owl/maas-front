<script setup lang="ts">
import { ref } from "vue";
import SectionAbility from "../components/SectionAbility.vue";
import SectionAdvantages from "../components/SectionAdvantages.vue";
import UploadDrawings from "../components/UploadDrawings.vue";
import UploadModel from "../components/UploadModel.vue";

let file_id = ref(1);
let drawing_id = ref(1);
</script>

<template>
  <!-- Section Upload-->
  <el-row
    :gutter="0"
    style="
      min-height: 600px;
      background-color: #283d5b;
      padding: 150px 0 0 20px;
    "
  >
    <el-col :offset="2" :span="7">
      <div style="text-align: left; font-size: 60px; color: white">
        ПРОИЗВОДСТВО ПО ТРЕБОВАНИЮ
      </div>
      <p style="font-size: 30px; color: white">
        Получите доступ к огромному выбору производственных процессов,
        материалов и отделки.
      </p>
    </el-col>
    <el-col :offset="3" :span="9" style="text-align: center">
      <el-row :gutter="20">
        <el-col :span="12">
          <UploadModel v-model="file_id" color="#283d5b" />
        </el-col>
        <el-col :span="12">
          <UploadDrawings v-model="drawing_id" color="#283d5b" />
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
            Калькулятор стоимости изделия
          </el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

  <SectionAbility />

  <!-- Section Milestones -->
  <el-row
    :gutter="0"
    style="background-color: #283d5b; padding-top: 30px; min-height: 300px"
  >
    <el-col :offset="2" :span="20">
      <div
        style="
          text-align: center;
          font-size: 60px;
          color: white;
          padding-bottom: 40px;
        "
      >
        ЭТАПЫ ПРОЕКТА
      </div>
      <el-steps style="padding-top: 20px" align-center :active="5">
        <el-step title="Загрузите модель или оставьте заявку" />
        <el-step title="Согласование проекта" />
        <el-step title="Изготовление" />
        <el-step title="Сертификация" />
        <el-step title="Доставка" />
      </el-steps>
    </el-col>
  </el-row>

  <!-- Section About -->
  <el-row
    id="about"
    :gutter="20"
    style="background-color: #eee; padding-top: 50px; min-height: 500px"
  >
    <el-col :offset="2" :span="9">
      <div
        style="
          text-align: left;
          font-size: 60px;
          color: #283d5b;
          padding: 0 0 20px;
        "
      >
        О НАС
      </div>
      <p style="font-size: 28px; color: #283d5b">
        Мы представляем Промышленный Кластер, работающий с **** года. Мы
        накопили достаточный опыт и компетенции для предоставления Вам услуг по
        оптимизации производства, проектирования, подбору комплектующих, сборке
        – а так же множеству прочих услуг.
      </p>
      <p style="font-size: 28px; color: #283d5b">
        Наши возможности – это быстрые и удобные решения универсальных задач,
        вне зависимости от размера вашего производства.
      </p>
      <p style="font-size: 28px; color: #283d5b">
        Мы предлагаем качество, надежное партнерство и лучшие решения на рынке.
      </p>
    </el-col>
    <el-col :offset="1" :span="11">
      <el-image src="homePage/about.png" class="item-img" />
    </el-col>
  </el-row>

  <SectionAdvantages />
</template>
<style scoped>
:deep(.el-step__title) {
  font-size: 20px;
}
</style>
