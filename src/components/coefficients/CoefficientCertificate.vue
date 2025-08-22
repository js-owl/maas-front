<script lang="ts" setup>
const selected = defineModel<string[]>();

const certificates = [
  { value: "a", label: "Регистрация ITAR/EAR" },
  { value: "b", label: "Сертифицировано AS9100" },
  { value: "c", label: "Сертифицировано по ISO 9001" },
  { value: "d", label: "Сертификация оборудования" },
  { value: "e", label: "Сертификат соответствия" },
  { value: "f", label: "Сертифицировано JCP/eJCP" },
  { value: "g", label: "Сертификация материалов" },
];
</script>

<template>
  <div style="max-width: 1000px">
    <h2>Сертификаты и квалификации поставщиков</h2>
    <el-divider class="line" />
    <el-checkbox-group v-model="selected">
      <el-checkbox
        v-for="option in certificates"
        :key="option.label"
        :value="option.value"
        class="checkbox-item"
        disabled
      >
        <div style="font-size: 18px">{{ option.label }}</div>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<style scoped>
.checkbox-item {
  width: 300px;
}

.el-checkbox {
  padding-bottom: 5px;
}
:deep(.line) {
  border-color: #333;
}
</style>
