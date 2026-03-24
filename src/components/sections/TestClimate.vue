<template>
  <section class="section-basic climate-section">
    <div class="technical-requirements">
      <div>
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

      <div>
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
    </div>

    <el-collapse v-model="isNormativeOpen" class="normative-collapse">
      <el-collapse-item name="normative">
        <template #title>
          <span class="normative-title">
            Обозначение НД, устанавливающих нормы испытаний и измерений
          </span>
        </template>
        <p class="normative-content">
          Содержание блока можно заполнить после утверждения полного перечня нормативных документов.
        </p>
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isNormativeOpen = ref<string[]>([])
</script>

<style scoped>
.technical-requirements {
  margin-top: 40px;
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
  vertical-align: top;
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

@media (max-width: 768px) {
  .requirements-table th,
  .requirements-table td {
    font-size: 14px;
    padding: 10px 12px;
  }

  .requirements-table th {
    font-size: 16px;
  }
}
</style>
