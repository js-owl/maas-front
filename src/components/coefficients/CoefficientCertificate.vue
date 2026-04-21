<script lang="ts" setup>
const selected = defineModel<string[]>()

const certificates = [
  { value: 'g', label: 'Сертификация материалов' },
  { value: 'e', label: 'Сертификат соответствия' },
  { value: 'd', label: 'Сертификация оборудования' },
]
</script>

<template>
  <div style="max-width: 1000px">
    <div class="milling-field-title">Сертификаты</div>
    <el-checkbox-group v-model="selected">
      <el-checkbox
        v-for="option in certificates"
        :key="option.label"
        :value="option.value"
        class="checkbox-item"
        disabled
      >
        <div class="coefficient-value">{{ option.label }}</div>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<style scoped>
.milling-field-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  line-height: 1;
  color: #000;
}

.checkbox-item {
  width: 290px;
}

.el-checkbox {
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
