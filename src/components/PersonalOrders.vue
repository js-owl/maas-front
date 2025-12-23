<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { req_json_auth } from '../api'
import { useProfileStore } from '../stores/profile.store'
import { hidePrice } from '../helpers/hide-price'
import { Search } from '@element-plus/icons-vue'
import type { IKit } from '../interfaces/order.interface'

const router = useRouter()
const allOrders = ref<IKit[]>([])
const profileStore = useProfileStore()
const filenames = ref<Map<number, string>>(new Map())
const activeTab = ref('all')
const searchQuery = ref('')

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
      const orderName = order.kit_name?.toLowerCase() || ''
      return orderName.includes(query)
    })
  }

  return result
})

onMounted(async () => {
  const res = await req_json_auth('/kits', 'GET')
  const ordersData = await res?.json()
  allOrders.value = ordersData
})

const formatDate = (cellValue: string | null | undefined): string => {
  if (!cellValue) return ''
  const date = new Date(cellValue)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.getDate()
  const months = [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
  ]
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const formatPrice = (row: any, _column: any, cellValue: number | string) => {
  const username = profileStore.profile?.username
  if (hidePrice(username, row?.status)) return 'скрыто'
  if (cellValue == null || cellValue === '') return ''
  const value = Number(cellValue)
  if (Number.isNaN(value)) return String(cellValue)
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.trunc(value))
}

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

const handleOpen = (row: IKit): void => {
  const storageKey = `order_${row.kit_id}`
  localStorage.setItem(storageKey, JSON.stringify(row))
  router.push({ path: '/personal/order', query: { orderId: row.kit_id.toString() } })
}

const handleView = (row: IKit): void => {
  handleOpen(row)
}
</script>

<template>
  <el-row
    :gutter="20"
    style="background-color: #fff; padding: 10px 20px 10px 20px; min-height: 100px"
  >
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
        :default-sort="{ prop: 'kit_id', order: 'descending' }"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
        empty-text="Нет данных"
      >
        <el-table-column prop="kit_id" label="№" width="60" />

        <!-- Превью -->
        <el-table-column prop="file_id" label="Превью" width="120">
          <template>
            <div class="preview-placeholder" />
          </template>
        </el-table-column>

        <!-- Наименование -->
        <el-table-column prop="kit_name" label="Наименование">
          <template #default="{ row }">
            <span v-if="row.kit_name" class="filename-text" @click="handleView(row)">{{
              row.kit_name
            }}</span>
            <span
              v-else-if="getFilename(row.file_id)"
              class="filename-text"
              @click="handleView(row)"
            >
              {{ getFilename(row.file_id) }}
            </span>
            <span v-else class="no-filename">Нет названия</span>
          </template>
        </el-table-column>

        <el-table-column prop="quantity" label="Кол-во" width="100" align="center" />

        <!-- Дата создания / завершения -->
        <el-table-column label="Дата созд." width="120">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Дата завер." width="120">
          <template #default="{ row }">
            {{ formatDate(row.updated_at) }}
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
        <el-table-column prop="total_kit_price" label="Цена" width="100" :formatter="formatPrice" />
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
  background-color: red;
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
  cursor: pointer;
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
