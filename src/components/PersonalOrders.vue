<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { View } from '@element-plus/icons-vue'
import { req_json_auth } from '../api'
import type { IOrderResponse } from '../interfaces/order.interface'
import CadPreview from './cad/CadPreview.vue'
import { useMaterialStore } from '../stores/material.store'

const router = useRouter()
const orders = ref<IOrderResponse[]>()
// const deleteLoading = ref<number | null>(null)
const materialStore = useMaterialStore()

onMounted(async () => {
  const [ordersResponse] = await Promise.all([
    req_json_auth(`/orders`, 'GET'),
    materialStore.loadMaterials(),
  ])
  orders.value = (await ordersResponse?.json()) as IOrderResponse[]
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

const formatPrice = (_row: any, _column: any, cellValue: number | string) => {
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
        stripe
        :data="orders || []"
        :default-sort="{ prop: 'order_id', order: 'descending' }"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
        empty-text="Нет данных"
      >
        <el-table-column prop="order_id" label="№ зак." width="80" />

        <!-- 3D модель -->
        <el-table-column prop="file_id" label="3D модель" width="120">
          <template #default="{ row }">
            <div v-if="row.file_id" class="model-preview">
              <CadPreview :file-id="row.file_id" />
            </div>
            <span v-else class="no-model">Нет модели</span>
          </template>
        </el-table-column>

        <!-- Тип услуги -->
        <el-table-column prop="service_id" label="Тип обработки" width="120">
          <template #default="{ row }">
            {{ getServiceName(row.service_id) }}
          </template>
        </el-table-column>

        <!-- Дата создания -->
        <el-table-column
          prop="created_at"
          label="Дата создания"
          :formatter="formatDate"
          width="150"
        />
        <el-table-column prop="material_id" label="Материал" width="150">
          <template #default="{ row }">
            {{ getMaterialName(row.material_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="Кол-во" width="100" />
        <!-- <el-table-column prop="document_ids" label="Документы" width="150" /> -->
        <el-table-column prop="status" label="Статус" width="150">
          <template #default="{ row }">
            {{ getStatusText(row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="total_price" label="Цена" width="100" :formatter="formatPrice" />
        <el-table-column fixed="right" label="Операции" min-width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleOpen(scope.row)">
              <el-icon color="black" class="no-inherit">
                <View />
              </el-icon>
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
</style>
