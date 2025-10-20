<script lang="ts" setup>
const selected = defineModel({ type: String, required: true })

const otks = [
  { value: '1', label: 'Изготовителя' },
  { value: '1.2', label: 'Заказчика на площадке изготовителя' },
  { value: '1.15', label: 'Независимой приемкой' },
]
</script>

<template>
  <div style="max-width: 1000px">
    <div class="label">Вид контроля</div>
    <el-radio-group v-model="selected">
      <el-radio class="radio-item" v-for="option in otks" :key="option.label" :value="option.value">
        <div style="font-size: 18px">{{ option.label }}</div>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<style scoped>
.radio-item {
  width: 300px;
}

.el-radio {
  padding-bottom: 5px;
}

:deep(.line) {
  border-color: #333;
}

.label {
  padding-bottom: 12px;
  color: #283d5b;
  font-size: 24px;
  font-weight: 700;
}
@media (max-width: 767px) {
  .label {
    font-size: 20px;
  }
}
</style>
