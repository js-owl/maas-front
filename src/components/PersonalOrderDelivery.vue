<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { req_json_auth } from '../api'
import type { IKit, IOrderResponse } from '../interfaces/order.interface'
import { useProfileStore } from '../stores/profile.store'
import {
  buildDeliveryPointByCodeQuery,
  buildDeliveryPointsQuery,
  filterPvzPoints,
  formatDeliveryTracking,
  kitDeliveryQuoteReadiness,
  normalizePostalCode,
  pickCheapestPvzTariff,
  pickCityCode,
  pickDefaultPvzCode,
  pvzCodeLabel,
  pvzStreetLabel,
  shouldRefreshShipmentOnLoad,
  unwrapList,
  type CdekCity,
  type CdekPvz,
  type CdekTariff,
  type DeliveryShipment,
} from '../helpers/cdek-delivery'
import { orderLinePrice, unwrapApiData } from '../helpers/order-price'
import PvzMapPreview from './delivery/PvzMapPreview.vue'
import Select from './ui/Select.vue'
import Button from './ui/Button.vue'
import IconArrowLeft from '@/icons/IconArrowLeft.vue'

type KitOrder = IKit & {
  status_name?: string
}

const route = useRoute()
const router = useRouter()
const profileStore = useProfileStore()

const order = ref<KitOrder | null>(null)
const calcRows = ref<IOrderResponse[]>([])
const shipment = ref<DeliveryShipment | null>(null)
const pvzPoints = ref<CdekPvz[]>([])
const resolvedPvz = ref<CdekPvz | null>(null)
const pvzSearchQuery = ref('')
const pvzDropdownOpen = ref(false)
const selectedPvzCode = ref('')
const pvzTariff = ref<CdekTariff | null>(null)
const cityCode = ref<number | null>(null)
const deliveryLoading = ref(false)
const deliveryError = ref('')
const confirmLoading = ref(false)

const kitId = computed(() => {
  const fromQuery = route.query.kitId
  if (Array.isArray(fromQuery)) return Number(fromQuery[0])
  return Number(fromQuery) || 0
})

const formatPrice = (value?: number | null): string => {
  if (value == null) return '0'
  const n = Number(value)
  if (Number.isNaN(n)) return '0'
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(Math.trunc(n))
}

const deliveryQuote = computed(() => {
  if (pvzTariff.value?.delivery_sum != null) return Number(pvzTariff.value.delivery_sum)
  if (shipment.value?.delivery_sum != null) return Number(shipment.value.delivery_sum)
  return Number(order.value?.delivery_price ?? 0)
})

const deliveryCostLabel = computed(() => formatPrice(deliveryQuote.value))

const totalWithDelivery = computed(() => {
  const kitTotal = Number(order.value?.total_kit_price ?? 0)
  const rowsTotal = calcRows.value.reduce((sum, row) => sum + orderLinePrice(row), 0)
  const manufacturing = kitTotal > 0 ? kitTotal : rowsTotal
  return formatPrice(manufacturing + Number(deliveryQuote.value || 0))
})

const canConfirmOrder = computed(() => order.value?.status === 'AWAITING_CONFIRMATION')

const displayPvz = computed(() => {
  const code = (selectedPvzCode.value || shipment.value?.delivery_point_code || '').trim()
  if (!code) return null
  const fromList = pvzPoints.value.find((point) => point.code === code)
  if (fromList) return fromList
  if (resolvedPvz.value?.code === code) return resolvedPvz.value
  return null
})

const showPvzDetails = computed(
  () => Boolean(displayPvz.value) && (!canConfirmOrder.value || !pvzDropdownOpen.value)
)

const displayPvzPoints = computed(() => filterPvzPoints(pvzPoints.value, pvzSearchQuery.value))

const hasDeliveryOption = computed(
  () => Boolean(selectedPvzCode.value && pvzTariff.value?.tariff_code)
)

const confirmDisabled = computed(
  () =>
    confirmLoading.value ||
    deliveryLoading.value ||
    (!deliveryError.value && !hasDeliveryOption.value)
)

const deliveryQuoteReadiness = computed(() => kitDeliveryQuoteReadiness(calcRows.value))
const deliveryTracking = computed(() => formatDeliveryTracking(shipment.value))

const onPvzFilter = (query: string) => {
  pvzSearchQuery.value = query
}

const pvzPopperOptions = {
  modifiers: [
    { name: 'flip', enabled: false },
    { name: 'offset', options: { offset: [0, 8] } },
    { name: 'preventOverflow', options: { padding: 8, altAxis: false } },
  ],
}

