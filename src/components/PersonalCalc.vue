<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { req_json_auth, req_json } from '../api'
import Button from './ui/Button.vue'
import ButtonRound from './ui/ButtonRound.vue'
import InputEdit from './ui/InputEdit.vue'
import SelectFiles from './ui/SelectFiles.vue'
import CadShowById from './cad/CadShowById.vue'
import type { IOrderResponse, IKit } from '../interfaces/order.interface'
import { useMaterialStore } from '../stores/material.store'
import { useCoefficientsStore } from '../stores/coefficients.store'
import IconArrowLeft from '@/icons/IconArrowLeft.vue'
import IconCalculate from '@/icons/IconCalculate.vue'

type OtherService = {
  id: string
  label: string
  service: string
}

type OtherServicesResponse = {
  other_services: OtherService[]
}

type UploadedDocument = {
  id: number
  original_filename: string
  uploaded_at?: string
}

// Get orderId and kitId from route query
const route = useRoute()
const router = useRouter()
const orderId = computed(() => Number(route.query.orderId) || 0)
const kitId = computed(() => {
  const fromQuery = route.query.kitId
  if (Array.isArray(fromQuery)) return Number(fromQuery[0]) || 0
  return Number(fromQuery) || 0
})

// Loading state
const isLoading = ref(false)
const isSaving = ref(false)

// Material store
const materialStore = useMaterialStore()

// Coefficients store
const coefficientsStore = useCoefficientsStore()

// Order data storage
const orderData = ref<IOrderResponse | null>(null)

// Kit data (for status check)
const kitData = ref<IKit | null>(null)

// File ID for CAD viewer (reactive variable for v-model)
const fileId = ref<number | null>(null)

// Other services storage
const otherServices = ref<OtherService[]>([])
const uploadedDocuments = ref<UploadedDocument[]>([])

// Order name - represents the order name
const order_name = ref('')

// Order code - represents the order code
const order_code = ref('')

// Manufacturing cost per unit in rubles
const manufacturingCost = ref(10526)

// Quantity of items to manufacture
const quantity = ref(8)

// Manufacturing time in days
const manufacturingTime = ref(3)

// Product properties - stores various attributes of the product
const productProperties = ref({
  serviceId: '', // ID услуги (Service ID)
  dimensions: '', // Размеры (Dimensions)
  partVolume: '', // Объем детали (Part volume)
  material: '', // Материал (Material)
  coating: '', // Покрытие (Coating)
})


// Format price without decimal (for total cost)
const formatPrice = (value: number): string => {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб.'
}

// Cost per item
const costPerItem = computed(() => {
  return manufacturingCost.value
})

// Total cost
const totalCostFormatted = computed(() => {
  return manufacturingCost.value * quantity.value
})

const loadUploadedDocuments = async (documentIds: number[]) => {
  if (!Array.isArray(documentIds) || !documentIds.length) {
    uploadedDocuments.value = []
    return
  }

  const responses = await Promise.all(
    documentIds.map(async (documentId) => {
      try {
        const response = await req_json_auth(`/documents/${documentId}`, 'GET')
        if (!response?.ok) return null
        const data = (await response.json()) as UploadedDocument
        return {
          id: data.id,
          original_filename: data.original_filename,
          uploaded_at: data.uploaded_at,
        }
      } catch {
        return null
      }
    })
  )

  uploadedDocuments.value = responses.reduce<UploadedDocument[]>((acc, item) => {
    if (item?.id && item.original_filename) acc.push(item)
    return acc
  }, [])
}

const downloadUploadedDocument = async (uploadedDocument: UploadedDocument) => {
  try {
    const response = await req_json_auth(`/documents/${uploadedDocument.id}/download`, 'GET')
    if (!response?.ok) {
      ElMessage.error('Ошибка загрузки документа')
      return
    }

    const blob = await response.blob()
    const fileUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = uploadedDocument.original_filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(fileUrl), 1000)
  } catch (error) {
    console.error('Ошибка при скачивании документа:', error)
    ElMessage.error('Ошибка при скачивании документа')
  }
}

const removeUploadedDocument = async (uploadedDocument: UploadedDocument) => {
  const targetOrderId = orderData.value?.order_id || orderId.value
  const currentDocumentIds = Array.isArray(orderData.value?.document_ids)
    ? orderData.value.document_ids
    : []
  const updatedDocumentIds = currentDocumentIds.filter((id) => id !== uploadedDocument.id)

  if (!targetOrderId || targetOrderId <= 0) {
    ElMessage.error('Не удалось определить заказ для удаления документа')
    return
  }

  try {
    const response = await req_json_auth(`/orders/${targetOrderId}`, 'PUT', {
      document_ids: updatedDocumentIds,
    })

    if (!response?.ok) {
      ElMessage.error('Не удалось удалить документ')
      return
    }

    if (orderData.value) {
      orderData.value.document_ids = updatedDocumentIds
    }
    uploadedDocuments.value = uploadedDocuments.value.filter(
      (item) => item.id !== uploadedDocument.id
    )

    ElMessage.success('Документ удален')
  } catch (error) {
    console.error('Ошибка при удалении документа:', error)
    ElMessage.error('Ошибка при удалении документа')
  }
}



