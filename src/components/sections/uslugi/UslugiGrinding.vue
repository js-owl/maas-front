<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
</script>

<template>
  <!-- Шлифовка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Шлифовка</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Шлифовка металла - это процесс механической обработки поверхности металлических изделий с
          целью придания им нужной шероховатости, формы и точности размеров. 
          <br /><br />
          Данный метод широко
          применяется в машиностроении, приборостроении, авиастроении и других отраслях, где важна
          высокая точность обработки деталей. Основной рабочий инструмент при шлифовке - абразивный
          круг, выполненный из твёрдых частиц, способных снимать тонкий слой металла с обрабатываемой
          поверхности.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/grinding.png" alt="Шлифовка" class="uslugi-image" />
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
              <col style="width: 500px" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th class="uslugi-table-thead">Тип сварки</th>
                <th class="uslugi-table-thead">Рабочая зона, мм</th>
                <th class="uslugi-table-thead">Макс. вес</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Круглошлифовальный станок</td>
                <td>
                  диаметр: до 270,<br />
                  длина: до 500
                </td>
                <td>50 кг</td>
              </tr>
              <tr>
                <td>Внутришлифовальный станок</td>
                <td>
                  внутр. диаметр: до 240<br />
                  глубина: до 600 мм
                </td>
                <td>60 кг</td>
              </tr>
              <tr>
                <td>Плоскошлифовальный станок</td>
                <td>
                  длина: до 2000 мм<br />
                  ширина: до 600 мм<br />
                  высота: до 380 мм
                </td>
                <td>1000 кг</td>
              </tr>
              <tr>
                <td>Внутришлифовальный станок</td>
                <td>
                  диаметр: до 400<br />
                  длина: до 2000
                </td>
                <td>200 кг</td>
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

@media (max-width: 767px) {
  .technical-requirements {
    display: none;
  }
}

</style>

