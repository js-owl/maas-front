<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { req_json_auth } from '../api'
import type { IOrderResponse } from '../interfaces/order.interface'
import { orderTypeOptions } from '../helpers/order-type-options'
import arrowLeftIcon from '@/assets/calc-info/arrow-left.svg'
import downloadIcon from '@/assets/calc-info/download.svg'

const route = useRoute()
const router = useRouter()

const orderId = computed(() => Number(route.query.orderId) || 0)
const kitId = computed(() => Number(route.query.kitId) || 0)

const isLoading = ref(false)
const serviceId = ref('')

const processingType = computed(() => {
  const id = serviceId.value
  if (!id) return ''

  const match = orderTypeOptions.find((option) => option.serviceId === id)
  if (match) return match.label

  if (id.startsWith('electroplating')) {
    return orderTypeOptions.find((option) => option.value === 'galvanic')?.label ?? ''
  }

  return ''
})

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
const netCost = ref('-')
const profit = ref('-')
const priceWithoutVat = ref('-')
const vatCosts = ref('-')
const priceWithVat = ref('-')
const totalCosts = ref('-')

const formatPrice = (value?: number | string | null) => {
  if (value == null || value === '') return '-'
  const num = Number(value)
  if (Number.isNaN(num)) return '-'
  return num.toFixed(2)
}

const costRows = computed(() => [
  { number: '1', label: 'Затраты на материалы, руб', value: materialCosts.value.matPriceFull, nested: false },
  { number: '2', label: 'Затраты на оплату труда, руб', value: laborCosts.value.sumCostsLabor, nested: false },
  { number: '2.1', label: 'Основная заработная плата, руб', value: laborCosts.value.priceOfHourWithOthers.workPrice, nested: true },
  { number: '2.2', label: 'Дополнительная заработная плата, руб', value: laborCosts.value.priceOfHourWithOthers.dopSalary, nested: true },
  { number: '2.3', label: 'Трудоёмкость, ч', value: laborCosts.value.totalTime, nested: true },
  { number: '2.4', label: 'Стоимость нормочаса, руб/ч', value: laborCosts.value.priceOfHourWithOthers.priceOfHourWithOthers, nested: true },
  { number: '3', label: 'Страховые взносы, руб', value: laborCosts.value.priceOfHourWithOthers.insurancePrice, nested: false },
  { number: '4', label: 'Затраты на специальную технологическую оснастку, руб', value: toolingCosts.value, nested: false },
  { number: '5', label: 'Общепроизводственные затраты, руб', value: laborCosts.value.priceOfHourWithOthers.overheadExpenses, nested: false },
  { number: '6', label: 'Общехозяйственные затраты, руб', value: laborCosts.value.priceOfHourWithOthers.administrativeExpenses, nested: false },
  { number: '7', label: 'Себестоимость, руб', value: netCost.value, nested: false },
  { number: '8', label: 'Прибыль, руб', value: profit.value, nested: false },
  { number: '9', label: 'Цена (без НДС), руб', value: priceWithoutVat.value, nested: false },
  { number: '10', label: 'НДС, руб', value: vatCosts.value, nested: false },
  { number: '11', label: 'Цена (с НДС), руб', value: priceWithVat.value, nested: false },
])

