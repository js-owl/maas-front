<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { req_json_auth } from '../api'
import type { IOrderResponse } from '../interfaces/order.interface'
import CadPreview from './cad/CadPreview.vue'
import { useMaterialStore } from '../stores/material.store'
import { useProfileStore } from '../stores/profile.store'
import { hidePrice } from '../helpers/hide-price'

const router = useRouter()
const orders = ref<IOrderResponse[]>()
// const deleteLoading = ref<number | null>(null)
const materialStore = useMaterialStore()
const profileStore = useProfileStore()
const filenames = ref<Map<number, string>>(new Map())

const fetchFilename = async (fileId: number): Promise<string | null> => {
  if (!fileId) return null
  try {
    const response = await req_json_auth(`/files/${fileId}`, 'GET')
    if (response?.ok) {
      const fileInfo = (await response.json()) as { original_filename?: string; filename?: string; }
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

onMounted(async () => {
  const [ordersResponse] = await Promise.all([
    req_json_auth(`/orders`, 'GET'),
    materialStore.loadMaterials(),
  ])
  const allOrders = (await ordersResponse?.json()) as IOrderResponse[]
  const filteredOrders = allOrders?.filter((order) => !excludedStatuses.includes(order.status)) || []
  orders.value = filteredOrders
  await loadFilenames(filteredOrders)
})

const formatDate = (_row: any, _column: any, cellValue: string) => {
  if (!cellValue) return ''
  const date = new Date(cellValue)
  if (Number.isNaN(date.getTime())) return cellValue
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  return `${day}-${month}-${year}`
}

const formatPrice = (row: any, _column: any, cellValue: number | string) => {
  const username = profileStore.profile?.username
  if (hidePrice(username, row?.status)) return 'скрыто'
  if (cellValue == null || cellValue === '') return ''
  const value = Number(cellValue)
  if (Number.isNaN(value)) return String(cellValue)
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.trunc(value))
}

const serviceNames: any = {
  'cnc-lathe': 'токарная',
  'cnc-milling': 'фрезерная',
  printing: '3D печать',
}
const getServiceName = (service_id: number): string => {
  return serviceNames[service_id] || service_id
}

const getMaterialName = (materialCode: string): string => {
  if (!materialCode) return ''
  const found = materialStore.materials.find((m) => m.value === materialCode)
  return found?.label ?? materialCode
}

const statusTexts: any = {
  pending: 'ожидание оплаты',
  processing: 'в проиводстве',
}
const getStatusText = (status: string): string => {
  return statusTexts[status] || status
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


// const handleDelete = async (row: IOrderResponse): Promise<void> => {
//   deleteLoading.value = row.order_id
//   const r = await req_json_auth(`/admin/orders/${row.order_id}`, 'DELETE')
//   if (r?.ok) {
//     if (orders.value) {
//       orders.value = orders.value.filter((item) => item.order_id !== row.order_id)
//     }
//   }
//   deleteLoading.value = null
// }
</script>

<template>
  <el-row :gutter="20" style="background-color: #fff; padding: 10px 0 0px 20px; min-height: 100px">
    <el-col :offset="0" :span="24">
      <h1>Мои заказы</h1>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="background-color: #fff; padding-top: 0px; min-height: 500px">
    <el-col :offset="0" :span="24">
      <el-table
        :data="orders || []"
        :default-sort="{ prop: 'order_id', order: 'descending' }"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
        empty-text="Нет данных"
      >
        <el-table-column prop="order_id" label="№" width="60" />

        <!-- 3D модель -->
        <el-table-column prop="file_id" label="3D модель" width="120">
          <template #default="{ row }">
            <div v-if="row.file_id" class="model-preview">
              <CadPreview :file-id="row.file_id" />
            </div>
            <span v-else class="no-model">Нет модели</span>
          </template>
        </el-table-column>

        <!-- Имя файла -->
        <el-table-column prop="file_id" label="Название ДСЕ"  width="300">
          <template #default="{ row }">
            <span v-if="getFilename(row.file_id)" class="filename-text">{{ getFilename(row.file_id) }}</span>
            <span v-else class="no-filename">Нет файла</span>
          </template>
        </el-table-column>

        <!-- Дата создания -->
        <!-- <el-table-column
          prop="created_at"
          label="Дата создания"
          :formatter="formatDate"
          width="150"
        /> -->
        <!-- <el-table-column prop="material_id" label="Материал" width="150">
          <template #default="{ row }">
            {{ getMaterialName(row.material_id) }}
          </template>
        </el-table-column> -->
        <el-table-column prop="quantity" label="Кол-во" width="100" align="center" />
        <!-- <el-table-column prop="document_ids" label="Документы" width="150" /> -->
        <el-table-column prop="total_price" label="Цена" width="100" :formatter="formatPrice" />
        <el-table-column prop="status" label="Статус" width="150">
          <template #default="{ row }">
            {{ getStatusText(row.status) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="" min-width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleOpen(scope.row)" class="open-button">
              Открыть
            </el-button>
            <!-- <el-button
              link
              type="primary"
              size="small"
              @click="handleDelete(scope.row)"
              :loading="deleteLoading === scope.row.order_id"
            >
              <el-icon color="red" class="no-inherit">
                <Delete />
              </el-icon>
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<style scoped>
.model-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
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

.open-button {
  color: rgb(96, 98, 102);
  background-color: var(--whity);
  border-color: var(--grey2);
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  &:hover {
    border: 1px solid var(--grey2);
    color: black;
  }
}
</style>
