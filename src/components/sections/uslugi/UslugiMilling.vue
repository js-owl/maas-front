<script lang="ts" setup>
import { useUslugiRequirementsExpand } from '@/composables/useUslugiRequirementsExpand'
import UslugiRequirementsAccordion from '@/components/sections/uslugi/UslugiRequirementsAccordion.vue'
import UslugiKeywords from '@/components/sections/uslugi/UslugiKeywords.vue'

const { isRequirementsExpanded, isMobile } = useUslugiRequirementsExpand()

const keywords = [
  'Фрезерная обработка металла',
  'Фрезерные работы',
  'Детали по чертежам',
  'Фрезеровка ЧПУ',
  'Фрезерная обработка по чертежам',
  'Изготовление деталей на ЧПУ',
  'Расчет стоимости деталей на ЧПУ',
]

const materialsLabel = 'Алюминиевые сплавы, сталь, дерево'

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
      <template v-if="isMobile">
        <div class="uslugi-mech-content">
          <div class="uslugi-mech-intro">
            <div class="uslugi-title">Фрезерная обработка</div>
            <div class="uslugi-text">
              <p>
                Фрезерная обработка представляет собой технологический процесс, при котором
                специальный режущий инструмент (фреза) вращается и удаляет материал, создавая изделия
                заданной конфигурации.
              </p>
              <p>
                Методика эффективна как для изготовления плоских элементов, так и для формирования
                трёхмерных объектов. Она обеспечивает прецизионную точность и широко применяется при
                работе с различными материалами: металлами, полимерами, древесиной.
              </p>
            </div>
          </div>

          <div class="uslugi-image-wrapper">
            <img
              src="/uslugiPages/milling.png"
              alt="Фрезерная обработка"
              class="uslugi-image"
              width="500"
              height="380"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="uslugi-title">Фрезерная обработка</div>

        <div class="uslugi-section">
          <div class="uslugi-text">
            <p>
              Выполняем фрезерную обработку деталей на заказ по конструкторской документации и
              3D-моделям. Доступно универсальное оборудование, а также 3- и 5-координатные станки с
              ЧПУ, позволяющие изготавливать детали сложной формы и обрабатывать несколько
              поверхностей заготовки.
            </p>
            <p>
              Производственные ресурсы позволяют работать с алюминиевыми сплавами, сталями и другими
              материалами в зависимости от требований проекта. После загрузки чертежа или 3D-модели
              специалисты определяют технологию, оборудование и последовательность операций,
              необходимую для изготовления детали.
            </p>
            <p>
              Фрезерные работы применяются при производстве корпусов, плит, кронштейнов, элементов
              оснастки и других деталей с пазами, карманами, отверстиями и сложными пространственными
              поверхностями.
            </p>
          </div>

          <div class="uslugi-image-wrapper">
            <img src="/uslugiPages/milling.png" alt="Фрезерная обработка" class="uslugi-image" width="500" height="380" />
          </div>
        </div>
      </template>

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
                {{ materialsLabel }}
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
                <tr v-for="row in equipmentRows" :key="row.equipment">
                  <td>{{ row.equipment }}</td>
                  <td>
                    <template v-for="(line, index) in row.dimensions" :key="line">
                      <br v-if="index > 0" />{{ line }}
                    </template>
                  </td>
                  <td>{{ materialsLabel }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </UslugiRequirementsAccordion>

      <UslugiKeywords v-if="!isMobile" :tags="keywords" />
    </div>
  </el-col>
</template>