const onPvzVisibleChange = (visible: boolean) => {
  pvzDropdownOpen.value = visible
  if (!visible) {
    pvzSearchQuery.value = ''
    return
  }
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>('.delivery-pvz-select .el-select__input')
    input?.focus()
    input?.select()
  })
}

const loadCalcs = async () => {
  if (!order.value?.order_ids?.length) {
    calcRows.value = []
    return
  }

  const responses = await Promise.all(
    order.value.order_ids.map(async (id) => {
      const res = await req_json_auth(`/orders/${id}`, 'GET')
      if (!res?.ok) throw new Error(`Failed to load calc order ${id}`)
      return unwrapApiData<IOrderResponse>(await res.json())
    })
  )
  calcRows.value = responses
}

const loadPvzDetailsForShipment = async () => {
  const code = (shipment.value?.delivery_point_code || selectedPvzCode.value || '').trim()
  if (!code) {
    resolvedPvz.value = null
    return
  }
  if (pvzPoints.value.some((point) => point.code === code)) {
    resolvedPvz.value = pvzPoints.value.find((point) => point.code === code) || null
    return
  }
  if (resolvedPvz.value?.code === code) return
  try {
    const res = await req_json_auth(buildDeliveryPointByCodeQuery(code), 'GET')
    if (!res?.ok) return
    const points = unwrapList<CdekPvz>(await res.json())
    resolvedPvz.value = points.find((point) => point.code === code) || points[0] || null
  } catch {
    resolvedPvz.value = null
  }
}

const refreshShipmentIfNeeded = async () => {
  const current = shipment.value
  if (!shouldRefreshShipmentOnLoad(current, order.value?.status)) return
  if (!current?.id) return
  try {
    const res = await req_json_auth(`/delivery/shipments/${current.id}/refresh`, 'POST')
    if (!res?.ok) return
    const data = await res.json()
    if (data && typeof data === 'object') {
      shipment.value = data as DeliveryShipment
      if (shipment.value.delivery_point_code) {
        selectedPvzCode.value = shipment.value.delivery_point_code
      }
      await loadPvzDetailsForShipment()
    }
  } catch {
    // Keep cached shipment; tracking block still shows UUID/status fallback.
  }
}

const loadShipment = async () => {
  if (!kitId.value) return
  try {
    const res = await req_json_auth(`/delivery/kits/${kitId.value}/shipment`, 'GET')
    if (!res?.ok) {
      shipment.value = null
      return
    }
    const data = await res.json()
    shipment.value = data && typeof data === 'object' ? (data as DeliveryShipment) : null
    if (shipment.value?.delivery_point_code) {
      selectedPvzCode.value = shipment.value.delivery_point_code
    }
    await refreshShipmentIfNeeded()
    await loadPvzDetailsForShipment()
  } catch {
    shipment.value = null
  }
}

