<script lang="ts" setup>
import Radio from '../ui/Radio.vue'

const selected = defineModel({ type: String, required: true })

const otks = [
  { value: '1.0', label: 'Изготовитель' },
  { value: '1.2', label: 'Заказчика на площадке изготовителя' },
  { value: '1.15', label: 'Независимой приемкой' },
  { value: '1.3', label: 'Фиксация первой инспекции изделия' },
]
</script>

<template>
  <div class="otk-grid">
    <el-radio-group v-model="selected" class="otk-radio-group">
      <Radio
        v-for="option in otks"
        :key="option.value"
        :value="option.value"
        class="otk-radio"
      >
        {{ option.label }}
      </Radio>
    </el-radio-group>
  </div>
</template>

<style scoped>
.otk-grid {
  width: 100%;
}

.otk-radio-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 20px;
  row-gap: 20px;
  width: 100%;
}

.otk-radio {
  width: 100%;
}

@media (max-width: 767px) {
  .otk-radio-group {
    grid-template-columns: 1fr;
    row-gap: 12px;
  }

  .otk-radio {
    --radio-white-space: normal;
  }
}
</style>
