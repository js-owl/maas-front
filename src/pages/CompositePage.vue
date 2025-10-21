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
    class="composite-container"
  >
    <el-col :offset="2" :span="20" :xs="{ span: 24, offset: 0 }">
      <h1 class="composite-title">{{ h.toUpperCase() }}</h1>
    </el-col>
    <el-col :offset="2" :span="20" :xs="{ span: 24, offset: 0 }">
      <el-table
        stripe
        :data="productionData"
        class="composite-table"
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
.composite-container {
  background-image: url('banner_composite.jpg');
  background-repeat: no-repeat;
  background-color: #fff;
  padding: 30px 0 300px 0;
  min-height: 500px;
}

.composite-title {
  font-size: 70px;
  color: white;
}

.composite-table {
  width: 100%;
  margin-top: 20px;
}

.composite-table :deep(.cell) {
  white-space: pre-line;
}

@media (max-width: 767px) {
  .composite-container {
    padding: 16px 0 200px 0;
    min-height: auto;
    background-size: cover;
    background-position: center;
  }

  .composite-title {
    font-size: 32px;
    text-align: center;
    line-height: 1.2;
    margin-bottom: 16px;
  }

  .composite-table {
    margin-top: 12px;
  }

  .composite-table :deep(.el-table__header) {
    display: none;
  }

  .composite-table :deep(.el-table__body) {
    display: block;
  }

  .composite-table :deep(.el-table__row) {
    display: block;
    margin-bottom: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
    background: white;
  }

  .composite-table :deep(.el-table__cell) {
    display: block;
    border: none;
    padding: 4px 0;
  }

  .composite-table :deep(.el-table__cell:before) {
    content: attr(data-label) ": ";
    font-weight: bold;
    display: inline-block;
    min-width: 120px;
  }
}
</style>
