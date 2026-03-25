<script setup lang="ts">
import { ref } from 'vue'

const openedNormativeItems = ref<string[]>([])

// В макете список НД не показан (оставляем пустым, но блок сохраняем)
const normativeDocuments: string[] = []
</script>

<template>
  <section class="section-basic dust-section">
    <div class="technical-requirements">
      <div class="uslugi-title-table">Испытание на статическое и динамическое воздействие пыли и песка</div>

      <div class="subsection">
        <div class="uslugi-title-table2">Статическое воздействие</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <colgroup>
              <col class="col-type" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td>Скорость потока</td>
                <td>(0.5...2.5) м/с</td>
              </tr>
              <tr>
                <td>Концентрация</td>
                <td>(2-6) г/м3</td>
              </tr>
              <tr>
                <td>Температура</td>
                <td>(+15...+65) °C</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="subsection">
        <div class="uslugi-title-table2">Динамическое воздействие</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <colgroup>
              <col class="col-type" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td>Скорость потока</td>
                <td>(10...25) м/с</td>
              </tr>
              <tr>
                <td>Концентрация</td>
                <td>(0.18-5) г/м3</td>
              </tr>
              <tr>
                <td>Температура</td>
                <td>(+15...+65) °C</td>
              </tr>
              <tr>
                <td>Массо-габаритные характеристики испытываемой продукции</td>
                <td>
                  80 кг
                  <br />
                  700 x 600 x 700 мм
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
.uslugi-title-table2{
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .tests-list {
    font-size: 22px;
  }

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
