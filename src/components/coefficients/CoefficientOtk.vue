<script lang="ts" setup>
const selected = defineModel({ type: String, required: true });

const otks = [
  { value: "1", label: "Изготовителя" },
  { value: "1.2", label: "Заказчика на площадке изготовителя" },
  { value: "1.15", label: "Независимой приемкой" },
  { value: "1.3", label: "Сборка и фиксация первой инспекции изделия" },
];
</script>

<template>
  <div style="max-width: 1000px">
    <h2>Вид контроля</h2>
    <el-divider class="line" />
    <el-radio-group v-model="selected">
      <el-radio
        class="radio-item"
        v-for="option in otks"
        :key="option.label"
        :value="option.value"
      >
        <div style="font-size: 18px">{{ option.label }}</div>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<style scoped>
.radio-item {
  width: 400px;
}

.el-radio {
  padding-bottom: 5px;
}

:deep(.line) {
  border-color: #333;
}
</style>
