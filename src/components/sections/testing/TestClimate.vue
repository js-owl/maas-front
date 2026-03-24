<script setup lang="ts">
import { ref } from 'vue'

const openedNormativeItems = ref<string[]>([])

const normativeDocuments = [
  'ГОСТ РВ 20.57.306-98',
  'ЕНГЛ-С',
  'ГОСТ 15543-70',
  'ГОСТ 28216-89',
  'IEC60068',
  'ГОСТ РВ 0020-57.306-2019',
  'НЛГВ-2',
  'ГОСТ 15543.1-89',
  'ГОСТ 28224-89',
  'IEC60945',
  'ГОСТ РВ 20.39.414.1-97',
  'КТ-160',
  'ГОСТ 16962.1-90',
  'ГОСТ Р 51369-99',
  'ГОСТ РВ 20.57.416-97',
  'ГОСТ 11478-88',
  'ГОСТ 16019-2001',
  'DO-160',
  'MIL-STD-810',
  'ГОСТ РВ 0020-57.416-2020',
  'ГОСТ 15150-69',
  'ГОСТ 28201-89',
]
</script>

<template>
  <section class="section-basic climate-section">
    <div class="technical-requirements">
      <div class="temperature-section">
        <div class="uslugi-title-table">Испытание на воздействие температуры среды</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <colgroup>
              <col class="col-type" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td>Диапазон температур</td>
                <td>t от -65 &deg;C до +180 &deg;C</td>
              </tr>
              <tr>
                <td>Массо-габаритные характеристики испытываемой продукции</td>
                <td>
                  150 кг
                  <br />
                  800 x 700 x 800 мм
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="humidity-section">
        <div class="uslugi-title-table">Испытание на воздействие влажности</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <colgroup>
              <col class="col-type" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td>Диапазон рабочих частот</td>
                <td>
                  от 20% до 98%
                  <br />
                  t от -85 &deg;C до +20 &deg;C
                </td>
              </tr>
              <tr style="margin-top: 10px;">
                <td>Массо-габаритные характеристики испытываемой продукции</td>
                <td>
                  150 кг
                  <br />
                  800 x 700 x 800 мм
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <el-collapse v-model="openedNormativeItems" class="normative-collapse">
      <el-collapse-item name="normative">
        <template #title>
          <span class="normative-title">
            Обозначение НД, устанавливающих нормы испытаний и измерений
          </span>
        </template>
        <div class="normative-content">
          <span
            v-for="item in normativeDocuments"
            :key="item"
            class="normative-chip"
          >
            {{ item }}
          </span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<style scoped>
.technical-requirements {
  margin-top: 20px;
}

/* .temperature-section {
  padding-top: 30px;
} */

.humidity-section {
  margin-top: 30px;
}

.requirements-table-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background-color: #f4f6f8;
}

.requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.col-type {
  width: 900px;
}

.requirements-table thead {
  background-color: var(--bgcolor);
}

.requirements-table th,
.requirements-table td {
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 500;
  color: #000;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  vertical-align: middle;
}

.requirements-table th {
  font-size: 18px;
  font-weight: 500;
}

.requirements-table th:last-child,
.requirements-table td:last-child {
  border-right: none;
}

.requirements-table tr:last-child td {
  border-bottom: none;
}

.normative-collapse {
  margin-top: 28px;
}

.normative-collapse :deep(.el-collapse) {
  border-top: none;
  border-bottom: none;
}

.normative-collapse :deep(.el-collapse-item__header) {
  min-height: 56px;
  padding: 12px 18px;
  margin: 0;
  box-sizing: border-box;
  border: none;
  border-radius: 8px 8px 0 0;
  background-color: #cbd1d5;
  line-height: 1.3;
}

.normative-collapse :deep([id^='el-collapse-head-']) {
  margin: 0;
}

.normative-collapse :deep(.el-collapse-item__arrow) {
  margin: 0 0 0 auto;
}

.normative-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
  border-radius: 0 0 8px 8px;
  background-color: #cbd1d5;
}

.normative-collapse :deep(.el-collapse-item__content) {
  padding: 0 18px 16px;
}

.normative-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
}

.normative-content {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px 12px;
}

.normative-chip {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: #b9c0c5;
  font-size: 16px;
  font-weight: 500;
  color: #000;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .requirements-table th,
  .requirements-table td {
    font-size: 14px;
    padding: 10px 12px;
  }

  .requirements-table th {
    font-size: 16px;
  }

  .normative-collapse :deep(.el-collapse-item__header) {
    padding: 10px 12px;
  }

  .normative-collapse :deep(.el-collapse-item__content) {
    padding: 0 12px 12px;
  }

  .normative-title {
    font-size: 20px;
  }

  .normative-content {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .normative-chip {
    font-size: 14px;
    padding: 5px 10px;
  }
}
</style>
