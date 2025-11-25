<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { req_json_auth } from '../api'
import type { IOrderResponse } from '../interfaces/order.interface'

// Get orderId from route query
const route = useRoute()
const router = useRouter()
const orderId = computed(() => Number(route.query.orderId) || 0)

// Loading state
const isLoading = ref(false)

// Document number - typically would come from props or route params
// This represents the calculation document identifier
const documentNumber = ref('ФР-159783')

// Comment text area value
// Stores user-entered comments about the calculation
const comment = ref('')

// Material costs section data
// Represents costs related to raw materials and auxiliary materials
// Structure matches the hierarchical breakdown from the specification
const materialCosts = ref({
  matPriceFull: '-', // 1 Материальные затраты (mat_price_full)
  rawMaterials: {
    matPrice: '-', // 1.1 сырье и основные материалы (mat_price)
    blankInfo: {
      // 1.1.1 Информация о заготовке (blank_info) - parent category
      extractedDimensions: '-', // 1.1.1.1 Извлечённые габаритные размеры детали (extracted_dimensions)
      matVolume: '-', // 1.1.1.2 Объём заготовки (mat_volume)
      matWeight: '-', // 1.1.1.3 Норма расхода (mat_weight)
    },
    pricePerKg: '-', // 1.1.2 Основной материал (price_per_kg)
  },
  dopMatPrice: '-', // 1.2 вспомогательные материалы (dop_mat_price)
})

// Labor costs section data
// Represents costs associated with labor and workforce
// Structure matches the hierarchical breakdown from the specification
const laborCosts = ref({
  sumCostsLabor: '-', // 2 Затраты на оплату труда (sum_costs_labor)
  totalTime: '-', // 2.1 Трудоёмкость (total_time)
  priceOfHourWithOthers: {
    priceOfHourWithOthers: '-', // 2.2 Стоимость нормочаса (price_of_hour_with_others)
    workPrice: '-', // 2.2.1 Основная заработная плата (work_price)
    dopSalary: '-', // 2.2.2 Дополнительная заработная плата (dop_salary)
    insurancePrice: '-', // 2.2.3 Страховые взносы (insurance_price)
    overheadExpenses: '-', // 2.2.4 Общепроизводственные затраты (overhead_expenses)
    administrativeExpenses: '-', // 2.2.5 Общехозяйственные затраты (administrative_expenses)
  },
})

// Tooling costs
// Represents costs for special technological equipment
// 3 Затраты на специальную технологическую оснастку (price_special_equipment_to_quantity)
const toolingCosts = ref('-')

// Convert material costs to tree data structure
// Tree structure matches the exact hierarchy from the specification image
const materialCostsTree = computed(() => [
  {
    label: '1.1 Сырье и основные материалы',
    value: materialCosts.value.rawMaterials.matPrice,
    children: [
      {
        label: '1.1.1 Информация о заготовке',
        value: null, // Parent node without direct value
        children: [
          {
            label: '1.1.1.1 Извлечённые габаритные размеры детали',
            value: materialCosts.value.rawMaterials.blankInfo.extractedDimensions,
          },
          {
            label: '1.1.1.2 Объём заготовки',
            value: materialCosts.value.rawMaterials.blankInfo.matVolume,
          },
          {
            label: '1.1.1.3 Норма расхода',
            value: materialCosts.value.rawMaterials.blankInfo.matWeight,
          },
        ],
      },
      {
        label: '1.1.2 Основной материал',
        value: materialCosts.value.rawMaterials.pricePerKg,
      },
    ],
  },
  {
    label: '1.2 вспомогательные материалы',
    value: materialCosts.value.dopMatPrice,
  },
])

// Convert labor costs to tree data structure
// Tree structure matches the exact hierarchy from the specification image
const laborCostsTree = computed(() => [
  {
    label: '2.1 Трудоёмкость',
    value: laborCosts.value.totalTime,
  },
  {
    label: '2.2 Стоимость нормочаса',
    value: laborCosts.value.priceOfHourWithOthers.priceOfHourWithOthers,
    children: [
      {
        label: '2.2.1 Основная заработная плата',
        value: laborCosts.value.priceOfHourWithOthers.workPrice,
      },
      {
        label: '2.2.2 Дополнительная заработная плата',
        value: laborCosts.value.priceOfHourWithOthers.dopSalary,
      },
      {
        label: '2.2.3 Страховые взносы',
        value: laborCosts.value.priceOfHourWithOthers.insurancePrice,
      },
      {
        label: '2.2.4 Общепроизводственные затраты',
        value: laborCosts.value.priceOfHourWithOthers.overheadExpenses,
      },
      {
        label: '2.2.5 Общехозяйственные затраты',
        value: laborCosts.value.priceOfHourWithOthers.administrativeExpenses,
      },
    ],
  },
])

// Handler for opening calculation details
// This would typically navigate to a detailed calculation view or open a modal
const handleOpenCalculation = () => {
  if (!orderId.value) return
  router.push({
    name: 'personal-calc',
    query: { orderId: orderId.value.toString() },
  })
}

