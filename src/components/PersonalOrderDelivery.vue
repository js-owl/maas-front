<script lang="ts" setup>
import { computed, defineAsyncComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ru from 'element-plus/es/locale/lang/ru'
import { req_json_auth } from '../api'
import type { IKit, IOrderResponse } from '../interfaces/order.interface'
import { kitStatusTail } from '../helpers/status-text'
import { orderLinePrice, unwrapApiData } from '../helpers/order-price'
import { useProfileStore } from '../stores/profile.store'
import {
  buildDeliveryPointByCodeQuery,
  buildDeliveryPointsQuery,
  filterPvzPoints,
  kitDeliveryQuoteReadiness,
  normalizePostalCode,
  pickCheapestPvzTariff,
  pickCityCode,
  pickDefaultPvzCode,
  pvzCodeLabel,
  pvzStreetLabel,
  unwrapList,
  type CdekCity,
  type CdekPvz,
  type CdekTariff,
  type DeliveryShipment,
} from '../helpers/cdek-delivery'
import PvzMapPreview from './delivery/PvzMapPreview.vue'
import iconTransport from '@/assets/delivery/icon-transport.svg'
import iconPickup from '@/assets/delivery/icon-pickup.svg'
import iconChevron from '@/assets/delivery/icon-chevron.svg'
import iconBack from '@/assets/delivery/icon-back.svg'

const CadPreview = defineAsyncComponent(() => import('./cad/CadPreview.vue'))

type KitOrder = IKit & {
  status_name?: string
}

type DeliveryType = 'transport' | 'pickup'

const route = useRoute()
const router = useRouter()
const profileStore = useProfileStore()

const order = ref<KitOrder | null>(null)
const calcRows = ref<IOrderResponse[]>([])
const isLoading = ref(false)
const confirmLoading = ref(false)
const deliveryType = ref<DeliveryType>('transport')
const deliveryDate = ref<Date | null>(null)
const deliveryComment = ref('')
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
  }).format(Math.round(n))
}

const orderLines = computed(() =>
  calcRows.value.map((row) => {
    const quantity = Number(row.quantity) > 0 ? Number(row.quantity) : 1
    const total = orderLinePrice(row)
    return {
      id: row.order_id,
      name: row.order_name || row.order_code || 'Деталь',
      quantity,
      unitPrice: total / quantity,
      total,
      fileId: row.file_id,
    }
  })
)

const goodsSum = computed(() => {
  if (orderLines.value.length) {
    return orderLines.value.reduce((sum, line) => sum + line.total, 0)
  }
  return Number(order.value?.total_kit_price ?? 0)
})

const vatAmount = computed(() => Math.round(goodsSum.value * 0.2))
const grandTotal = computed(() => goodsSum.value + vatAmount.value)

const orderStatusTail = computed(() => kitStatusTail(order.value?.status))

const canConfirmOrder = computed(() => orderStatusTail.value === 'AWAITING_CONFIRMATION')

const deliveryQuoteReadiness = computed(() => kitDeliveryQuoteReadiness(calcRows.value))

const displayPvz = computed(() => {
  const code = (selectedPvzCode.value || shipment.value?.delivery_point_code || '').trim()
  if (!code) return null
  const fromList = pvzPoints.value.find((point) => point.code === code)
  if (fromList) return fromList
  if (resolvedPvz.value?.code === code) return resolvedPvz.value
  return null
})

const displayPvzPoints = computed(() => filterPvzPoints(pvzPoints.value, pvzSearchQuery.value))

const hasDeliveryOption = computed(
  () => Boolean(selectedPvzCode.value && pvzTariff.value?.tariff_code && cityCode.value != null)
)

const pvzPopperOptions = {
  modifiers: [
    { name: 'flip', enabled: false },
    { name: 'offset', options: { offset: [0, 8] } },
    { name: 'preventOverflow', options: { padding: 8, altAxis: false } },
  ],
}

const isPastDate = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return start.getTime() < todayStart.getTime()
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