const applyOrder = (orderData: IOrderResponse) => {
  if (orderData.service_id) {
    serviceId.value = orderData.service_id
  }

    const breakdown = orderData.total_price_breakdown

    if (breakdown?.mat_price_full != null) {
      materialCosts.value.matPriceFull = formatPrice(breakdown.mat_price_full)
    }
    if (breakdown?.mat_price != null) {
      materialCosts.value.rawMaterials.matPrice = formatPrice(breakdown.mat_price)
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
    if (breakdown?.price_per_kg != null) {
      materialCosts.value.rawMaterials.pricePerKg = `${formatPrice(breakdown.price_per_kg)} руб/кг`
    }
    if (breakdown?.dop_mat_price != null) {
      materialCosts.value.dopMatPrice = formatPrice(breakdown.dop_mat_price)
    }

    if (breakdown?.sum_costs_labor != null) {
      laborCosts.value.sumCostsLabor = formatPrice(breakdown.sum_costs_labor)
    }
    if (orderData.total_time != null) {
      laborCosts.value.totalTime = orderData.total_time.toFixed(2)
    }
    if (breakdown?.price_of_hour != null) {
      laborCosts.value.priceOfHourWithOthers.priceOfHourWithOthers = formatPrice(breakdown.price_of_hour)
    }
    if (breakdown?.work_price != null) {
      laborCosts.value.priceOfHourWithOthers.workPrice = formatPrice(breakdown.work_price)
    }
    if (breakdown?.dop_salary != null) {
      laborCosts.value.priceOfHourWithOthers.dopSalary = formatPrice(breakdown.dop_salary)
    }
    if (breakdown?.insurance_price != null) {
      laborCosts.value.priceOfHourWithOthers.insurancePrice = formatPrice(breakdown.insurance_price)
    }
    if (breakdown?.overhead_expenses != null) {
      laborCosts.value.priceOfHourWithOthers.overheadExpenses = formatPrice(breakdown.overhead_expenses)
    }
    if (breakdown?.administrative_expenses != null) {
      laborCosts.value.priceOfHourWithOthers.administrativeExpenses = formatPrice(breakdown.administrative_expenses)
    }
    if (breakdown?.net_cost != null) {
      netCost.value = formatPrice(breakdown.net_cost)
    }
    if (breakdown?.profit != null) {
      profit.value = formatPrice(breakdown.profit)
    }
    if (breakdown?.price_special_equipment_to_quantity != null) {
      toolingCosts.value = formatPrice(breakdown.price_special_equipment_to_quantity)
    }

    const detailPriceCalculation = orderData.detail_price_calculation
    if (detailPriceCalculation?.material_price != null && detailPriceCalculation.material_price !== '') {
      materialCosts.value.matPriceFull = formatPrice(detailPriceCalculation.material_price)
    }
    if (detailPriceCalculation?.salary_fund_with_taxes != null && detailPriceCalculation.salary_fund_with_taxes !== '') {
      laborCosts.value.sumCostsLabor = formatPrice(detailPriceCalculation.salary_fund_with_taxes)
    }
    if (detailPriceCalculation?.price_special_equipment != null && detailPriceCalculation.price_special_equipment !== '') {
      toolingCosts.value = formatPrice(detailPriceCalculation.price_special_equipment)
    }
    priceWithoutVat.value = formatPrice(detailPriceCalculation?.detail_price_one ?? orderData.total_price)
    vatCosts.value = formatPrice(detailPriceCalculation?.taxes ?? breakdown?.taxes)
    priceWithVat.value = formatPrice(detailPriceCalculation?.detail_price_one_with_taxes ?? breakdown?.total_price_with_taxes)
    totalCosts.value = priceWithVat.value
}

const fetchOrder = async (id: number) => {
  if (!id) return

  isLoading.value = true
  try {
    const response = await req_json_auth(`/orders/${id}`, 'GET')
    if (!response?.ok) {
      ElMessage.error('Не удалось загрузить данные заказа')
      return
    }

    applyOrder((await response.json()) as IOrderResponse)
  } catch (error) {
    console.error('Error fetching order:', error)
    ElMessage.error('Ошибка при загрузке заказа')
  } finally {
    isLoading.value = false
  }
}

const calculationFromState = (): IOrderResponse | null => {
  const calculation = history.state?.calculation
  if (!calculation || typeof calculation !== 'object') return null
  return calculation as IOrderResponse
}

const handleGoBack = () => {
  if (calculationFromState() || (!kitId.value && !orderId.value)) {
    router.back()
    return
  }

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
  const stateServiceId = history.state?.serviceId
  if (typeof stateServiceId === 'string' && stateServiceId) {
    serviceId.value = stateServiceId
  }

  const calculation = calculationFromState()
  if (calculation) {
    applyOrder(calculation)
    return
  }

  if (orderId.value > 0) {
    void fetchOrder(orderId.value)
  }
})
</script>

