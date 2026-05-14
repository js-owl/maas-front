<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Download, Edit } from '@element-plus/icons-vue'
import { req_json_auth } from '../api'
import type { IOrderResponse } from '../interfaces/order.interface'
import ButtonRound from './ui/ButtonRound.vue'
import InputEdit from './ui/InputEdit.vue'
import IconArrowLeft from '@/icons/IconArrowLeft.vue'

const route = useRoute()
const router = useRouter()

const orderId = computed(() => Number(route.query.orderId) || 0)
const kitId = computed(() => Number(route.query.kitId) || 0)

const isLoading = ref(false)
const documentNumber = ref('ФР-159783')
const orderName = ref('Наименование заказа')

const materialCosts = ref({
  matPriceFull: '-',
  rawMaterials: {
    matPrice: '-',
    blankInfo: {
      extractedDimensions: '-',
      matVolume: '-',
      matWeight: '-',
    },
    pricePerKg: '-',
  },
  dopMatPrice: '-',
})

const laborCosts = ref({
  sumCostsLabor: '-',
  totalTime: '-',
  priceOfHourWithOthers: {
    priceOfHourWithOthers: '-',
    workPrice: '-',
    dopSalary: '-',
    insurancePrice: '-',
    overheadExpenses: '-',
    administrativeExpenses: '-',
  },
})

const toolingCosts = ref('-')
const priceWithoutVat = ref('-')
const vatCosts = ref('-')
const totalCosts = ref('-')

const costRows = computed(() => [
  { number: '1', label: 'Затраты на материалы', value: materialCosts.value.matPriceFull },
  { number: '2', label: 'Затраты на оплату труда', value: laborCosts.value.sumCostsLabor },
  { number: '3', label: 'Затраты на специальную технологическую оснастку', value: toolingCosts.value },
  { number: '4', label: 'Цена без НДС', value: priceWithoutVat.value },
  { number: '5', label: 'НДС', value: vatCosts.value },
])

