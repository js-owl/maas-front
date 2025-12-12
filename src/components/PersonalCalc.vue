<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Clock, Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { req_json_auth } from '../api'
import type { IOrderResponse } from '../interfaces/order.interface'
import { useMaterialStore } from '../stores/material.store'
import { useCoefficientsStore } from '../stores/coefficients.store'
import { useProfileStore } from '../stores/profile.store'
import { hidePrice as hidePriceFn } from '../helpers/hide-price'

// Get orderId from route query
const route = useRoute()
const router = useRouter()
const orderId = computed(() => Number(route.query.orderId) || 0)

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

// Model filename - represents the uploaded 3D model file
const modelFilename = ref('Example_model.stl')

// Manufacturing cost per unit in rubles
const manufacturingCost = ref(10526)

// Quantity of items to manufacture
const quantity = ref(8)

// Selected production location
const selectedProduction = ref('Москва')

// Manufacturing time in days
const manufacturingTime = ref(3)

// Delivery time in days
const deliveryTime = ref(4)

// Delivery cost in rubles
const deliveryCost = ref(0)

// Product properties - stores various attributes of the product
const productProperties = ref({
  dimensions: '', // Размеры (Dimensions)
  partVolume: '', // Объем детали (Part volume)
  material: '', // Материал (Material)
  postProcessing: '', // Постобработка (Post-processing)
  coating: '', // Покрытие (Coating)
  certification: '', // Сертификация (Certification)
})

// Available production locations
const productionLocations = ['Москва', 'Дубна', 'Саранск']

// Calculate total cost including manufacturing and delivery
const totalCost = computed(() => {
  return manufacturingCost.value * quantity.value + deliveryCost.value
})

// Format number with spaces as thousand separators (Russian format)
const formatCurrency = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб'
}

// Handle quantity increase
// const increaseQuantity = () => {
//   quantity.value += 1
// }

// // Handle quantity decrease
// const decreaseQuantity = () => {
//   if (quantity.value > 1) {
//     quantity.value -= 1
//   }
// }

// // Handle quantity input change
// const handleQuantityChange = (value: number | null) => {
//   if (value !== null && value >= 1) {
//     quantity.value = value
//   } else {
//     quantity.value = 1
//   }
// }

// Handle calculate cost button click
const handleCalculateCost = () => {
  // Navigate to calculation info page with orderId as query parameter
  router.push({
    name: 'personal-calc-info',
    query: { orderId: orderId.value },
  })
}

// Handle production location selection
const handleProductionChange = (location: string) => {
  selectedProduction.value = location
  // TODO: Update delivery cost and time based on selected location
  console.log('Production location changed to:', location)
}

// Fetch filename from API by file_id
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

      // Update model filename if file_id exists
      if (fetchedOrderData.file_id) {
        const filename = await fetchFilename(fetchedOrderData.file_id)
        modelFilename.value = filename || `Model_${fetchedOrderData.file_id}.stl`
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
      <el-col :span="16">
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
              <!-- Filename -->
              <div class="filename">{{ modelFilename }}</div>

              <!-- Manufacturing Cost -->
              <div class="cost-section">
                <div class="cost-label">Стоимость изготовления</div>
                <div v-if="!hidePrice" class="cost-value">{{ formatCurrency(totalCost) }}</div>
                <div v-else class="cost-value">Рассчитываем цену...</div>
                <div class="quantity-display">{{ quantity }} шт.</div>
              </div>
            </div>
            <!-- Quantity Input Section -->
            <div class="quantity-section">
              <el-button type="default" class="calculate-button" @click="handleCalculateCost">
                Калькуляция стоимости
              </el-button>

              <!-- <div class="quantity-label">Количество</div>
              <div class="quantity-controls">
                <el-button circle size="small" :disabled="quantity <= 1" @click="decreaseQuantity">
                  -
                </el-button>
                <el-input-number
                  v-model="quantity"
                  :min="1"
                  :max="1000"
                  size="default"
                  :controls="false"
                  class="quantity-input"
                  @change="handleQuantityChange"
                />
                <el-button circle size="small" @click="increaseQuantity">+</el-button>
              </div> -->
            </div>
          </div>

          <!-- Bottom Section: Product Properties -->
          <div class="properties-section">
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
            <!-- <div class="property-item">
              <span class="property-label">Сертификация</span>
              <span class="property-value">{{ productProperties.certification || '-' }}</span>
            </div> -->
          </div>
        </el-card>
      </el-col>

      <!-- Right Column - Order Summary and Production Selection -->
      <el-col :span="8">
        <el-row :gutter="20">
          <!-- Top-Right Card - Order Summary -->
          <el-col :span="24">
            <el-card v-if="!hidePrice" class="order-summary-card" shadow="never">
                <div class="total-cost">{{ formatCurrency(totalCost) }}</div>
              <div class="order-details">
                <div class="order-detail-item">
                  <el-icon class="detail-icon">
                    <Clock />
                  </el-icon>
                  <span class="detail-label">Срок изготовления</span>
                  <span class="detail-value">{{ manufacturingTime }}</span>
                </div>
                <div class="order-detail-item">
                  <el-icon class="detail-icon">
                    <Location />
                  </el-icon>
                  <span class="detail-label">Срок доставки</span>
                  <span class="detail-value">{{ deliveryTime }}</span>
                </div>
                <div class="order-detail-item">
                  <span class="detail-label">Стоимость доставки</span>
                  <span class="detail-value">{{
                    deliveryCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                  }}</span>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- Bottom-Right Card - Production Location Selection -->
          <el-col :span="24">
            <el-card class="production-card" shadow="never">
              <div class="production-title">Выбрать производство</div>
              <el-radio-group
                v-model="selectedProduction"
                class="production-options"
                @change="handleProductionChange"
              >
                <el-radio
                  v-for="location in productionLocations"
                  :key="location"
                  :label="location"
                  class="production-radio"
                >
                  {{ location }}
                </el-radio>
              </el-radio-group>
            </el-card>
          </el-col>
        </el-row>
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

.product-card :deep(.el-card__body) {
  padding: 24px;
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

/* Quantity Section */
.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.calculate-button {
  width: 100%;
  background-color: #f5f7fa;
  border-color: #dcdfe6;
  color: #606266;
  margin-bottom: 8px;
}

.edit-button {
  width: 100%;
  margin-bottom: 8px;
}

.quantity-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-input {
  width: 80px;
}

.quantity-input :deep(.el-input__wrapper) {
  border-radius: 4px;
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

/* Order Summary Card */
.order-summary-card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}

.order-summary-card :deep(.el-card__body) {
  padding: 24px;
}

.total-cost {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
  text-align: left;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-icon {
  font-size: 20px;
  color: #606266;
}

.detail-label {
  font-size: 14px;
  color: #606266;
  flex: 1;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

/* Production Card */
.production-card {
  background: #fff;
  border-radius: 8px;
}

.production-card :deep(.el-card__body) {
  padding: 24px;
}

.production-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 16px;
}

.production-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.production-radio {
  width: 100%;
  margin: 0;
  padding: 8px 0;
}

.production-radio :deep(.el-radio__label) {
  padding-left: 8px;
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
