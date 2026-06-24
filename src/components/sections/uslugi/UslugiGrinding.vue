<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

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

        <div v-if="isRequirementsExpanded && isMobile" class="grinding-requirements-mobile">
          <div class="grinding-requirements-mobile__row grinding-requirements-mobile__row--head">
            <div class="grinding-requirements-mobile__cell">Тип сварки</div>
            <div
              class="grinding-requirements-mobile__cell grinding-requirements-mobile__cell--zone"
            >
              Рабочая зона, мм
            </div>
          </div>

          <div
            v-for="row in equipmentRows"
            :key="`${row.equipment}-${row.maxWeight}`"
            class="grinding-requirements-mobile__row"
          >
            <div class="grinding-requirements-mobile__cell">
              <p class="grinding-requirements-mobile__line">{{ row.equipment }}</p>
              <p class="grinding-requirements-mobile__line">{{ row.maxWeight }}</p>
            </div>
            <div
              class="grinding-requirements-mobile__cell grinding-requirements-mobile__cell--zone"
            >
              <p
                v-for="(line, index) in row.dimensions"
                :key="index"
                class="grinding-requirements-mobile__line"
              >
                {{ line }}
              </p>
            </div>
          </div>
        </div>

        <div v-else-if="isRequirementsExpanded" class="requirements-table-wrapper">
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

.grinding-requirements-mobile {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #aeb2b5;
  border-radius: 8px;
  overflow: hidden;
}

.grinding-requirements-mobile__row {
  display: flex;
  width: 100%;
}

.grinding-requirements-mobile__row:not(:last-child) {
  border-bottom: 1px solid #aeb2b5;
}

.grinding-requirements-mobile__row--head .grinding-requirements-mobile__cell {
  background-color: var(--button-bg);
}

.grinding-requirements-mobile__row .grinding-requirements-mobile__cell:first-child {
  border-right: 1px solid #aeb2b5;
}

.grinding-requirements-mobile__cell {
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

.grinding-requirements-mobile__cell--zone {
  flex: 0 0 120px;
  width: 120px;
}

.grinding-requirements-mobile__line {
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
