<script lang="ts" setup>
import { ref, computed } from 'vue'

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

// Convert material costs to tree data structure
// Tree structure allows hierarchical display of nested cost categories using el-tree component
const materialCostsTree = computed(() => [
  {
    label: '1 Сырье и основные материалы',
    value: null, // Parent nodes don't have direct values
    children: [
      {
        label: '1.1 Информация о заготовке',
        value: materialCosts.value.rawMaterials.blankInfo,
      },
      {
        label: '1.2 Извлеченные габариты детали',
        value: materialCosts.value.rawMaterials.extractedDimensions,
      },
      {
        label: '1.3 Объем детали',
        value: materialCosts.value.rawMaterials.partVolume,
      },
      {
        label: '1.4 Норма расхода',
        value: materialCosts.value.rawMaterials.consumptionRate,
      },
      {
        label: '1.5 Основной материал',
        value: materialCosts.value.rawMaterials.mainMaterial,
      },
    ],
  },
  {
    label: '2 Вспомогательные материалы',
    value: materialCosts.value.auxiliaryMaterials,
  },
])

// Convert labor costs to tree data structure
// Tree structure organizes labor costs into expandable categories for better UX
const laborCostsTree = computed(() => [
  {
    label: '1 Трудоемкость',
    value: laborCosts.value.laborIntensity,
  },
  {
    label: '2 Стоимость нормочаса',
    value: null, // Parent node
    children: [
      {
        label: '2.1 Основная заработная плата',
        value: laborCosts.value.costPerStandardHour.basicSalary,
      },
      {
        label: '2.2 Дополнительная заработная плата',
        value: laborCosts.value.costPerStandardHour.additionalSalary,
      },
      {
        label: '2.3 Страховые взносы',
        value: laborCosts.value.costPerStandardHour.insuranceContributions,
      },
      {
        label: '2.4 Общепроизводственные затраты',
        value: laborCosts.value.costPerStandardHour.generalProductionCosts,
      },
      {
        label: '2.5 Общехозяйственные затраты',
        value: laborCosts.value.costPerStandardHour.generalAdministrativeCosts,
      },
    ],
  },
])

// Convert tooling costs to tree data structure
// Simple single-node tree structure for tooling costs display
const toolingCostsTree = computed(() => [
  {
    label: '',
    value: toolingCosts.value,
  },
])

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
    <!-- Using el-tree to display hierarchical cost structure with expandable nodes -->
    <div class="cost-section">
      <div class="section-title">Материальные затраты</div>
      <div class="section-divider"></div>
      <el-tree
        :data="materialCostsTree"
        :props="{ children: 'children', label: 'label' }"
        :expand-on-click-node="false"
        class="cost-tree"
      >
        <template #default="{ data }">
          <div class="cost-item">
            <span class="cost-label">{{ data.label }}</span>
            <span class="cost-value" v-if="data.value !== null">{{ data.value }}</span>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- Labor Costs Section -->
    <!-- Using el-tree for hierarchical display of labor costs with nested subcategories -->
    <div class="cost-section">
      <div class="section-title">Затраты на оплату труда</div>
      <div class="section-divider"></div>
      <el-tree
        :data="laborCostsTree"
        :props="{ children: 'children', label: 'label' }"
        :expand-on-click-node="false"
        class="cost-tree"
      >
        <template #default="{ data }">
          <div class="cost-item">
            <span class="cost-label">{{ data.label }}</span>
            <span class="cost-value" v-if="data.value !== null">{{ data.value }}</span>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- Tooling Costs Section -->
    <!-- Using el-tree for consistent display structure across all cost sections -->
    <div class="cost-section">
      <div class="section-title">Затраты на оснастку</div>
      <div class="section-divider"></div>
      <el-tree
        :data="toolingCostsTree"
        :props="{ children: 'children', label: 'label' }"
        :expand-on-click-node="false"
        class="cost-tree"
      >
        <template #default="{ data }">
          <div class="cost-item">
            <span class="cost-label">{{ data.label }}</span>
            <span class="cost-value" v-if="data.value !== null">{{ data.value }}</span>
          </div>
        </template>
      </el-tree>
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

/* Tree styling for cost sections */
/* Customizes el-tree appearance to match the original cost-item layout */
.cost-tree {
  padding: 8px 0;
}

.cost-tree :deep(.el-tree-node__content) {
  height: auto;
  min-height: 32px;
  padding: 8px 0;
}

.cost-tree :deep(.el-tree-node__expand-icon) {
  padding: 4px;
  margin-right: 4px;
}

/* Cost item row - label on left, value on right */
/* Ensures cost-item takes full width of tree node content area for proper alignment */
.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  min-height: 32px;
  width: 100%;
}

.cost-label {
  flex: 1;
  color: #606266;
  font-size: 14px;
  text-align: left;
}

/* Cost value alignment - ensures values are right-aligned within the cost-item */
.cost-value {
  flex: 0 0 auto;
  color: #303133;
  font-size: 14px;
  text-align: right;
  min-width: 80px;
  margin-left: auto;
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

