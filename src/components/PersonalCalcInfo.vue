<script lang="ts" setup>
import { ref } from 'vue'

// Document number - typically would come from props or route params
// This represents the calculation document identifier
const documentNumber = ref('ФР-159783')

// Comment text area value
// Stores user-entered comments about the calculation
const comment = ref('')

// Material costs section data
// Represents costs related to raw materials and auxiliary materials
const materialCosts = ref({
  rawMaterials: {
    blankInfo: '-', // Information about the blank/workpiece
    extractedDimensions: '-', // Extracted part dimensions
    partVolume: '-', // Part volume
    consumptionRate: '-', // Consumption rate
    mainMaterial: '-', // Main material
  },
  auxiliaryMaterials: '-', // Auxiliary materials cost
})

// Labor costs section data
// Represents costs associated with labor and workforce
const laborCosts = ref({
  laborIntensity: '-', // Labor intensity/workload
  costPerStandardHour: {
    basicSalary: '-', // Basic salary
    additionalSalary: '-', // Additional salary
    insuranceContributions: '-', // Insurance contributions
    generalProductionCosts: '-', // General production costs
    generalAdministrativeCosts: '-', // General administrative costs
  },
})

// Tooling costs
// Represents costs for tooling and equipment
const toolingCosts = ref('-')

// Handler for opening calculation details
// This would typically navigate to a detailed calculation view or open a modal
const handleOpenCalculation = () => {
  // TODO: Implement navigation or modal opening logic
  console.log('Opening calculation:', documentNumber.value)
}

// Handler for saving the calculation information
// This would typically send the data to the backend API
const handleSave = async () => {
  // TODO: Implement save logic with API call
  console.log('Saving calculation:', {
    documentNumber: documentNumber.value,
    comment: comment.value,
  })
}
</script>

<template>
  <div class="calc-info-container">
    <!-- Header section with document number and open button -->
    <div class="calc-header">
      <div class="document-number">{{ documentNumber }}</div>
      <el-button type="default" size="small" @click="handleOpenCalculation">
        Открыть расчет
      </el-button>
    </div>

    <!-- Material Costs Section -->
    <div class="cost-section">
      <div class="section-title">Материальные затраты</div>
      <div class="section-divider"></div>

      <!-- Raw materials subsection -->
      <div class="subsection">
        <div class="subsection-title">1 Сырье и основные материалы</div>
        <div class="subsection-content">
          <div class="cost-item">
            <span class="cost-label">1.1 Информация о заготовке</span>
            <span class="cost-value">{{ materialCosts.rawMaterials.blankInfo }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">1.2 Извлеченные габариты детали</span>
            <span class="cost-value">{{ materialCosts.rawMaterials.extractedDimensions }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">1.3 Объем детали</span>
            <span class="cost-value">{{ materialCosts.rawMaterials.partVolume }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">1.4 Норма расхода</span>
            <span class="cost-value">{{ materialCosts.rawMaterials.consumptionRate }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">1.5 Основной материал</span>
            <span class="cost-value">{{ materialCosts.rawMaterials.mainMaterial }}</span>
          </div>
        </div>
      </div>

      <div class="section-divider"></div>

      <!-- Auxiliary materials subsection -->
      <div class="subsection">
        <div class="subsection-title">2 Вспомогательные материалы</div>
        <div class="cost-item">
          <span class="cost-label"></span>
          <span class="cost-value">{{ materialCosts.auxiliaryMaterials }}</span>
        </div>
      </div>
    </div>

    <!-- Labor Costs Section -->
    <div class="cost-section">
      <div class="section-title">Затраты на оплату труда</div>
      <div class="section-divider"></div>

      <!-- Labor intensity subsection -->
      <div class="subsection">
        <div class="subsection-title">1 Трудоемкость</div>
        <div class="cost-item">
          <span class="cost-label"></span>
          <span class="cost-value">{{ laborCosts.laborIntensity }}</span>
        </div>
      </div>

      <div class="section-divider"></div>

      <!-- Cost per standard hour subsection -->
      <div class="subsection">
        <div class="subsection-title">2 Стоимость нормочаса</div>
        <div class="subsection-content">
          <div class="cost-item">
            <span class="cost-label">2.1 Основная заработная плата</span>
            <span class="cost-value">{{ laborCosts.costPerStandardHour.basicSalary }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">2.2 Дополнительная заработная плата</span>
            <span class="cost-value">{{ laborCosts.costPerStandardHour.additionalSalary }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">2.3 Страховые взносы</span>
            <span class="cost-value">{{ laborCosts.costPerStandardHour.insuranceContributions }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">2.4 Общепроизводственные затраты</span>
            <span class="cost-value">{{ laborCosts.costPerStandardHour.generalProductionCosts }}</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">2.5 Общехозяйственные затраты</span>
            <span class="cost-value">{{ laborCosts.costPerStandardHour.generalAdministrativeCosts }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tooling Costs Section -->
    <div class="cost-section">
      <div class="section-title">Затраты на оснастку</div>
      <div class="section-divider"></div>
      <div class="cost-item">
        <span class="cost-label"></span>
        <span class="cost-value">{{ toolingCosts }}</span>
      </div>
    </div>

    <!-- Comment Section -->
    <div class="comment-section">
      <div class="section-title">Комментарий</div>
      <el-input
        v-model="comment"
        type="textarea"
        :rows="4"
        placeholder="Введите комментарий..."
        class="comment-textarea"
      />
    </div>

    <!-- Save Button -->
    <div class="action-section">
      <el-button type="danger" size="default" @click="handleSave"> Сохранить </el-button>
    </div>
  </div>
</template>

<style scoped>
.calc-info-container {
  background: #fff;
  padding: 20px;
  min-height: 500px;
}

/* Header styling - document number on left, button on right */
.calc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
}

.document-number {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

/* Section styling - each main cost category */
.cost-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
}

.section-divider {
  height: 1px;
  background-color: #e4e7ed;
  margin: 12px 0;
}

/* Subsection styling - numbered items within sections */
.subsection {
  margin: 16px 0;
}

.subsection-title {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
}

.subsection-content {
  margin-left: 16px;
}

/* Cost item row - label on left, value on right */
.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  min-height: 32px;
}

.cost-label {
  flex: 1;
  color: #606266;
  font-size: 14px;
}

.cost-value {
  flex: 0 0 auto;
  color: #303133;
  font-size: 14px;
  text-align: right;
  min-width: 80px;
}

/* Comment section styling */
.comment-section {
  margin-top: 32px;
  margin-bottom: 24px;
}

.comment-textarea {
  margin-top: 12px;
}

/* Action section - save button positioned at bottom right */
.action-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}
</style>

