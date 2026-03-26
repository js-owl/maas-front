<script lang="ts" setup></script>

<template>
  <!-- Токарная обработка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Токарная обработка</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Токарная обработка представляет собой механическую операцию, при которой вращающаяся
          деталь обрабатывается режущим инструментом, последовательно снимающим слой материала.
          Технология позволяет создавать цилиндрические, конические и сложные профилированные
          поверхности с высокой степенью точности. Применяется в производстве металлических,
          пластиковых и других изделий, обеспечивая превосходное качество финишной обработки.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/lathe.png" alt="Токарная обработка" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="uslugi-title-table">Технические требования</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <colgroup>
              <col />
              <col style="width: 300px" />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>Оборудование</th>
                <th>Габариты</th>
                <th>Материалы</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Токарно-винторезные станки</td>
                <td>диаметр: до 1600<br />длина: до 5000</td>
                <td rowspan="3">
                  <ul class="materials-list">
                    <li>Нержавеющие, легированные стали</li>
                    <li>Стали коррозионностойкие (жаропрочные)</li>
                    <li>Стали конструкционные легированные</li>
                    <li>Титановые сплавы</li>
                    <li>Полиамиды, фторопласт</li>
                    <li>Алюминиевые, бронзовые, медные сплавы</li>
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
