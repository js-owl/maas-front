<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

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

        <div v-if="isRequirementsExpanded && isMobile" class="lathe-requirements-mobile">
          <div class="lathe-requirements-mobile__row lathe-requirements-mobile__row--head">
            <div class="lathe-requirements-mobile__cell">Оборудование</div>
            <div class="lathe-requirements-mobile__cell">Габариты</div>
          </div>

          <div
            v-for="row in equipmentRows"
            :key="row.equipment"
            class="lathe-requirements-mobile__row"
          >
            <div class="lathe-requirements-mobile__cell">{{ row.equipment }}</div>
            <div class="lathe-requirements-mobile__cell">
              <p
                v-for="(line, index) in row.dimensions"
                :key="index"
                class="lathe-requirements-mobile__line"
              >
                {{ line }}
              </p>
            </div>
          </div>

          <div class="lathe-requirements-mobile__row lathe-requirements-mobile__row--materials">
            <div class="lathe-requirements-mobile__cell lathe-requirements-mobile__cell--full">
              <p class="lathe-requirements-mobile__materials-title">Материалы:</p>
              <ul class="lathe-requirements-mobile__materials-list">
                <li v-for="material in materials" :key="material">{{ material }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div v-else-if="isRequirementsExpanded" class="requirements-table-wrapper">
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
  gap: 8px;
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

.lathe-requirements-mobile {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.lathe-requirements-mobile__row {
  display: flex;
  width: 100%;
}

.lathe-requirements-mobile__row--head .lathe-requirements-mobile__cell {
  background-color: var(--button-bg);
}

.lathe-requirements-mobile__row--head .lathe-requirements-mobile__cell:first-child {
  border-top-left-radius: 8px;
}

.lathe-requirements-mobile__row--head .lathe-requirements-mobile__cell:last-child {
  border-top-right-radius: 8px;
}

.lathe-requirements-mobile__row--materials .lathe-requirements-mobile__cell--full {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.lathe-requirements-mobile__cell {
  flex: 1 1 0;
  min-width: 0;
  padding: 8px;
  border: 1px solid #aeb2b5;
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

.lathe-requirements-mobile__cell--full {
  flex: 1 1 100%;
  width: 100%;
}

.lathe-requirements-mobile__line {
  margin: 0;
}

.lathe-requirements-mobile__materials-title {
  margin: 0;
}

.lathe-requirements-mobile__materials-list {
  margin: 0;
  padding-left: 15px;
  list-style-type: disc;
}

.lathe-requirements-mobile__materials-list li {
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