// Handle back button click - navigate to order page with current kitId
const handleBack = () => {
  if (kitId.value && kitId.value > 0) {
    router.push({
      name: 'personal-order',
      query: { kitId: kitId.value.toString() },
    })
  } else {
    router.push({
      name: 'personal-orders',
    })
  }
}

// Handle calc info button click - navigate to calc info page with current orderId (and kitId if present)
const handleCalcInfo = () => {
  if (!orderId.value || orderId.value <= 0) return

  const query: Record<string, string> = {}

  if (kitId.value && kitId.value > 0) {
    query.kitId = kitId.value.toString()
  }

  query.orderId = orderId.value.toString()

  router.push({
    name: 'personal-calc-info',
    query,
  })
}

// Block "Расчет" button when kit status is NOT pending and NOT New
const isCalculationDisabled = computed(() => {
  // const status = kitData.value?.status
  // if (!status) return false
  // const isPending = status === 'pending'
  // const isNew = status === 'New' || status.toLowerCase() === 'new'
  return false // !isPending && !isNew
})

// Handle edit button click - navigate to edit page based on service_id (same logic as in PersonalOrder.vue)
const handleEdit = () => {
  if (!orderData.value?.service_id || !orderData.value.order_id) return

  const serviceId = orderData.value.service_id
  const orderIdValue = orderData.value.order_id
  const query: Record<string, string> = { orderId: orderIdValue.toString() }

  if (kitId.value && kitId.value > 0) {
    query.kitId = kitId.value.toString()
  }

  switch (serviceId) {
    case 'cnc-lathe':
      router.push({
        path: '/other',
        query,
      })
      break
    case 'cnc-milling':
      router.push({
        path: '/milling',
        query,
      })
      break
    case 'printing':
      router.push({
        path: '/printing',
        query,
      })
      break
    default:
      router.push({
        path: '/other',
        query,
      })
      break
  }
}

// Load other services from API
const loadOtherServices = async () => {
  if (otherServices.value.length > 0) return

  // Default services that are always available
  const defaultServices: OtherService[] = [
    {
      id: '101',
      label: '3D печать',
      service: 'printing',
    },
    {
      id: '102',
      label: 'Механообработка',
      service: 'cnc-milling',
    },
  ]

  try {
    const res = await req_json('/other_services', 'GET')
    if (res?.ok) {
      const data = (await res.json()) as OtherServicesResponse
      if (data?.other_services && Array.isArray(data.other_services)) {
        // Merge default services with API services, avoiding duplicates by service field
        const serviceMap = new Map<string, OtherService>()
        
        // Add default services first
        defaultServices.forEach((service) => {
          serviceMap.set(service.service, service)
        })
        
        // Add API services, they will override defaults if service field matches
        data.other_services.forEach((service) => {
          serviceMap.set(service.service, service)
        })
        
        otherServices.value = Array.from(serviceMap.values())
      } else {
        // If API didn't return valid data, use defaults
        otherServices.value = defaultServices
      }
    } else {
      // If API request failed, use defaults
      otherServices.value = defaultServices
    }
  } catch (error) {
    console.error('Failed to load other services:', error)
    // On error, use defaults
    otherServices.value = defaultServices
  }
}

