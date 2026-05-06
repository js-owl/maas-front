<script lang="ts" setup>
import { onMounted, ref, computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { /* Edit, */ Delete /*, Notebook, Plus, Minus */ } from '@element-plus/icons-vue'
import { req_json_auth } from '../api'
import type { IKit, IOrderResponse } from '../interfaces/order.interface'
import { statusTexts } from '../helpers/status-text'
const CadPreview = defineAsyncComponent(() => import('./cad/CadPreview.vue'))
// import CoefficientQuantity from './coefficients/CoefficientQuantity.vue'
import Button from './ui/Button.vue'
import ButtonRound from './ui/ButtonRound.vue'
import Select from './ui/Select.vue'
import InputEdit from './ui/InputEdit.vue'
import IconArrowLeft from '@/icons/IconArrowLeft.vue'
import IconCalculate from '@/icons/IconCalculate.vue'
import IconChat from '@/icons/IconChat.vue'

type KitOrder = IKit & {
  status_name?: string
}

const route = useRoute()
const router = useRouter()

const order = ref<KitOrder | null>(null)
const isLoading = ref(false)
const hasError = ref(false)

const quantity = ref<number>(0)
const filename = ref<string>('')

const deleteLoading = ref<number | null>(null)
// const quantityUpdating = ref<number | null>(null)

const calcRows = ref<IOrderResponse[]>([])

const selectedOrderType = ref<string>('')

const orderTypeOptions = [
  // { label: 'токарная', value: 'machining' },
  { label: 'мехобработка', value: 'milling' },
  { label: '3D-печать', value: 'printing' },
  { label: 'прочее', value: 'other' },
]

const manufacturerOptions = [
  { label: 'АО "ДМЗ"', value: 'location_1' },
  { label: 'АО "КТ-Спектр"', value: 'location_2' },
  { label: 'ЦКП', value: 'location_3' },
]

const orderId = computed(() => {
  const fromQuery = route.query.orderId
  if (Array.isArray(fromQuery)) return Number(fromQuery[0])
  return Number(fromQuery)
})

const kitId = computed(() => {
  const fromQuery = route.query.kitId
  if (Array.isArray(fromQuery)) return Number(fromQuery[0])
  return Number(fromQuery) || orderId.value
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

const orderStatus = computed(() => {
  if (!order.value?.status_name) return 'Ожидает оплаты'
  return statusTexts[order.value.status_name] || order.value.status_name
})

const selectedLocation = computed({
  get: () => order.value?.location || 'location_1',
  set: (value: string) => {
    if (!order.value) return
    order.value = {
      ...order.value,
      location: value,
    }
  },
})

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

const handleFilenameUpdate = (newName: string) => {
  if (!order.value) return

  filename.value = newName
  order.value = {
    ...order.value,
    kit_name: newName,
  }
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
    const res = await req_json_auth(`/kits/${kitId.value}`, 'GET')
    if (!res?.ok) throw new Error('Failed to load order')
    const data = (await res.json()) as KitOrder
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

// const handleEdit = (row: any): void => {
//   console.log({ row })
//   switch (row.service_id) {
//     case 'cnc-lathe':
//       router.push({
//         path: '/other',
//         query: {
//           kitId: kitId.value.toString(),
//           orderId: row.order_id.toString(),
//         },
//       })
//       break
//     case 'cnc-milling':
//       router.push({
//         path: '/milling',
//         query: {
//           kitId: kitId.value.toString(),
//           orderId: row.order_id.toString(),
//         },
//       })
//       break
//     case 'printing':
//       router.push({
//         path: '/printing',
//         query: {
//           kitId: kitId.value.toString(),
//           orderId: row.order_id.toString(),
//         },
//       })
//       break
//     default:
//       router.push({
//         path: '/other',
//         query: {
//           kitId: kitId.value.toString(),
//           orderId: row.order_id.toString(),
//         },
//       })
//       break
//   }
// }

const updateKit = async (): Promise<Response | undefined> => {
  if (!order.value) return undefined
  return await req_json_auth(`/kits/${kitId.value}`, 'PUT', {
    kit_name: order.value.kit_name,
    quantity: quantity.value,
    order_ids: order.value.order_ids,
    location: selectedLocation.value,
  })
}

const handleOpenCalcs = (): void => {
  if (!kitId.value) return
  router.push({
    name: 'personal-calcs',
    query: { kitId: kitId.value.toString() },
  })
}

const handleOpenCalculation = (row: any): void => {
  if (!row?.order_id) return
  router.push({
    name: 'personal-calc',
    query: { kitId: kitId.value.toString(), orderId: row.order_id.toString() },
  })
}

// const handleOpenCalcInfo = (row: any): void => {
//   if (!row?.order_id) return
//   router.push({
//     name: 'personal-calc-info',
//     query: { kitId: kitId.value.toString(), orderId: row.order_id.toString() },
//   })
// }


// const updateOrderQuantity = async (row: IOrderResponse, newQuantity: number): Promise<void> => {
//   if (newQuantity < 1) {
//     ElMessage.warning('Количество не может быть меньше 1')
//     return
//   }

//   quantityUpdating.value = row.order_id
//   try {
//     // Получаем текущие данные заказа
//     const res = await req_json_auth(`/orders/${row.order_id}`, 'GET')
//     if (!res?.ok) {
//       throw new Error('Failed to load order data')
//     }
//     const orderData = (await res.json()) as IOrderResponse

//     // Обновляем количество
//     const updatedData = {
//       ...orderData,
//       quantity: newQuantity,
//     }

//     // Отправляем PUT запрос с обновленными данными
//     const updateRes = await req_json_auth(`/orders/${row.order_id}`, 'PUT', updatedData)
//     if (!updateRes?.ok) {
//       throw new Error('Failed to update order quantity')
//     }

//     // Обновляем локальные данные
//     const updatedOrder = (await updateRes.json()) as IOrderResponse
//     const index = calcRows.value.findIndex((item) => item.order_id === row.order_id)
//     if (index !== -1) {
//       calcRows.value[index] = updatedOrder
//     }

//     // Перезагружаем заказ для обновления общей стоимости
//     await loadOrder()
//     ElMessage.success('Количество обновлено')
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error('Error updating quantity:', error)
//     ElMessage.error('Ошибка при обновлении количества')
//   } finally {
//     quantityUpdating.value = null
//   }
// }

// const incrementQuantity = async (row: IOrderResponse): Promise<void> => {
//   const newQuantity = (row.quantity || 1) + 1
//   await updateOrderQuantity(row, newQuantity)
// }

// const decrementQuantity = async (row: IOrderResponse): Promise<void> => {
//   const currentQuantity = row.quantity || 1
//   if (currentQuantity <= 1) {
//     ElMessage.warning('Количество не может быть меньше 1')
//     return
//   }
//   const newQuantity = currentQuantity - 1
//   await updateOrderQuantity(row, newQuantity)
// }

const handleDelete = async (row: any): Promise<void> => {
  try {
    // Show confirmation dialog before deleting
    await ElMessageBox.confirm(
      `Вы уверены, что хотите удалить деталь #${row.order_id}?`,
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
      // Удаляем order_id из списка
      if (order.value?.order_ids) {
        order.value.order_ids = order.value.order_ids.filter((id: number) => id !== row.order_id)
      }

      // Отправляем PUT запрос с обновленным списком order_ids
      try {
        const updateRes = await updateKit()
        if (!updateRes?.ok) {
          console.error('Failed to update kit after deletion')
        }
      } catch (updateError) {
        // eslint-disable-next-line no-console
        console.error('Error updating kit:', updateError)
      }

      ElMessage.success('Заказ успешно удален')
      // Обновляем список деталей
      await loadOrder()
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

const handleOpenChat = () => {
  ElMessage.info('Чат будет доступен позже')
}

const handleOrderTypeChange = (value: string | number | boolean | object) => {
  if (!order.value || !value) return

  const valueStr = String(value)
  const existingIds = Array.isArray(order.value.order_ids) ? order.value.order_ids : []

  const pathMap: Record<string, string> = {
    other: '/other',
    milling: '/milling',
    printing: '/printing',
  }

  const path = pathMap[valueStr] || '/other'

  router.push({
    path,
    query: {
      kitId: kitId.value.toString(),
      orderId: '0',
      orderIds: existingIds.join(','),
    },
  })

  // Сброс выбранного значения после навигации
  selectedOrderType.value = ''
}

const saveOrder = async () => {
  if (!order.value) return

  try {
    const res = await updateKit()
    if (!res?.ok) throw new Error('Failed to save order')

    await loadOrder()

    ElMessage.success('Заказ сохранен')
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    ElMessage.error('Не удалось сохранить заказ')
  }
}

const confirmOrder = async () => {
  if (!kitId.value) return

  try {
    const updateRes = await updateKit()
    if (!updateRes?.ok) throw new Error('Failed to save order before confirm')

    const res = await req_json_auth(`/kits/${kitId.value}/confirm`, 'PUT')
    if (!res?.ok) throw new Error('Failed to confirm order')

    await loadOrder()
    ElMessage.success('Заказ подтверждён')
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    ElMessage.error('Не удалось подтвердить заказ')
  }
}

onMounted(() => {
  void loadOrder()
})
</script>

<template>
  <section class="personal-order">
    <div class="order-layout">
      <div class="order-main">
        <!-- <el-card shadow="never" class="order-card"> -->
        <div class="order-header">
          <div class="order-title">
            <div class="maas-subtitle">Заказ №{{ kitId }}</div>
            <div class="order-name-wrapper">
              <InputEdit v-model="filename" :font-size="'24px'" @update:model-value="handleFilenameUpdate" />
            </div>
          </div>
          <div class="order-quantity">
            <ButtonRound width="164px" @click="handleOpenChat">
              <template #icon-left>
                <IconChat color="#7d8083" />
              </template>
              Чат
            </ButtonRound>
            <ButtonRound width="214px" @click="handleOpenCalcs">
              <template #icon-left>
                <IconCalculate color="#7d8083" />
              </template>
              Калькуляция
            </ButtonRound>
            <!-- <Button class="calc-button" @click="handleOpenCalcs">Калькуляция стоимости</Button> -->
          </div>
        </div>

        <el-table
          class="order-table"
          :data="calcRows"
          style="margin-top: 10px; width: 100%;"
          v-loading="isLoading"
          empty-text="Нет данных по деталям"
        >
          <!-- <el-table-column prop="id" label="№" width="60">
            <template #default="{ row }">
              {{ row.order_id }}
            </template>
          </el-table-column> -->
          <el-table-column prop="file_id" label="Превью" width="90">
            <template #default="{ row }">
              <div v-if="row.file_id" class="model-preview">
                <CadPreview :file-id="row.file_id" />
              </div>
              <div v-else class="preview-placeholder" />
            </template>
          </el-table-column>
          <el-table-column label="Обозначение" min-width="250">
            <template #default="{ row }">
              <span class="order-name-link" @click="handleOpenCalculation(row)">
                {{ row.order_code }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Наименование" min-width="180">
            <template #default="{ row }">
              {{ row.order_name }}
            </template>
          </el-table-column>
          <el-table-column label="Кол-во, шт" width="96" align="center">
            <template #default="{ row }">
              <div class="quantity-controls-cell">
                <!-- <el-button
                  :icon="Minus"
                  size="small"
                  circle
                  :disabled="quantityUpdating === row.order_id || (row.quantity || 1) <= 1"
                  :loading="quantityUpdating === row.order_id"
                  @click="decrementQuantity(row)"
                /> -->
                <span class="quantity-value">{{ row.quantity || 1 }}</span>
                <!-- <el-button
                  :icon="Plus"
                  size="small"
                  circle
                  :disabled="quantityUpdating === row.order_id"
                  :loading="quantityUpdating === row.order_id"
                  @click="incrementQuantity(row)"
                /> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Цена" width="96" align="right">
            <template #default="{ row }">
              {{ formatPrice(row.total_price) }}
            </template>
          </el-table-column>

          <el-table-column label="" width="52" align="center">
            <template #default="row">
              <div class="action-buttons">
                <!-- <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleOpenCalcInfo(row.row)"
                  :icon="Notebook"
                  title="Калькуляция"
                /> -->
                <!-- <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleEdit(row.row)"
                  :icon="Edit"
                  title="Редактировать"
                /> -->
                <el-button
                  link
                  type="primary"
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
          <ButtonRound width="274px" @click="goBack">
              <template #icon-left>
                 <IconArrowLeft color="#333" />
              </template>
               Расчеты и заказы
            </ButtonRound>
          <Select
            v-model="selectedOrderType"
            placeholder="Добавить деталь"
            width="266px"
            @change="handleOrderTypeChange"
          >
            <el-option
              v-for="option in orderTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </Select>
          <ButtonRound width="200px" @click="saveOrder">
            Сохранить
          </ButtonRound>
        </div>
        <!-- </el-card> -->
      </div>

      <!-- Правая карточка -->
      <div class="order-side">
        <div shadow="never" class="summary-card">
          <!-- Статус и даты -->
          <div class="status-section">
            <div class="status-row">
              <span class="maas-text">Статус</span>
              <span class="status-value">{{ orderStatus }}</span>
            </div>
            <div class="date-group">
              <div class="date-row">
                <span class="maas-text">Дата создания</span>
                <span class="status-value">{{ createdDate }}</span>
              </div>
              <div class="date-row">
                <span class="maas-text">Дата завершения</span>
                <span class="status-value">{{ completionDate }}</span>
              </div>
            </div>
          </div>

          <div class="manufacturer-section">
            <div class="maas-subtitle">Выбор изготовителя</div>
            <el-radio-group v-model="selectedLocation" class="manufacturer-radio-group">
              <el-radio
                v-for="manufacturer in manufacturerOptions"
                :key="manufacturer.value"
                :value="manufacturer.value"
              >
                {{ manufacturer.label }}
              </el-radio>
            </el-radio-group>
          </div>

          <div class="cost-item">
            <div class="maas-text">Стоимость изготовления</div>
            <div class="maas-subtitle">
              {{ manufacturingCost }} <span class="rub">руб.</span>
            </div>
          </div>

          <!-- Доставка -->
          <div class="cost-item">
            <div class="maas-text">Доставка</div>
            <div class="maas-subtitle">
              {{ deliveryCost }} <span class="rub">руб.</span>
            </div>
          </div>

          <!-- Итого -->
          <div class="cost-item total">
            <div class="maas-text">Стоимость с учетом доставки</div>
            <div class="maas-subtitle">
              {{ totalWithDelivery }} <span class="rub">руб.</span>
            </div>
          </div>
          <!-- Кнопка оплаты -->
          <div class="summary-actions">
            <Button @click="confirmOrder" class="pay-order-button">Создать заказ</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.personal-order {
  /* min-height: auto; */
  background-color: var(--bgcolor);
  padding: 0;
  border-radius: 20px;
}

.order-layout {
  margin-bottom: 40px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 15px 0 var(--button-bg);
  padding: 40px 40px 32px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 40px;
}

.order-main {
  min-width: 0;
}

.order-side {
  min-width: 0;
  width: 100%;
  max-width: 360px;
  justify-self: end;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
}

.order-title {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-quantity {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
}

.model-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.preview-placeholder {
  width: 60px;
  height: 40px;
  background: linear-gradient(180deg, #fafafb 0%, var(--bgcolor) 99%);
  border: 2px solid var(--button-bg);
  border-radius: 4px;
  margin: 4px auto;
}

.order-table {
  --el-table-header-bg-color: var(--bgcolor);
  --el-table-border-color: var(--bgcolor);
  --el-table-text-color: #000;
  --el-table-row-hover-bg-color: #fff;
}

.order-table :deep(.el-table__header-wrapper th.el-table__cell) {
  background-color: var(--bgcolor) !important;
  color: #000;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  padding: 12px 10px;
}

.order-table :deep(.el-table__body-wrapper td.el-table__cell) {
  color: #000;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  padding: 20px 10px;
  border-bottom: 1px solid var(--bgcolor);
}

.order-table :deep(.el-table__body-wrapper .el-table__cell .cell) {
  line-height: 1.1;
}

.order-table :deep(.el-table__header-wrapper th.el-table__cell .cell) {
  padding-left: 0;
  padding-right: 0;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 40px;
}

.summary-card {
  background-color: var(--bgcolor);
  border-radius: 20px;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  min-height: 100%;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.status-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 0;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.status-row::before,
.date-row::before {
  content: '';
  flex: 1;
  order: 2;
  border-bottom: 2px dashed var(--button-bg);
  transform: translateY(-2px);
}

.date-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.manufacturer-section {
  padding: 24px 0;
  border-top: 2px solid var(--button-bg);
  border-bottom: 2px solid var(--button-bg);
}

.manufacturer-section .maas-subtitle {
  margin-bottom: 12px;
}

.manufacturer-radio-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.manufacturer-radio-group :deep(.el-radio) {
  height: auto;
  margin-right: 0;
  color: #000;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
}

.manufacturer-radio-group :deep(.el-radio__label) {
  padding-left: 8px;
}

.manufacturer-radio-group :deep(.el-radio__inner) {
  width: 18px;
  height: 18px;
  border-color: #aeb2b5;
  background-color: transparent;
}

.manufacturer-radio-group :deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: #aeb2b5;
  background-color: #aeb2b5;
}

.manufacturer-radio-group :deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #000;
}

.status-value {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  color: #000;
}

.status-row > :first-child,
.date-row > :first-child {
  order: 1;
}

.status-row > :last-child,
.date-row > :last-child {
  order: 3;
  text-align: right;
  white-space: nowrap;
}

.cost-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 24px;
}

.cost-item.total {
  margin-bottom: 24px;
}

.rub {
  margin-left: 4px;
  font-size: 14px;
  font-weight: 500;
}

.summary-actions {
  margin-top: 4px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.pay-order-button :deep(.btn) {
  width: 100% !important;
  height: 48px !important;
  background: #aeb2b5 !important;
  background-size: 100% 100% !important;
  border: none !important;
  color: #000 !important;
  border-radius: 10px !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  box-shadow: none !important;
  padding: 12px 24px !important;
}

.pay-order-button :deep(.btn:hover) {
  background: #aeb2b5 !important;
  transform: translateY(0) !important;
  box-shadow: none !important;
  animation: none !important;
}

.pay-order-button :deep(.btn:active) {
  transform: translateY(0) !important;
  box-shadow: none !important;
}

.pay-order-button :deep(.btn::before) {
  display: none !important;
}

.action-buttons {
  display: flex;
  /* gap: 8px; */
  align-items: center;
}

.action-buttons :deep(.el-button) {
  padding: 0;
  color: #7d8083;
  min-height: auto;
}

.action-buttons :deep(.el-button:hover) {
  color: #7d8083;
}

.action-buttons :deep(.el-icon) {
  font-size: 14px;
}

.quantity-controls-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.quantity-value {
  min-width: 30px;
  text-align: center;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
}

.order-name-link {
  cursor: pointer;
  transition: color 0.2s;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #000;
}

.order-name-link:hover {
  text-decoration: underline;
}

.order-quantity :deep(.btn),
.order-footer :deep(.btn) {
  background: var(--button-bg) !important;
  box-shadow: none !important;
  transform: none !important;
  animation: none !important;
  color: #000 !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  height: 48px !important;
  border-radius: 320px !important;
}

.order-quantity :deep(.btn::before),
.order-footer :deep(.btn::before) {
  display: none !important;
}

.order-footer :deep(.el-select__wrapper) {
  min-height: 48px !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

@media (max-width: 992px) {
  .order-layout {
    padding: 20px;
    border-radius: 0;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .order-side {
    max-width: 100%;
    justify-self: stretch;
  }

  .order-quantity {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .order-footer {
    flex-direction: column;
  }
}
</style>
