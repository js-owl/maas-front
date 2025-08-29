<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { req_json } from "../../api";

const selected = defineModel();
const coveres = ref();

onMounted(async () => {
  const r = await req_json(`/calculator/coefficients/`, "GET");
  const data = await r?.json();
  coveres.value = data.cover.map((item: any) => ({
    value: item.id,
    label: item.value,
  }));
});
</script>

<template>
  <div>
    <p>Покрытие</p>
    <el-select
      v-model="selected"
      placeholder="Выбрать"
      size="large"
      style="display: block"
    >
      <el-option
        v-for="item in coveres"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
