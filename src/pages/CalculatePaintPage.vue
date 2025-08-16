<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import CardUpload from "../components/CardUploadDrawing.vue";
import { API_BASE } from "../api";

import CoefficientQuantity from "../components/coefficients/CoefficientQuantity.vue";
import PaintArea from "../components/coefficients/PaintArea.vue";
import MaterialPaint from "../components/materials/MaterialPaint.vue";
import PaintType from "../components/coefficients/PaintType.vue";
import PaintColor from "../components/coefficients/PaintColor.vue";
import PaintLakery from "../components/coefficients/PaintLakery.vue";
import PaintPrimer from "../components/coefficients/PaintPrimer.vue";
import CoefficientOtk from "../components/coefficients/CoefficientOtk.vue";
import CoefficientCertificate from "../components/coefficients/CoefficientCertificate.vue";

let paint_area = ref(154);
let quantity = ref(1);
let material = ref("metal");

let paint_type = ref("epoxy");
let paint_color = ref("3032");
let paint_lakery = ref("a");

let paint_prepare = ref("a");
let paint_primer = ref("b");

let control_type = ref("1");
let sert_type = ref(["a", "f"]);

const payload = reactive({
  paint_area,
  quantity,
  material,
  paint_type,
  paint_color,
  paint_lakery,
  paint_prepare,
  paint_primer,
  control_type,
  sert_type,
});

type sendType = typeof payload;

async function sendData(payload: sendType) {
  console.log("sendData:", { payload });
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  try {
    const res = await fetch(`${API_BASE}/calc-paint`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("price", { data });
  } catch (err) {
    console.warn({ err });
  }
}

// Отправляем запрос на сервер при любом изменении данных
watch(payload, sendData, { deep: true });

const submitOrder = () => {
  console.log("|-submitOrder");
};
</script>

<template>
  <el-row :gutter="5" style="min-height: 500px">
    <!-- 1. Левая часть -->
    <el-col
      :span="9"
      style="background-color: #283d5b; padding: 30px 50px 30px 100px"
    >
      <div style="color: white; font-size: 38px; padding-bottom: 40px">
        Лакокрасочное покрытие изделий
      </div>
      <CardUpload />
      <div style="color: white; font-size: 42px">1,5 ч</div>
      <div style="color: white; font-size: 20px; padding-bottom: 40px">
        Трудоемкость изготовления 1 ед.
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          padding-bottom: 40px;
        "
      >
        <div>
          <div style="color: white; font-size: 42px">1 000 руб</div>
          <div style="color: white; font-size: 20px">
            Стоимость изготовления 1 ед.
          </div>
        </div>
        <div>
          <div style="color: white; font-size: 42px">67 000 руб</div>
          <div style="color: white; font-size: 20px">Стоимость 84 ед.*</div>
        </div>
      </div>
      <div style="color: #577aad; font-size: 20px; padding-bottom: 40px">
        *При увеличении количества единиц в заказе стоимость одного изделия
        становится выгоднее.
      </div>
      <div style="display: flex; justify-content: center">
        <el-button
          type="primary"
          plain
          style="
            background-color: #bc2b55;
            border: 1px solid white;
            color: white;
            font-size: 26px;
            padding: 30px 90px;
          "
          @click="submitOrder"
        >
          Перейти к оформлению >
        </el-button>
      </div>
    </el-col>

    <!-- 2. Правая часть -->
    <el-col :span="15" style="background-color: #e5e5e5; padding-top: 30px">
      <el-row :gutter="5">
        <el-col :offset="2" :span="6">
          <PaintArea v-model="paint_area" />
        </el-col>
        <el-col :offset="1" :span="6">
          <CoefficientQuantity v-model="quantity" />
        </el-col>
        <el-col :offset="1" :span="6">
          <MaterialPaint v-model="material" />
        </el-col>
      </el-row>

      <el-row :gutter="5" style="padding-top: 30px">
        <el-col :offset="2" :span="6">
          <PaintType v-model="paint_type" />
        </el-col>
        <el-col :offset="1" :span="6">
          <PaintColor v-model="paint_color" />
        </el-col>
        <el-col :offset="1" :span="6">
          <PaintLakery v-model="paint_lakery" />
        </el-col>
      </el-row>

      <el-row :gutter="5" style="padding-top: 30px">
        <el-col :offset="2" :span="6">
          <PaintPrepare v-model="paint_prepare" />
        </el-col>
        <el-col :offset="1" :span="6">
          <PaintPrimer v-model="paint_primer" />
        </el-col>
        <el-col :offset="1" :span="6"> </el-col>
      </el-row>

      <el-row :gutter="5" style="padding-top: 30px">
        <el-col :offset="2" :span="20">
          <CoefficientOtk v-model="control_type" />
        </el-col>
      </el-row>

      <el-row :gutter="5" style="padding: 30px 0">
        <el-col :offset="2" :span="20">
          <CoefficientCertificate v-model="sert_type" />
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped></style>
