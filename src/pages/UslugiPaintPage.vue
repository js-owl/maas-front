<script setup lang="ts">
import { ref } from "vue";

// const h: string = `Лакокрасочное покрытие изделий`;

const productionData = ref([
  {
    process: "Лакокрасочное покрытие",
    equipment: "Окрасочно-сушильная камера",
    dimensions: "4 000 × 2 000 × 2 000 мм",
  },
  {
    process: "Лакокрасочное покрытие",
    equipment: "Сушильная камера",
    dimensions: "max габариты 7 000 × 5 300 × 3 500 мм",
  },
  {
    process: "Лакокрасочное покрытие",
    equipment: "Окрасочно-сушильные камеры",
    dimensions: "max габариты 14 000 × 4 000 × 4 000 мм",
  },
]);
</script>

<template>
  <el-row
    :gutter="20"
    class="painting-container"
  >
    <el-col :offset="2" :span="20" :xs="{ span: 24, offset: 0 }">
      <h1 class="painting-title">
        ЛАКОКРАСОЧНОЕ ПОКРЫТИЕ<br />
        ИЗДЕЛИЙ
      </h1>
    </el-col>
    <el-col :offset="2" :span="20" :xs="{ span: 24, offset: 0 }">
      <el-table
        stripe
        :data="productionData"
        class="painting-table"
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
.painting-container {
  background-image: url('banner_painting.jpg');
  background-repeat: no-repeat;
  background-color: #fff;
  padding: 30px 0 300px 0;
  min-height: 500px;
}

.painting-title {
  font-size: 70px;
  color: white;
}

.painting-table {
  width: 100%;
  margin-top: 20px;
}

.painting-table :deep(.cell) {
  white-space: pre-line;
}

@media (max-width: 767px) {
  .painting-container {
    padding: 16px 0 200px 0;
    min-height: auto;
    background-size: cover;
    background-position: center;
  }

  .painting-title {
    font-size: 32px;
    text-align: center;
    line-height: 1.2;
    margin-bottom: 16px;
  }

  .painting-table {
    margin-top: 12px;
  }

  .painting-table :deep(.el-table__header) {
    display: none;
  }

  .painting-table :deep(.el-table__body) {
    display: block;
  }

  .painting-table :deep(.el-table__row) {
    display: block;
    margin-bottom: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
    background: white;
  }

  .painting-table :deep(.el-table__cell) {
    display: block;
    border: none;
    padding: 4px 0;
  }

  .painting-table :deep(.el-table__cell:before) {
    content: attr(data-label) ": ";
    font-weight: bold;
    display: inline-block;
    min-width: 120px;
  }
}
</style>
