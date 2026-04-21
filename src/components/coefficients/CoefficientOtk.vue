<script lang="ts" setup>
const selected = defineModel({ type: String, required: true })

const otks = [
  { value: '1.0', label: 'Изготовителя' },
  { value: '1.2', label: 'Заказчика на площадке изготовителя' },
  { value: '1.15', label: 'Независимой приемкой' },
]
</script>

<template>
  <div style="max-width: 1000px">
    <div class="milling-field-title">Вид контроля</div>
    <el-radio-group v-model="selected">
      <el-radio class="radio-item" v-for="option in otks" :key="option.label" :value="option.value">
        <div class="coefficient-value">{{ option.label }}</div>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<style scoped>
.milling-field-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  line-height: 1;
  color: #000;
}

.radio-item {
  width: 290px;
}

.el-radio {
  padding-bottom: 5px;
}

:deep(.line) {
  border-color: #333;
}

@media (max-width: 767px) {
  .milling-field-title {
    font-size: 18px;
  }
}
</style>