<template>
  <div class="calc-info-page" v-loading="isLoading">
    <section class="calc-info-container">
      <div class="calc-info-body">
        <div class="calc-info-main">
          <header class="calc-header">
            <div v-if="kitId" class="document-number">Заказ №{{ kitId }}</div>
            <div v-if="processingType" class="processing-type">{{ processingType }}</div>
          </header>

          <div class="cost-block">
            <div class="cost-list">
              <div
                v-for="row in costRows"
                :key="row.number"
                class="cost-line"
                :class="{ 'cost-line--nested': row.nested }"
              >
                <span class="line-number">{{ row.number }}</span>
                <span class="line-label">{{ row.label }}</span>
                <span class="line-dash" aria-hidden="true"></span>
                <span class="line-value">{{ row.value || '-' }}</span>
              </div>
            </div>

            <div class="total-section">
              <span class="total-label">Итого, руб</span>
              <span class="line-dash" aria-hidden="true"></span>
              <span class="total-value">{{ totalCosts }}</span>
            </div>
          </div>
        </div>

        <footer class="action-section">
          <button type="button" class="action-btn" @click="handleGoBack">
            <img :src="arrowLeftIcon" width="20" height="20" alt="" />
            Вернуться в Заказ
          </button>
          <button type="button" class="action-btn" @click="handleDownload">
            Скачать
            <img :src="downloadIcon" width="20" height="20" alt="" />
          </button>
        </footer>
      </div>
    </section>
  </div>
</template>

<style scoped>
.calc-info-page {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.calc-info-container {
  background: #fff;
  padding: 40px;
  border-radius: 40px;
  box-shadow: 0 6px 7.5px rgba(224, 227, 237, 0.5);
  font-family: 'Montserrat-Medium', sans-serif;
  letter-spacing: 0;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.calc-info-body {
  display: flex;
  flex-direction: column;
  gap: 80px;
  width: 100%;
}

.calc-info-main {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  min-width: 0;
}

.calc-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  width: 100%;
}

.processing-type {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.4;
  color: #000;
  word-break: break-word;
}

.document-number {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  color: #000;
  letter-spacing: 0;
}

.cost-block {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  min-width: 0;
}

.cost-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.cost-line,
.total-section {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.cost-line--nested {
  padding-left: 30px;
  box-sizing: border-box;
}

.line-number {
  font-family: 'Montserrat-Medium', sans-serif;
  width: 30px;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: #000;
  letter-spacing: 0;
}

.line-label {
  font-family: 'Montserrat-Medium', sans-serif;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: #000;
  letter-spacing: 0;
  flex-shrink: 0;
}

.line-dash {
  flex: 1;
  min-width: 12px;
  height: 0;
  border-bottom: 2px dashed #cbd1d5;
}

.line-value {
  font-family: 'Montserrat-Medium', sans-serif;
  text-align: right;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: #000;
  white-space: nowrap;
  letter-spacing: 0;
  flex-shrink: 0;
}

.total-label,
.total-value {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  color: #000;
  letter-spacing: 0;
  flex-shrink: 0;
}

.total-value {
  text-align: right;
}

.action-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-height: 44px;
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  background: #cbd1d5;
  color: #000;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  cursor: pointer;
}

.action-btn img {
  display: block;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .calc-info-container {
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 0 5px #c8cfe3;
  }

  .calc-info-body {
    gap: 24px;
  }

  .calc-info-main,
  .cost-block {
    gap: 24px;
  }

  .calc-header {
    gap: 8px;
  }

  .document-number {
    font-size: 12px;
    line-height: normal;
  }

  .processing-type {
    font-size: 16px;
    line-height: normal;
  }

  .cost-list {
    gap: 0;
  }

  .cost-line {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr) max-content;
    align-items: start;
    column-gap: 8px;
    padding: 12px 0;
    border-bottom: 1px solid #e8ecef;
  }

  .cost-line--nested {
    padding-left: 16px;
  }

  .line-number {
    width: auto;
    font-size: 14px;
    line-height: 1.35;
  }

  .line-label {
    white-space: normal;
    font-size: 14px;
    line-height: 1.35;
    min-width: 0;
  }

  .line-dash {
    display: none;
  }

  .line-value {
    font-size: 14px;
    line-height: 1.35;
  }

  .total-section {
    justify-content: space-between;
    padding-top: 8px;
  }

  .total-label,
  .total-value {
    font-size: 16px;
    line-height: normal;
  }

  .action-section {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .action-btn {
    width: 100%;
    max-height: 44px;
  }
}
</style>
