<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Download, Edit } from '@element-plus/icons-vue'
import { req_json_auth } from '../api'
import ButtonRound from './ui/ButtonRound.vue'
import IconCalculate from '../icons/IconCalculate.vue'
import IconArrowLeft from '@/icons/IconArrowLeft.vue'

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

const handleOpenCalcInfo = (row: CalculationOrderRow): void => {
  if (!row?.order_id) return
  router.push({
    name: 'personal-calc-info',
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
    <div class="calcs-card">
      <div class="page-header">
        <div class="page-title">
          <div class="order-number">Заказ №{{ kitId }}</div>
          <div class="order-name-row">
            <div class="order-name">{{ summary?.kit_name || 'Наименование заказа' }}</div>
            <el-icon class="order-edit-icon">
              <Edit />
            </el-icon>
          </div>
        </div>
      </div>

      <el-table
        class="calcs-table"
        :data="calcRows"
        v-loading="isLoading"
        empty-text="Нет данных по деталям"
      >
        <el-table-column type="index" label="№" width="50" />
        <el-table-column prop="order_code" label="Обозначение" min-width="180">
          <template #default="{ row }">
            <span class="order-code" @click="handleOpenCalculation(row)">
              {{ row.order_code }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="order_name" label="Наименование" min-width="200" />
        <el-table-column prop="quantity" label="Кол-во, шт" width="90" align="center">
          <template #default="{ row }">
            {{ row.quantity || 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Калькуляция" width="110" align="center">
          <template #default="{ row }">
            <button type="button" class="calc-icon-button" @click="handleOpenCalcInfo(row)">
              <IconCalculate class="calc-icon" />
            </button>
          </template>
        </el-table-column>
        <el-table-column label="Цена за ед. без НДС, руб." min-width="132" align="right">
          <template #default="{ row }">
            {{ formatMoney(getNetUnitPrice(row)) }}
          </template>
        </el-table-column>
        <el-table-column label="Стоимость без НДС, руб." min-width="132" align="right">
          <template #default="{ row }">
            {{ formatMoney(getNetTotal(row)) }}
          </template>
        </el-table-column>
        <el-table-column label="НДС 20%, руб." min-width="126" align="right">
          <template #default="{ row }">
            {{ formatMoney(getVat(row)) }}
          </template>
        </el-table-column>
        <el-table-column label="Стоимость с НДС, руб." min-width="157" align="right">
          <template #default="{ row }">
            {{ formatMoney(getTotalWithVat(row)) }}
          </template>
        </el-table-column>
        <template #append>
          <div class="table-append-total">
            <span class="table-append-total__label">ИТОГО</span>
            <span class="table-append-total__value">{{ formatMoney(totalWithVatAll) }}</span>
          </div>
        </template>
      </el-table>

      <div class="actions">
        <ButtonRound width="300px" @click="handleBackToOrder">
          <template #icon-left>
            <IconArrowLeft color="#2f3133" />
          </template>
          Вернуться в Заказ
        </ButtonRound>
        <ButtonRound width="300px" @click="handleDownload">
          <template #icon-left>
            <el-icon><Download /></el-icon>
          </template>
          Скачать
        </ButtonRound>
      </div>
    </div>
  </section>
</template>

<style scoped>
.personal-calcs {
  min-height: 100vh;
  background-color: var(--bgcolor);
  padding: 24px 0 40px;
}

.calcs-card {
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 15px 0 var(--button-bg);
  padding: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}

.page-title {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-number {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  color: #000;
}

.order-name-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.order-name {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  color: #000;
}

.order-edit-icon {
  color: #7d8083;
  font-size: 18px;
}

.calcs-table {
  width: 100%;
  --el-table-header-bg-color: var(--bgcolor);
  --el-table-border-color: var(--bgcolor);
  --el-table-text-color: #000;
  --el-table-row-hover-bg-color: #fff;
}

.calcs-table :deep(.el-table__header-wrapper th.el-table__cell) {
  background-color: var(--bgcolor) !important;
  color: #000;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  padding: 12px 10px;
}

.calcs-table :deep(.el-table__body-wrapper td.el-table__cell) {
  color: #000;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  padding: 26px 10px;
  border-bottom: 1px solid var(--bgcolor);
}

.calcs-table :deep(.el-table__body .el-table__row td:first-child .cell) {
  color: #7d8083;
}

.order-code {
  cursor: pointer;
  transition: color 0.2s;
}

.order-code:hover {
  text-decoration: underline;
}

.calc-icon-button {
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
  cursor: pointer;
}

.calc-icon {
  display: inline-block;
  width: 26px;
  height: 26px;
}

.table-append-total {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 38px;
  width: 100%;
  box-sizing: border-box;
  padding: 26px 10px 0;
}

.table-append-total__label,
.table-append-total__value {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: var(--custom-red);
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
}

.actions :deep(.btn) {
  background: var(--button-bg) !important;
  background-size: 100% 100% !important;
  border-radius: 30px !important;
  box-shadow: none !important;
  color: #000 !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  letter-spacing: 0 !important;
}

.actions :deep(.btn:hover),
.actions :deep(.btn:active) {
  transform: none !important;
  box-shadow: none !important;
  animation: none !important;
}

.actions :deep(.btn::before) {
  display: none !important;
}

.actions :deep(.el-icon) {
  font-size: 18px;
}

@media (max-width: 1200px) {
  .calcs-card {
    padding: 24px;
  }

  .actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  .personal-calcs {
    padding: 0 0 24px;
  }

  .calcs-card {
    border-radius: 0;
    padding: 20px;
  }

  .order-number,
  .order-name {
    font-size: 20px;
  }

  .table-append-total {
    gap: 16px;
    padding-top: 20px;
  }

  .actions :deep(.btn) {
    width: 100% !important;
  }
}
</style>

