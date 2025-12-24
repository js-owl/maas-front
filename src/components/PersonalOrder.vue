<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import { req_json_auth } from '../api'
import type { IKit, IOrderResponse } from '../interfaces/order.interface'
import CadPreview from './cad/CadPreview.vue'
import CoefficientQuantity from './coefficients/CoefficientQuantity.vue'
import Button from './ui/Button.vue'
const route = useRoute()
const router = useRouter()

const order = ref<IKit | null>(null)
const isLoading = ref(false)
const hasError = ref(false)

const quantity = ref<number>(0)
const filename = ref<string>('')
const isEditingFilename = ref(false)
const editedFilename = ref('')

const deleteLoading = ref<number | null>(null)

const calcRows = ref<IOrderResponse[]>([])

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
  return formatPrice(order.value?.total_kit_price ?? 0)
})

const deliveryCost = computed(() => {
  // TODO: заменить на реальные данные о доставке
  return formatPrice(order.value?.delivery_price)
})

const totalWithDelivery = computed(() => {
  const total = (order.value?.total_kit_price ?? 0) + Number(deliveryCost.value)
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

// const fetchFilename = async (fileId: number): Promise<string | null> => {
//   if (!fileId) return null
//   try {
//     const response = await req_json_auth(`/files/${fileId}`, 'GET')
//     if (response?.ok) {
//       const fileInfo = (await response.json()) as { original_filename?: string; filename?: string }
//       return fileInfo.original_filename || fileInfo.filename || null
//     }
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error(`Error fetching filename for file ${fileId}:`, error)
//   }
//   return null
// }

const startEditFilename = () => {
  isEditingFilename.value = true
  editedFilename.value = filename.value
}

const saveFilename = () => {
  if (!order.value) {
    isEditingFilename.value = false
    return
  }

  const newName = editedFilename.value.trim()

  if (!newName) {
    editedFilename.value = filename.value
    isEditingFilename.value = false
    return
  }

  filename.value = newName
  order.value = {
    ...order.value,
    kit_name: newName,
  }

  isEditingFilename.value = false
}

const cancelEditFilename = () => {
  editedFilename.value = filename.value
  isEditingFilename.value = false
}

const loadCalcs = async () => {
  if (!order.value?.order_ids?.length) {
    calcRows.value = []
    return
  }

  try {
    const ids = order.value.order_ids

    const responses = await Promise.all(
      ids.map(async (id) => {
        const res = await req_json_auth(`/orders/${id}`, 'GET')
        if (!res?.ok) {
          throw new Error(`Failed to load calc order ${id}`)
        }
        return (await res.json()) as any
      })
    )

    calcRows.value = responses
    // .map(item =>{if(item == f return item} ) fetchFilename
  } catch (e) {
    console.error(e)
    ElMessage.error('Не удалось загрузить расчеты заказа')
  }
}

const loadOrder = async () => {
  isLoading.value = true
  hasError.value = false
  try {
    const res = await req_json_auth(`/kits/${orderId.value}`, 'GET')
    if (!res?.ok) throw new Error('Failed to load order')
    const data = (await res.json()) as IKit
    order.value = data
    quantity.value = data.quantity ?? 0
    filename.value = data.kit_name ?? ''
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
  console.log({ row })
  switch (row.service_id) {
    case 'cnc-lathe':
      router.push({
        path: '/machining',
        query: { orderId: row.order_id.toString() },
      })
      break
    case 'cnc-milling':
      router.push({
        path: '/milling',
        query: { orderId: row.order_id.toString() },
      })
      break
    case 'printing':
      router.push({
        path: '/printing',
        query: { orderId: row.order_id.toString() },
      })
      break
    default:
      router.push({
        path: '/machining',
        query: { orderId: row.order_id.toString() },
      })
      break
  }
}

const handleDelete = async (row: any): Promise<void> => {
  try {
    // Show confirmation dialog before deleting
    await ElMessageBox.confirm(
      `Вы уверены, что хотите удалить заказ #${row.order_id}?`,
      'Подтверждение удаления',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      }
    )

    deleteLoading.value = row.calc_id
    const r = await req_json_auth(`/orders/${row.order_id}`, 'DELETE')
    if (r?.ok) {
      ElMessage.success('Заказ успешно удален')
    } else {
      ElMessage.error('Ошибка при удалении заказа')
    }
  } catch (error: any) {
    if (error === 'cancel' || error === 'close' || error?.action === 'cancel') {
      return
    }
    console.error('Error deleting order:', error)
    ElMessage.error('Ошибка при удалении заказа')
  } finally {
    deleteLoading.value = null
  }
}

const goBack = () => {
  router.push({ path: '/personal/orders' })
}

const cancel = () => {
  console.log('cancel')
}

const addOrder = () => {
  if (!order.value) return

  const existingIds = Array.isArray(order.value.order_ids) ? order.value.order_ids : []

  router.push({
    path: '/machining',
    query: {
      orderId: '0',
      kitId: orderId.value.toString(),
      orderIds: existingIds.join(','),
    },
  })
}

const saveOrder = async () => {
  if (!order.value) return

  try {
    const res = await req_json_auth(`/kits/${orderId.value}`, 'PUT', {
      kit_name: order.value.kit_name,
      quantity: quantity.value,
    })

    if (!res?.ok) throw new Error('Failed to save order')

    ElMessage.success('Заказ сохранен')
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    ElMessage.error('Не удалось сохранить заказ')
  }
}

onMounted(() => {
  void loadOrder()
})
</script>

<template>
  <section class="personal-order">
    <el-row :gutter="20">
      <el-col :span="16">
        <!-- <el-card shadow="never" class="order-card"> -->
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
                <el-button text type="primary" size="small" @click="saveFilename"> ✓ </el-button>
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
            <CoefficientQuantity v-model="quantity" />
            <el-button class="calc-button">Калькуляция стоимости</el-button>
            <Button width="200px" @click="addOrder"> Add </Button>
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
            <template #default="{ row }">
              {{ row.order_id }}
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
              {{ row.order_name }}
            </template>
          </el-table-column>
          <el-table-column label="Кол-во, шт" width="100" align="center">
            <template #default="{ row }">
              {{ row.quantity }}
            </template>
          </el-table-column>
          <el-table-column label="Цена" width="120" align="right">
            <template #default="{ row }">
              {{ formatPrice(row.total_price) }}
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
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleDelete(row.row)"
                  :loading="deleteLoading === row.row.order_id"
                  :icon="Delete"
                  title="Удалить"
                  class="delete-button"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="order-footer">
          <Button width="200px" @click="goBack"> &lt; к списку </Button>
          <Button width="200px" @click="saveOrder"> Сохранить </Button>
        </div>
        <!-- </el-card> -->
      </el-col>

      <el-col :span="8">
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
            <div style="font-size: 16px; font-weight: 500">Доставка</div>
            <div style="font-size: 24px; font-weight: 600">
              {{ deliveryCost }} <span class="rub">руб.</span>
            </div>
          </div>

          <div class="summary-item total">
            <div style="font-size: 16px; font-weight: 500">Стоимость с учетом доставки</div>
            <div style="font-size: 36px; font-weight: 700">
              {{ totalWithDelivery }} <span class="rub">руб.</span>
            </div>
          </div>

          <div class="summary-actions">
            <Button @click="cancel"> Оплатить заказ </Button>
            <!-- <el-button type="primary" class="pay-button"> Оплатить заказ </el-button> -->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<style scoped>
.personal-order {
  min-height: 200px;
  background-color: white;
  /* margin: 0px 0 40px;*/
  padding: 20px 10px;
  border-radius: 20px;
  /* box-shadow: 0 12px 32px rgba(18, 24, 40, 0.12); */
}
.order-page {
  padding: 20px;
}

/* .order-card {
  background-color: #f7f8fa;
  border-radius: 16px;
  border: none;
} */

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
  font-size: 20px;
  font-weight: 500;
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
  /* align-items: flex-end; */
  gap: 8px;
}

.quantity-label {
  font-size: 16px;
  font-weight: 500;
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


.summary-card {
  background-color: #e9ecef;
  border-radius: 16px;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-item {
  display: block;
  /* justify-content: space-between;
  align-items: baseline; */
}

.summary-label {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}

.summary-value {
  font-size: 36px;
  font-weight: 700;
}

.summary-item.total {
  margin-top: 16px;
  margin-bottom: 80px;
}

.summary-total {
  font-size: 22px;
  font-weight: 700;
}

.rub {
  margin-left: 4px;
  font-size: 16px;
  font-weight: 500;
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
