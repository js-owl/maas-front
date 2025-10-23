<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import MaterialMachining from '../components/materials/MaterialMachining.vue'
import CoefficientQuantity from '../components/coefficients/CoefficientQuantity.vue'
import CoefficientTolerance from '../components/coefficients/CoefficientTolerance.vue'
import CoefficientFinish from '../components/coefficients/CoefficientFinish.vue'
import CalculateBasePage from '../components/CalculateBasePage.vue'

let material_id = ref('alum_D16')

const basePageRef = ref()

// Initialize with default values
let finish_id = ref('3')
let tolerance_id = ref('4')
let quantity = ref(1)

onMounted(() => {
  if (basePageRef.value) {
    finish_id = basePageRef.value.finish_id
    tolerance_id = basePageRef.value.tolerance_id
    quantity = basePageRef.value.quantity
  }
})
</script>

<template>
  <CalculateBasePage
    ref="basePageRef"
    serviceId="cnc-lathe"
    title="ТОКАРНАЯ ОБРАБОТКА"
    :defaultFileId="4"
    submitButtonText="Перейти к оформлению"
  >
    <template #rightSection>
      <el-row :gutter="5">
        <el-col :offset="0" :span="7" :xs="{ span: 24, offset: 0 }">
          <div class="disabled-block">
            <CoefficientFinish v-if="finish_id" v-model="finish_id" />
          </div>
        </el-col>
        <el-col :offset="1" :span="7" :xs="{ span: 24, offset: 0 }">
          <div class="disabled-block">
            <CoefficientTolerance v-if="tolerance_id" v-model="tolerance_id" />
          </div>
        </el-col>
        <el-col :offset="1" :span="7" :xs="{ span: 24, offset: 0 }">
          <CoefficientQuantity v-if="quantity" v-model="quantity" />
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :offset="0" :span="15" :xs="{ span: 24, offset: 0 }">
          <MaterialMachining v-model="material_id" />
        </el-col>
        <el-col :offset="1" :span="5"> </el-col>
      </el-row>
    </template>
  </CalculateBasePage>
</template>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 10px;
  background-color: #283d5b;
}
:deep(.loading-top .el-loading-spinner) {
  top: 40px;
  margin-top: 0;
  transform: scale(1.5);
  transform-origin: top center;
}

.custom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.submit {
  background-color: var(--bgcolor);
  border: 1px solid var(--bgcolor);
  color: black;
  font-size: 20px;
  padding: 30px 0;
  width: 100%;
}

/* Основные цвета и фоны */
.main-container {
  min-height: 500px;
  background-color: var(--bgcolor);
}

.left-section {
  margin-bottom: 40px;
  padding: 30px 30px 40px 40px;
  background-color: white;
  border-radius: 20px 0 0 20px;
}

.right-section {
  margin-bottom: 40px;
  padding: 30px 30px 40px 40px;
  background-color: white;
  border-radius: 0 20px 20px 0;
}

/* Текстовые стили */
.title-text {
  color: black;
  font-size: 38px;
  font-weight: 600;
  padding-bottom: 30px;
}

.price-section {
  /* border-top: 1px solid #577aad; */
  /* border-bottom: 1px solid #577aad; */
  font-size: 24px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  background-color: var(--whity);
  color: black;
  margin-bottom: 10px;
  padding: 14px 10px;
  border-radius: 3px;
  /* border-bottom: 1px solid #577aad; */
}

.price-row-last {
  display: flex;
  justify-content: space-between;
  background-color: var(--whity);
  color: black;
  padding: 14px 10px;
  border-radius: 3px;
}

.disclaimer-text {
  color: black;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
}

/* Секции с компонентами */
.component-section {
  background-color: white;
  padding-bottom: 30px;
}

.upload-section {
  background-color: white;
  padding-bottom: 30px;
}

.upload-title {
  padding-bottom: 10px;
  font-size: 30px;
  color: black;
  font-weight: 700;
  /* color: #577aad; */
}

.upload-info {
  font-size: 20px;
  color: black;
}

.cad-section {
  color: var(--whity);
}

/* Кнопки и центрирование */
.center-button {
  display: flex;
  justify-content: center;
}

/* Отступы для строк */
.row-spacing-top {
  padding-top: 30px;
}

.row-spacing-bottom {
  padding: 0 0 30px 0;
}

.row-spacing-both {
  padding: 30px 0;
}

.disabled-block {
  opacity: 0.5;
  pointer-events: none;
}

@media (max-width: 767px) {
  .main-container {
    min-height: auto;
  }

  .left-section {
    padding: 16px 12px 24px 12px;
  }

  .right-section {
    padding: 16px 12px 24px 12px;
  }

  .title-text {
    font-size: 24px;
    text-align: center;
    padding-bottom: 16px;
  }

  .price-section {
    margin-bottom: 16px;
  }

  .price-row {
    font-size: 16px;
    padding: 8px 0;
  }

  .price-row-last {
    font-size: 16px;
    padding: 8px 0;
  }

  .disclaimer-text {
    font-size: 12px;
    margin-bottom: 16px;
  }

  .upload-section {
    margin-bottom: 16px;
  }

  .upload-title {
    font-size: 18px;
    text-align: center;
    margin-bottom: 12px;
  }

  .upload-info {
    font-size: 12px;
    text-align: center;
    margin-bottom: 12px;
  }

  .submit {
    font-size: 16px;
    padding: 16px 0;
    margin-bottom: 8px;
  }

  .component-section {
    margin-bottom: 16px;
  }
}
</style>
