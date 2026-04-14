<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { req_json_auth, req_json } from '../api'
import Button from './ui/Button.vue'
import InputEdit from './ui/InputEdit.vue'
import SelectFiles from './ui/SelectFiles.vue'
import CadShowById from './cad/CadShowById.vue'
import type { IOrderResponse, IKit } from '../interfaces/order.interface'
import { useMaterialStore } from '../stores/material.store'
import { useCoefficientsStore } from '../stores/coefficients.store'

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
  try {
    const response = await req_json_auth(`/documents/${uploadedDocument.id}`, 'DELETE')
    if (!response?.ok) {
      ElMessage.error('Не удалось удалить документ')
      return
    }

    uploadedDocuments.value = uploadedDocuments.value.filter((item) => item.id !== uploadedDocument.id)

    if (Array.isArray(orderData.value?.document_ids)) {
      orderData.value.document_ids = orderData.value.document_ids.filter(
        (documentId) => documentId !== uploadedDocument.id
      )
    }

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

  switch (serviceId) {
    case 'cnc-lathe':
      router.push({
        path: '/other',
        query: { orderId: orderIdValue.toString() },
      })
      break
    case 'cnc-milling':
      router.push({
        path: '/milling',
        query: { orderId: orderIdValue.toString() },
      })
      break
    case 'printing':
      router.push({
        path: '/printing',
        query: { orderId: orderIdValue.toString() },
      })
      break
    default:
      router.push({
        path: '/other',
        query: { orderId: orderIdValue.toString() },
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
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="product-card" shadow="never">
          <div class="toolbar-row">
            <Button width="250px" @click="handleBack">
               < Вернуться в Заказ
            </Button>
            <Button width="200px" type="secondary" @click="handleCalcInfo">
              Калькуляция
            </Button>
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
              <span class="property-label">Объем детали, см²</span>
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
              <span class="property-label">Площадь покраски, см²</span>
              <span class="property-divider" />
              <span class="property-value">-</span>
            </div>
          </div>

          <SelectFiles
            :uploaded-documents="uploadedDocuments"
            @view-document="downloadUploadedDocument"
            @remove-document="removeUploadedDocument"
          />
        </el-card>
      </el-col>

      <!-- Правая карточка -->
      <el-col :span="8">
        <div class="summary-card">
          <!-- Image Container -->
          <div class="image-container">
            <div class="personal-wrapper">
              <div v-if="fileId" class="preview-wrapper">
                <CadShowById v-model="fileId" />
              </div>
              <div v-else class="preview-placeholder">
                <div class="placeholder-content"></div>
              </div>
            </div>
          </div>

          <!-- Quantity Display -->
          <div class="cost-value" style="padding-top:20px">
            {{ quantity }} шт.
          </div>

          
          <div class="cost-item">
            <div class="cost-label">Стоимость 1 изд.</div>
            <div class="cost-value">
              {{ formatPrice(costPerItem) }}
            </div>
          </div>

          <div class="cost-item">
            <div class="cost-label">Общая стоимость</div>
            <div class="cost-value">
              {{ formatPrice(totalCostFormatted) }}
            </div>
          </div>
          <div class="summary-actions">
            <Button width="100%" type="secondary" :disabled="isCalculationDisabled" @click="handleEdit">
              Расчет
            </Button>
            <Button width="100%" :loading="isSaving" @click="saveOrder">
              Сохранить
            </Button>
          </div>
        </div>
      </el-col>
    </el-row>
  </section>
  </div>
</template>

<style scoped>
.personal-order {
  min-height: 130vh;
  box-sizing: border-box;
  background-color: white;
  padding: 20px 10px;
  border-radius: 20px;
}
.personal-calc-container {
  padding: 0;
  min-height: 500px;
}

/* Product Card Styling */
.product-card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}

:deep(.el-card) {
  border: none;
}

.product-card :deep(.el-card__body) {
  padding: 24px;
  border: none;
}

.toolbar-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
  background-color: #e4e7ed;
  border-radius: 8px;
}

/* Product Info Section */
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
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

/* Properties Section */
.properties-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.property-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 4px 0;
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
  border-bottom: 1px dashed #d0d5dd;
  transform: translateY(4px);
}

.property-value {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  text-align: right;
  white-space: nowrap;
}

/* Right Summary Card */
.summary-card {
  background-color: #e9ecef;
  border-radius: 16px;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  min-height: 100%;
}

/* Image Container */
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.personal-wrapper {
  position: relative;
  width: 100%;
  /* background-color: #fff; */
  border-radius: 12px;
  padding: 12px;
  /* min-height: 200px; */
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
  min-height: 180px;
  max-width: 100%;
  max-height: 100%;
  border: none !important;
  border-radius: 8px;
}

.preview-wrapper :deep(.preview-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  min-height: 180px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.cost-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}


.summary-actions {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .personal-calc-container {
    padding: 16px;
  }

  .summary-card {
    margin-top: 20px;
  }
}
</style>
