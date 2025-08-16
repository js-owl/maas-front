<script lang="ts" setup>
import { computed, ref } from "vue";
import CardPrice from "./CardPrice.vue";
import CardImage from "./CardImage.vue";
import CardUpload from "./CardUpload.vue";

import MaterialMilling from "./materials/MaterialMilling.vue";
import VolumeRectangle from "./volumes/VolumeRectangle.vue";
import CoefficientQuantity from "./coefficients/CoefficientQuantity.vue";
import CoefficientTolerance from "./coefficients/CoefficientTolerance.vue";
import CoefficientFinish from "./coefficients/CoefficientFinish.vue";
import CoefficientCover from "./coefficients/CoefficientCover.vue";
import CoefficientOtk from "./coefficients/CoefficientOtk.vue";
import CoefficientCertificate from "./coefficients/CoefficientCertificate.vue";

const img = "./milling.png";

let material = ref({
  value: "Алюминий 1",
  label: "лист Д16/Д16Т/Д95/Д95Т",
  price: 110,
  density: 2700,
  k_handle: 0.03,
});

const length = ref(200);
const width = ref(100);
const thickness = ref(50);

let quantity = ref(1);
const k_complexity = ref(0.75);
let k_tolerance = ref(1);
let k_finish = ref(1);
let k_cover = ref(1);
let k_otk = ref("1");
let k_cert = ref(["a", "f"]);

const mat_volume = computed(() => {
  const res = Number(
    (0.000000001 * length.value * width.value * thickness.value).toFixed(10)
  );
  console.log("mat_volume", res);
  return res;
});

const mat_weight = computed(() => {
  const res = Number((mat_volume.value * material.value.density).toFixed(4));
  console.log("mat_weight", res);
  return res;
});

const mat_price = computed(() => {
  const res = Number(
    (mat_weight.value * material.value.price * 1.2).toFixed(3)
  );
  console.log("mat_price", res);
  return res;
});

const work_price = computed(() => {
  let Kp = 2 / 3;
  const work_time =
    10 + Kp * 5 + mat_weight.value * 1000 * material.value.k_handle;
  const res = Number(((work_time * 2600) / 60).toFixed(3));
  console.log("work_price", res);
  return res;
});

const k_quantity = computed(() => {
  let res;
  if (quantity.value < 21) {
    res = 1;
  } else if (quantity.value < 101) {
    res = 0.95;
  } else if (quantity.value < 501) {
    res = 0.85;
  } else {
    res = 0.8;
  }
  console.log("k_quantity", res);
  return res;
});

const detail_price = computed(() => {
  const res = (
    (mat_price.value + work_price.value) *
    k_complexity.value *
    k_tolerance.value *
    k_finish.value *
    k_cover.value *
    Number(k_otk.value) *
    k_quantity.value
  ).toFixed(0);

  console.log(
    "k_complexity=",
    k_complexity.value,
    "k_tolerance=",
    k_tolerance.value,
    "k_finish=",
    k_finish.value,
    "k_cover=",
    k_cover.value,
    "k_otk=",
    Number(k_otk.value)
  );
  console.log("k_cert=", k_cert.value);
  console.log("===== detail_price =====", res);
  return res;
});
</script>

<template>
  <el-row :gutter="5" style="min-height: 500px">
    <!-- 1. Результат -->
    <el-col
      :span="8"
      style="background-color: #bbb; padding: 30px 50px 30px 100px"
    >
      <CardPrice :price="detail_price" :quantity />
      <el-divider />
      <CardImage :img length="200" dia="100" thickness="50" />
      <el-divider />
      <CardUpload />
    </el-col>

    <!-- 2. Выбор параметров -->
    <el-col
      :span="16"
      style="background-color: #e5e5e5; padding: 30px 200px 30px 30px"
    >
      <p style="color: #666; font-size: 20px">Механическая обработка</p>
      <h1>Фрезерная обработка</h1>
      <div class="r">
        <CoefficientQuantity v-model="quantity" />
        <MaterialMilling v-model="material" />
      </div>
      <div class="r">
        <VolumeRectangle
          v-model="length"
          v-model:width="width"
          v-model:thickness="thickness"
        />
        <CoefficientTolerance v-model="k_tolerance" />
        <CoefficientFinish v-model="k_finish" />
      </div>
      <el-divider />
      <h2>Дополнительные опции</h2>
      <CoefficientCover v-model="k_cover" />
      <el-divider />
      <CoefficientOtk v-model="k_otk" />
      <el-divider />
      <CoefficientCertificate v-model="k_cert" />
    </el-col>
  </el-row>
</template>

<style scoped>
.calc {
  margin-top: 20px;
  background-color: #be2a44;
  color: white;
  font-size: 18px;
  padding: 18px;
}
.r {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
