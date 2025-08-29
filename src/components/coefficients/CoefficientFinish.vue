<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { req_json } from "../../api";

const selected = defineModel();
const finishes = ref();

onMounted(async () => {
  const r = await req_json(`/calculator/coefficients/`, "GET");
  const data = await r?.json();
  finishes.value = data.finish.map((item: any) => ({
    value: item.id,
    label: item.value,
  }));
});
</script>

<template>
  <div>
    <p>Шероховатость, Ra</p>
    <el-select
      v-model="selected"
      placeholder="Выбрать"
      size="large"
      style="display: block"
    >
      <el-option
        v-for="item in finishes"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
