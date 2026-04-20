<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
</script>

<template>
  <!-- Фрезерная обработка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Фрезерная обработка</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Фрезерная обработка представляет собой технологический процесс, при котором специальный
          режущий инструмент (фреза) вращается и удаляет материал, создавая изделия заданной
          конфигурации.
          <br /><br />
          Методика эффективна как для изготовления плоских элементов, так и для формирования
          трёхмерных объектов. Она обеспечивает прецизионную точность и широко применяется при
          работе с различными материалами: металлами, полимерами, древесиной.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/milling.png" alt="Фрезерная обработка" class="uslugi-image" />
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
              <col/>
              <col />
            </colgroup>
            <thead>
              <tr>
                <th class="uslugi-table-thead">Оборудование</th>
                <th class="uslugi-table-thead">Габариты, мм</th>
                <th class="uslugi-table-thead">Материалы</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Универсальные станки</td>
                <td>до 1 400 (Д х Ш х В)</td>
                <td rowspan="4">
                  <ul class="materials-list">
                    <li>Алюминиевые сплавы</li>
                    <li>Сталь</li>
                    <li>Дерево</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>Станки ЧПУ, 5-осевой</td>
                <td>
                  max: 13 866 × 1 571 × 1 150 (дерево)<br />
                  max: 4 200 × 3 200 × 1 250 (металл)
                </td>
              </tr>
              <tr>
                <td>Станки ЧПУ, 3-осевой</td>
                <td>max: 4 200 × 3 200 × 1 250 (металл)</td>
              </tr>
              <tr>
                <td>Фрезерно-гравировальный станок</td>
                <td>
                  max: 2 200 × 1 610 (металл)<br />
                  max: 4 000 × 2 070 (дерево)
                </td>
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
  /* background-color: #cbd1d5; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* padding: 0 18px; */
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
