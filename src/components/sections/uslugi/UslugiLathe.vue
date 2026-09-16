<script lang="ts" setup>
import { useUslugiRequirementsExpand } from '@/composables/useUslugiRequirementsExpand'
import UslugiRequirementsAccordion from '@/components/sections/uslugi/UslugiRequirementsAccordion.vue'
import UslugiKeywords from '@/components/sections/uslugi/UslugiKeywords.vue'

const { isRequirementsExpanded, isMobile } = useUslugiRequirementsExpand()

const keywords = [
  'Токарная обработка металла',
  'Токарные работы',
  'Детали по чертежам',
  'Токарная обработка ЧПУ',
  'Изготовление деталей на токарном станке',
  'Расчет стоимости токарной обработки',
]

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
          <p>
            Выполняем токарную обработку металла на заказ по чертежам и 3D-моделям заказчика.
            Производственные возможности платформы позволяют выполнять обработку деталей на
            универсальных токарных станках и оборудовании с ЧПУ, включая крупногабаритные заготовки.
          </p>
          <p>
            Токарные работы применяются для изготовления валов, втулок, осей, колец, фланцев и
            других тел вращения с заданными геометрическими параметрами. Доступна обработка сталей,
            нержавеющих и легированных сталей, титановых, алюминиевых, медных сплавов и ряда
            инженерных полимеров.
          </p>
          <p>
            Максимальные доступные габариты на отдельных типах оборудования — до 1600 мм по
            диаметру и до 5000 мм по длине. Конкретная технология обработки, оборудование и
            производственный маршрут подбираются после анализа конструкторской документации.
          </p>
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/lathe.png" alt="Токарная обработка" class="uslugi-image" width="500" height="391" />
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
                  <th class="uslugi-table-thead">Габариты, мм</th>
                  <th class="uslugi-table-thead">Материалы</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in equipmentRows" :key="row.equipment">
                  <td>{{ row.equipment }}</td>
                  <td>
                    <template v-for="(line, index) in row.dimensions" :key="line">
                      <br v-if="index > 0" />{{ line }}
                    </template>
                  </td>
                  <td>
                    <ul class="materials-list">
                      <li v-for="material in materials" :key="material">{{ material }}</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </UslugiRequirementsAccordion>

      <UslugiKeywords :tags="keywords" />
    </div>
  </el-col>
</template>
