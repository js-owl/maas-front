<script setup lang="ts">
import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);
</script>

<template>
  <el-row :gutter="0" class="milestones-row">
    <el-col :offset="3" :span="18">
      <div class="milestones-title">
        ЭТАПЫ ПРОЕКТА
      </div>
      <el-steps
        class="milestones-steps"
        :align-center="!isMobile"
        :direction="isMobile ? 'vertical' : 'horizontal'"
        :active="5"
      >
        <el-step title="Загрузите модель или оставьте заявку" />
        <el-step title="Согласование проекта" />
        <el-step title="Изготовление" />
        <el-step title="Сертификация" />
        <el-step title="Доставка" />
      </el-steps>
    </el-col>
  </el-row>
  
</template>

<style scoped>
.milestones-row {
  background-color: var(--left-section-bg);
  padding-top: 30px;
  min-height: 300px;
}

.milestones-title {
  text-align: center;
  font-size: 60px;
  color: white;
  padding-bottom: 40px;
}

.milestones-steps {
  padding-top: 20px;
}

:deep(.el-step__title) {
  font-size: 20px;
}

@media (max-width: 767px) {
  .milestones-row {
    padding-top: 16px;
    min-height: auto;
  }

  .milestones-title {
    font-size: 28px;
    line-height: 1.2;
    padding: 0 12px 16px;
  }

  .milestones-steps {
    padding-top: 8px;
    padding-left: 8px;
    padding-right: 8px;
  }

  :deep(.el-step__title) {
    font-size: 14px;
    line-height: 1.3;
    white-space: normal;
  }

  :deep(.el-step__icon) {
    transform: scale(0.85);
  }
}
</style>


