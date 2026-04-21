<script lang="ts" setup>
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
      <el-radio
        v-for="option in otks"
        :key="option.value"
        :label="option.value"
        class="otk-radio"
      >
        <span class="otk-label">{{ option.label }}</span>
      </el-radio>
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
  margin-right: 0;
  width: 100%;
  min-height: 20px;
}

.otk-label {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  line-height: 1;
  color: #000;
  white-space: nowrap;
}

:deep(.otk-radio .el-radio__label) {
  padding-left: 10px;
}

:deep(.otk-radio .el-radio__inner) {
  display: inline-block;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid #cbd1d5;
}

:deep(.otk-radio .el-radio__inner::after) {
  width: 10px;
  height: 10px;
}

:deep(.otk-radio.is-checked .el-radio__inner) {
  border-color: #cbd1d5;
  background: #fff;
}

:deep(.otk-radio.is-checked .el-radio__inner::after) {
  transform: translate(-50%, -50%) scale(1);
  background-color: #cbd1d5;
}

:deep(.otk-radio .el-radio__input) {
  display: inline-flex;
  align-items: center;
}

:deep(.otk-radio .el-radio__input.is-checked + .el-radio__label) {
  color: #000;
}

@media (max-width: 767px) {
  .otk-radio-group {
    grid-template-columns: 1fr;
    row-gap: 12px;
  }

  .otk-label {
    white-space: normal;
  }
}
</style>
