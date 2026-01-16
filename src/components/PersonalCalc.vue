<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { req_json_auth, req_json } from '../api'
import Button from './ui/Button.vue'
import type { IOrderResponse } from '../interfaces/order.interface'
import { useMaterialStore } from '../stores/material.store'
import { useCoefficientsStore } from '../stores/coefficients.store'
import { useProfileStore } from '../stores/profile.store'
import { hidePrice as hidePriceFn } from '../helpers/hide-price'

type OtherService = {
  id: string
  label: string
  service: string
}

type OtherServicesResponse = {
  other_services: OtherService[]
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

// Material store
const materialStore = useMaterialStore()

// Coefficients store
const coefficientsStore = useCoefficientsStore()

// Profile store
const profileStore = useProfileStore()
const username = computed(() => profileStore.profile?.username ?? null)
const status = computed(() => orderData.value?.status ?? null)
const hidePrice = computed(() => hidePriceFn(username.value, status.value))

// Order data storage
const orderData = ref<IOrderResponse | null>(null)

// Other services storage
const otherServices = ref<OtherService[]>([])

// Order name - represents the order name
const order_name = ref('')

// Manufacturing cost per unit in rubles
const manufacturingCost = ref(10526)

// Quantity of items to manufacture
const quantity = ref(8)

// Manufacturing time in days
const manufacturingTime = ref(3)

// Delivery cost in rubles
const deliveryCost = ref(0)

// Product properties - stores various attributes of the product
const productProperties = ref({
  serviceId: '', // ID услуги (Service ID)
  dimensions: '', // Размеры (Dimensions)
  partVolume: '', // Объем детали (Part volume)
  material: '', // Материал (Material)
  coating: '', // Покрытие (Coating)
})

// Calculate total cost including manufacturing and delivery
const totalCost = computed(() => {
  return manufacturingCost.value * quantity.value + deliveryCost.value
})

// Format number with spaces as thousand separators (Russian format)
const formatCurrency = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб'
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
      label: 'Фрезерные работы',
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

      // Update order name if order_name exists
      if (fetchedOrderData.order_name) {
        order_name.value = fetchedOrderData.order_name
      }
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

</script>

<template>
  <div
    class="personal-calc-container"
    v-loading="isLoading"
    element-loading-text="Загрузка данных заказа..."
  >
    <el-row :gutter="20">
      <!-- Left Card - Product Details and Configuration (2/3 width) -->
      <el-col :span="24">
        <el-card class="product-card" shadow="never">
          <!-- Top Section: Image, Filename, Cost, Quantity -->
          <div class="product-header">
            <!-- Image Preview Placeholder -->
            <div class="image-placeholder">
              <div class="placeholder-content">
                <!-- Placeholder for 3D model preview -->
              </div>
            </div>

            <!-- Product Info Section -->
            <div class="product-info">
              <!-- Order Name -->
              <div class="filename">{{ order_name }}</div>

              <!-- Manufacturing Cost -->
              <div class="cost-section">
                <div class="cost-label">Стоимость изготовления</div>
                <div v-if="!hidePrice" class="cost-value">{{ formatCurrency(totalCost) }}</div>
                <div v-else class="cost-value">Рассчитываем цену...</div>
                <div class="quantity-display">{{ quantity }} шт.</div>
              </div>
            </div>
          </div>

          <!-- Bottom Section: Product Properties -->
          <div class="properties-section">
            <div class="property-item">
              <span class="property-label">Услуга</span>
              <span class="property-value">{{ productProperties.serviceId || '-' }}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Размеры</span>
              <span class="property-value">{{ productProperties.dimensions || '-' }}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Объем детали</span>
              <span class="property-value">{{ productProperties.partVolume || '-' }}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Материал</span>
              <span class="property-value">{{ productProperties.material || '-' }}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Покрытие</span>
              <span class="property-value">{{ productProperties.coating || '-' }}</span>
            </div>
          </div>
          <div style="padding-top: 20px;">
            <Button width="200px" @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              Назад
            </Button>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<style scoped>
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

/* Product Header - Image and Info Section */
.product-header {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

/* Image Placeholder */
.image-placeholder {
  width: 120px;
  height: 120px;
  background-color: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
}

.filename {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

/* Cost Section */
.cost-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cost-label {
  font-size: 14px;
  color: #606266;
}

.cost-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.quantity-display {
  font-size: 14px;
  color: #909399;
}

/* Properties Section */
.properties-section {
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.property-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #e4e7ed;
}

.property-item:last-child {
  border-bottom: none;
}

.property-label {
  font-size: 14px;
  color: #606266;
  flex: 1;
}

.property-value {
  font-size: 14px;
  color: #909399;
  text-align: right;
  min-width: 100px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .personal-calc-container {
    padding: 16px;
  }

  .product-header {
    flex-direction: column;
  }

  .image-placeholder {
    width: 100%;
    height: 200px;
  }
}
</style>
