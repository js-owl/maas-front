<script setup lang="ts">
import { ref } from "vue";

const h: string = "Механообрабатывающее производство";

const productionData = ref([
  {
    process: "Сверлильные работы",
    equipment: "Вертикально-соединительные станки",
    material: "Дерево, алюминиевые и стальные сплавы, пластик",
    dimensions: "до 500 мм (Д × Ш х В)",
  },
  {
    process: "Шлифовка",
    equipment: "Круглошлифовальный станок",
    material: "Стальные сплавы",
    dimensions: "длина до 12500 мм, диаметр до 280 мм",
  },
  {
    process: "Шлифовка",
    equipment: "Горизонтально-шлифовальные станки",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "до 500 мм (Д × Ш х В)",
  },
  {
    process: "Фрезерные работы",
    equipment: "Универсальные станки",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "до 720 мм (Д × Ш х В)",
  },
  {
    process: "Фрезерные работы",
    equipment: "Универсальные станки",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "до 1400 мм (Д × Ш х В)",
  },
  {
    process: "Фрезерные работы",
    equipment: "Станки ЧПУ, 3-осевые",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "до 1000 мм  (Д × Ш х В)",
  },
  {
    process: "Фрезерные работы",
    equipment: "Станки ЧПУ, 3-осевые",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "max габариты 4200 × 3200 × 1250 мм",
  },
  {
    process: "Фрезерные работы",
    equipment: "Станки ЧПУ, 5-осевой",
    material: "Дерево",
    dimensions: "max габариты 3190 × 450 × 89 мм",
  },
  {
    process: "Фрезерные работы",
    equipment: "Станки ЧПУ, 5-осевой",
    material: "Дерево",
    dimensions: "max габариты 13866 × 1571 × 1150 мм",
  },
  {
    process: "Фрезерные работы",
    equipment: "Станки ЧПУ, 5-осевые",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "800 мм  (Д × Ш х В)",
  },
  {
    process: "Фрезерные работы",
    equipment: "Станки ЧПУ, 5-осевой",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "max габариты 4200 × 3200 × 1250 мм",
  },
  {
    process: "Гравированные работы",
    equipment: "Фрезерно-гравировальный станок",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "max габариты 2200 × 1610 мм",
  },
  {
    process: "Гравированные работы",
    equipment: "Фрезерно-гравировальный станок",
    material: "Дерево",
    dimensions: "max габариты 4000 × 2070 мм",
  },
  {
    process: "Раскройные работы по композитным тканям",
    equipment: "Режущий плоттер",
    material: "Углеволокно",
    dimensions: "габариты стола: 2 270 × 2 500 мм",
  },
  {
    process: "Токарно-винторезные работы",
    equipment: "Токарно-винторезные станки",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "длина до 500 мм, диаметр до 275 мм",
  },
  {
    process: "Токарно-винторезные работы",
    equipment: "Токарно-винторезный станок",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "длина до 2 000 мм, диаметр до 500 мм",
  },
  {
    process: "Токарные работы",
    equipment: "Станок с ЧПУ",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "длина до 1 000 мм, диаметр до 600 мм",
  },
  {
    process: "Токарные работы",
    equipment: "Станок с ЧПУ",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "длина до 750 мм, диаметр до 360 мм",
  },
  {
    process: "Раскройные работы",
    equipment: "Ленточнопильные станки",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "-",
  },
  {
    process: "Раскройные работы",
    equipment: "Станок отрезной",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "-",
  },
  {
    process: "Раскройные работы",
    equipment: "Ножницы по металлу",
    material: "Алюминиевые и стальные сплавы",
    dimensions: "-",
  },
  {
    process: "Раскройные работы",
    equipment: "Установка плазменной / лазерной резки",
    material: "Алюминиевые и стальные сплавы",
    dimensions:
      "Толщина реза:\nАлюминиевые сплавы до 45 мм\nСтальные сплавы до 10 мм",
  },
]);
</script>

<template>
  <el-row
    :gutter="20"
    style="
      background-image: url('banner_mechanical.jpg');
      background-repeat: no-repeat;
      background-color: #fff;
      padding: 30px 0 30px 0;
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
