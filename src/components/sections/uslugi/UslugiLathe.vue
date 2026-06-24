<script lang="ts" setup>
import { useUslugiRequirementsExpand } from '@/composables/useUslugiRequirementsExpand'
import UslugiRequirementsAccordion from '@/components/sections/uslugi/UslugiRequirementsAccordion.vue'

const { isRequirementsExpanded, isMobile } = useUslugiRequirementsExpand()

const materials = [
  'Нержавеющие, легированные стали',
  'Стали коррозионностойкие (жаропрочные)',
  'Стали конструкционные легированные',
  'Титановые сплавы',
  'Полиамиды, фторопласт',
  'Алюминиевые, бронзовые, медные сплавы',
]

const equipmentRows = [
  {
    equipment: 'Токарно-винторезные станки',
    dimensions: ['диаметр: до 1600', 'длина: до 5000'],
  },
  {
    equipment: 'Станок с ЧПУ',
    dimensions: ['Диаметр до 600'],
  },
  {
    equipment: 'Тяжёлый токарный станок с ЧПУ',
    dimensions: ['диаметр: до 880', 'длина: до 1500'],
  },
]
</script>

<template>
  <!-- Токарная обработка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper uslugi-wrapper--lathe">
      <div class="uslugi-title">Токарная обработка</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Токарная обработка представляет собой механическую операцию, при которой вращающаяся
          деталь обрабатывается режущим инструментом, последовательно снимающим слои материала.
          <br /><br />
          Технология позволяет создавать цилиндрические, конические и сложные профилированные
          поверхности с высокой степенью точности. Применяется в производстве металлических,
          пластиковых и других изделий, обеспечивая превосходное качество финишной обработки.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/lathe.png" alt="Токарная обработка" class="uslugi-image" />
        </div>
      </div>

      <UslugiRequirementsAccordion v-model:expanded="isRequirementsExpanded" :is-mobile="isMobile">
        <template #mobile>
          <div class="requirements-mobile">
            <div class="requirements-mobile__row requirements-mobile__row--head">
              <div class="requirements-mobile__cell">Оборудование</div>
              <div class="requirements-mobile__cell">Габариты</div>
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
                <p class="requirements-mobile__materials-title">Материалы:</p>
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
                      <li v-for="material in materials" :key="material">{{ material }}</li>
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
        </template>
      </UslugiRequirementsAccordion>
    </div>
  </el-col>
</template>
