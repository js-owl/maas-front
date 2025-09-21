<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Tools, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('equipment')

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <el-row :gutter="0" class="main-container">
    <!-- 1. Левая часть -->
    <el-col :offset="2" :span="9" class="left-section">
      <div class="applications-section">
        <h2 class="section-title">ПРИМЕНЕНИЕ</h2>
        <div class="applications-list">
          <div class="application-item">
            <el-icon class="check-icon"><Check /></el-icon>
            <span>Точение цилиндрических и конусных поверхностей;</span>
          </div>
          <div class="application-item">
            <el-icon class="check-icon"><Check /></el-icon>
            <span>Нарезание резьбы (метрической, дюймовой, трапецеидальной);</span>
          </div>
          <div class="application-item">
            <el-icon class="check-icon"><Check /></el-icon>
            <span>Снятие фасок, канавок и пазов.</span>
          </div>
          <div class="application-item">
            <el-icon class="check-icon"><Check /></el-icon>
            <span>Наружное и внутреннее точение, резьба.</span>
          </div>
          <div class="application-item">
            <el-icon class="check-icon"><Check /></el-icon>
            <span>Высокоточное сверление и обработка отверстий, расточка.</span>
          </div>
          <div class="application-item">
            <el-icon class="check-icon"><Check /></el-icon>
            <span>Фасонная обработка торцевых и сложных поверхностей;</span>
          </div>
        </div>

        <!-- Calculator Section -->
        <div class="calculator-section">
          <div class="calculator-box" @click="router.push({ name: 'machining' })">
            <el-icon class="calculator-icon"><Tools /></el-icon>
            <span class="calculator-text">Калькулятор стоимости токарной обработки</span>
          </div>
        </div>

        <!-- Back Button -->
        <div class="back-button-section">
          <el-button class="back-button" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            В меню
          </el-button>
        </div>
      </div>
    </el-col>

     <!-- 2. Правая часть -->
    <el-col :span="13" class="right-section">
      <div class="technical-section">
        <h2 class="section-title">ТОКАРНАЯ ОБРАБОТКА</h2>
        <p class="description">
          Токарная обработка представляет собой механическую операцию, при которой вращающаяся деталь обрабатывается режущим инструментом, последовательно снимающим слои материала. Технология позволяет создавать цилиндрические, конические и сложные профилированные поверхности с высокой степенью точности. Применяется в производстве металлических, пластиковых и других изделий, обеспечивая превосходное качество финишной обработки.
        </p>

        <h3 class="section-title">ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ</h3>
        
        <!-- Tabs -->
        <el-tabs v-model="activeTab" class="tech-tabs">
          <el-tab-pane label="Оборудование" name="equipment">
            <div class="tab-content">
              <div class="requirement-item">Токарно-винторезные станки</div>
              <div class="requirement-item">Станок с ЧПУ</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Размеры детали/заготовки" name="dimensions">
            <div class="tab-content">
              <div class="requirement-item">длина до 1000 мм</div>
              <div class="requirement-item">диаметр до 600 мм</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Материалы" name="materials">
            <div class="tab-content">
              <div class="requirement-item">Нержавеющие, легированные стали</div>
              <div class="requirement-item">Полиамиды, фторопласт</div>
              <div class="requirement-item">Алюминиевые, бронзовые, медные сплавы</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.main-container {
  min-height: 500px;
  background-color: var(--left-section-bg);
}

.left-section {
  padding: 30px 50px 40px 20px;
}

.title-text {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.section-title {
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.applications-section {
  margin-bottom: 40px;
}

.applications-list {
  margin-bottom: 30px;
}

.application-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: white;
  font-size: 16px;
}

.check-icon {
  color: #4CAF50;
  margin-right: 15px;
  font-size: 18px;
}

.calculator-section {
  margin-bottom: 30px;
}

.calculator-box {
  background-color: #34495e;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.calculator-box:hover {
  background-color: #2c3e50;
}

.calculator-icon {
  font-size: 24px;
  margin-right: 15px;
  color: #3498db;
}

.calculator-text {
  font-size: 16px;
  font-weight: 500;
}

.back-button-section {
  margin-top: 30px;
}

.back-button {
  background-color: #34495e;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 6px;
}

.back-button:hover {
  background-color: #2c3e50;
}

.right-section {
  background-color: #fff;
  padding-top: 30px;
}

.technical-section {
  color: white;
}

.description {
  color: #bdc3c7;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.tech-tabs {
  margin-top: 20px;
}

:deep(.el-tabs__header) {
  margin-bottom: 20px;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: #34495e;
}

:deep(.el-tabs__item) {
  color: #bdc3c7;
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-tabs__item.is-active) {
  color: white;
}

:deep(.el-tabs__active-bar) {
  background-color: #3498db;
}

.tab-content {
  padding: 20px 0;
}

.requirement-item {
  background-color: #34495e;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 6px;
  color: white;
  font-size: 16px;
}

.requirement-item:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .left-section {
    padding: 20px;
  }
  
  .right-section {
    padding: 20px;
  }
  
  .title-text {
    font-size: 20px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .application-item {
    font-size: 14px;
  }
  
  .calculator-text {
    font-size: 14px;
  }
  
  .description {
    font-size: 14px;
  }
}
</style>