// Fetch order data from API
const fetchOrder = async (id: number) => {
  if (!id || id === 0) return

  isLoading.value = true
  try {
    // Ensure materials are loaded to resolve material label
    if (!materialStore.materials.length) {
      await materialStore.setAllMaterials()
    }

    // Ensure coefficients are loaded to resolve finish/cover/tolerance labels
    if (
      !coefficientsStore.coefficients.finish.length &&
      !coefficientsStore.coefficients.cover.length &&
      !coefficientsStore.coefficients.tolerance.length
    ) {
      await coefficientsStore.setAllCoefficients()
    }

    // Load other services to resolve service label
    await loadOtherServices()

    const response = await req_json_auth(`/orders/${id}`, 'GET')
    if (response?.ok) {
      const fetchedOrderData = (await response.json()) as IOrderResponse
      orderData.value = fetchedOrderData

      // Update file ID for CAD viewer
      fileId.value = fetchedOrderData.file_id || null

      // Map order data to component state
      if (fetchedOrderData.quantity) quantity.value = fetchedOrderData.quantity
      if (fetchedOrderData.detail_price_one)
        manufacturingCost.value = fetchedOrderData.detail_price_one
      if (fetchedOrderData.manufacturing_cycle)
        manufacturingTime.value = fetchedOrderData.manufacturing_cycle

      // Map product properties
      if (fetchedOrderData.service_id) {
        // Find service label by service field (not id) from other_services
        const foundService = otherServices.value.find(
          (service) => service.service === fetchedOrderData.service_id
        )
        productProperties.value.serviceId = foundService?.label ?? fetchedOrderData.service_id
      }
      if (fetchedOrderData.length && fetchedOrderData.width && fetchedOrderData.height) {
        productProperties.value.dimensions = `${fetchedOrderData.length} × ${fetchedOrderData.width} × ${fetchedOrderData.height}`
      }
      if (fetchedOrderData.mat_volume) {
        const volumeInCm3 = fetchedOrderData.mat_volume * 1_000_000
        productProperties.value.partVolume = `${volumeInCm3.toFixed(2)} см³`
      }
      if (fetchedOrderData.material_id) {
        const foundMaterial = materialStore.materials.find(
          (m) => m.value === fetchedOrderData.material_id
        )
        productProperties.value.material = foundMaterial?.label ?? fetchedOrderData.material_id
      }

      // Map cover_id (array of ids) to coating labels from coefficients store
      if (Array.isArray(fetchedOrderData.cover_id) && fetchedOrderData.cover_id.length) {
        const coverLabels = fetchedOrderData.cover_id
          .map(
            (id) => coefficientsStore.coefficients.cover.find((cover) => cover.value === id)?.label
          )
          .filter((label): label is string => Boolean(label))

        productProperties.value.coating =
          coverLabels.join(', ') || fetchedOrderData.cover_id.join(', ')
      }

      // Update order name and code if they exist
      if (fetchedOrderData.order_name) {
        order_name.value = fetchedOrderData.order_name
      }
      if (fetchedOrderData.order_code) {
        order_code.value = fetchedOrderData.order_code
      }

      await loadUploadedDocuments(fetchedOrderData.document_ids)
    } else {
      ElMessage.error('Не удалось загрузить данные заказа')
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    ElMessage.error('Ошибка при загрузке заказа')
  } finally {
    isLoading.value = false
  }
}

// Save order - update order with current data
const saveOrder = async () => {
  if (!orderData.value || !orderId.value || orderId.value <= 0) {
    ElMessage.warning('Нет данных для сохранения')
    return
  }

  isSaving.value = true
  try {
    // Prepare updated order data with current order_code, order_name, and quantity
    const updatedData = {
      ...orderData.value,
      order_code: order_code.value,
      order_name: order_name.value,
      quantity: quantity.value,
    }

    const response = await req_json_auth(`/orders/${orderId.value}`, 'PUT', updatedData)
    if (response?.ok) {
      const updatedOrder = (await response.json()) as IOrderResponse
      orderData.value = updatedOrder
      ElMessage.success('Заказ сохранен')
    } else {
      ElMessage.error('Не удалось сохранить заказ')
    }
  } catch (error) {
    console.error('Error saving order:', error)
    ElMessage.error('Ошибка при сохранении заказа')
  } finally {
    isSaving.value = false
  }
}

// Load kit data (for status)
const fetchKit = async (id: number) => {
  if (!id || id === 0) {
    kitData.value = null
    return
  }
  try {
    const res = await req_json_auth(`/kits/${id}`, 'GET')
    if (res?.ok) {
      kitData.value = (await res.json()) as IKit
    } else {
      kitData.value = null
    }
  } catch {
    kitData.value = null
  }
}

// Watch for orderId changes and fetch order data
watch(
  orderId,
  (newId) => {
    if (newId && newId > 0) {
      fetchOrder(newId)
    }
  },
  { immediate: true }
)

// Watch for kitId changes and fetch kit data
watch(
  kitId,
  (newKitId) => {
    if (newKitId && newKitId > 0) {
      fetchKit(newKitId)
    } else {
      kitData.value = null
    }
  },
  { immediate: true }
)

</script>

<template>
  <div
    class="personal-calc-container"
    v-loading="isLoading"
    element-loading-text="Загрузка данных заказа..."
  >
    <section class="personal-order">
      <div class="calc-layout">
        <div class="calc-main">
          <div class="toolbar-row">
            <ButtonRound width="280px" @click="handleBack">
              <template #icon-left>
                <IconArrowLeft color="#333" />
              </template>
              Вернуться в Заказ
            </ButtonRound>
            <ButtonRound width="220px" @click="handleCalcInfo">
              <template #icon-left>
                <IconCalculate color="#7d8083" />
              </template>
              Калькуляция
            </ButtonRound>
          </div>

          <div class="product-info">
            <div class="order-number">Заказ №{{ kitId }}</div>
            <InputEdit v-model="order_code" />
            <InputEdit v-model="order_name" />
          </div>

          <div class="properties-section">
            <div class="property-item">
              <span class="property-label">Услуга</span>
              <span class="property-divider" />
              <span class="property-value">{{ productProperties.serviceId || '-' }}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Размер, мм</span>
              <span class="property-divider" />
              <span class="property-value">{{ productProperties.dimensions || '-' }}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Объем детали, мм³</span>
              <span class="property-divider" />
              <span class="property-value">{{ productProperties.partVolume || '-' }}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Материал</span>
              <span class="property-divider" />
              <span class="property-value">{{ productProperties.material || '-' }}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Постобработка</span>
              <span class="property-divider" />
              <span class="property-value">{{ productProperties.coating || '-' }}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Материал покрытия</span>
              <span class="property-divider" />
              <span class="property-value">{{ productProperties.coating || '-' }}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Площадь покраски, мм³</span>
              <span class="property-divider" />
              <span class="property-value">-</span>
            </div>
          </div>

          <SelectFiles
            :uploaded-documents="uploadedDocuments"
            @view-document="downloadUploadedDocument"
            @remove-document="removeUploadedDocument"
          />
        </div>

        <div class="calc-side">
          <div class="summary-card">
            <div class="image-container">
              <div class="personal-wrapper">
                <div v-if="fileId" class="preview-wrapper">
                  <CadShowById v-model="fileId" />
                </div>
                <div v-else class="preview-placeholder">
                  <div class="placeholder-content" />
                </div>
              </div>
            </div>

            <div class="cost-value quantity-value">{{ quantity }} шт.</div>

            <div class="cost-item">
              <div class="cost-label">Стоимость 1 изд.</div>
              <div class="cost-value">{{ formatPrice(costPerItem) }}</div>
            </div>

            <div class="cost-item">
              <div class="cost-label">Общая стоимость</div>
              <div class="cost-value">{{ formatPrice(totalCostFormatted) }}</div>
            </div>
            <div class="summary-actions">
              <Button
                width="100%"
                type="secondary"
                :disabled="isCalculationDisabled"
                @click="handleEdit"
              >
                Расчет
              </Button>
              <Button width="100%" :loading="isSaving" @click="saveOrder">
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.personal-order {
  min-height: auto;
  background-color: var(--bgcolor);
  padding: 0;
  border-radius: 20px;
}

.personal-calc-container {
  padding: 0;
  min-height: 500px;
}

.calc-layout {
  margin-bottom: 40px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 15px 0 var(--button-bg);
  padding: 30px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 40px;
}

.calc-main {
  min-width: 0;
}

.calc-side {
  min-width: 0;
  width: 100%;
  max-width: 360px;
  justify-self: end;
}

.toolbar-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.order-number {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #000000;
}

.placeholder-content {
  width: 100%;
  height: 100%;
  background-color: var(--whity);
  border-radius: 10px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 40px;
}

.cost-label {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  padding-top: 10px;
}

.cost-value {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #000000;
}

.quantity-value {
  padding-top: 0;
}

.properties-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.property-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.property-label {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  white-space: nowrap;
}

.property-divider {
  flex: 1;
  border-bottom: 2px dashed var(--button-bg);
  transform: translateY(8px);
}

.property-value {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  text-align: right;
  white-space: nowrap;
}

.summary-card {
  background-color: var(--bgcolor);
  border-radius: 20px;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  padding: 20px;
  min-height: 640px;
  box-sizing: border-box;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.personal-wrapper {
  position: relative;
  width: 100%;
  border-radius: 10px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-wrapper :deep(.cad-preview-container) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-wrapper :deep(.stl-preview) {
  width: 100% !important;
  height: 100% !important;
  min-height: 250px;
  max-width: 100%;
  max-height: 100%;
  border: none !important;
  border-radius: 10px;
  background-color: #fff;
}

.preview-wrapper :deep(.preview-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  min-height: 250px;
  background-color: #fff;
  border-radius: 10px;
}

.cost-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 0;
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Use same button appearance pattern as PersonalOrder/PersonalCalcs. */
.toolbar-row :deep(.btn) {
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

.toolbar-row :deep(.btn::before) {
  display: none !important;
}

.summary-actions :deep(.btn) {
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

.summary-actions :deep(.btn:hover) {
  background: #aeb2b5 !important;
  transform: translateY(0) !important;
  box-shadow: none !important;
  animation: none !important;
}

.summary-actions :deep(.btn:active) {
  transform: translateY(0) !important;
  box-shadow: none !important;
}

.summary-actions :deep(.btn::before) {
  display: none !important;
}

@media (max-width: 992px) {
  .calc-layout {
    padding: 20px;
    border-radius: 0;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .toolbar-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .calc-side {
    max-width: 100%;
    justify-self: stretch;
  }

  .summary-card {
    min-height: auto;
  }
}
</style>
