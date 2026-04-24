<script lang="ts" setup>
import Checkbox from '../ui/Checkbox.vue'

const selected = defineModel<string[]>()

const certificates = [
  { value: 'g', label: 'Сертификация материалов' },
  { value: 'e', label: 'Сертификат соответствия' },
  { value: 'd', label: 'Сертификация оборудования' },
]
</script>

<template>
  <div style="max-width: 1000px">
    <div class="coefficient-label">Сертификаты и квалификации поставщиков</div>
    <el-checkbox-group v-model="selected">
      <Checkbox
        v-for="option in certificates"
        :key="option.label"
        :value="option.value"
        class="checkbox-item"
        disabled
      >
        <div class="coefficient-value">{{ option.label }}</div>
      </Checkbox>
    </el-checkbox-group>
  </div>
</template>

<style scoped>
.checkbox-item {
  width: 290px;
  padding-bottom: 5px;
}
:deep(.line) {
  border-color: #333;
}


</style>
