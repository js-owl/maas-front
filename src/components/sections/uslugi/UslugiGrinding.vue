<script lang="ts" setup></script>

<template>
  <!-- Шлифовка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Шлифовка</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Шлифовка металла - это процесс механической обработки поверхности металлических изделий с
          целью придания им нужной шероховатости, формы и точности размеров. Данный метод широко
          применяется в машиностроении, приборостроении, авиастроении и других отраслях, где важна
          высокая точность обработки деталей. Основной рабочий инструмент при шлифовке - абразивный
          круг, выполненный из твёрдых частиц, способных снимать тонкий слой металла с обрабатываемой
          поверхности.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/grinding.png" alt="Шлифовка" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="uslugi-title-table">Технические требования</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <thead>
              <tr>
                <th>Тип сварки</th>
                <th>Рабочая зона, мм</th>
                <th>Макс. вес</th>
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

.requirements-title {
  font-size: 36px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 40px;
  text-align: left;
}

.requirements-table-wrapper {
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

.requirements-table thead {
  background-color: var(--bgcolor);
}
.requirements-table th{
  font-size: 24px;
}

.requirements-table th,
.requirements-table td {
  padding: 16px 20px;
  font-size: 20px;
  font-weight: 500;
  color: #000;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  vertical-align: top;
}

.requirements-table th:first-child,
.requirements-table td:first-child {
  width: 500px;
  max-width: 500px;
}

.requirements-table th {
  font-size: 24px;
  font-weight: 600;
}

.requirements-table th:last-child,
.requirements-table td:last-child {
  border-right: none;
}

.requirements-table tr:last-child td {
  border-bottom: none;
}

.materials-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.materials-list li + li {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .requirements-title {
    font-size: 22px;
    text-align: center;
    margin-bottom: 30px;
  }

  .requirements-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>

