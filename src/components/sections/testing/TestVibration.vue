<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

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

const mobileNormativeDocuments = [
  'ГОСТ РВ 20.57.305-98',
  'ГОСТ РВ 0020-57.305-2019',
  'ГОСТ РВ 20.39.414.1-97',
  'ГОСТ РВ 20.57.416-97',
  'ГОСТ РВ 0020-57.416-2020',
  'ГОСТ IEC 60068-2-57-2016',
  'ЕНГЛ-С',
  'НЛГВ-2',
  'КТ-160',
  'ГОСТ 11478-88',
  'ГОСТ 16019-2001',
  'ГОСТ 16962.2-90',
  'ГОСТ 17516.1-90',
  'ГОСТ 16019-2001',
  'ГОСТ 28203-89',
  'ГОСТ 28213-89',
  'ГОСТ 28215-89',
  'ГОСТ 28220-89',
  'ГОСТ 28221-89',
  'ГОСТ 30630.1.1-99',
  'ГОСТ 30630.1.2-99',
  'ГОСТ 30630.1.9-2015',
  'ГОСТ 30631-99',
  'ГОСТ Р 51371-99',
  'ГОСТ Р 53189-2008',
  'ГОСТ Р 53190-2008',
  'DO-160',
  'MIL-STD-810',
  'IEC60945',
  'IEC60068',
]
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-3756 -->
  <section class="section-basic vibration-section" :class="{ 'vibration-section--mobile': isMobile }">
    <div class="technical-requirements">
      <template v-if="isMobile">
        <div class="vibration-block">
          <div class="vibration-block__titles">
            <ol class="uslugi-table-title uslugi-table-title--mobile-list" start="1">
              <li>
                Испытание на воздействие синусоидальной вибрации одной частоты / с изменяемой частотой.
              </li>
            </ol>
            <ol class="uslugi-table-title uslugi-table-title--mobile-list" start="3">
              <li>Испытание на воздействие широкополосной случайной вибрации</li>
            </ol>
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
                    (4.9...980) м/с²
                    <br />
                    (0.5 до 100) g
                  </td>
                </tr>
                <tr>
                  <td>
                    Макс. перемещение
                    <br />
                    (пик-пик)
                  </td>
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
                    800 х 800 х 1000 мм
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <template v-else>
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
      </template>

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
                  <template v-if="isMobile">(4.9...980) м/с²</template>
                  <template v-else>(4,9..980) м/с²</template>
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
                  <template v-if="isMobile">800 х 800 х 1000 мм</template>
                  <template v-else>800 x 800 x 1000 мм</template>
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
                  <template v-if="isMobile">(4.9...980) м/с²</template>
                  <template v-else>(4,9..980) м/с²</template>
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
                  <template v-if="isMobile">800 х 800 х 1000 мм</template>
                  <template v-else>800 x 800 x 1000 мм</template>
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
        <div class="normative-content" :class="{ 'normative-content--mobile': isMobile }">
          <span
            v-for="item in isMobile ? mobileNormativeDocuments : normativeDocuments"
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

.vibration-section--mobile .technical-requirements {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0;
}

.vibration-section--mobile .vibration-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vibration-section--mobile .vibration-block__titles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vibration-section--mobile .uslugi-table-title--mobile-list {
  margin: 0;
  padding-left: 21px;
  list-style: decimal;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.vibration-section--mobile .subsection {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.vibration-section--mobile .uslugi-table-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.vibration-section--mobile .requirements-table-wrapper {
  margin: 0;
  border: none;
  border-radius: 0;
  overflow: visible;
  background-color: transparent;
}

.vibration-section--mobile .requirements-table colgroup {
  display: none;
}

.vibration-section--mobile .requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.vibration-section--mobile .requirements-table td {
  padding: 8px;
  border: 1px solid var(--button-bg);
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  vertical-align: middle;
  word-break: break-word;
  background-color: #f2f3f7;
}

.vibration-section--mobile .requirements-table tbody tr:first-child td:first-child {
  border-radius: 8px 0 0 0;
}

.vibration-section--mobile .requirements-table tbody tr:first-child td:last-child {
  border-radius: 0 8px 0 0;
}

.vibration-section--mobile .requirements-table tbody tr:last-child td:first-child {
  border-radius: 0 0 0 8px;
}

.vibration-section--mobile .requirements-table tbody tr:last-child td:last-child {
  border-radius: 0 0 8px 0;
}

.vibration-section--mobile .normative-collapse {
  margin: 0;
  width: 100%;
}

.vibration-section--mobile .normative-collapse :deep(.el-collapse) {
  border: none;
}

.vibration-section--mobile .normative-collapse :deep(.el-collapse-item__header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: auto;
  height: auto;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background-color: #cbd1d5;
  line-height: normal;
}

.vibration-section--mobile .normative-collapse :deep(.el-collapse-item.is-active .el-collapse-item__header) {
  border-radius: 8px 8px 0 0;
}

.vibration-section--mobile .normative-collapse :deep(.el-collapse-item__arrow) {
  margin: 0 0 0 8px;
  font-size: 24px;
  transform: rotate(90deg);
}

.vibration-section--mobile .normative-collapse :deep(.el-collapse-item.is-active .el-collapse-item__arrow) {
  transform: rotate(-90deg);
}

.vibration-section--mobile .normative-collapse :deep(.el-collapse-item__wrap) {
  border: none;
  border-radius: 0 0 8px 8px;
  background-color: #cbd1d5;
}

.vibration-section--mobile .normative-collapse :deep(.el-collapse-item__content) {
  padding: 0 8px 8px;
}

.vibration-section--mobile .normative-title {
  flex: 1 1 0;
  min-width: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  word-break: break-word;
}

.vibration-section--mobile .normative-content--mobile {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 0;
  row-gap: 4px;
}

.vibration-section--mobile .normative-content--mobile .normative-chip {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 0;
  border-bottom: 1px solid #cbd1d5;
  border-radius: 0;
  background-color: transparent;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  word-break: break-word;
  white-space: nowrap;
}
</style>
