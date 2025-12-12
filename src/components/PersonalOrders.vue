<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { req_json_auth } from '../api'
import type { IOrderResponse } from '../interfaces/order.interface'
import CadPreview from './cad/CadPreview.vue'
import { useMaterialStore } from '../stores/material.store'
import { useProfileStore } from '../stores/profile.store'
import { hidePrice } from '../helpers/hide-price'
import { View, Edit, Delete, Search } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const allOrders = ref<IOrderResponse[]>([])
const deleteLoading = ref<number | null>(null)
const materialStore = useMaterialStore()
const profileStore = useProfileStore()
const filenames = ref<Map<number, string>>(new Map())
const activeTab = ref('all')
const searchQuery = ref('')

const fetchFilename = async (fileId: number): Promise<string | null> => {
  if (!fileId) return null
  try {
    const response = await req_json_auth(`/files/${fileId}`, 'GET')
    if (response?.ok) {
      const fileInfo = (await response.json()) as { original_filename?: string; filename?: string }
      return fileInfo.original_filename || fileInfo.filename || null
    }
  } catch (error) {
    console.error(`Error fetching filename for file ${fileId}:`, error)
  }
  return null
}

const loadFilenames = async (ordersData: IOrderResponse[]) => {
  const uniqueFileIds = Array.from(
    new Set(ordersData.filter((order) => order.file_id).map((order) => order.file_id))
  ) as number[]

  const filenamePromises = uniqueFileIds.map(async (fileId) => {
    const filename = await fetchFilename(fileId)
    if (filename) {
      filenames.value.set(fileId, filename)
    }
  })

  await Promise.all(filenamePromises)
}

const excludedStatuses = ['cancelled', 'C3:LOSE']

const filteredOrders = computed(() => {
  let result = allOrders.value.filter((order) => !excludedStatuses.includes(order.status))

  // Фильтрация по вкладкам
  if (activeTab.value === 'paid') {
    result = result.filter((order) => order.status === 'completed' || order.status === 'C3:WIN')
  } else if (activeTab.value === 'unpaid') {
    result = result.filter((order) => order.status === 'pending' || order.status === 'processing')
  } else if (activeTab.value === 'calculations') {
    // Для вкладки "Расчеты" можно добавить свою логику
    result = result
  }

  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((order) => {
      const filename = getFilename(order.file_id)?.toLowerCase() || ''
      const orderId = order.order_id.toString()
      return filename.includes(query) || orderId.includes(query)
    })
  }

  return result
})

onMounted(async () => {
  const [ordersResponse] = await Promise.all([
    req_json_auth(`/orders`, 'GET'),
    materialStore.loadMaterials(),
  ])
  const ordersData = (await ordersResponse?.json()) as IOrderResponse[]
  allOrders.value = ordersData
  await loadFilenames(ordersData)
})

const formatDate = (cellValue: string | null | undefined): string => {
  if (!cellValue) return ''
  const date = new Date(cellValue)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.getDate()
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const getCompletionDate = (order: IOrderResponse): string => {
  if (order.updated_at) {
    return formatDate(order.updated_at)
  }
  if (order.created_at && order.manufacturing_cycle) {
    const createdDate = new Date(order.created_at)
    const completionDate = new Date(createdDate.getTime() + order.manufacturing_cycle * 24 * 60 * 60 * 1000)
    return formatDate(completionDate.toISOString())
  }
  return formatDate(order.created_at)
}

const formatPrice = (row: any, _column: any, cellValue: number | string) => {
  const username = profileStore.profile?.username
  if (hidePrice(username, row?.status)) return 'скрыто'
  if (cellValue == null || cellValue === '') return ''
  const value = Number(cellValue)
  if (Number.isNaN(value)) return String(cellValue)
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.trunc(value))
}

// const serviceNames: any = {
//   'cnc-lathe': 'токарная',
//   'cnc-milling': 'фрезерная',
//   printing: '3D печать',
// }
// const getServiceName = (service_id: number): string => {
//   return serviceNames[service_id] || service_id
// }

// const getMaterialName = (materialCode: string): string => {
//   if (!materialCode) return ''
//   const found = materialStore.materials.find((m) => m.value === materialCode)
//   return found?.label ?? materialCode
// }

const statusTexts: Record<string, string> = {
  pending: 'Ожидает оплаты',
  processing: 'Обработка',
  'in-progress': 'В работе',
  completed: 'Завершен',
  'C3:WIN': 'Завершен',
  'C3:LOSE': 'Отменен',
  cancelled: 'Отменен',
}

const statusColors: Record<string, string> = {
  pending: 'warning',
  processing: 'info',
  'in-progress': 'primary',
  completed: 'success',
  'C3:WIN': 'success',
  'C3:LOSE': 'danger',
  cancelled: 'danger',
}

const getStatusText = (status: string): string => {
  return statusTexts[status] || status
}

const getStatusColor = (status: string): string => {
  return statusColors[status] || 'info'
}

const getFilename = (fileId: number | null | undefined): string | null => {
  if (!fileId) return null
  return filenames.value.get(fileId) || null
}

const handleOpen = (row: IOrderResponse): void => {
  router.push({
    path: '/personal/calc',
    query: { orderId: row.order_id.toString() },
  })
}

