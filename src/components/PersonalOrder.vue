<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { req_json_auth } from '../api'
import type { IOrderResponse } from '../interfaces/order.interface'
import CadPreview from './cad/CadPreview.vue'

const route = useRoute()
const router = useRouter()

const order = ref<IOrderResponse | null>(null)
const isLoading = ref(false)
const hasError = ref(false)

const quantity = ref<number>(0)

type OrderCalcRow = {
  id: number
  name: string
  quantity: number
  price: number
  file_id?: number | null
}

const calcRows = ref<OrderCalcRow[]>([])

const orderId = computed(() => {
  const fromQuery = route.query.orderId
  if (Array.isArray(fromQuery)) return Number(fromQuery[0])
  return Number(fromQuery)
})

const formatPrice = (value?: number | null): string => {
  if (value == null) return '0'
  const n = Number(value)
  if (Number.isNaN(n)) return '0'
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(Math.trunc(n))
}

const manufacturingCost = computed(() => {
  return formatPrice(order.value?.total_price ?? 0)
})

const deliveryCost = computed(() => {
  // TODO: заменить на реальные данные о доставке
  return formatPrice(1474)
})

const totalWithDelivery = computed(() => {
  const total = (order.value?.total_price ?? 0) + 1474
  return formatPrice(total)
})

const createdDate = computed(() => order.value?.created_at ?? '')
const completionDate = computed(() => order.value?.updated_at ?? '')