const loadDeliveryQuote = async () => {
  if (!kitId.value) return
  const readiness = deliveryQuoteReadiness.value
  if (!readiness.ready) {
    deliveryLoading.value = false
    deliveryError.value = readiness.reason
    pvzPoints.value = []
    pvzTariff.value = null
    return
  }
  deliveryLoading.value = true
  deliveryError.value = ''
  pvzSearchQuery.value = ''
  pvzTariff.value = null
  try {
    if (!profileStore.profile) {
      await profileStore.getProfile()
    }
    const profile = profileStore.profile
    const cityName = (profile?.city_name || profile?.city || '').trim()
    const postal = normalizePostalCode(profile?.postal)
    const phone = (profile?.personal_phone_number || profile?.phone_number || '').trim()
    if (!cityName) {
      deliveryError.value = 'Укажите город в профиле, чтобы рассчитать доставку в ПВЗ'
      return
    }
    if (!phone) {
      deliveryError.value = 'Укажите телефон в профиле для оформления доставки'
      return
    }
    const citiesRes = await req_json_auth(
      `/delivery/cdek/cities?q=${encodeURIComponent(cityName)}&size=5`,
      'GET'
    )
    if (!citiesRes?.ok) throw new Error('cities')
    const cities = unwrapList<CdekCity>(await citiesRes.json())
    const code = pickCityCode(cities, cityName)
    if (!code) {
      deliveryError.value = 'Не удалось определить город СДЭК по адресу профиля'
      return
    }
    cityCode.value = code

    let pointsRes = await req_json_auth(buildDeliveryPointsQuery(code, postal), 'GET')
    if (!pointsRes?.ok) throw new Error('pvz')
    let points = unwrapList<CdekPvz>(await pointsRes.json()).filter((point) => Boolean(point.code))
    if (!points.length && postal) {
      pointsRes = await req_json_auth(buildDeliveryPointsQuery(code), 'GET')
      if (!pointsRes?.ok) throw new Error('pvz')
      points = unwrapList<CdekPvz>(await pointsRes.json()).filter((point) => Boolean(point.code))
    }
    pvzPoints.value = points
    if (!pvzPoints.value.length) {
      deliveryError.value = postal
        ? 'Рядом с индексом из профиля нет пунктов выдачи СДЭК'
        : 'Рядом с адресом нет пунктов выдачи СДЭК'
      return
    }
    if (!selectedPvzCode.value || !pvzPoints.value.some((point) => point.code === selectedPvzCode.value)) {
      selectedPvzCode.value = pickDefaultPvzCode(pvzPoints.value, postal)
    }

    const calcRes = await req_json_auth('/delivery/cdek/calculate', 'POST', {
      kit_id: kitId.value,
      to_location_code: code,
    })
    if (!calcRes?.ok) {
      const detail = await calcRes?.text()
      throw new Error(detail || 'calculate')
    }
    const calcBody = await calcRes.json()
    const tariffs = unwrapList<CdekTariff>(
      (calcBody as { tariff_codes?: CdekTariff[] })?.tariff_codes ?? calcBody
    )
    const cheapest = pickCheapestPvzTariff(tariffs)
    if (!cheapest) {
      deliveryError.value = 'Нет тарифа СДЭК до пункта выдачи для этого заказа'
      return
    }
    pvzTariff.value = cheapest
  } catch (error) {
    console.error(error)
    deliveryError.value = 'Не удалось рассчитать доставку. Проверьте вес деталей и адрес профиля.'
  } finally {
    deliveryLoading.value = false
  }
}

