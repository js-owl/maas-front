<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { req_json_auth } from '../api'
import Button from './ui/Button.vue'

type CalculationOrderRow = {
  order_id: number
  order_name: string
  order_code: string
  quantity: number
  unit_price: number
  total_price: number
  taxes: number
  total_kit_price_with_taxes: number
}

type CalculationSummary = {
  kit_id: number
  kit_name: string
  kit_quantity: number
  orders: CalculationOrderRow[]
  total_kit_price_with_taxes: number
}

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const summary = ref<CalculationSummary | null>(null)
const calcRows = ref<CalculationOrderRow[]>([])

const kitId = computed(() => {
  const fromQuery = route.query.kitId
  if (Array.isArray(fromQuery)) return Number(fromQuery[0])
  return Number(fromQuery)
})

const formatMoney = (value?: number | null): string => {
  if (value == null) return '0,00'
  const n = Number(value)
  if (Number.isNaN(n)) return '0,00'
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

const getNetUnitPrice = (row: CalculationOrderRow): number => {
  return row.unit_price ?? 0
}

const getNetTotal = (row: CalculationOrderRow): number => {
  const quantity = row.quantity || 1
  return getNetUnitPrice(row) * quantity
}

const getVat = (row: CalculationOrderRow): number => {
  return row.taxes ?? 0
}

const getTotalWithVat = (row: CalculationOrderRow): number => {
  return row.total_kit_price_with_taxes ?? getNetTotal(row) + getVat(row)
}

const totalWithVatAll = computed(() => {
  if (summary.value) return summary.value.total_kit_price_with_taxes
  return calcRows.value.reduce((sum, row) => sum + getTotalWithVat(row), 0)
})

const loadSummary = async () => {
  if (!kitId.value) return

  isLoading.value = true

  try {
    const res = await req_json_auth(`/kits/${kitId.value}/calculation_summary`, 'GET')
    if (!res?.ok) throw new Error('Failed to load calculation summary')
    const data = (await res.json()) as CalculationSummary
    summary.value = data
    calcRows.value = data.orders ?? []
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    ElMessage.error('Не удалось загрузить итоговую калькуляцию заказа')
  } finally {
    isLoading.value = false
  }
}

const handleOpenCalculation = (row: CalculationOrderRow): void => {
  if (!row?.order_id) return
  router.push({
    name: 'personal-calc',
    query: { kitId: kitId.value?.toString() ?? '', orderId: row.order_id.toString() },
  })
}

const handleBackToOrder = () => {
  router.push({
    name: 'personal-order',
    query: { kitId: kitId.value?.toString() ?? '' },
  })
}

const handleDownload = () => {
  // Заглушка для скачивания итоговой калькуляции
  // Здесь позже можно добавить реальный вызов API
  ElMessage.info('Скачивание итоговой калькуляции будет доступно позже')
}

onMounted(() => {
  void loadSummary()
})
</script>

<template>
  <section class="personal-calcs">
    <div class="page-header">
      <div class="page-title">
        <div class="order-number">Заказ №{{ kitId }}</div>
        <div class="order-name">{{ summary?.kit_name || 'Наименование заказа' }}</div>
      </div>
    </div>

    <el-table
      :data="calcRows"
      style="width: 100%; margin-top: 16px;"
      :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
      v-loading="isLoading"
      empty-text="Нет данных по деталям"
    >
      <el-table-column type="index" label="№" width="60" />
      <el-table-column prop="order_code" label="Обозначение" min-width="180">
        <template #default="{ row }">
          <span class="order-code" @click="handleOpenCalculation(row)">
            {{ row.order_code }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="order_name" label="Наименование" min-width="200" />
      <el-table-column prop="quantity" label="Кол-во, шт" width="110" align="center">
        <template #default="{ row }">
          {{ row.quantity || 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Калькуляция" width="130" align="center">
        <template #default>
          <span class="calc-icon" />
        </template>
      </el-table-column>
      <el-table-column label="Цена за ед. без НДС, руб." min-width="180" align="right">
        <template #default="{ row }">
          {{ formatMoney(getNetUnitPrice(row)) }}
        </template>
      </el-table-column>
      <el-table-column label="Стоимость без НДС, руб." min-width="180" align="right">
        <template #default="{ row }">
          {{ formatMoney(getNetTotal(row)) }}
        </template>
      </el-table-column>
      <el-table-column label="НДС 20%, руб." min-width="160" align="right">
        <template #default="{ row }">
          {{ formatMoney(getVat(row)) }}
        </template>
      </el-table-column>
      <el-table-column label="Стоимость с НДС, руб." min-width="190" align="right">
        <template #default="{ row }">
          {{ formatMoney(getTotalWithVat(row)) }}
        </template>
      </el-table-column>
    </el-table>

    <div class="summary-row">
      <div class="summary-spacer" />
      <div class="summary-total">
        <span class="summary-label">ИТОГО</span>
        <span class="summary-value">{{ formatMoney(totalWithVatAll) }}</span>
      </div>
    </div>

    <div class="actions">
      <Button class="back-button" @click="handleBackToOrder">
        &lt; Вернуться в Заказ
      </Button>
      <Button class="download-button" @click="handleDownload">
        Скачать
      </Button>
    </div>
  </section>
</template>

<style scoped>
.personal-calcs {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 20px 10px 32px;
  border-radius: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.page-title {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-number {
  font-size: 16px;
  font-weight: 500;
}

.order-name {
  font-size: 24px;
  font-weight: 600;
}

.order-code {
  cursor: pointer;
  transition: color 0.2s;
}

.order-code:hover {
  text-decoration: underline;
}

.calc-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: #e4e7ed;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.summary-spacer {
  flex: 1;
}

.summary-total {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 700;
  color: #e53935;
}

.summary-label {
  text-transform: uppercase;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.back-button :deep(.btn) {
  min-width: 200px;
}

.download-button :deep(.btn) {
  min-width: 160px;
}

@media (max-width: 768px) {
  .actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .back-button :deep(.btn),
  .download-button :deep(.btn) {
    width: 100% !important;
  }
}
</style>