const loadOrder = async () => {
  if (!kitId.value) {
    ElMessage.error('Не удалось открыть доставку: заказ не найден')
    return
  }
  isLoading.value = true
  try {
    const res = await req_json_auth(`/kits/${kitId.value}`, 'GET')
    if (!res?.ok) throw new Error('Failed to load order')
    order.value = unwrapApiData<KitOrder>(await res.json())
    await loadCalcs()
    if (deliveryType.value === 'transport') {
      await loadShipment()
      await loadDeliveryQuote()
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('Не удалось загрузить данные доставки')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push({
    name: 'personal-order',
    query: kitId.value ? { kitId: kitId.value.toString() } : undefined,
  })
}

const onPvzFilter = (query: string) => {
  pvzSearchQuery.value = query
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

const loadPvzDetails = async (code: string) => {
  const pointCode = code.trim()
  if (!pointCode) {
    resolvedPvz.value = null
    return
  }
  const fromList = pvzPoints.value.find((point) => point.code === pointCode)
  if (fromList) {
    resolvedPvz.value = fromList
    return
  }
  if (resolvedPvz.value?.code === pointCode) return
  try {
    const res = await req_json_auth(buildDeliveryPointByCodeQuery(pointCode), 'GET', undefined, [404])
    if (!res?.ok) return
    const points = unwrapList<CdekPvz>(await res.json())
    resolvedPvz.value = points.find((point) => point.code === pointCode) || points[0] || null
  } catch {
    resolvedPvz.value = null
  }
}

const loadShipment = async () => {
  if (!kitId.value) return
  try {
    const res = await req_json_auth(`/delivery/kits/${kitId.value}/shipment`, 'GET', undefined, [404])
    if (!res?.ok) {
      shipment.value = null
      return
    }
    const data = await res.json()
    shipment.value = data && typeof data === 'object' ? (data as DeliveryShipment) : null
    if (shipment.value?.delivery_point_code) {
      selectedPvzCode.value = shipment.value.delivery_point_code
      await loadPvzDetails(shipment.value.delivery_point_code)
    }
  } catch {
    shipment.value = null
  }
}

const loadDeliveryQuote = async () => {
  if (!kitId.value || deliveryType.value !== 'transport') return
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
      'GET',
      undefined,
      [400, 404, 422]
    )
    if (!citiesRes?.ok) throw new Error('cities')
    const cities = unwrapList<CdekCity>(await citiesRes.json())
    const code = pickCityCode(cities, cityName)
    if (!code) {
      deliveryError.value = 'Не удалось определить город СДЭК по адресу профиля'
      return
    }
    cityCode.value = code

    let pointsRes = await req_json_auth(buildDeliveryPointsQuery(code, postal), 'GET', undefined, [
      400, 404, 422,
    ])
    if (!pointsRes?.ok) throw new Error('pvz')
    let points = unwrapList<CdekPvz>(await pointsRes.json()).filter((point) => Boolean(point.code))
    if (!points.length && postal) {
      pointsRes = await req_json_auth(buildDeliveryPointsQuery(code), 'GET', undefined, [400, 404, 422])
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
    await loadPvzDetails(selectedPvzCode.value)

    const calcRes = await req_json_auth(
      '/delivery/cdek/calculate',
      'POST',
      {
        kit_id: kitId.value,
        to_location_code: code,
      },
      [400, 404, 422]
    )
    if (!calcRes?.ok) throw new Error('calculate')
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

const readApiMessage = async (res: Response): Promise<string> => {
  try {
    const data = await res.json()
    const message = data?.message ?? data?.detail
    return typeof message === 'string' ? message : ''
  } catch {
    return ''
  }
}

const confirmErrorText = (message: string): string => {
  if (/select a cdek pickup point/i.test(message)) {
    return 'Выберите пункт выдачи СДЭК, чтобы подтвердить заказ'
  }
  return message || 'Не удалось подтвердить заказ'
}

const ensureDeliveryReady = (): boolean => {
  if (deliveryType.value !== 'transport') return true
  if (deliveryLoading.value) return false
  if (!hasDeliveryOption.value) {
    ElMessage.warning(deliveryError.value || 'Выберите пункт выдачи СДЭК')
    return false
  }
  return true
}

const confirmOrder = async () => {
  if (!ensureDeliveryReady()) return
  if (!kitId.value || !order.value || confirmLoading.value) return

  confirmLoading.value = true
  try {
    const updateRes = await req_json_auth(`/kits/${kitId.value}`, 'PUT', {
      kit_name: order.value.kit_name,
      quantity: order.value.quantity,
      order_ids: order.value.order_ids,
      location: order.value.location || 'location_1',
    })
    if (!updateRes?.ok) throw new Error('Не удалось сохранить заказ')

    if (deliveryType.value === 'transport' && pvzTariff.value && selectedPvzCode.value) {
      const tariff = pvzTariff.value
      const optionRes = await req_json_auth(
        `/delivery/kits/${kitId.value}/option`,
        'PUT',
        {
          tariff_code: tariff.tariff_code,
          delivery_mode: 'pvz',
          delivery_point_code: selectedPvzCode.value,
          delivery_sum: tariff.delivery_sum,
          period_min: tariff.period_min,
          period_max: tariff.period_max,
          to_location_code: cityCode.value,
        },
        [400, 409, 422]
      )
      if (!optionRes?.ok) {
        const message = optionRes ? await readApiMessage(optionRes) : ''
        throw new Error(message || 'Не удалось сохранить пункт выдачи СДЭК')
      }
    }

    const res = await req_json_auth(`/kits/${kitId.value}/confirm`, 'PUT', undefined, [400, 409, 422])
    if (!res?.ok) {
      const message = res ? await readApiMessage(res) : ''
      throw new Error(confirmErrorText(message))
    }

    try {
      const confirmed = unwrapApiData<Partial<KitOrder>>(await res.json())
      if (confirmed && typeof confirmed === 'object' && order.value) {
        order.value = { ...order.value, ...confirmed }
      }
    } catch {
      // Confirm may return an empty body.
    }

    await loadOrder()
    ElMessage.success('Заказ подтверждён')
  } catch (error) {
    console.error(error)
    ElMessage.error(error instanceof Error ? error.message : 'Не удалось подтвердить заказ')
  } finally {
    confirmLoading.value = false
  }
}

watch(deliveryType, (type) => {
  if (type === 'transport' && order.value) void loadDeliveryQuote()
})

onMounted(() => {
  void loadOrder()
})
</script>

<template>
  <section class="order-delivery">
    <div class="order-delivery__main">
      <header class="order-delivery__head">
        <p class="order-delivery__number">Заказ №{{ kitId || '—' }}</p>
        <p class="order-delivery__name">{{ order?.kit_name || '—' }}</p>
      </header>

      <div class="order-delivery__body">
        <div class="delivery-kind">
          <h1 class="order-delivery__title">Вид доставки</h1>
          <div class="delivery-options" role="radiogroup" aria-label="Вид доставки">
            <button
              type="button"
              class="delivery-option"
              :class="{ 'delivery-option--active': deliveryType === 'transport' }"
              role="radio"
              :aria-checked="deliveryType === 'transport'"
              @click="deliveryType = 'transport'"
            >
              <img class="delivery-option__icon" :src="iconTransport" alt="" />
              <span class="delivery-option__text">
                <span class="delivery-option__label">СДЭК</span>
                <span class="delivery-option__hint">
                  Доставка по всей России. Срок уточняется
                </span>
              </span>
            </button>
            <button
              type="button"
              class="delivery-option"
              :class="{ 'delivery-option--active': deliveryType === 'pickup' }"
              role="radio"
              :aria-checked="deliveryType === 'pickup'"
              @click="deliveryType = 'pickup'"
            >
              <img class="delivery-option__icon" :src="iconPickup" alt="" />
              <span class="delivery-option__text">
                <span class="delivery-option__label">Самовывоз</span>
                <span class="delivery-option__hint">Со склада в Москве, бесплатно</span>
              </span>
            </button>
          </div>
        </div>

        <div v-if="deliveryType === 'transport'" class="delivery-panel">
          <div class="delivery-fields">
            <div class="delivery-field delivery-field--address">
              <span class="delivery-field__label">Пункт выдачи СДЭК</span>
              <p v-if="deliveryLoading" class="delivery-pvz__hint">Расчёт доставки…</p>
              <p v-else-if="deliveryError" class="delivery-pvz__error">{{ deliveryError }}</p>
              <template v-else>
                <p v-if="pvzPoints.length" class="delivery-pvz__hint">
                  Введите код ПВЗ или улицу. Список строится по городу из профиля.
                </p>
                <el-select
                  v-if="pvzPoints.length"
                  v-model="selectedPvzCode"
                  class="delivery-pvz-select"
                  placeholder="Найти ПВЗ: код или улица"
                  filterable
                  clearable
                  fit-input-width
                  placement="bottom-start"
                  :popper-options="pvzPopperOptions"
                  :filter-method="onPvzFilter"
                  no-match-text="Пункт не найден"
                  popper-class="delivery-pvz-select-dropdown"
                  @visible-change="onPvzVisibleChange"
                >
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
                </el-select>
                <div v-if="displayPvz && !pvzDropdownOpen" class="delivery-pvz__selected">
                  <span class="delivery-pvz__code">{{ pvzCodeLabel(displayPvz) }}</span>
                  <span class="delivery-pvz__addr">{{ pvzStreetLabel(displayPvz) }}</span>
                </div>
                <PvzMapPreview v-if="displayPvz && !pvzDropdownOpen" :point="displayPvz" />
                <p v-if="pvzTariff?.period_min" class="delivery-pvz__hint">
                  Срок {{ pvzTariff.period_min }}–{{ pvzTariff.period_max }} дн. после отгрузки.
                  Стоимость {{ formatPrice(pvzTariff.delivery_sum) }} руб.
                </p>
              </template>
            </div>
            <label class="delivery-field delivery-field--date">
              <span class="delivery-field__label">Желаемая дата доставки</span>
              <span class="delivery-date">
                <el-config-provider :locale="ru">
                  <el-date-picker
                    v-model="deliveryDate"
                    class="delivery-date__input"
                    type="date"
                    format="DD.MM.YYYY"
                    placeholder="Выберите дату"
                    :clearable="false"
                    :disabled-date="isPastDate"
                    popper-class="delivery-date-popper"
                  />
                </el-config-provider>
                <img class="delivery-date__chevron" :src="iconChevron" alt="" />
              </span>
            </label>
          </div>

          <label class="delivery-field delivery-comment">
            <span class="delivery-field__label">Комментарий к доставке</span>
            <textarea
              v-model="deliveryComment"
              class="delivery-field__control delivery-field__control--area"
              placeholder="Например, пропускной режим, время для разгрузки, контакты на месте"
            />
          </label>
        </div>

        <div v-else class="delivery-panel">
          <p class="delivery-pvz__hint">
            Чтобы подтвердить заказ, выберите доставку СДЭК и пункт выдачи.
          </p>
        </div>

        <div class="order-delivery__back-row">
          <button type="button" class="order-delivery__back" @click="goBack">
            <img :src="iconBack" alt="" />
            Назад к заказу
          </button>
        </div>
      </div>
    </div>

    <aside class="order-delivery__side">
      <div class="summary">
        <h2 class="order-delivery__title">Состав заказа</h2>

        <p v-if="isLoading" class="summary-empty">Загрузка состава…</p>
        <p v-else-if="!orderLines.length" class="summary-empty">Нет данных по деталям</p>
        <div v-else class="summary-items">
          <div v-for="line in orderLines" :key="line.id" class="summary-item">
            <div class="summary-item__preview">
              <CadPreview v-if="line.fileId" :file-id="line.fileId" />
            </div>
            <div class="summary-item__body">
              <div class="summary-item__info">
                <span class="summary-item__name">{{ line.name }}</span>
                <span class="summary-item__qty">
                  <span>{{ line.quantity }} шт.</span>
                  <span>х</span>
                  <span>{{ formatPrice(line.unitPrice) }} руб.</span>
                </span>
              </div>
              <span class="summary-item__price">{{ formatPrice(line.total) }} руб.</span>
            </div>
          </div>
        </div>

        <div class="summary-line" />

        <div class="summary-rows">
          <div class="summary-row">
            <span>Сумма</span>
            <span>{{ formatPrice(goodsSum) }}</span>
          </div>
          <div class="summary-row">
            <span>НДС (20%)</span>
            <span>{{ formatPrice(vatAmount) }}</span>
          </div>
        </div>

        <div class="summary-line" />

        <div class="summary-row summary-row--total">
          <span>Итого</span>
          <span>{{ formatPrice(grandTotal) }}</span>
        </div>
      </div>

      <div class="order-delivery__actions">
        <button
          v-if="canConfirmOrder"
          type="button"
          class="order-delivery__continue"
          :disabled="confirmLoading || isLoading || deliveryType !== 'transport' || deliveryLoading || !hasDeliveryOption"
          @click="confirmOrder"
        >
          Подтвердить заказ
        </button>
      </div>
    </aside>
  </section>
</template>

<style scoped>
.order-delivery {
  display: flex;
  align-items: stretch;
  gap: 20px;
  color: #000;
}

.order-delivery__main {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 40px;
  min-width: 0;
  padding: 40px;
  border-radius: 40px;
  background: #fff;
  box-shadow: 0 6px 15px rgba(224, 227, 237, 0.5);
}

.order-delivery__head {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-delivery__number {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
}

.order-delivery__name {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  word-break: break-word;
}

.order-delivery__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

.delivery-kind {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-delivery__title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  color: #000;
}

.delivery-options {
  display: flex;
  align-items: stretch;
  gap: 10px;
}

.delivery-option {
  display: flex;
  flex: 1 1 0;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  padding: 20px;
  border: 2px solid #cbd1d5;
  border-radius: 10px;
  background: #fff;
  color: #7d8083;
  text-align: left;
  cursor: pointer;
}

.delivery-option--active {
  border-color: #1e61c7;
  background: rgba(11, 103, 242, 0.1);
  color: #000;
}

.delivery-option__icon {
  display: block;
  flex-shrink: 0;
}

.delivery-option--active .delivery-option__icon {
  filter: brightness(0);
}

.delivery-option:not(.delivery-option--active) .delivery-option__icon {
  filter: brightness(0) saturate(100%) invert(53%) sepia(7%) saturate(314%) hue-rotate(169deg)
    brightness(94%) contrast(87%);
}

.delivery-option__text {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.delivery-option__label,
.delivery-option__hint {
  font-family: 'Montserrat-Medium', sans-serif;
  font-weight: 500;
  line-height: 1.25;
}

.delivery-option__label {
  font-size: 18px;
}

.delivery-option__hint {
  font-size: 14px;
}

.delivery-panel {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 20px;
  min-height: 280px;
  padding: 20px;
  border-radius: 20px;
  background: #eceff2;
}

.delivery-fields {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.delivery-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.delivery-field--address {
  flex: 1 1 auto;
}

.delivery-field--date {
  flex: 0 0 252px;
  width: 252px;
}

.delivery-pvz__hint,
.delivery-pvz__error {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.35;
}

.delivery-pvz__hint {
  color: #55585b;
}

.delivery-pvz__error {
  color: #c2410c;
}

.delivery-pvz-select {
  width: 100%;
}

.delivery-pvz-select :deep(.el-select__wrapper) {
  min-height: 54px;
  height: 54px;
  padding: 0 20px;
  border: 1px solid #cbd1d5;
  border-radius: 10px;
  background: #fff;
  box-shadow: none;
}

.delivery-pvz-select :deep(.el-select__wrapper.is-focused),
.delivery-pvz-select :deep(.el-select__wrapper.is-hovering) {
  box-shadow: none;
}

.delivery-pvz-select :deep(.el-select__wrapper.is-focused) {
  border-color: #1e61c7;
}

.delivery-pvz-select :deep(.el-select__placeholder),
.delivery-pvz-select :deep(.el-select__selected-item),
.delivery-pvz-select :deep(.el-select__input) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.delivery-pvz-select :deep(.el-select__placeholder) {
  color: #7d8083;
}

.delivery-pvz__selected {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid #cbd1d5;
  border-radius: 10px;
  background: #fff;
}

.delivery-pvz__code {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  line-height: 1.2;
  color: #000;
}

.delivery-pvz__addr {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 13px;
  line-height: 1.4;
  color: #55585b;
  word-break: break-word;
}

.delivery-field__label {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.2;
  color: #000;
}

.delivery-field__control {
  box-sizing: border-box;
  width: 100%;
  height: 54px;
  margin: 0;
  padding: 0 20px;
  border: 1px solid #cbd1d5;
  border-radius: 10px;
  background: #fff;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: #000;
  outline: none;
}

.delivery-field__control::placeholder {
  color: #7d8083;
  opacity: 1;
}

.delivery-field__control:focus {
  border-color: #1e61c7;
}

.delivery-field__control--area {
  flex: 1 1 auto;
  height: auto;
  min-height: 160px;
  padding: 20px;
  resize: vertical;
}

.delivery-comment {
  flex: 1 1 auto;
  min-height: 0;
}

.delivery-date {
  position: relative;
  display: block;
  width: 100%;
}

.delivery-date__chevron {
  position: absolute;
  top: 50%;
  right: 20px;
  display: block;
  pointer-events: none;
  transform: translateY(-50%);
}

.delivery-date :deep(.delivery-date__input.el-date-editor) {
  width: 100%;
  height: 54px;
}

.delivery-date :deep(.el-input__wrapper) {
  height: 54px;
  padding: 0 44px 0 20px;
  border: 1px solid #cbd1d5;
  border-radius: 10px;
  background: #fff;
  box-shadow: none;
}

.delivery-date :deep(.el-input__wrapper.is-focus),
.delivery-date :deep(.el-input__wrapper:hover) {
  box-shadow: none;
}

.delivery-date :deep(.el-input__wrapper.is-focus) {
  border-color: #1e61c7;
}

.delivery-date :deep(.el-input__inner) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.delivery-date :deep(.el-input__inner::placeholder) {
  color: #7d8083;
  opacity: 1;
}

.delivery-date :deep(.el-input__prefix),
.delivery-date :deep(.el-input__suffix) {
  display: none;
}

.order-delivery__back-row {
  display: flex;
  align-items: flex-end;
  min-height: 40px;
}

.order-delivery__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-height: 44px;
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  background: #cbd1d5;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: #000;
  cursor: pointer;
}

.order-delivery__back img {
  display: block;
  flex-shrink: 0;
}

.order-delivery__side {
  display: flex;
  flex: 0 0 500px;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  width: 500px;
  padding: 40px;
  border: 1px solid #cbd1d5;
  border-radius: 40px;
  background: #fff;
}

.summary {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.summary-empty {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #55585b;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.summary-item__preview {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  overflow: hidden;
}

.summary-item__preview :deep(.cad-preview-container),
.summary-item__preview :deep(.stl-preview) {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 0;
  background: transparent;
}

.summary-item__preview :deep(.preview-image) {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.summary-item__body {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.summary-item__info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.summary-item__name,
.summary-item__price {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.2;
  color: #000;
}

.summary-item__name {
  word-break: break-word;
}

.summary-item__price {
  flex-shrink: 0;
  text-align: right;
  white-space: nowrap;
}

.summary-item__qty {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  color: #55585b;
  white-space: nowrap;
}

.summary-line {
  height: 0;
  border-top: 1px solid #cbd1d5;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  color: #000;
}

.summary-row--total {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
}

.order-delivery__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.order-delivery__continue {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  background: #1e61c7;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  color: #fff;
  cursor: pointer;
}

.order-delivery__continue:disabled {
  opacity: 0.7;
  cursor: default;
}

@media (max-width: 1300px) and (min-width: 769px) {
  .order-delivery__main {
    padding: 40px 20px;
    border-radius: 20px;
  }

  .order-delivery__side {
    flex: 0 0 340px;
    width: 340px;
    padding: 40px 20px;
    border: none;
    border-radius: 20px;
    box-shadow: 0 0 6px rgba(85, 88, 91, 0.25);
  }

  .delivery-fields {
    flex-direction: column;
  }

  .delivery-field--date {
    flex-basis: auto;
    width: 100%;
  }

  .summary-item__preview {
    display: none;
  }
}

@media (max-width: 768px) {
  .order-delivery {
    flex-direction: column;
    width: 100%;
    min-width: 0;
  }

  .order-delivery__main,
  .order-delivery__side {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    padding: 20px;
    border-radius: 24px;
  }

  .order-delivery__side {
    flex: 1 1 auto;
  }

  .summary,
  .summary-items,
  .summary-item,
  .summary-item__body,
  .summary-item__info {
    min-width: 0;
    max-width: 100%;
  }

  .summary-item {
    align-items: flex-start;
    gap: 12px;
  }

  .summary-item__preview {
    width: 40px;
    height: 40px;
  }

  .summary-item__preview :deep(.cad-preview-container),
  .summary-item__preview :deep(.stl-preview),
  .summary-item__preview :deep(.preview-image) {
    width: 40px;
    height: 40px;
  }

  .summary-item__body {
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 8px 12px;
  }

  .summary-item__info {
    flex: 1 1 120px;
  }

  .summary-item__name,
  .summary-item__price,
  .summary-row {
    font-size: 16px;
  }

  .summary-item__qty {
    flex-wrap: wrap;
    white-space: normal;
  }

  .summary-item__price {
    white-space: normal;
  }

  .summary-row--total {
    font-size: 20px;
  }

  .delivery-options,
  .delivery-fields {
    flex-direction: column;
  }

  .delivery-field--date {
    flex-basis: auto;
    width: 100%;
  }
}
</style>

<style>
.delivery-pvz-select-dropdown.el-popper {
  box-sizing: border-box;
  padding: 8px !important;
  background: #fff !important;
  border: 1px solid #cbd1d5 !important;
  border-radius: 10px !important;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.12) !important;
}

.delivery-pvz-select-dropdown .el-select-dropdown__item {
  height: auto;
  min-height: 52px;
  padding: 10px 12px;
  line-height: 1.2;
}

.delivery-pvz-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.delivery-pvz-option__code {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  color: #000;
}

.delivery-pvz-option__addr {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 13px;
  line-height: 1.35;
  color: #55585b;
  white-space: normal;
  word-break: break-word;
}
</style>