const loadCalcs = async () => {
  if (!order.value?.calc_ids?.length) {
    calcRows.value = []
    return
  }

  try {
    const ids = order.value.calc_ids

    const responses = await Promise.all(
      ids.map(async (id) => {
        const res = await req_json_auth(`/orders/${id}`, 'GET')
        if (!res?.ok) {
          throw new Error(`Failed to load calc order ${id}`)
        }
        return (await res.json()) as any
      })
    )

    calcRows.value = responses.map((item, index) => {
      const id = Number(item.id ?? item.order_id ?? ids[index] ?? index + 1)
      const name =
        item.detail_name ??
        item.order_name ??
        item.name ??
        item.title ??
        `деталь №${id}`
      const qty = Number(item.quantity ?? item.qty ?? item.k_quantity ?? 0) || 0
      const price = Number(item.price ?? item.detail_price ?? item.total_price ?? 0) || 0

      return {
        id,
        name,
        quantity: qty,
        price,
        file_id: item.file_id ?? null,
      }
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    ElMessage.error('Не удалось загрузить расчеты заказа')
  }
}

const loadOrder = async (orderData?: IOrderResponse | null) => {
  // Если данные переданы напрямую, используем их
  if (orderData) {
    order.value = orderData
    quantity.value = orderData.quantity ?? 0
    await loadCalcs()
    return
  }

  // Пытаемся получить данные из localStorage
  if (orderId.value && !Number.isNaN(orderId.value)) {
    const storageKey = `order_${orderId.value}`
    const storedData = localStorage.getItem(storageKey)
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as IOrderResponse
        order.value = parsedData
        quantity.value = parsedData.quantity ?? 0
        // Удаляем данные из localStorage после использования
        localStorage.removeItem(storageKey)
        await loadCalcs()
        return
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error parsing stored order data:', e)
        localStorage.removeItem(storageKey)
      }
    }
  }

  // Если данных нет в localStorage, загружаем с сервера (fallback)
  if (!orderId.value || Number.isNaN(orderId.value)) {
    hasError.value = true
    return
  }

  isLoading.value = true
  hasError.value = false
  try {
    const res = await req_json_auth(`/orders/${orderId.value}`, 'GET')
    if (!res?.ok) throw new Error('Failed to load order')
    const data = (await res.json()) as IOrderResponse
    order.value = data
    quantity.value = data.quantity ?? 0
    await loadCalcs()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    hasError.value = true
    ElMessage.error('Не удалось загрузить данные заказа')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push({ path: '/personal/orders' })
}

onMounted(() => {
  void loadOrder()
})
</script>

<template>
  <div class="order-page">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card shadow="never" class="order-card">
          <div class="order-header">
            <div class="order-title">
              <div class="order-name">Заказ {{ orderId || '' }}</div>
              <div class="order-subtitle">Стоимость изготовления</div>
              <div class="order-price">
                {{ manufacturingCost }}
                <span class="order-price-currency">руб</span>
              </div>
            </div>
            <div class="order-quantity">
              <div class="quantity-label">Количество</div>
              <el-input-number
                v-model="quantity"
                :min="1"
                :max="9999"
                controls-position="right"
                class="quantity-input"
              />
              <el-button class="calc-button">Калькуляция стоимости</el-button>
            </div>
          </div>

          <el-table
            :data="calcRows"
            class="details-table"
            :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
            v-loading="isLoading"
            empty-text="Нет данных по деталям"
          >
            <el-table-column prop="id" label="№" width="60">
              <template #default="{ row, $index }">
                {{ row.id || $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="file_id" label="Превью" width="120">
              <template #default="{ row }">
                <div v-if="row.file_id" class="model-preview">
                  <CadPreview :file-id="row.file_id" />
                </div>
                <div v-else class="preview-placeholder" />
              </template>
            </el-table-column>
            <el-table-column label="Наименование детали">
              <template #default="{ row }">
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column label="Количество, шт" width="140" align="center">
              <template #default="{ row }">
                {{ row.quantity }}
              </template>
            </el-table-column>
            <el-table-column label="Цена" width="120" align="right">
              <template #default="{ row }">
                {{ formatPrice(row.price) }}
              </template>
            </el-table-column>
            <el-table-column label="" width="90" align="center">
              <template #default>
                <el-button link type="primary" size="small">
                  <span class="icon-placeholder">✎</span>
                </el-button>
                <el-button link type="danger" size="small">
                  <span class="icon-placeholder">🗑</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="order-footer">
            <el-button class="back-button" @click="goBack">
              &lt; к списку
            </el-button>
            <el-button type="primary" class="pay-button">
              Оплатить заказ
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="never" class="summary-card">
          <div class="summary-item">
            <div class="summary-label">Доставка</div>
            <div class="summary-value">
              {{ deliveryCost }} <span class="rub">руб.</span>
            </div>
          </div>

          <div class="summary-item total">
            <div class="summary-label">Стоимость с учетом доставки</div>
            <div class="summary-total">
              {{ totalWithDelivery }} <span class="rub">руб.</span>
            </div>
          </div>

          <div class="dates-block">
            <div class="date-row">
              <span class="date-label">Дата создания</span>
              <span class="date-value">{{ createdDate }}</span>
            </div>
            <div class="date-row">
              <span class="date-label">Дата завершения</span>
              <span class="date-value">{{ completionDate }}</span>
            </div>
          </div>

          <div class="summary-actions">
            <el-button text class="small-delete">
              <span class="icon-placeholder">🗑</span>
            </el-button>
            <el-button type="primary" class="save-button">
              Сохранить
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.order-page {
  padding: 20px;
}

.order-card {
  background-color: #f7f8fa;
  border-radius: 16px;
  border: none;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.order-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-name {
  font-size: 18px;
  font-weight: 600;
}

.order-subtitle {
  font-size: 12px;
  color: #909399;
}

.order-price {
  font-size: 26px;
  font-weight: 700;
}

.order-price-currency {
  margin-left: 4px;
  font-size: 14px;
}

.order-quantity {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.quantity-label {
  font-size: 12px;
  color: #909399;
}

.quantity-input {
  width: 140px;
}

.calc-button {
  margin-top: 4px;
}

.details-table {
  margin-top: 10px;
}

.model-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.preview-placeholder {
  width: 60px;
  height: 60px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin: 4px auto;
}

.icon-placeholder {
  font-size: 14px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.back-button {
  border-radius: 24px;
}

.pay-button {
  border-radius: 24px;
}

.summary-card {
  background-color: #e9ecef;
  border-radius: 16px;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.summary-label {
  font-size: 13px;
  color: #606266;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
}

.summary-item.total {
  margin-top: 8px;
}

.summary-total {
  font-size: 22px;
  font-weight: 700;
}

.rub {
  margin-left: 4px;
  font-size: 13px;
}

.dates-block {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #d4d7de;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #606266;
}

.date-value {
  font-weight: 500;
}

.summary-actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.small-delete {
  padding: 8px;
}

.save-button {
  border-radius: 24px;
}

@media (max-width: 992px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .order-quantity {
    align-items: flex-start;
  }
}
</style>


