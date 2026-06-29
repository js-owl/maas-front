<script lang="ts" setup>
import { onMounted, ref, computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { /* Edit, */ Delete, Plus /*, Notebook, Minus */ } from '@element-plus/icons-vue'
import { req_json_auth } from '../api'
import type { IKit, IOrderResponse } from '../interfaces/order.interface'
import { statusTexts } from '../helpers/status-text'
const CadPreview = defineAsyncComponent(() => import('./cad/CadPreview.vue'))
// import CoefficientQuantity from './coefficients/CoefficientQuantity.vue'
import Button from './ui/Button.vue'
import ButtonRound from './ui/ButtonRound.vue'
import Select from './ui/Select.vue'
import InputEdit from './ui/InputEdit.vue'
import Radio from './ui/Radio.vue'
import IconArrowLeft from '@/icons/IconArrowLeft.vue'
import IconCalculate from '@/icons/IconCalculate.vue'
// import IconChat from '@/icons/IconChat.vue'
import { orderTypeOptions } from '@/helpers/order-type-options'

type KitOrder = IKit & {
  status_name?: string
}

type LocationItem = {
  id: string
  label: string
}

type LocationResponse = {
  data?: {
    locations?: LocationItem[]
  }
  locations?: LocationItem[]
}

type ManufacturerOption = {
  label: string
  value: string
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

const manufacturerOptions = ref<ManufacturerOption[]>([])

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

const hasZeroDetailPrice = computed(() =>
  calcRows.value.some((row) => Number(row.detail_price) === 0)
)

// const totalWithDelivery = computed(() => {
//   const total = (order.value?.total_kit_price ?? 0) + (order.value?.delivery_price ?? 0)
//   return formatPrice(total)
// })

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
// const completionDate = computed(() => formatDate(order.value?.updated_at))

const orderStatus = computed(() => {
  const text = !order.value?.status_name
    ? 'Ожидает оплаты'
    : statusTexts[order.value.status_name] || order.value.status_name
  return text.length > 20 ? `${text.slice(0, 20)}...` : text
})

const canConfirmOrder = computed(() => order.value?.status === 'AWAITING_CONFIRMATION')

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

const loadManufacturerOptions = async () => {
  try {
    const res = await req_json_auth('/locations', 'GET')
    if (!res?.ok) throw new Error('Failed to load locations')

    const data = (await res.json()) as LocationResponse
    const locations = data.data?.locations ?? data.locations ?? []

    if (!Array.isArray(locations)) throw new Error('Invalid locations response')

    manufacturerOptions.value = locations.map((location) => ({
      label: location.label,
      value: location.id,
    }))
  } catch (e) {
    console.error(e)
    if (!manufacturerOptions.value.length) {
      ElMessage.error('Не удалось загрузить список изготовителей')
    }
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

// const handleOpenChat = () => {
//   ElMessage.info('Чат будет доступен позже')
// }

const handleOrderTypeChange = (value: string | number | boolean | object) => {
  if (!order.value || !value) return

  const valueStr = String(value)
  const existingIds = Array.isArray(order.value.order_ids) ? order.value.order_ids : []
  const path = orderTypeOptions.find((option) => option.value === valueStr)?.routePath || '/other'

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
  void loadManufacturerOptions()
  void loadOrder()
})
</script>

<template>
  <section class="personal-order">
    <div class="order-layout">
      <div class="order-main">
        <div class="order-toolbar-mobile">
          <button type="button" class="order-mobile-btn order-mobile-btn--back" @click="goBack">
            <IconArrowLeft color="#000" />
            Расчеты и заказы
          </button>
          <button
            type="button"
            class="order-mobile-btn order-mobile-btn--calc"
            aria-label="Калькуляция"
            @click="handleOpenCalcs"
          >
            <IconCalculate color="#000" :width="16" :height="16" />
          </button>
        </div>

        <div class="order-content-block">
          <div class="order-header">
            <div class="order-title">
              <div class="maas-subtitle order-number">Заказ №{{ kitId }}</div>
              <div class="order-name-wrapper">
                <InputEdit
                  v-model="filename"
                  :font-size="'24px'"
                  class="order-name-input"
                  @update:model-value="handleFilenameUpdate"
                />
              </div>
            </div>
            <div class="order-quantity order-quantity--desktop">
              <ButtonRound width="214px" @click="handleOpenCalcs">
                <template #icon-left>
                  <IconCalculate color="#7d8083" />
                </template>
                Калькуляция
              </ButtonRound>
            </div>
          </div>

          <div
            v-if="calcRows.length"
            v-loading="isLoading"
            class="order-details-mobile"
          >
            <div class="order-details-mobile__header">
              <span class="order-details-mobile__col-preview">Превью</span>
              <span class="order-details-mobile__col-designation">Обозначение</span>
              <span class="order-details-mobile__col-price">Цена</span>
            </div>
            <button
              v-for="row in calcRows"
              :key="row.order_id"
              type="button"
              class="order-details-mobile__row"
              @click="handleOpenCalculation(row)"
            >
              <span class="order-details-mobile__preview">
                <span v-if="row.file_id" class="model-preview model-preview--mobile">
                  <CadPreview :file-id="row.file_id" />
                </span>
                <span v-else class="preview-placeholder preview-placeholder--mobile" />
              </span>
              <span class="order-details-mobile__designation">
                <span class="order-details-mobile__code">{{ row.order_code }}</span>
                <span class="order-details-mobile__name">{{ row.order_name }}</span>
              </span>
              <span class="order-details-mobile__price">{{ formatPrice(row.total_price) }}</span>
            </button>
          </div>
          <p v-else-if="!isLoading" class="order-details-mobile__empty">Нет данных по деталям</p>

          <div class="order-add-detail-mobile">
            <el-icon class="order-add-detail-mobile__icon" :size="16">
              <Plus />
            </el-icon>
            <Select
              v-model="selectedOrderType"
              placeholder="Добавить деталь"
              width="100%"
              class="order-type-select order-type-select--mobile"
              dropdown-class="order-type-select-dropdown"
              @change="handleOrderTypeChange"
            >
              <el-option
                v-for="option in orderTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              >
                <span class="order-type-option__label">{{ option.label }}</span>
                <span class="order-type-option__chevron" aria-hidden="true" />
              </el-option>
            </Select>
          </div>
        </div>

        <el-table
          class="order-table order-table--desktop"
          :data="calcRows"
          style="margin-top: 10px; width: 100%"
          v-loading="isLoading"
          empty-text="Нет данных по деталям"
        >
          <!-- <el-table-column prop="id" label="№" width="60">
            <template #default="{ row }">
              {{ row.order_id }}
            </template>
          </el-table-column> -->
          <el-table-column prop="file_id" label="Превью" width="90" class-name="preview-column">
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
          <el-table-column label="Наименование" min-width="200">
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
          <el-table-column label="Цена" width="105" align="right">
            <template #default="{ row }">
              {{ formatPrice(row.total_price) }}
            </template>
          </el-table-column>

          <el-table-column label="" width="52" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <!-- <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleOpenCalcInfo(row)"
                  :icon="Notebook"
                  title="Калькуляция"
                /> -->
                <!-- <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleEdit(row)"
                  :icon="Edit"
                  title="Редактировать"
                /> -->
                <el-button
                  link
                  type="primary"
                  @click="handleDelete(row)"
                  :loading="deleteLoading === row.order_id"
                  :icon="Delete"
                  title="Удалить"
                  class="delete-button"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="order-footer order-footer--desktop">
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
            class="order-type-select"
            dropdown-class="order-type-select-dropdown"
            @change="handleOrderTypeChange"
          >
            <el-option
              v-for="option in orderTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
              <span class="order-type-option__label">{{ option.label }}</span>
              <span class="order-type-option__chevron" aria-hidden="true" />
            </el-option>
          </Select>
          <ButtonRound width="162px" @click="saveOrder"> Сохранить </ButtonRound>
        </div>
        <!-- </el-card> -->
      </div>

      <!-- Правая карточка -->
      <div class="order-side">
        <div shadow="never" class="summary-card">
          <div class="summary-content">
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
                <div class="date-row date-row--completion">
                  <span class="maas-text">Дата завершения</span>
                  <span class="status-value">-</span>
                  <!-- <span class="status-value">{{ completionDate }}</span> -->
                </div>
              </div>
            </div>

            <div class="manufacturer-section">
              <div class="maas-subtitle">Выбор изготовителя</div>
              <el-radio-group
                v-model="selectedLocation"
                class="manufacturer-radio-group"
                @change="saveOrder"
              >
                <Radio
                  v-for="manufacturer in manufacturerOptions"
                  :key="manufacturer.value"
                  :value="manufacturer.value"
                  class="manufacturer-radio"
                >
                  {{ manufacturer.label }}
                </Radio>
              </el-radio-group>
            </div>

            <div class="cost-section">
              <div class="cost-item">
                <div class="maas-text">Стоимость изготовления</div>
                <div class="maas-subtitle">
                  {{ manufacturingCost }} <span class="rub">руб.</span>
                </div>
                <div v-if="hasZeroDetailPrice" class="price-disclaimer">
                  <p>
                    Часть деталей заказа автоматически не оценена. Уточним цену заказа в ближайшее
                    время.
                  </p>
                </div>
              </div>

              <!-- Итого -->
              <!-- <div class="cost-item total">
                <div class="maas-text">Стоимость с учетом доставки</div>
                <div class="maas-subtitle">
                  {{ totalWithDelivery }} <span class="rub">руб.</span>
                </div>
              </div> -->
            </div>
          </div>

          <div class="summary-actions summary-actions--desktop">
            <Button v-if="canConfirmOrder" @click="confirmOrder" class="pay-order-button">
              Подтвердить заказ
            </Button>
          </div>

          <div class="summary-actions-mobile">
            <button type="button" class="summary-save-mobile" @click="saveOrder">
              Сохранить заказ
            </button>
            <button
              v-if="canConfirmOrder"
              type="button"
              class="summary-confirm-mobile"
              @click="confirmOrder"
            >
              Подтвердить заказ
            </button>
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
  width: 80px;
  max-width: 100%;
  height: 60px;
  margin: 0 auto;
  overflow: hidden;
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

.order-table :deep(.preview-column.el-table__cell) {
  padding: 10px 5px;
}

.order-table :deep(.preview-column .cell) {
  padding-left: 0;
  padding-right: 0;
  overflow: hidden;
  line-height: 0;
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

.order-type-select {
  margin-left: auto;
}

.order-number {
  line-height: 1;
}

.order-type-option__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-type-option__chevron {
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-left: 20px;
}

.order-type-option__chevron::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 5px;
  width: 7px;
  height: 7px;
  border-top: 1.5px solid #000;
  border-right: 1.5px solid #000;
  transform: rotate(45deg);
}

.summary-card {
  background-color: var(--bgcolor);
  border-radius: 20px;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  padding: 20px;
  min-height: 100%;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.summary-content {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  width: 100%;
}

.summary-card .maas-text {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  color: #000;
}

.summary-card .maas-subtitle {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  color: #000;
}

.status-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--button-bg);
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--button-bg);
}

.status-row::before,
.date-row::before {
  content: '';
  flex: 1;
  order: 2;
  border-bottom: 2px dashed var(--button-bg);
  transform: translateY(7px);
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
  padding: 0 0 20px;
  border-bottom: 2px solid var(--button-bg);
}

.manufacturer-section .maas-subtitle {
  margin-bottom: 20px;
}

.manufacturer-radio-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.manufacturer-radio-group :deep(.el-radio) {
  height: auto;
  color: #000;
  font-weight: 500;
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

.cost-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
}

.cost-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cost-item.total {
  margin-bottom: 0;
}

.price-disclaimer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #55585b;
}

