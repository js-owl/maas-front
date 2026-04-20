<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
</script>

<template>
  <!-- Токарная обработка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Токарная обработка</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Токарная обработка представляет собой механическую операцию, при которой вращающаяся
          деталь обрабатывается режущим инструментом, последовательно снимающим слой материала.
          <br /><br />
          Технология позволяет создавать цилиндрические, конические и сложные профилированные
          поверхности с высокой степенью точности. Применяется в производстве металлических,
          пластиковых и других изделий, обеспечивая превосходное качество финишной обработки.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/lathe.png" alt="Токарная обработка" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="requirements-header" @click="isRequirementsExpanded = !isRequirementsExpanded">
          <div class="uslugi-table-title">Технические требования</div>
          <el-icon class="requirements-arrow" :class="{ expanded: isRequirementsExpanded }">
            <IconArrowDown />
          </el-icon>
        </div>

        <div v-if="isRequirementsExpanded" class="requirements-table-wrapper">
          <table class="requirements-table">
            <colgroup>
              <col />
              <col style="width: 300px" />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th class="uslugi-table-thead">Оборудование</th>
                <th class="uslugi-table-thead">Габариты</th>
                <th class="uslugi-table-thead">Материалы</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Токарно-винторезные станки</td>
                <td>диаметр: до 1600<br />длина: до 5000</td>
                <td rowspan="3">
                  <ul class="materials-list">
                    <li>Нержавеющие, легированные стали</li>
                    <li>Стали коррозионностойкие (жаропрочные)</li>
                    <li>Стали конструкционные легированные</li>
                    <li>Титановые сплавы</li>
                    <li>Полиамиды, фторопласт</li>
                    <li>Алюминиевые, бронзовые, медные сплавы</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>Станок с ЧПУ</td>
                <td>Диаметр до 600 мм</td>
              </tr>
              <tr>
                <td>Тяжёлый токарный станок с ЧПУ</td>
                <td>диаметр: до 880<br />длина: до 1500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.technical-requirements {
  margin-top: 40px;
}

.requirements-header {
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.requirements-arrow {
  transition: transform 0.2s ease;
  transform: rotate(0deg);
}

.requirements-arrow.expanded {
  transform: rotate(-180deg);
}

.requirements-table-wrapper {
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.uslugi-table-thead {
  font-size: 18px;
  font-weight: 500;
  padding: 16px 20px;
  color: #000;
  background-color: var(--bgcolor);
  text-align: left;
}

.materials-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.materials-list li + li {
  margin-top: 4px;
}

@media (max-width: 767px) {
  .technical-requirements {
    display: none;
  }
}
</style>
