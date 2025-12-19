<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { req_json_auth } from '../api'
import type { IOrderResponse } from '../interfaces/order.interface'
import CadPreview from './cad/CadPreview.vue'

const route = useRoute()
const router = useRouter()

const order = ref<IOrderResponse | null>(null)
const isLoading = ref(false)
const hasError = ref(false)

const quantity = ref<number>(0)
const filename = ref<string>('')
const isEditingFilename = ref(false)
const editedFilename = ref('')

type CalcRow = {
  calc_id: number
  calc_name: string
  calc_qty: number
  calc_price: number
  file_id?: number | null
}

const calcRows = ref<CalcRow[]>([])

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

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

const createdDate = computed(() => formatDate(order.value?.created_at))
const completionDate = computed(() => formatDate(order.value?.updated_at))

const fetchFilename = async (fileId: number): Promise<string | null> => {
  if (!fileId) return null
  try {
    const response = await req_json_auth(`/files/${fileId}`, 'GET')
    if (response?.ok) {
      const fileInfo = (await response.json()) as { original_filename?: string; filename?: string }
      return fileInfo.original_filename || fileInfo.filename || null
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching filename for file ${fileId}:`, error)
  }
  return null
}

const loadFilename = async () => {
  if (order.value?.file_id) {
    const name = await fetchFilename(order.value.file_id)
    if (name) {
      filename.value = name
      editedFilename.value = name
    }
  }
}

const startEditFilename = () => {
  isEditingFilename.value = true
  editedFilename.value = filename.value
}

const saveFilename = () => {
  filename.value = editedFilename.value
  isEditingFilename.value = false
  // TODO: сохранить имя файла на сервере
}

const cancelEditFilename = () => {
  editedFilename.value = filename.value
  isEditingFilename.value = false
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  if (quantity.value < 9999) {
    quantity.value++
  }
}

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
      const calc_id = Number(item.id ?? item.order_id ?? ids[index] ?? index + 1)
      const calc_service_id = item.service_id ?? ''
      const calc_name =`деталь №${calc_id}`
      const calc_qty = Number(item.quantity ?? 0) || 0
      const calc_price = Number(item.total_price ?? 0) || 0

      return {
        calc_id,
        calc_service_id,
        calc_name,
        calc_qty,
        calc_price,
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
    await loadFilename()
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
        await loadFilename()
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
    await loadFilename()
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

const handleEdit = (row: any): void => {
  console.log({row})
  switch (row.calc_service_id) {
    case 'cnc-lathe':
      router.push({
        path: '/machining',
        query: { orderId: row.calc_id.toString() },
      })
      break
    case 'cnc-milling':
      router.push({
        path: '/milling',
        query: { orderId: row.calc_id.toString() },
      })
      break
    case 'printing':
      router.push({
        path: '/printing',
        query: { orderId: row.calc_id.toString() },
      })
      break
    default:
      router.push({
        path: '/machining',
        query: { orderId: row.calc_id.toString() },
      })
      break
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
              <div class="order-name-wrapper">
                <div v-if="!isEditingFilename" class="order-name">
                  {{ filename || 'Загрузка...' }}
                  <el-button
                    text
                    type="primary"
                    :icon="Edit"
                    class="edit-name-btn"
                    @click="startEditFilename"
                  />
                </div>
                <div v-else class="order-name-edit">
                  <el-input
                    v-model="editedFilename"
                    class="filename-input"
                    @keyup.enter="saveFilename"
                    @keyup.esc="cancelEditFilename"
                  />
                  <el-button text type="primary" size="small" @click="saveFilename">
                    ✓
                  </el-button>
                  <el-button text type="danger" size="small" @click="cancelEditFilename">
                    ✕
                  </el-button>
                </div>
              </div>
              <div class="order-subtitle">Стоимость изготовления</div>
              <div class="order-price">
                {{ manufacturingCost }}
                <span class="order-price-currency">руб.</span>
              </div>
            </div>
            <div class="order-quantity">
              <div class="quantity-label">Количество</div>
              <div class="quantity-controls">
                <el-button class="quantity-btn" @click="decreaseQuantity">-</el-button>
                <el-input
                  v-model.number="quantity"
                  type="number"
                  :min="1"
                  :max="9999"
                  class="quantity-input-simple"
                />
                <el-button class="quantity-btn" @click="increaseQuantity">+</el-button>
              </div>
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
                {{ row.calc_id || $index + 1 }}
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
                {{ row.calc_name }}
              </template>
            </el-table-column>
            <el-table-column label="Количество, шт" width="140" align="center">
              <template #default="{ row }">
                {{ row.calc_qty }}
              </template>
            </el-table-column>
            <el-table-column label="Цена" width="120" align="right">
              <template #default="{ row }">
                {{ formatPrice(row.calc_price) }}
              </template>
            </el-table-column>
            <el-table-column label="" width="90" align="center">
              <template #default="row">
                <div class="action-buttons">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="handleEdit(row.row)"
                    :icon="Edit"
                    title="Редактировать"
                  />
                  <!-- <el-button
                    link
                    type="primary"
                    size="small"
                    @click="handleDelete(scope.row)"
                    :loading="deleteLoading === scope.row.order_id"
                    :icon="Delete"
                    title="Удалить"
                    class="delete-button"
                  /> -->
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="order-footer">
            <el-button class="back-button" @click="goBack">
              &lt; к списку
            </el-button>
            <el-button type="primary" class="save-button-footer">
              Сохранить
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="never" class="summary-card">
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

          <div class="summary-actions">
            <el-button type="primary" class="pay-button">
              Оплатить заказ
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

.order-name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-name {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-name-btn {
  padding: 4px;
  min-height: auto;
}

.order-name-edit {
  display: flex;
  align-items: center;
  gap: 4px;
}

.filename-input {
  flex: 1;
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

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-input-simple {
  width: 80px;
}

.quantity-input-simple :deep(.el-input__inner) {
  text-align: center;
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
  width: 100%;
}

.save-button-footer {
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
  margin-top: 16px;
  margin-bottom: 16px;
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
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #d4d7de;
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
  justify-content: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-buttons :deep(.el-button) {
  padding: 4px 8px;
  color: #606266;
}

.action-buttons :deep(.el-button:hover) {
  color: #409eff;
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


