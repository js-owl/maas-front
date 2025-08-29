<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { req_json } from "../../api";

const selected = defineModel();
const tolerances = ref();

onMounted(async () => {
  const r = await req_json(`/calculator/coefficients/`, "GET");
  const data = await r?.json();
  console.log(data);
  tolerances.value = data.tolerance.map((item: any) => ({
    value: item.id,
    label: item.value,
  }));
});
</script>

<template>
  <div>
    <p>Квалитет точности</p>
    <el-select
      v-model="selected"
      placeholder="Выбрать"
      size="large"
      style="display: block"
    >
      <el-option
        v-for="item in tolerances"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
