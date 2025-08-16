<script setup lang="ts">
import { ref } from "vue";

const h: string = "Производство изделий из композитных материалов";

const productionData = ref([
  {
    process: "Вакуумная инфузия",
    equipment: "Камера сушильная конвекционная",
    material: "Углеволокно",
    dimensions: "max габариты 10 000 × 2 000 × 2 000 мм",
  },
  {
    process: "Вакуумная инфузия",
    equipment: "Камера сушильная конвекционная",
    material: "Углеволокно",
    dimensions: "max габариты 8 500 × 2 000 × 2 000 мм",
  },
  {
    process: "Вакуумная инфузия",
    equipment: "Камера сушильная конвекционная",
    material: "Углеволокно",
    dimensions: "max габариты 2 000 × 2 000 × 2 000 мм",
  },
]);
</script>

<template>
  <el-row
    :gutter="20"
    style="
      background-image: url('banner_composite.jpg');
      background-repeat: no-repeat;
      background-color: #fff;
      padding: 30px 0 300px 0;
      min-height: 500px;
    "
  >
    <el-col :offset="2" :span="20">
      <h1 style="font-size: 70px; color: white">{{ h.toUpperCase() }}</h1>
    </el-col>
    <el-col :offset="2" :span="20">
      <el-table
        stripe
        :data="productionData"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
      >
        <el-table-column
          prop="process"
          label="Наименование технологического процесса"
          width="350"
        />
        <el-table-column
          prop="equipment"
          label="Тип оборудования"
          width="350"
        />
        <el-table-column prop="material" label="Вид материала" width="350" />
        <el-table-column
          prop="dimensions"
          label="Габаритные размеры детали/заготовки"
        />
      </el-table>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-table {
  margin-top: 20px;
}

.el-table :deep(.cell) {
  white-space: pre-line;
}
</style>
