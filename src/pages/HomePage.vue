<script setup lang="ts">
import SectionModel from "../components/SectionModel.vue";
import SectionAbility from "../components/SectionAbility.vue";
import SectionAdvantages from "../components/SectionAdvantages.vue";
</script>

<template>
  <SectionModel />
  <SectionAbility />

  <!-- Section Milestones -->
  <el-row
    :gutter="0"
    style="
      background-color: var(--left-section-bg);
      padding-top: 30px;
      min-height: 300px;
    "
  >
    <el-col :offset="3" :span="18">
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

  <SectionAbout />
  <SectionAdvantages />
</template>
<style scoped>
:deep(.el-step__title) {
  font-size: 20px;
}
</style>
