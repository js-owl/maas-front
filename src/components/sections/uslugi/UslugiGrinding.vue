<script lang="ts" setup>
import { useUslugiRequirementsExpand } from '@/composables/useUslugiRequirementsExpand'
import UslugiRequirementsAccordion from '@/components/sections/uslugi/UslugiRequirementsAccordion.vue'

const { isRequirementsExpanded, isMobile } = useUslugiRequirementsExpand()

const equipmentRows = [
  {
    equipment: 'Круглошлифовальный станок',
    maxWeight: 'Макс. вес до 50 кг',
    dimensions: ['диаметр: до 270', 'длина: до 500'],
  },
  {
    equipment: 'Внутришлифовальный станок',
    maxWeight: 'Макс. вес до 60 кг',
    dimensions: ['внутр. диаметр: до 240', 'глубина: до 600 мм'],
  },
  {
    equipment: 'Плоскошлифовальный станок',
    maxWeight: 'Макс. вес до 1000 кг',
    dimensions: ['длина: до 2000 мм', 'ширина: до 600 мм', 'высота: до 380 мм'],
  },
  {
    equipment: 'Внутришлифовальный станок',
    maxWeight: 'Макс. вес до 200 кг',
    dimensions: ['диаметр: до 400', 'длина: до 2000'],
  },
]
</script>

<template>
  <!-- Шлифовка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper uslugi-wrapper--grinding">
      <div class="uslugi-title">Шлифовка</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Шлифовка металла - это процесс механической обработки поверхности металлических изделий с
          целью придания им нужной шероховатости, формы и точности размеров.
          <br /><br />
          Данный метод широко применяется в машиностроении, приборостроении, авиастроении и других
          отраслях, где важна высокая точность обработки деталей. Основной рабочий инструмент при
          шлифовке - абразивный круг, выполненный из твёрдых частиц, способных снимать тонкий слой
          металла с обрабатываемой поверхности.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/grinding.png" alt="Шлифовка" class="uslugi-image" />
        </div>
      </div>

      <UslugiRequirementsAccordion v-model:expanded="isRequirementsExpanded" :is-mobile="isMobile">
        <template #mobile>
          <div class="requirements-mobile">
            <div class="requirements-mobile__row requirements-mobile__row--head">
              <div class="requirements-mobile__cell">Тип сварки</div>
              <div class="requirements-mobile__cell requirements-mobile__cell--narrow">
                Рабочая зона, мм
              </div>
            </div>

            <div
              v-for="row in equipmentRows"
              :key="`${row.equipment}-${row.maxWeight}`"
              class="requirements-mobile__row"
            >
              <div class="requirements-mobile__cell">
                <p class="requirements-mobile__line">{{ row.equipment }}</p>
                <p class="requirements-mobile__line">{{ row.maxWeight }}</p>
              </div>
              <div class="requirements-mobile__cell requirements-mobile__cell--narrow">
                <p
                  v-for="(line, index) in row.dimensions"
                  :key="index"
                  class="requirements-mobile__line"
                >
                  {{ line }}
                </p>
              </div>
            </div>
          </div>
        </template>

        <template #desktop>
          <div class="requirements-table-wrapper">
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
        </template>
      </UslugiRequirementsAccordion>
    </div>
  </el-col>
</template>