.price-disclaimer p {
  margin: 0;
}

.rub {
  margin-left: 4px;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}

.summary-actions {
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

.order-toolbar-mobile,
.order-details-mobile,
.order-details-mobile__empty,
.order-add-detail-mobile,
.summary-actions-mobile {
  display: none;
}

@media (max-width: 992px) {
  .order-layout {
    padding: 20px;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .order-side {
    max-width: 100%;
    justify-self: stretch;
  }
}

@media (max-width: 767px) {
  .personal-order {
    border-radius: 0;
  }

  .order-layout {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin-bottom: 0;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 0 5px #c8cfe3;
    box-sizing: border-box;
    width: 100%;
  }

  .order-main {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .order-content-block {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .order-toolbar-mobile {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
  }

  .order-mobile-btn {
    border: none;
    border-radius: 8px;
    background: var(--button-bg);
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
    color: #000;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .order-mobile-btn--back {
    flex: 1 1 0;
    min-width: 0;
    height: 40px;
    gap: 10px;
    padding: 12px 16px;
    white-space: nowrap;
  }

  .order-mobile-btn--calc {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    padding: 12px 10px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    margin-bottom: 0;
  }

  .order-title {
    gap: 8px;
    width: 100%;
  }

  .order-number {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #000;
  }

  .order-name-wrapper {
    width: 100%;
  }

  .order-name-input :deep(.input-edit-value) {
    font-size: 16px !important;
    line-height: normal;
  }

  .order-name-input :deep(.input-edit-btn) {
    padding: 0;
    width: 24px;
    height: 24px;
  }

  .order-name-input :deep(.input-edit-btn .el-icon) {
    font-size: 24px;
  }

  .order-quantity--desktop,
  .order-table--desktop,
  .order-footer--desktop,
  .summary-actions--desktop {
    display: none;
  }

  .order-details-mobile {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .order-details-mobile__header {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .order-details-mobile__col-preview,
  .order-details-mobile__col-designation,
  .order-details-mobile__col-price {
    font-family: 'Montserrat-Regular', sans-serif;
    font-size: 10px;
    font-weight: 400;
    line-height: 14px;
    color: #7d8083;
    box-sizing: border-box;
  }

  .order-details-mobile__col-preview {
    flex: 0 0 38px;
    width: 38px;
    padding: 8px 4px;
    text-align: center;
  }

  .order-details-mobile__col-designation {
    flex: 1 1 0;
    min-width: 0;
    padding: 8px;
  }

  .order-details-mobile__col-price {
    flex: 0 0 auto;
    padding: 8px 20px;
    text-align: center;
  }

  .order-details-mobile__row {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 48px;
    padding: 0;
    border: none;
    border-bottom: 1px solid var(--bgcolor);
    background: #fff;
    cursor: pointer;
    text-align: left;
    box-sizing: border-box;
  }

  .order-details-mobile__preview {
    flex: 0 0 38px;
    width: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 4px;
    box-sizing: border-box;
  }

  .model-preview--mobile {
    width: 30px;
    height: 30px;
    margin: 0;
  }

  .preview-placeholder--mobile {
    width: 30px;
    height: 30px;
    margin: 0;
    border-width: 1px;
  }

  .order-details-mobile__designation {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    box-sizing: border-box;
  }

  .order-details-mobile__code {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .order-details-mobile__name {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 10px;
    font-weight: 500;
    line-height: normal;
    color: #7d8083;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .order-details-mobile__price {
    flex: 0 0 auto;
    padding: 16px 20px;
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #000;
    text-align: right;
    white-space: nowrap;
    box-sizing: border-box;
  }

  .order-details-mobile__empty {
    display: block;
    margin: 0;
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #7d8083;
    text-align: center;
  }

  .order-add-detail-mobile {
    display: block;
    position: relative;
    width: 100%;
  }

  .order-add-detail-mobile__icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    color: #000;
    pointer-events: none;
  }

  .order-type-select--mobile :deep(.el-select__wrapper) {
    min-height: 40px !important;
    height: 40px;
    padding: 8px 16px 8px 36px !important;
    border-radius: 8px !important;
    background: var(--button-bg) !important;
    border: none !important;
    box-shadow: none !important;
    gap: 4px;
    justify-content: center;
  }

  .order-type-select--mobile :deep(.el-select__selection),
  .order-type-select--mobile :deep(.el-select__selected-item),
  .order-type-select--mobile :deep(.el-select__placeholder) {
    font-family: 'Montserrat-SemiBold', sans-serif !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    line-height: normal !important;
    color: #000 !important;
  }

  .order-type-select--mobile :deep(.el-select__suffix) {
    display: none;
  }

  .order-type-select--mobile :deep(.el-select__selection) {
    flex: 0 0 auto;
  }

  .order-side {
    width: 100%;
    max-width: 100%;
  }

  .summary-card {
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
    min-height: auto;
  }

  .summary-card .maas-text {
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
  }

  .summary-card .maas-subtitle {
    font-size: 20px;
    font-weight: 600;
    line-height: normal;
  }

  .status-section {
    gap: 8px;
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: none;
  }

  .status-row {
    gap: 4px;
    padding-bottom: 0;
    border-bottom: none;
  }

  .status-row::before,
  .date-row::before {
    border-bottom-color: #55585b;
    transform: translateY(5px);
  }

  .date-group {
    gap: 0;
  }

  .date-row--completion {
    display: none;
  }

  .status-value {
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
  }

  .manufacturer-section {
    padding: 0;
    border-bottom: none;
  }

  .manufacturer-section .maas-subtitle {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
  }

  .manufacturer-radio-group {
    gap: 0;
  }

  .summary-content {
    gap: 16px;
  }

  .manufacturer-radio-group :deep(.radio) {
    --radio-size: 18px;
    --radio-dot-size: 8px;
    --radio-label-size: 12px;
    --radio-min-height: 18px;
  }

  .cost-section {
    gap: 4px;
    padding-top: 0;
  }

  .cost-item .maas-text {
    font-size: 12px;
  }

  .cost-item .maas-subtitle {
    font-size: 20px;
  }

  .price-disclaimer {
    font-size: 12px;
    margin-top: 4px;
  }

  .summary-actions-mobile {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .summary-save-mobile,
  .summary-confirm-mobile {
    width: 100%;
    height: 40px;
    padding: 4px 24px;
    border: none;
    border-radius: 8px;
    background: var(--button-bg);
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
    color: #000;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .summary-confirm-mobile {
    background: #aeb2b5;
  }
}
</style>

<style>
.order-type-select-dropdown.el-popper {
  /* width: 320px !important;
  min-width: 320px !important;
  max-width: 320px !important; */
  box-sizing: border-box;
  padding: 20px !important;
  background: #fff !important;
  border: none !important;
  border-radius: 20px !important;
  box-shadow: none !important;
}

.order-type-select-dropdown .el-select-dropdown {
  background: transparent;
}

.order-type-select-dropdown .el-select-dropdown__wrap {
  max-height: none;
}

.order-type-select-dropdown .el-select-dropdown__list {
  padding: 0 !important;
}

.order-type-select-dropdown .el-select-dropdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 10px 0 !important;
  color: #000 !important;
  background: #fff !important;
  font-family: 'Montserrat-Medium', sans-serif !important;
  font-size: 18px !important;
  font-weight: 500 !important;
  line-height: 1 !important;
}

.order-type-select-dropdown .el-select-dropdown__item.is-selected {
  font-weight: 500 !important;
}

.order-type-select-dropdown .el-popper__arrow {
  display: none;
}
</style>