const fetchOrder = async (id: number) => {
  if (!id) return

  isLoading.value = true
  try {
    const response = await req_json_auth(`/orders/${id}`, 'GET')
    if (!response?.ok) {
      ElMessage.error('Не удалось загрузить данные заказа')
      return
    }

    const orderData = (await response.json()) as IOrderResponse

    if (orderData.order_id) {
      documentNumber.value = `ФР-${orderData.order_id}`
    }
    if (orderData.order_name) {
      orderName.value = orderData.order_name
    }

    if (orderData.total_price_breakdown?.mat_price_full != null) {
      materialCosts.value.matPriceFull = `${orderData.total_price_breakdown.mat_price_full.toFixed(2)} руб`
    }
    if (orderData.total_price_breakdown?.mat_price != null) {
      materialCosts.value.rawMaterials.matPrice = `${orderData.total_price_breakdown.mat_price.toFixed(2)} руб`
    }
    if (orderData.length && orderData.width && orderData.height) {
      materialCosts.value.rawMaterials.blankInfo.extractedDimensions = `${orderData.length} × ${orderData.width} × ${orderData.height}`
    }
    if (orderData.mat_volume != null) {
      const volumeInCm3 = orderData.mat_volume * 1_000_000
      materialCosts.value.rawMaterials.blankInfo.matVolume = `${volumeInCm3.toFixed(2)} см³`
    }
    if (orderData.mat_weight != null) {
      materialCosts.value.rawMaterials.blankInfo.matWeight = `${orderData.mat_weight.toFixed(2)} кг`
    }
    if (orderData.total_price_breakdown?.price_per_kg != null) {
      materialCosts.value.rawMaterials.pricePerKg = `${orderData.total_price_breakdown.price_per_kg.toFixed(2)} руб/кг`
    }
    if (orderData.total_price_breakdown?.dop_mat_price != null) {
      materialCosts.value.dopMatPrice = `${orderData.total_price_breakdown.dop_mat_price.toFixed(2)} руб`
    }

    if (orderData.total_price_breakdown?.sum_costs_labor != null) {
      laborCosts.value.sumCostsLabor = `${orderData.total_price_breakdown.sum_costs_labor.toFixed(2)} руб`
    }
    if (orderData.total_time != null) {
      laborCosts.value.totalTime = `${orderData.total_time.toFixed(2)} ч`
    }
    if (orderData.total_price_breakdown?.price_of_hour_with_others != null) {
      laborCosts.value.priceOfHourWithOthers.priceOfHourWithOthers = `${orderData.total_price_breakdown.price_of_hour_with_others.toFixed(2)} руб/ч`
    }
    if (orderData.total_price_breakdown?.work_price != null) {
      laborCosts.value.priceOfHourWithOthers.workPrice = `${orderData.total_price_breakdown.work_price.toFixed(2)} руб`
    }
    if (orderData.total_price_breakdown?.dop_salary != null) {
      laborCosts.value.priceOfHourWithOthers.dopSalary = `${orderData.total_price_breakdown.dop_salary.toFixed(2)} руб`
    }
    if (orderData.total_price_breakdown?.insurance_price != null) {
      laborCosts.value.priceOfHourWithOthers.insurancePrice = `${orderData.total_price_breakdown.insurance_price.toFixed(2)} руб`
    }
    if (orderData.total_price_breakdown?.overhead_expenses != null) {
      laborCosts.value.priceOfHourWithOthers.overheadExpenses = `${orderData.total_price_breakdown.overhead_expenses.toFixed(2)} руб`
    }
    if (orderData.total_price_breakdown?.administrative_expenses != null) {
      laborCosts.value.priceOfHourWithOthers.administrativeExpenses = `${orderData.total_price_breakdown.administrative_expenses.toFixed(2)} руб`
    }

    if (orderData.total_price_breakdown?.price_special_equipment_to_quantity != null) {
      toolingCosts.value = `${orderData.total_price_breakdown.price_special_equipment_to_quantity.toFixed(2)} руб`
    }
    if (orderData.total_price != null) {
      priceWithoutVat.value = `${orderData.total_price.toFixed(2)} руб`
      totalCosts.value = `${orderData.total_price.toFixed(2)} руб`
    }
    if (orderData.total_price_breakdown?.taxes != null) {
      vatCosts.value = `${Number(orderData.total_price_breakdown.taxes).toFixed(2)} руб`
    }
    if (orderData.total_price_breakdown?.total_price_with_taxes != null) {
      totalCosts.value = `${Number(orderData.total_price_breakdown.total_price_with_taxes).toFixed(2)} руб`
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    ElMessage.error('Ошибка при загрузке заказа')
  } finally {
    isLoading.value = false
  }
}

const handleOrderNameUpdate = (value: string) => {
  orderName.value = value
}

const handleGoBack = () => {
  router.push({
    name: 'personal-calcs',
    query: { kitId: kitId.value?.toString() ?? '' },
  })
}

const handleEdit = () => {
  if (!orderId.value) return
  router.push({
    name: 'personal-calc',
    query: {
      kitId: kitId.value?.toString() ?? '',
      orderId: orderId.value.toString(),
    },
  })
}

const handleDownload = () => {
  ElMessage.info('Скачивание калькуляции будет доступно позже')
}

onMounted(() => {
  if (orderId.value > 0) {
    void fetchOrder(orderId.value)
  }
})
</script>

<template>
  <div class="calc-info-page" v-loading="isLoading">
    <section class="calc-info-container">
      <header class="calc-header">
        <div class="document-number">Заказ №{{ orderId }}</div>
        <InputEdit v-model="orderName" :font-size="'24px'" @update:model-value="handleOrderNameUpdate" />
      </header>

      <div class="cost-section">
        <div v-for="row in costRows" :key="`${row.number}-${row.label}`" class="cost-line">
          <span class="line-number">{{ row.number }}</span>
          <span class="line-label">{{ row.label }}</span>
          <span class="line-dash"></span>
          <span class="line-value">{{ row.value || '-' }}</span>
        </div>
      </div>

      <div class="total-section">
        <span class="total-label">Итого</span>
        <span class="section-line"></span>
        <span class="section-value">{{ totalCosts }}</span>
      </div>

      <footer class="action-section">
        <ButtonRound width="175px" @click="handleGoBack">
          <template #icon-left>
            <IconArrowLeft color="#2f3133" />
          </template>
          Назад
        </ButtonRound>
        <div class="right-actions">
          <ButtonRound width="220px" @click="handleEdit">
            <template #icon-left>
              <el-icon><Edit /></el-icon>
            </template>
            Редактировать
          </ButtonRound>
          <ButtonRound width="170px" @click="handleDownload">
            <template #icon-left>
              <el-icon><Download /></el-icon>
            </template>
            Скачать
          </ButtonRound>
        </div>
      </footer>
    </section>
  </div>
</template>

<style scoped>
/* .calc-info-page {
  background: #e1e4e6;
  padding: 24px 0 40px;
} */

.calc-info-container {
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  min-height: 620px;
  font-family: 'Montserrat-Medium', sans-serif;
  letter-spacing: 0;
}

.calc-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 40px;
}

