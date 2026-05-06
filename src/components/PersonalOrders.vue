<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { req_json_auth } from '../api'
import { useProfileStore } from '../stores/profile.store'
import { hidePrice } from '../helpers/hide-price'
import { statusTexts } from '../helpers/status-text'
import { Search, Delete, Plus, Refresh } from '@element-plus/icons-vue'
import ButtonRound from './ui/ButtonRound.vue'
import type { IKit } from '../interfaces/order.interface'

type KitOrder = IKit & {
  status_name?: string
}

const router = useRouter()
const allOrders = ref<KitOrder[]>([])
const profileStore = useProfileStore()
const filenames = ref<Map<number, string>>(new Map())
const activeTab = ref('all')
const searchQuery = ref('')
const deleteLoading = ref<number | null>(null)

const excludedStatuses = ['cancelled', 'C3:LOSE']

const filteredOrders = computed(() => {
  let result = allOrders.value.filter((order) => !excludedStatuses.includes(order.status_name ?? ''))

  if (activeTab.value === 'paid') {
    result = result.filter((order) => order.status_name === 'completed' || order.status_name === 'C3:WIN')
  } else if (activeTab.value === 'unpaid') {
    result = result.filter((order) => order.status_name === 'pending' || order.status_name === 'processing')
  } else if (activeTab.value === 'completed') {
    result = result.filter((order) => order.status_name === 'completed' || order.status_name === 'C3:WIN')
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((order) => {
      const orderName = order.kit_name?.toLowerCase() || ''
      return orderName.includes(query)
    })
  }

  return result
})

const loadOrders = async () => {
  const res = await req_json_auth('/kits', 'GET')
  const ordersData = (await res?.json()) as KitOrder[]
  allOrders.value = ordersData
}