// Fetch order data from API
// Retrieves order information including calculation details and cost breakdown
const fetchOrder = async (id: number) => {
  if (!id || id === 0) return

  isLoading.value = true
  try {
    const response = await req_json_auth(`/orders/${id}`, 'GET')
    if (response?.ok) {
      const orderData = (await response.json()) as IOrderResponse

      // Map order data to component state
      // Set document number from order_id
      if (orderData.order_id) {
        documentNumber.value = `ФР-${orderData.order_id}`
      }

      // Map material costs from order data
      // Mapping follows the structure from specification: extracted_dimensions, mat_volume, mat_weight, price_per_kg, dop_mat_price
      if (orderData.total_price_breakdown?.mat_price_full !== undefined && orderData.total_price_breakdown?.mat_price_full !== null) {
        materialCosts.value.matPriceFull = `${orderData.total_price_breakdown.mat_price_full.toFixed(2)} руб`
      }
      if (orderData.total_price_breakdown?.mat_price !== undefined && orderData.total_price_breakdown?.mat_price !== null) {
        materialCosts.value.rawMaterials.matPrice = `${orderData.total_price_breakdown.mat_price.toFixed(2)} руб`
      }
      if (orderData.length && orderData.width && orderData.height) {
        materialCosts.value.rawMaterials.blankInfo.extractedDimensions = `${orderData.length} × ${orderData.width} × ${orderData.height}`
      }
      if (orderData.mat_volume !== undefined && orderData.mat_volume !== null) {
        // Конвертация из м³ в см³ (1 м³ = 1,000,000 см³)
        const volumeInCm3 = orderData.mat_volume * 1_000_000
        materialCosts.value.rawMaterials.blankInfo.matVolume = `${volumeInCm3.toFixed(2)} см³`
      }
      if (orderData?.mat_weight !== undefined && orderData?.mat_weight !== null) {
        materialCosts.value.rawMaterials.blankInfo.matWeight = `${orderData.mat_weight.toFixed(2)} кг`
      }
      if (orderData.total_price_breakdown?.price_per_kg !== undefined && orderData.total_price_breakdown?.price_per_kg !== null) {
        materialCosts.value.rawMaterials.pricePerKg = `${orderData.total_price_breakdown.price_per_kg.toFixed(2)} руб/кг`
      }
      if (orderData.total_price_breakdown?.dop_mat_price !== undefined && orderData.total_price_breakdown?.dop_mat_price !== null) {
        materialCosts.value.dopMatPrice = `${orderData.total_price_breakdown.dop_mat_price.toFixed(2)} руб`
      }

      // Map labor costs from order data
      // Mapping follows the structure from specification: sum_costs_labor, total_time, price_of_hour_with_others, work_price, dop_salary, insurance_price, overhead_expenses, administrative_expenses
      if (orderData.total_price_breakdown?.sum_costs_labor !== undefined && orderData.total_price_breakdown?.sum_costs_labor !== null) {
        laborCosts.value.sumCostsLabor = `${orderData.total_price_breakdown.sum_costs_labor.toFixed(2)} руб`
      }
      if (orderData.total_time !== undefined && orderData.total_time !== null) {
        laborCosts.value.totalTime = `${orderData.total_time.toFixed(2)} ч`
      }
      if (orderData.total_price_breakdown) {
        const breakdown = orderData.total_price_breakdown
        if (breakdown.price_of_hour_with_others !== undefined && breakdown.price_of_hour_with_others !== null) {
          laborCosts.value.priceOfHourWithOthers.priceOfHourWithOthers = `${breakdown.price_of_hour_with_others.toFixed(2)} руб/ч`
        }
        if (breakdown.work_price !== undefined && breakdown.work_price !== null) {
          laborCosts.value.priceOfHourWithOthers.workPrice = `${breakdown.work_price.toFixed(2)} руб`
        }
        if (breakdown.dop_salary !== undefined && breakdown.dop_salary !== null) {
          laborCosts.value.priceOfHourWithOthers.dopSalary = `${breakdown.dop_salary.toFixed(2)} руб`
        }
        if (breakdown.insurance_price !== undefined && breakdown.insurance_price !== null) {
          laborCosts.value.priceOfHourWithOthers.insurancePrice = `${breakdown.insurance_price.toFixed(2)} руб`
        }
        if (breakdown.overhead_expenses !== undefined && breakdown.overhead_expenses !== null) {
          laborCosts.value.priceOfHourWithOthers.overheadExpenses = `${breakdown.overhead_expenses.toFixed(2)} руб`
        }
        if (breakdown.administrative_expenses !== undefined && breakdown.administrative_expenses !== null) {
          laborCosts.value.priceOfHourWithOthers.administrativeExpenses = `${breakdown.administrative_expenses.toFixed(2)} руб`
        }
      }

      // Map tooling costs
      if (orderData.total_price_breakdown?.price_special_equipment_to_quantity !== undefined && orderData.total_price_breakdown?.price_special_equipment_to_quantity !== null) {
        toolingCosts.value = `${orderData.total_price_breakdown.price_special_equipment_to_quantity.toFixed(2)} руб`
      }

      // Set comment from special instructions if available
      if (orderData.special_instructions) {
        comment.value = orderData.special_instructions
      }
    } else {
      ElMessage.error('Не удалось загрузить данные заказа')
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    ElMessage.error('Ошибка при загрузке заказа')
  } finally {
    isLoading.value = false
  }
}

// Fetch order data when component is mounted
onMounted(() => {
  if (orderId.value && orderId.value > 0) {
    fetchOrder(orderId.value)
  }
})

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
      <div class="section-title">
        <span>1 Материальные затраты</span>
        <span class="section-value">{{ materialCosts.matPriceFull }}</span>
      </div>
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
      <div class="section-title">
        <span>2 Затраты на оплату труда</span>
        <span class="section-value">{{ laborCosts.sumCostsLabor }}</span>
      </div>
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
      <div class="section-title">
        <span>3 Затраты на специальную технологическую оснастку</span>
        <span class="section-value">{{ toolingCosts }}</span>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
}

.section-value {
  font-size: 15px;
  font-weight: 500;
  color: #606266;
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

