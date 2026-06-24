<script lang="ts" setup>
import { useUslugiRequirementsExpand } from '@/composables/useUslugiRequirementsExpand'
import UslugiRequirementsAccordion from '@/components/sections/uslugi/UslugiRequirementsAccordion.vue'

const { isRequirementsExpanded, isMobile } = useUslugiRequirementsExpand()

const materials = ['Алюминиевые сплавы', 'Сталь', 'Дерево']

const equipmentRows = [
  {
    equipment: 'Универсальные станки',
    dimensions: ['до 1 400 (Д х Ш х В)'],
  },
  {
    equipment: 'Станки ЧПУ, 5-осевой',
    dimensions: [
      'max: 13 866 × 1 571 × 1 150 (дерево)',
      'max: 4 200 × 3 200 × 1 250 (металл)',
    ],
  },
  {
    equipment: 'Станки ЧПУ, 3-осевой',
    dimensions: ['max: 4 200 × 3 200 × 1 250 (металл)'],
  },
  {
    equipment: 'Фрезерно-гравировальный станок',
    dimensions: ['max: 2 200 × 1 610 (металл)', 'max: 4 000 × 2 070 (дерево)'],
  },
]
</script>

<template>
  <!-- Фрезерная обработка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper uslugi-wrapper--milling">
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

      <UslugiRequirementsAccordion v-model:expanded="isRequirementsExpanded" :is-mobile="isMobile">
        <template #mobile>
          <div class="requirements-mobile">
            <div class="requirements-mobile__row requirements-mobile__row--head">
              <div class="requirements-mobile__cell">Оборудование</div>
              <div class="requirements-mobile__cell">Габариты, мм</div>
            </div>

            <div
              v-for="row in equipmentRows"
              :key="row.equipment"
              class="requirements-mobile__row"
            >
              <div class="requirements-mobile__cell">{{ row.equipment }}</div>
              <div class="requirements-mobile__cell">
                <p
                  v-for="(line, index) in row.dimensions"
                  :key="index"
                  class="requirements-mobile__line"
                >
                  {{ line }}
                </p>
              </div>
            </div>

            <div class="requirements-mobile__row requirements-mobile__row--materials">
              <div class="requirements-mobile__cell requirements-mobile__cell--full">
                <ul class="requirements-mobile__materials-list">
                  <li v-for="material in materials" :key="material">{{ material }}</li>
                </ul>
              </div>
            </div>
          </div>
        </template>

        <template #desktop>
          <div class="requirements-table-wrapper">
            <table class="requirements-table">
              <colgroup>
                <col />
                <col />
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
                      <li v-for="material in materials" :key="material">{{ material }}</li>
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
        </template>
      </UslugiRequirementsAccordion>
    </div>
  </el-col>
</template>
