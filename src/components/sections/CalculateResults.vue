<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useProfileStore } from '../../stores/profile.store'
import type { IOrderResponse } from '../../interfaces/order.interface'
import { hidePrice as hidePriceFn } from '../../helpers/hide-price'
import { Clock } from '@element-plus/icons-vue'

const props = defineProps({
  result: {
    type: Object as PropType<IOrderResponse | null>,
    required: false,
    default: null,
  },
})

const profileStore = useProfileStore()
const username = profileStore.profile?.username ?? null
const status = computed(() => props.result?.status ?? null)
const hidePrice = computed(() => hidePriceFn(username, status.value))

const formatNumber = (value: number | string | null | undefined) => {
  const num = Number(value ?? 0)
  return isFinite(num) ? Math.round(num).toLocaleString('ru-RU') : '0'
}
</script>

<template>
  <div>
    <template v-if="hidePrice">
      <div class="calculating-price-container">
        <el-icon class="clock-icon">
          <Clock />
        </el-icon>
        <div class="calculating-title">Пара минут!</div>
        <div class="calculating-subtitle">Рассчитываем цену</div>
      </div>
    </template>
    <template v-else>
      <div class="price-section">
        <div class="card">
          <div class="card-title">Стоимость</div>
          <div class="price-line">
            <span class="price">{{ formatNumber(props.result?.total_price) }} ₽</span>
            <span v-if="props.result && props.result.quantity > 1" class="per-item">
              {{ formatNumber(props.result?.detail_price_one) }} ₽ за 1 шт.*
            </span>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Время изготовления (дни)</div>
          <div class="price">{{ props.result?.manufacturing_cycle ?? '—' }}</div>
        </div>
      </div>

      <div v-if="profileStore.profile?.username == 'admin'" class="card">
        <div>Трудоемкость</div>
        <div>{{ Number(props.result?.total_time ?? 0).toFixed(2) || '?' }} ч.</div>
      </div>

      <div class="disclaimer-text">
        *При увеличении количества единиц в заказе стоимость одного изделия становится выгоднее
      </div>
    </template>
  </div>
</template>

<style scoped>
.price-section {
  font-size: 24px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  background-color: var(--whity);
  color: black;
  margin-bottom: 10px;
  padding: 14px 10px;
  border-radius: 3px;
}

.price-row-last {
  display: flex;
  justify-content: space-between;
  background-color: var(--whity);
  color: black;
  padding: 14px 10px;
  border-radius: 3px;
}

.disclaimer-text {
  color: black;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
}

.calculating-price-container {
  background-color: var(--whity);
  border-radius: 8px;
  padding: 24px 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.clock-icon {
  font-size: 48px;
  color: #666;
  margin-bottom: 16px;
}

.calculating-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.calculating-subtitle {
  font-size: 16px;
  color: #666;
}

.card {
  background-color: var(--whity);
  color: black;
  border-radius: 8px;
  padding: 14px 12px;
  margin-bottom: 10px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin-bottom: 4px;
}

.price-line {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price {
  font-size: 32px;
  font-weight: 700;
}

.currency {
  font-size: 24px;
  font-weight: 600;
}

.per-item {
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
  color: #666;
}

@media (max-width: 767px) {
  .price-section {
    margin-bottom: 16px;
  }

  .price-row {
    font-size: 16px;
    padding: 8px 0;
  }

  .price-row-last {
    font-size: 16px;
    padding: 8px 0;
  }

  .disclaimer-text {
    font-size: 12px;
    margin-bottom: 16px;
  }
  .price {
    font-size: 24px;
    font-weight: 700;
  }

  .calculating-price-container {
    padding: 20px 16px;
  }

  .clock-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .calculating-title {
    font-size: 18px;
    margin-bottom: 6px;
  }

  .calculating-subtitle {
    font-size: 14px;
  }
}
</style>
