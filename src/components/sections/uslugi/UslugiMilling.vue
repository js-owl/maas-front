<script lang="ts" setup></script>

<template>
  <!-- Фрезерная обработка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">ФРЕЗЕРНАЯ ОБРАБОТКА</div>

      <div class="uslugi-section">
        <div class="description-text">
          Фрезерная обработка представляет собой технологический процесс, при котором специальный
          режущий инструмент (фреза) вращается и удаляет материал, создавая изделия заданной
          конфигурации.
          Методика эффективна как для изготовления плоских элементов, так и для формирования
          трёхмерных объектов. Она обеспечивает прецизионную точность и широко применяется при
          работе с различными материалами: металлами, полимерами, древесиной.
        </div>

        <div class="image-wrapper">
          <img src="/uslugiPages/milling.png" alt="Фрезерная обработка" class="lathe-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="uslugi-title">ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <thead>
              <tr>
                <th>Оборудование</th>
                <th>Максимальный размер</th>
                <th>Материалы</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Универсальные станки</td>
                <td>до 1 400 мм (Д х Ш х В)</td>
                <td rowspan="4">
                  <ul class="materials-list">
                    <li>Алюминиевые сплавы</li>
                    <li>Сталь</li>
                    <li>Дерево</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>Станки ЧПУ, 5-осевой</td>
                <td>
                  max: 13 866 × 1571 х 1150 мм (дерево)<br />
                  max: 4 200 × 3200 × 1250 мм (металл)
                </td>
              </tr>
              <tr>
                <td>Станки ЧПУ, 3-осевой</td>
                <td>max: 4 200 × 3200 х 1250 мм (металл)</td>
              </tr>
              <tr>
                <td>Фрезерно-гравировальный станок</td>
                <td>
                  max: 2 200 × 1610 мм (металл)<br />
                  max: 4 000 × 2070 мм (дерево)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.description-text {
  flex: 1;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.6;
  color: #000;
  text-align: justify;
}

.image-wrapper {
  flex: 0 0 420px;
  display: flex;
  justify-content: flex-end;
}

.lathe-image {
  max-width: 600px;
  /* height: 260px; */
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

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
  .description-text {
    font-size: 16px;
    text-align: left;
  }

  .image-wrapper {
    flex: 1;
    justify-content: center;
  }

  .lathe-image {
    max-width: 100%;
    height: auto;
  }

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
