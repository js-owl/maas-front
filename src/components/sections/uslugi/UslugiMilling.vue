<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

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

      <div
        class="technical-requirements"
        :class="{ 'technical-requirements--expanded': isRequirementsExpanded && isMobile }"
      >
        <button
          v-if="isMobile"
          type="button"
          class="requirements-header requirements-header--mobile"
          @click="isRequirementsExpanded = !isRequirementsExpanded"
        >
          <div class="uslugi-table-title">Технические требования</div>
          <el-icon class="requirements-arrow" :class="{ expanded: isRequirementsExpanded }">
            <IconArrowDown color="#000000" />
          </el-icon>
        </button>

        <div
          v-else
          class="requirements-header"
          @click="isRequirementsExpanded = !isRequirementsExpanded"
        >
          <div class="uslugi-table-title">Технические требования</div>
          <el-icon class="requirements-arrow" :class="{ expanded: isRequirementsExpanded }">
            <IconArrowDown />
          </el-icon>
        </div>

        <div v-if="isRequirementsExpanded && isMobile" class="milling-requirements-mobile">
          <div class="milling-requirements-mobile__row milling-requirements-mobile__row--head">
            <div class="milling-requirements-mobile__cell">Оборудование</div>
            <div class="milling-requirements-mobile__cell">Габариты, мм</div>
          </div>

          <div
            v-for="row in equipmentRows"
            :key="row.equipment"
            class="milling-requirements-mobile__row"
          >
            <div class="milling-requirements-mobile__cell">{{ row.equipment }}</div>
            <div class="milling-requirements-mobile__cell">
              <p
                v-for="(line, index) in row.dimensions"
                :key="index"
                class="milling-requirements-mobile__line"
              >
                {{ line }}
              </p>
            </div>
          </div>

          <div class="milling-requirements-mobile__row milling-requirements-mobile__row--materials">
            <div class="milling-requirements-mobile__cell milling-requirements-mobile__cell--full">
              <ul class="milling-requirements-mobile__materials-list">
                <li v-for="material in materials" :key="material">{{ material }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div v-else-if="isRequirementsExpanded" class="requirements-table-wrapper">
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
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.technical-requirements {
  margin-top: 40px;
}

.technical-requirements--expanded {
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-top: 0;
}

.requirements-header {
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.requirements-header--mobile {
  height: 24px;
  min-height: 24px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 0;
  width: 100%;
  text-align: left;
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

.milling-requirements-mobile {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #aeb2b5;
  border-radius: 8px;
  overflow: hidden;
}

.milling-requirements-mobile__row {
  display: flex;
  width: 100%;
}

.milling-requirements-mobile__row:not(:last-child) {
  border-bottom: 1px solid #aeb2b5;
}

.milling-requirements-mobile__row--head .milling-requirements-mobile__cell {
  background-color: var(--button-bg);
}

.milling-requirements-mobile__row:not(.milling-requirements-mobile__row--materials)
  .milling-requirements-mobile__cell:first-child {
  border-right: 1px solid #aeb2b5;
}

.milling-requirements-mobile__cell {
  flex: 1 1 0;
  min-width: 0;
  padding: 8px;
  background-color: #f2f3f7;
  box-sizing: border-box;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  text-align: left;
  word-break: break-word;
}

.milling-requirements-mobile__cell--full {
  flex: 1 1 100%;
  width: 100%;
}

.milling-requirements-mobile__line {
  margin: 0;
}

.milling-requirements-mobile__materials-list {
  margin: 0;
  padding-left: 15px;
  list-style-type: disc;
}

.milling-requirements-mobile__materials-list li {
  margin: 0;
}

@media (max-width: 767px) {
  .technical-requirements {
    margin-top: 0;
  }

  .requirements-header :deep(.uslugi-table-title) {
    margin: 0;
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
    color: #000000;
  }

  .requirements-arrow {
    font-size: 24px;
    width: 24px;
    height: 24px;
    color: #000000;
  }
}
</style>
