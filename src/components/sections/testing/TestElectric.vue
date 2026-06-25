<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const openedNormativeItems = ref<string[]>([])

const normativeDocuments = [
  'ГОСТ РВ 20.57.310-98',
  'DO-160',
  'IEC60068',
  'КТ-160',
  'MIL-STD-810',
  'ГОСТ Р 54073-2010',
  'IEC60945',
]

const mobileNormativeDocuments = [
  'ГОСТ РВ 20.57.310-98',
  'КТ-160',
  'ГОСТ Р 54073-2010',
  'DO-160',
  'MIL-STD-810',
  'IEC60945',
  'IEC60068',
]
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-3848 -->
  <section class="section-basic electric-section" :class="{ 'electric-section--mobile': isMobile }">
    <div class="technical-requirements">
      <div class="uslugi-table-title">Испытание приемников электрической энергии</div>

      <div class="requirements-table-wrapper">
        <table class="requirements-table requirements-table--middle requirements-table--compact">
          <colgroup>
            <col class="col-type" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td>Выходная мощность</td>
              <td>6 кВт</td>
            </tr>
            <tr>
              <td>Выходное напряжение, переменный ток</td>
              <td>0-300 В</td>
            </tr>
            <tr>
              <td>Выходное напряжение, постоянный ток</td>
              <td>0-425 В</td>
            </tr>
            <tr>
              <td>Максимальный ток</td>
              <td>15 А</td>
            </tr>
            <tr>
              <td>Максимальный пик. ток</td>
              <td>200 А</td>
            </tr>
            <tr>
              <td>Массо-габаритные характеристики испытываемой продукции</td>
              <td>не ограничена</td>
            </tr>
          </tbody>
        </table>
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

.electric-section--mobile .technical-requirements {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.electric-section--mobile .uslugi-table-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.electric-section--mobile .requirements-table-wrapper {
  margin: 0;
  border: none;
  border-radius: 0;
  overflow: visible;
  background-color: transparent;
}

.electric-section--mobile .requirements-table colgroup {
  display: none;
}

.electric-section--mobile .requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.electric-section--mobile .requirements-table td {
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

.electric-section--mobile .requirements-table tbody tr:first-child td:first-child {
  border-radius: 8px 0 0 0;
}

.electric-section--mobile .requirements-table tbody tr:first-child td:last-child {
  border-radius: 0 8px 0 0;
}

.electric-section--mobile .requirements-table tbody tr:last-child td:first-child {
  border-radius: 0 0 0 8px;
}

.electric-section--mobile .requirements-table tbody tr:last-child td:last-child {
  border-radius: 0 0 8px 0;
}

.electric-section--mobile .normative-collapse {
  margin: 0;
  width: 100%;
}

.electric-section--mobile .normative-collapse :deep(.el-collapse) {
  border: none;
}

.electric-section--mobile .normative-collapse :deep(.el-collapse-item__header) {
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

.electric-section--mobile .normative-collapse :deep(.el-collapse-item.is-active .el-collapse-item__header) {
  border-radius: 8px 8px 0 0;
}

.electric-section--mobile .normative-collapse :deep(.el-collapse-item__arrow) {
  margin: 0 0 0 8px;
  font-size: 24px;
  transform: rotate(90deg);
}

.electric-section--mobile .normative-collapse :deep(.el-collapse-item.is-active .el-collapse-item__arrow) {
  transform: rotate(-90deg);
}

.electric-section--mobile .normative-collapse :deep(.el-collapse-item__wrap) {
  border: none;
  border-radius: 0 0 8px 8px;
  background-color: #cbd1d5;
}

.electric-section--mobile .normative-collapse :deep(.el-collapse-item__content) {
  padding: 0 8px 8px;
}

.electric-section--mobile .normative-title {
  flex: 1 1 0;
  min-width: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  word-break: break-word;
}

.electric-section--mobile .normative-content--mobile {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 0;
  row-gap: 4px;
}

.electric-section--mobile .normative-content--mobile .normative-chip {
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
