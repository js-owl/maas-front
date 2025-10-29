<script setup lang="ts">
import { type PropType } from 'vue'
import { useProfileStore } from '../../stores/profile.store'
import type { IOrderResponse } from '../../interfaces/order.interface'

const props = defineProps({
  result: {
    type: Object as PropType<IOrderResponse | null>,
    required: false,
    default: null,
  },
})

const profileStore = useProfileStore()
const formatNumber = (value: number | string | null | undefined) => {
  const num = Number(value ?? 0)
  return isFinite(num) ? Math.round(num).toLocaleString('ru-RU') : '0'
}
</script>

<template>
  <div>
    <div class="price-section">
      <div class="card">
        <div class="card-title">Стоимость</div>
        <div class="price-line">
          <span class="price">{{ formatNumber(props.result?.total_price) }} ₽</span>
          <span class="per-item">{{ formatNumber(props.result?.detail_price_one) }} ₽ за 1 шт.*</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Время изготовления (дни)</div>
        <div class="price">{{ props.result?.manufacturing_cycle ?? '—' }}</div>
      </div>
    </div>

    
    <div v-if="profileStore.profile?.username == 'admin'" class="card">
        <div>Трудоемкость</div>
        <div>{{ Number(props.result?.detail_time ?? 0).toFixed(2) || '?' }} ч.</div>
    </div>

    <div class="disclaimer-text">
      *При увеличении количества единиц в заказе стоимость одного изделия становится выгоднее
    </div>
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
}
</style>


