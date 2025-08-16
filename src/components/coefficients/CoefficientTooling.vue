<script lang="ts" setup>
const selected = defineModel({ type: String, required: true });

const toolings = [
  { value: "1", label: "Не нужна" },
  { value: "1.1", label: "Алюминиевая форма" },
  { value: "1.2", label: "Металлическая форма" },
];
</script>

<template>
  <div style="max-width: 1000px">
    <h2>Оснастка</h2>
    <el-divider class="line" />
    <el-radio-group v-model="selected">
      <el-radio
        class="radio-item"
        v-for="option in toolings"
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