.document-number {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  color: #000;
  letter-spacing: 0;
}

.cost-section {
  margin-bottom: 40px;
}

.total-section {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 60px;
}

.total-label {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  color: #000;
  letter-spacing: 0;
}

.section-head {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 10px;
}

.section-name {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  color: #000;
  letter-spacing: 0;
}

.section-line {
  flex: 1;
  border-bottom: 1px dashed #cbd1d5;
  transform: translateY(-4px);
}

.section-value {
  font-family: 'Montserrat-SemiBold', sans-serif;
  min-width: 70px;
  text-align: right;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  color: #000;
  white-space: nowrap;
  letter-spacing: 0;
}

.cost-line {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  margin-bottom: 0;
}

.line-number {
  font-family: 'Montserrat-Medium', sans-serif;
  width: 40px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  color: #000;
  letter-spacing: 0;
}

.line-label {
  font-family: 'Montserrat-Medium', sans-serif;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  color: #000;
  letter-spacing: 0;
}

.line-dash {
  flex: 1;
  min-width: 40px;
  border-bottom: 1px dashed #cbd1d5;
  transform: translateY(8px);
}

.line-value {
  font-family: 'Montserrat-Medium', sans-serif;
  min-width: 90px;
  text-align: right;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  color: #000;
  word-break: break-word;
  white-space: nowrap;
  letter-spacing: 0;
}

.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.right-actions {
  display: flex;
  gap: 20px;
}

.action-section :deep(.btn) {
  background: #cbd1d5 !important;
  background-size: 100% 100% !important;
  border-radius: 30px !important;
  box-shadow: none !important;
  color: #000 !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  letter-spacing: 0 !important;
}

.action-section :deep(.btn:hover),
.action-section :deep(.btn:active) {
  transform: none !important;
  box-shadow: none !important;
  animation: none !important;
}

.action-section :deep(.btn::before) {
  display: none !important;
}

.action-section :deep(.el-icon) {
  font-size: 18px;
}

.action-section :deep(.btn-icon-left) {
  transform: translateY(-1px);
}

@media (max-width: 1200px) {
  .calc-info-container {
    padding: 24px;
  }

  .action-section {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .right-actions {
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .section-name,
  .section-value,
  .document-number,
  .total-label {
    font-size: 20px;
  }

  .line-number,
  .line-label,
  .line-value {
    font-size: 16px;
  }

  .right-actions {
    flex-direction: column;
    gap: 12px;
  }

  .action-section :deep(.btn) {
    width: 100% !important;
  }
}
</style>
