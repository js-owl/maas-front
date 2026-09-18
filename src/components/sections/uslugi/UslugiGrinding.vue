<script lang="ts" setup>
import { useUslugiRequirementsExpand } from '@/composables/useUslugiRequirementsExpand'
import UslugiRequirementsAccordion from '@/components/sections/uslugi/UslugiRequirementsAccordion.vue'
import UslugiKeywords from '@/components/sections/uslugi/UslugiKeywords.vue'

const { isRequirementsExpanded, isMobile, isTablet } = useUslugiRequirementsExpand()

const keywords = [
  'Шлифовка металла',
  'Шлифовальные работы',
  'Шлифовка металла на заказ',
  'Полировка металлических деталей',
  'Полировка металла',
  'Плоскошлифовальные работы',
  'Шлифовка деталей',
  'Расчет стоимости шлифовки',
]

const equipmentRows = [
  {
    equipment: 'Круглошлифовальный станок',
    maxWeight: '50 кг',
    dimensions: ['диаметр: до 270', 'длина: до 500'],
  },
  {
    equipment: 'Внутришлифовальный станок',
    maxWeight: '60 кг',
    dimensions: ['внутр. диаметр: до 240', 'глубина: до 600 мм'],
  },
  {
    equipment: 'Плоскошлифовальный станок',
    maxWeight: '1000 кг',
    dimensions: ['длина: до 2000 мм', 'ширина: до 600 мм', 'высота: до 380 мм'],
  },
  {
    equipment: 'Внутришлифовальный станок',
    maxWeight: '200 кг',
    dimensions: ['диаметр: до 400', 'длина: до 2000'],
  },
]
</script>

<template>
  <!-- Шлифовка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper uslugi-wrapper--grinding">
      <template v-if="isMobile">
        <div class="uslugi-mech-content">
          <div class="uslugi-mech-intro">
            <div class="uslugi-title">Шлифовка</div>
            <div class="uslugi-text">
              <p>
                Шлифовка металла - это процесс механической обработки поверхности металлических
                изделий с целью придания им нужной шероховатости, формы и точности размеров.
              </p>
              <p>
                Данный метод широко применяется в машиностроении, приборостроении, авиастроении и
                других отраслях, где важна высокая точность обработки деталей. Основной рабочий
                инструмент при шлифовке - абразивный круг, выполненный из твёрдых частиц, способных
                снимать тонкий слой металла с обрабатываемой поверхности.
              </p>
            </div>
          </div>

          <div class="uslugi-image-wrapper">
            <img
              src="/uslugiPages/grinding.png"
              alt="Шлифовка"
              class="uslugi-image"
              width="500"
              height="380"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="uslugi-title">Шлифовка</div>

        <div class="uslugi-section">
          <div class="uslugi-text">
            <template v-if="isTablet">
              <p>
                Шлифовка металла - это процесс механической обработки поверхности металлических
                изделий с целью придания им нужной шероховатости, формы и точности размеров.
              </p>
              <p>
                Данный метод широко применяется в машиностроении, приборостроении, авиастроении и
                других отраслях, где важна высокая точность обработки деталей. Основной рабочий
                инструмент при шлифовке - абразивный круг, выполненный из твёрдых частиц, способных
                снимать тонкий слой металла с обрабатываемой поверхности.
              </p>
            </template>
            <template v-else>
              <p>
                Выполняем шлифовку и полировку металлических деталей для получения требуемой геометрии,
                размеров и качества поверхности. Шлифование применяется как финишный этап механической
                обработки, когда необходимо уменьшить шероховатость, обеспечить точность сопрягаемых
                поверхностей или подготовить изделие к последующим технологическим операциям.
              </p>
              <p>
                Доступны круглошлифовальная, внутришлифовальная и плоскошлифовальная обработка.
                Технология и режим обработки подбираются с учётом материала детали, её геометрии и
                требований конструкторской документации.
              </p>
              <p>
                Услуга может использоваться как самостоятельная операция либо как часть комплексного
                производственного маршрута — после токарной или фрезерной обработки и перед нанесением
                защитных или функциональных покрытий.
              </p>
            </template>
          </div>

          <div class="uslugi-image-wrapper">
            <img src="/uslugiPages/grinding.png" alt="Шлифовка" class="uslugi-image" width="500" height="380" />
          </div>
        </div>
      </template>

      <UslugiRequirementsAccordion v-model:expanded="isRequirementsExpanded" :is-mobile="isMobile">
        <template #mobile>
          <div class="requirements-mobile">
            <div class="requirements-mobile__row requirements-mobile__row--head">
              <div class="requirements-mobile__cell">Оборудование</div>
              <div class="requirements-mobile__cell requirements-mobile__cell--narrow">
                Габариты, мм
              </div>
            </div>

            <div
              v-for="row in equipmentRows"
              :key="`${row.equipment}-${row.maxWeight}`"
              class="requirements-mobile__row"
            >
              <div class="requirements-mobile__cell">
                <p class="requirements-mobile__line">{{ row.equipment }}</p>
                <p class="requirements-mobile__line">Макс. вес {{ row.maxWeight }}</p>
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
                  <th class="uslugi-table-thead">Оборудование</th>
                  <th class="uslugi-table-thead">Габариты, мм</th>
                  <th class="uslugi-table-thead">Макс. вес</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in equipmentRows" :key="`${row.equipment}-${row.maxWeight}`">
                  <td>{{ row.equipment }}</td>
                  <td>
                    <template v-for="(line, index) in row.dimensions" :key="line">
                      <br v-if="index > 0" />{{ line }}
                    </template>
                  </td>
                  <td>{{ row.maxWeight }}</td>
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
