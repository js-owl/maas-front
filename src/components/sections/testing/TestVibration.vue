<script setup lang="ts">
import { ref } from 'vue'

const openedNormativeItems = ref<string[]>([])

const normativeDocuments = [
  'ГОСТ РВ 20.57.305-98',
  'НЛГВ-2',
  'ГОСТ 28203-89',
  'ГОСТ 30630.1.9-2015',
  'IEC60945',
  'ГОСТ РВ 0020-57.305-2019',
  'КТ-160',
  'ГОСТ 28213-89',
  'ГОСТ 30631-99',
  'IEC60068',
  'ГОСТ РВ 20.39.414.1-97',
  'ГОСТ 11478-88',
  'ГОСТ 28215-89',
  'ГОСТ Р 51371-99',
  'ГОСТ РВ 20.57.416-97',
  'ГОСТ 16019-2001',
  'ГОСТ 28220-89',
  'ГОСТ Р 53189-2008',
  'ГОСТ Р 53190-2008',
  'ГОСТ РВ 0020-57.416-2020',
  'ГОСТ 16962.2-90',
  'ГОСТ 28221-89',
  'ГОСТ IEC 60068-2-57-2016',
  'ГОСТ 17516.1-90',
  'ГОСТ 30630.1.1-99',
  'DO-160',
  'ЕНГЛ-С',
  'ГОСТ 16019-2001',
  'ГОСТ 30630.1.2-99',
  'MIL-STD-810',
]
</script>

<template>
  <section class="section-basic vibration-section">
    <div class="technical-requirements">
      <div class="uslugi-table-title">
        <div>1. Испытание на воздействие синусоидальной вибрации одной частоты</div>
        <div>2. Испытание на воздействие синусоидальной вибрации с изменяемой частотой</div>
        <div>3. Испытание на воздействие широкополосной случайной вибрации</div>
      </div>

      <div class="requirements-table-wrapper">
        <table class="requirements-table requirements-table--middle requirements-table--compact">
          <colgroup>
            <col class="col-type" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td>Диапазон рабочих частот</td>
              <td>(1..2000) Гц</td>
            </tr>
            <tr>
              <td>Диапазон воспроизведения амплитуды ускорения</td>
              <td>
                (4,9..980) м/с²
                <br />
                (0.5 до 100) g
              </td>
            </tr>
            <tr>
              <td>Макс. перемещение (пик-пик)</td>
              <td>50 мм</td>
            </tr>
            <tr>
              <td>Номинальная высталкивающая сила</td>
              <td>16.3 кН</td>
            </tr>
            <tr>
              <td>Массо-габаритные характеристики испытываемой продукции</td>
              <td>
                350 кг
                <br />
                800 x 800 x 1000 мм
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="subsection">
        <div class="uslugi-table-title">
          Испытание на воздействие широкополосной случайной вибрации с наложением
          полигармонической вибрации
        </div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--middle requirements-table--compact">
            <colgroup>
              <col class="col-type" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td>Диапазон рабочих частот</td>
                <td>(1..2000) Гц</td>
              </tr>
              <tr>
                <td>Диапазон воспроизведения амплитуды ускорения</td>
                <td>
                  (4,9..980) м/с²
                  <br />
                  (0.5 до 100) g
                </td>
              </tr>
              <tr>
                <td>Макс. перемещение (пик-пик)</td>
                <td>50 мм</td>
              </tr>
              <tr>
                <td>Номинальная высталкивающая сила</td>
                <td>20.6 кН</td>
              </tr>
              <tr>
                <td>Массо-габаритные характеристики испытываемой продукции</td>
                <td>
                  350 кг
                  <br />
                  800 x 800 x 1000 мм
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="subsection">
        <div class="uslugi-table-title">Испытание на воздействие ударов многократного и одиночного действия</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--middle requirements-table--compact">
            <colgroup>
              <col class="col-type" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td>Диапазон рабочих частот</td>
                <td>(1..2000) Гц</td>
              </tr>
              <tr>
                <td>Диапазон воспроизведения амплитуды ускорения</td>
                <td>
                  (4,9..980) м/с²
                  <br />
                  (0.5 до 100) g
                </td>
              </tr>
              <tr>
                <td>Макс. перемещение (пик-пик)</td>
                <td>50 мм</td>
              </tr>
              <tr>
                <td>Номинальная высталкивающая сила</td>
                <td>106.8 кН</td>
              </tr>
              <tr>
                <td>Массо-габаритные характеристики испытываемой продукции</td>
                <td>
                  350 кг
                  <br />
                  800 x 800 x 1000 мм
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

.tests-list {
  margin-bottom: 16px;
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
}

.subsection {
  margin-top: 32px;
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

.requirements-table th {
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

.requirements-table th:last-child {
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
  .tests-list {
    font-size: 22px;
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