const loadOrder = async () => {
  if (!kitId.value) {
    ElMessage.error('Не удалось открыть доставку: заказ не найден')
    return
  }
  try {
    const res = await req_json_auth(`/kits/${kitId.value}`, 'GET')
    if (!res?.ok) throw new Error('Failed to load order')
    order.value = unwrapApiData<KitOrder>(await res.json())
    await loadCalcs()
    await loadShipment()
    if (order.value?.status === 'AWAITING_CONFIRMATION') {
      await loadDeliveryQuote()
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('Не удалось загрузить данные доставки')
  }
}

const confirmOrder = async () => {
  if (!kitId.value || !order.value) return
  const tariff = pvzTariff.value
  const pvzCode = selectedPvzCode.value
  const withDelivery = Boolean(pvzCode && tariff?.tariff_code)
  if (!withDelivery && !deliveryError.value) {
    ElMessage.warning('Выберите пункт выдачи СДЭК')
    return
  }
  if (confirmLoading.value) return
  confirmLoading.value = true

  try {
    const updateRes = await req_json_auth(`/kits/${kitId.value}`, 'PUT', {
      kit_name: order.value.kit_name,
      quantity: order.value.quantity,
      order_ids: order.value.order_ids,
      location: order.value.location || 'location_1',
    })
    if (!updateRes?.ok) throw new Error('Failed to save order before confirm')

    if (withDelivery && tariff && pvzCode) {
      const optionRes = await req_json_auth(`/delivery/kits/${kitId.value}/option`, 'PUT', {
        tariff_code: tariff.tariff_code,
        delivery_mode: 'pvz',
        delivery_point_code: pvzCode,
        delivery_sum: tariff.delivery_sum,
        period_min: tariff.period_min,
        period_max: tariff.period_max,
        to_location_code: cityCode.value,
      })
      if (!optionRes?.ok) {
        const detail = await optionRes?.text()
        throw new Error(detail || 'Failed to save delivery option')
      }
    }

    const res = await req_json_auth(`/kits/${kitId.value}/confirm`, 'PUT')
    if (!res?.ok) throw new Error('Failed to confirm order')

    await loadOrder()
    ElMessage.success(
      withDelivery
        ? 'Заказ подтверждён. Доставка в ПВЗ будет оформлена после изготовления.'
        : 'Заказ подтверждён'
    )
  } catch (error) {
    console.error(error)
    ElMessage.error('Не удалось подтвердить заказ')
  } finally {
    confirmLoading.value = false
  }
}

const goBack = () => {
  router.push({
    name: 'personal-order',
    query: kitId.value ? { kitId: kitId.value.toString() } : undefined,
  })
}

onMounted(() => {
  void loadOrder()
})
</script>

<template>
  <section class="order-delivery">
    <div class="order-delivery__card">
      <button type="button" class="order-delivery__back" @click="goBack">
        <IconArrowLeft color="#000" />
        К заказу
      </button>

      <h1 class="order-delivery__title">Доставка</h1>

      <div class="delivery-section">
        <div class="maas-subtitle delivery-section__title">Доставка СДЭК (ПВЗ)</div>
        <p v-if="deliveryLoading" class="delivery-section__hint">Расчёт доставки…</p>
        <p
          v-else-if="canConfirmOrder && !deliveryQuoteReadiness.ready"
          class="delivery-section__hint"
        >
          {{ deliveryQuoteReadiness.reason }}
        </p>
        <p v-else-if="deliveryError && canConfirmOrder" class="delivery-section__error">
          {{ deliveryError }}
        </p>
        <template v-else>
          <p v-if="canConfirmOrder && pvzPoints.length" class="delivery-section__search-hint">
            Введите код ПВЗ или улицу для поиска
          </p>
          <Select
            v-if="canConfirmOrder && pvzPoints.length"
            v-model="selectedPvzCode"
            placeholder="Найти ПВЗ: код или улица"
            filterable
            clearable
            fit-input-width
            placement="bottom-start"
            :popper-options="pvzPopperOptions"
            :filter-method="onPvzFilter"
            no-match-text="Пункт не найден"
            dropdown-class="delivery-pvz-select-dropdown"
            width="100%"
            size="default"
            class="delivery-pvz-select"
            @visible-change="onPvzVisibleChange"
          >
            <template #prefix>
              <el-icon class="delivery-pvz-select__search-icon" aria-hidden="true">
                <Search />
              </el-icon>
            </template>
            <template #header>
              <div class="delivery-pvz-dropdown__header">Поиск по коду или улице</div>
            </template>
            <el-option
              v-for="point in displayPvzPoints"
              :key="point.code"
              :label="pvzCodeLabel(point)"
              :value="point.code || ''"
            >
              <div class="delivery-pvz-option">
                <span class="delivery-pvz-option__code">{{ pvzCodeLabel(point) }}</span>
                <span class="delivery-pvz-option__addr">{{ pvzStreetLabel(point) }}</span>
              </div>
            </el-option>
          </Select>
          <div v-if="showPvzDetails && displayPvz" class="delivery-section__selected-pvz">
            <span class="delivery-section__selected-pvz-code">{{ pvzCodeLabel(displayPvz) }}</span>
            <span class="delivery-section__selected-pvz-addr">{{ pvzStreetLabel(displayPvz) }}</span>
          </div>
          <PvzMapPreview v-if="showPvzDetails && displayPvz" :point="displayPvz" />
          <div
            v-else-if="shipment?.delivery_point_code && !displayPvz"
            class="summary-field summary-field--inline"
          >
            <span class="maas-text">ПВЗ</span>
            <span class="summary-field__value">{{ shipment.delivery_point_code }}</span>
          </div>
          <div class="summary-field summary-field--inline">
            <span class="maas-text">Стоимость доставки</span>
            <span class="summary-field__value">{{ deliveryCostLabel }} руб.</span>
          </div>
          <div
            v-if="pvzTariff?.period_min && canConfirmOrder"
            class="summary-field summary-field--inline"
          >
            <span class="maas-text">Срок</span>
            <span class="summary-field__value">
              {{ pvzTariff.period_min }}–{{ pvzTariff.period_max }} дн. после отгрузки
            </span>
          </div>
          <div v-if="deliveryTracking" class="summary-field summary-field--inline">
            <span class="maas-text">Отправление</span>
            <span class="summary-field__value">{{ deliveryTracking }}</span>
          </div>
          <div class="summary-field summary-field--cost">
            <span class="maas-text">Итого с доставкой</span>
            <span class="summary-field__value summary-field__value--cost">
              {{ totalWithDelivery }} <span class="rub">руб.</span>
            </span>
          </div>
        </template>
      </div>

      <div v-if="canConfirmOrder" class="order-delivery__actions">
        <Button
          :loading="confirmLoading"
          :disabled="confirmDisabled"
          class="pay-order-button"
          @click="confirmOrder"
        >
          Подтвердить заказ
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.order-delivery {
  background-color: var(--bgcolor);
}

.order-delivery__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  max-width: 720px;
  padding: 40px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 15px 0 var(--button-bg);
}

