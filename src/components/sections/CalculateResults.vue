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
</script>

<template>
  <div>
    <div class="price-section">
      <div class="price-row">
        <div>Стоимость 1 ед.</div>
        <div>{{ Math.round(Number(props.result?.detail_price_one ?? 0)).toLocaleString() }} р.</div>
      </div>
      <div class="price-row">
        <div>Общая стоимость {{ props.result?.quantity || 0 }} ед.*</div>
        <div>
          <span> {{ Math.round(Number(props.result?.total_price ?? 0)).toLocaleString() }} р. </span>
          <span
            v-show="Number(props.result?.detail_price ?? 0) != Number(props.result?.detail_price_one ?? 0)"
          >
            ({{ Math.round(Number(props.result?.detail_price ?? 0)).toLocaleString() }} р. за 1 ед.)
          </span>
        </div>
      </div>
      <div v-if="profileStore.profile?.username == 'admin'" class="price-row">
        <div>Трудоемкость</div>
        <div>{{ Number(props.result?.detail_time ?? 0).toFixed(2) || '?' }} ч.</div>
      </div>
      <div class="price-row-last">
        <div>Длительность изготовления</div>
        <div>{{ props.result?.manufacturing_cycle }} дн.</div>
      </div>
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
}
</style>