onMounted(async () => {
  await loadOrders()
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

const formatPrice = (cellValue: number | string | null | undefined, status?: string) => {
  const username = profileStore.profile?.username
  if (hidePrice(username, status)) return 'скрыто'
  if (cellValue == null || cellValue === '') return ''
  const value = Number(cellValue)
  if (Number.isNaN(value)) return String(cellValue)
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.trunc(value))
}

const statusClasses: Record<string, string> = {
  pending: 'status-chip--pending',
  processing: 'status-chip--processing',
  'in-progress': 'status-chip--processing',
  completed: 'status-chip--completed',
  'C3:WIN': 'status-chip--completed',
  'C3:LOSE': 'status-chip--cancelled',
  cancelled: 'status-chip--cancelled',
}

const getStatusText = (status: string): string => {
  return statusTexts[status] || status
}

const getStatusClass = (status: string): string => {
  return statusClasses[status] || 'status-chip--default'
}

const getFilename = (fileId: number | null | undefined): string | null => {
  if (!fileId) return null
  return filenames.value.get(fileId) || null
}

const handleOpen = (row: IKit): void => {
  if (!row.kit_id) return
  const storageKey = `order_${row.kit_id}`
  localStorage.setItem(storageKey, JSON.stringify(row))
  router.push({ path: '/personal/order', query: { kitId: row.kit_id.toString() } })
}

const handleView = (row: IKit): void => {
  handleOpen(row)
}

const handleCreateOrder = (): void => {
  ElMessage.info('Функция "Создать заказ" будет доступна позже')
}

const handleRepeatOrder = (): void => {
  ElMessage.info('Функция "Повторить" будет доступна позже')
}

const handleDelete = async (row: IKit): Promise<void> => {
  try {
    await ElMessageBox.confirm(
      `Вы уверены, что хотите удалить заказ #${row.kit_id}?`,
      'Подтверждение удаления',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      }
    )

    deleteLoading.value = row.kit_id ?? null
    const r = await req_json_auth(`/kits/${row.kit_id}`, 'DELETE')
    if (r?.ok) {
      ElMessage.success('Заказ успешно удален')
      await loadOrders()
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
</script>

<template>
  <section class="personal-orders">
    <div class="orders-card">
      <div class="orders-toolbar">
        <el-tabs v-model="activeTab" class="filter-tabs">
          <el-tab-pane label="Все" name="all" />
          <el-tab-pane label="Оплаченные" name="paid" />
          <el-tab-pane label="Неоплаченные" name="unpaid" />
          <el-tab-pane label="Завершенные" name="completed" />
        </el-tabs>
        <div class="toolbar-actions">
          <ButtonRound width="220px" @click="handleCreateOrder">
            <template #icon-left>
              <el-icon><Plus /></el-icon>
            </template>
            Создать заказ
          </ButtonRound>
          <ButtonRound width="170px" @click="handleRepeatOrder">
            <template #icon-left>
              <el-icon><Refresh /></el-icon>
            </template>
            Повторить
          </ButtonRound>
          <el-input
            v-model="searchQuery"
            placeholder="Поиск"
            class="search-input"
            :prefix-icon="Search"
            clearable
          />
        </div>
      </div>

      <el-table
        class="orders-table"
        :data="filteredOrders"
        :default-sort="{ prop: 'kit_id', order: 'descending' }"
        empty-text="Нет данных"
      >
        <el-table-column type="selection" width="56" align="center" />
        <el-table-column prop="kit_id" label="№" width="74" />

        <el-table-column prop="kit_name" label="Наименование">
          <template #default="{ row }">
            <span v-if="row.kit_name" class="filename-text filename-text--link" @click="handleView(row)">{{
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

        <el-table-column label="Дата созд." width="150">
          <template #default="{ row }">
            <span class="filename-text">{{ formatDate(row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Дата завер." width="150">
          <template #default="{ row }">
            <span class="filename-text">{{ formatDate(row.updated_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status_name" label="Статус" width="250">
          <template #default="{ row }">
            <span class="status-chip" :class="getStatusClass(row.status_name)">
              {{ getStatusText(row.status_name) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="total_kit_price" label="Цена" width="120" align="right">
          <template #default="{ row }">
            <span class="filename-text">{{ formatPrice(row.total_kit_price, row.status_name) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="" width="70" align="center">
          <template #default="{ row }">
            <el-button
              link
              class="delete-button"
              @click="handleDelete(row)"
              :loading="deleteLoading === row.kit_id"
              :icon="Delete"
              title="Удалить"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<style scoped>
.personal-orders {
  min-height: 100vh;
  background-color: var(--bgcolor);
}

.orders-card {
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 15px 0 var(--button-bg);
  padding: 40px;
}

.orders-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 20px;
}

.filter-tabs {
  min-width: 0;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
}

.filter-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.filter-tabs :deep(.el-tabs__item) {
  border-bottom: 2px solid var(--button-bg);
  color: #7d8083;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  padding: 0 0 8px;
  margin-right: 20px;
}

.filter-tabs :deep(.el-tabs__item.is-active) {
  color: var(--custom-red);
  font-weight: 500;
}

.filter-tabs :deep(.el-tabs__active-bar) {
  background-color: var(--custom-red);
}

.filter-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.toolbar-actions :deep(.btn) {
  background: var(--button-bg) !important;
  box-shadow: none !important;
  border-radius: 40px !important;
  color: #000 !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  letter-spacing: 0 !important;
}

.toolbar-actions :deep(.btn:hover),
.toolbar-actions :deep(.btn:active) {
  transform: none !important;
  box-shadow: none !important;
  animation: none !important;
}

.toolbar-actions :deep(.btn::before) {
  display: none !important;
}

.search-input {
  width: 181px;
}

.search-input :deep(.el-input__wrapper) {
  background-color: var(--whity);
  border: 2px solid var(--button-bg);
  border-radius: 10px;
  box-shadow: none;
  padding: 8px 16px;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: var(--button-bg);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--button-bg);
  box-shadow: none;
}

.search-input :deep(.el-input__inner) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #000;
}

.search-input :deep(.el-input__prefix .el-icon) {
  color: #000;
}

.orders-table {
  width: 100%;
  --el-table-header-bg-color: var(--bgcolor);
  --el-table-border-color: var(--bgcolor);
  --el-table-text-color: #000;
  --el-table-row-hover-bg-color: #fff;
}

.orders-table :deep(.el-table__header-wrapper th.el-table__cell) {
  background-color: var(--bgcolor) !important;
  color: #000;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  padding: 12px 10px;
}

.orders-table :deep(.el-table__body-wrapper td.el-table__cell) {
  color: #000;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  padding: 20px 10px;
  border-bottom: 1px solid var(--bgcolor);
}

.orders-table :deep(.el-table__body .el-table__row td:first-child .cell) {
  color: #7d8083;
}

.orders-table :deep(.el-table__header-wrapper th.el-table-column--selection .cell) {
  display: flex;
  justify-content: center;
}

.orders-table :deep(.el-checkbox__inner) {
  width: 24px;
  height: 24px;
  border: 2px solid var(--button-bg);
  border-radius: 5px;
  background-color: #fff;
}

.orders-table :deep(.el-checkbox__inner::after) {
  left: 7px;
  top: 3px;
}

.orders-table :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--button-bg);
  border-color: var(--button-bg);
}

.orders-table :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

.orders-table :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: var(--button-bg);
  border-color: var(--button-bg);
}

.filename-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #000;
}

.filename-text--link {
  cursor: pointer;
}

.filename-text--link:hover {
  text-decoration: underline;
}

.no-filename {
  color: #7d8083;
  font-style: italic;
  font-size: 12px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #000;
  white-space: nowrap;
}

.status-chip--default,
.status-chip--cancelled {
  background-color: var(--whity);
  border-color: var(--bgcolor);
}

.status-chip--completed {
  background-color: #e2f3e7;
  border-color: #bbe9c7;
}

.status-chip--processing {
  background-color: #e7f7ff;
  border-color: #bddded;
}

.status-chip--pending {
  background-color: #f6f0e4;
  border-color: #eddbbb;
}

.delete-button {
  color: #7d8083 !important;
}

.delete-button:hover {
  color: #55585b !important;
}

@media (max-width: 1200px) {
  .orders-card {
    padding: 24px;
  }

  .orders-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-actions {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .personal-orders {
    min-height: auto;
  }

  .orders-card {
    border-radius: 0;
    padding: 20px;
  }

  .toolbar-actions {
    gap: 12px;
  }

  .search-input,
  .toolbar-actions :deep(.btn) {
    width: 100%;
  }
}
</style>