.order-delivery__back {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  background: var(--button-bg);
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
}

.order-delivery__title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #000;
}

.delivery-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.delivery-section__title {
  font-size: 14px;
}

.delivery-section__hint,
.delivery-section__error,
.delivery-section__search-hint {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  line-height: 1.4;
}

.delivery-section__search-hint {
  color: #475467;
}

.delivery-section__error {
  color: #b42318;
}

.delivery-section__selected-pvz {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 12px 14px;
  border: 1px solid #e4e7ec;
  border-radius: 12px;
  background: #f9fafb;
}

.delivery-section__selected-pvz-code {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  line-height: 1.2;
  color: #101828;
}

.delivery-section__selected-pvz-addr {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: #475467;
  word-break: break-word;
}

.delivery-pvz-select {
  width: 100%;
}

.delivery-pvz-select :deep(.el-select__wrapper) {
  min-height: 44px;
  height: 44px;
  align-items: center;
  padding: 0 14px;
  font-size: 14px;
  cursor: text;
}

.delivery-pvz-select :deep(.el-select__selection) {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}

.delivery-pvz-select :deep(.el-select__selected-item),
.delivery-pvz-select :deep(.el-select__selection-text) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.delivery-pvz-select :deep(.el-select__suffix) {
  align-self: center;
}

.delivery-pvz-select :deep(.el-select__prefix) {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  color: #667085;
}

.delivery-pvz-select__search-icon {
  font-size: 18px;
}

.delivery-pvz-select :deep(.el-select__placeholder) {
  color: #667085;
}

.delivery-pvz-select :deep(.el-select__input) {
  cursor: text;
}

.summary-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.maas-text {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.summary-field__value {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #000;
}

.summary-field__value--cost {
  font-size: 24px;
  line-height: 1.4;
}

.rub {
  margin-left: 4px;
}

.order-delivery__actions {
  width: 100%;
  max-width: 360px;
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

.pay-order-button :deep(.btn:hover),
.pay-order-button :deep(.btn:active) {
  background: #aeb2b5 !important;
  transform: translateY(0) !important;
  box-shadow: none !important;
  animation: none !important;
}

.pay-order-button :deep(.btn::before) {
  display: none !important;
}

@media (max-width: 768px) {
  .order-delivery__card {
    padding: 16px;
    border-radius: 16px;
  }
}
</style>

<style>
.delivery-pvz-select-dropdown.el-popper {
  box-sizing: border-box;
  padding: 12px 16px 16px !important;
  background: #fff !important;
  border: 1px solid #e4e7ec !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.12) !important;
}

.delivery-pvz-select-dropdown .el-select-dropdown {
  background: transparent;
  border: none;
  box-shadow: none;
}

.delivery-pvz-select-dropdown .el-popper__arrow {
  display: none;
}

.delivery-pvz-dropdown__header {
  padding: 0 4px 10px;
  border-bottom: 1px solid #f2f4f7;
  margin-bottom: 8px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 13px;
  line-height: 1.3;
  color: #667085;
}

.delivery-pvz-select-dropdown .el-select-dropdown__wrap {
  height: 260px;
  max-height: 260px;
  min-height: 260px;
}

.delivery-pvz-select-dropdown .el-select-dropdown__list {
  min-height: 220px;
  padding: 0 !important;
}

.delivery-pvz-select-dropdown .el-select-dropdown__item {
  display: flex;
  align-items: flex-start;
  height: auto;
  min-height: 52px;
  padding: 10px 12px !important;
  line-height: 1.2 !important;
  color: #101828 !important;
  background: #fff !important;
}

.delivery-pvz-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
}

.delivery-pvz-option__code {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  color: #101828;
}

.delivery-pvz-option__addr {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 13px;
  line-height: 1.35;
  color: #475467;
  white-space: normal;
  word-break: break-word;
}

.delivery-pvz-select-dropdown .el-select-dropdown__item.is-hovering,
.delivery-pvz-select-dropdown .el-select-dropdown__item:hover {
  background: #f9fafb !important;
}

.delivery-pvz-select-dropdown .el-select-dropdown__item.is-selected {
  font-weight: 600 !important;
  background: #f2f4f7 !important;
}

.delivery-pvz-select-dropdown .el-select-dropdown__empty {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  color: #667085;
}
</style>