const handleView = (row: IOrderResponse): void => {
  handleOpen(row)
}

const handleEdit = (row: IOrderResponse): void => {
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

const handleDelete = async (row: IOrderResponse): Promise<void> => {
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

    deleteLoading.value = row.order_id
    const r = await req_json_auth(`/orders/${row.order_id}`, 'DELETE')
    if (r?.ok) {
      allOrders.value = allOrders.value.filter((item) => item.order_id !== row.order_id)
      ElMessage.success('Заказ успешно удален')
    } else {
      ElMessage.error('Ошибка при удалении заказа')
    }
  } catch (error: any) {
    // User cancelled the confirmation dialog - this is expected behavior
    // ElMessageBox rejects with action string when user clicks cancel
    if (error === 'cancel' || error === 'close' || error?.action === 'cancel') {
      return
    }
    console.error('Error deleting order:', error)
    ElMessage.error('Ошибка при удалении заказа')
  } finally {
    deleteLoading.value = null
  }
}

</script>

<template>
  <el-row :gutter="20" style="background-color: #fff; padding: 10px 20px 10px 20px; min-height: 100px">
    <el-col :span="18">
      <h1>Мои заказы</h1>
    </el-col>
    <el-col :span="6" class="search-col">
      <el-input
        v-model="searchQuery"
        placeholder="Поиск"
        class="search-input"
        :prefix-icon="Search"
        clearable
      />
    </el-col>
  </el-row>
  <el-row :gutter="20" style="background-color: #fff; padding: 20px; min-height: 500px">
    <el-col :offset="0" :span="24">
      <div class="table-header">
        <el-tabs v-model="activeTab" class="filter-tabs">
          <el-tab-pane label="Все" name="all" />
          <el-tab-pane label="Оплаченные" name="paid" />
          <el-tab-pane label="Неоплаченные" name="unpaid" />
          <el-tab-pane label="Расчеты" name="calculations" />
        </el-tabs>
      </div>
      <el-table
        :data="filteredOrders"
        :default-sort="{ prop: 'order_id', order: 'descending' }"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
        empty-text="Нет данных"
      >
        <el-table-column prop="order_id" label="№" width="60" />

        <!-- Превью -->
        <el-table-column prop="file_id" label="Превью" width="120">
          <template #default="{ row }">
            <div v-if="row.file_id" class="model-preview">
              <CadPreview :file-id="row.file_id" />
            </div>
            <div v-else class="preview-placeholder" />
          </template>
        </el-table-column>

        <!-- Наименование -->
        <el-table-column prop="file_id" label="Наименование" width="250">
          <template #default="{ row }">
            <span v-if="getFilename(row.file_id)" class="filename-text">{{
              getFilename(row.file_id)
            }}</span>
            <span v-else class="no-filename">Нет файла</span>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Кол-во" width="100" align="center" />

        <!-- Дата завершения -->
        <el-table-column label="Дата завер." width="120">
          <template #default="{ row }">
            {{ getCompletionDate(row) }}
          </template>
        </el-table-column>

        <!-- Статус -->
        <el-table-column prop="status" label="Статус" width="150">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Цена -->
        <el-table-column prop="total_price" label="Цена" width="100" :formatter="formatPrice" />

        <!-- Действия -->
        <el-table-column fixed="right" label="" width="150">
          <template #default="scope">
            <div class="action-buttons">
              <el-button
                link
                type="primary"
                size="small"
                @click="handleView(scope.row)"
                :icon="View"
                title="Просмотр"
              />
              <el-button
                link
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
                :icon="Edit"
                title="Редактировать"
              />
              <el-button
                link
                type="primary"
                size="small"
                @click="handleDelete(scope.row)"
                :loading="deleteLoading === scope.row.order_id"
                :icon="Delete"
                title="Удалить"
                class="delete-button"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<style scoped>
.table-header {
  margin-bottom: 20px;
}

.filter-tabs {
  flex: 1;
}

.filter-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.filter-tabs :deep(.el-tabs__item) {
  color: #909399;
  font-size: 14px;
}

.filter-tabs :deep(.el-tabs__item.is-active) {
  color: #ce132f;
  font-weight: 500;
}

.filter-tabs :deep(.el-tabs__active-bar) {
  background-color: #ce132f;
}

.search-col {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.search-input {
  width: 100%;
  max-width: 300px;
}

.search-input :deep(.el-input__wrapper) {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: none;
  padding: 8px 12px;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #c0c4cc;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.search-input :deep(.el-input__inner) {
  font-size: 14px;
  color: #606266;
}

.search-input :deep(.el-input__prefix) {
  left: 12px;
}

.search-input :deep(.el-input__prefix .el-input__prefix-inner) {
  color: #909399;
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
}

.no-model {
  color: #909399;
  font-style: italic;
  font-size: 12px;
}

.filename-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-filename {
  color: #909399;
  font-style: italic;
  font-size: 12px;
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

.delete-button :deep(.el-icon) {
  color: #f56c6c;
}

.delete-button:hover :deep(.el-icon) {
  color: #f56c6c;
}

@media (max-width: 768px) {
  .search-col {
    margin-top: 10px;
    justify-content: stretch;
  }

  .search-input {
    width: 100%;
    max-width: 100%;
  }
}
</style>
