<script lang="ts" setup></script>

<template>
  <!-- Лакокрасочные материалы -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">ЛАКОКРАСОЧНЫЕ МАТЕРИАЛЫ</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Порошковая покраска — метод получения полимерных покрытий с высокими защитными и
          декоративными свойствами.
          В отличие от жидких материалов, порошковая краска наносится электростатическим методом,
          благодаря чему частицы равномерно притягиваются к поверхности.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/paint.webp" alt="Порошковая покраска" class="lathe-image" />
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>Применение различных видов покрытий, включая:</p>
                  <ul class="materials-list">
                    <li>Грунтовочные составы.</li>
                    <li>Акриловые и уретановые краски.</li>
                    <li>Защитные лаки для повышения износостойкости и коррозионной стойкости изделий.</li>
                  </ul>
                  <p>Работа с разными типами изделий:</p>
                  <ul class="materials-list">
                    <li>металлические детали,</li>
                    <li>композитные изделия,</li>
                    <li>деревянные формы и оснастка.</li>
                  </ul>
                  <p>Сушка и полимеризация покрытий</p>
                </td>
                <td>
                  <p>
                    Окрасочно-сушильная камера позволяет окрашивать изделия с максимальными габаритами
                    2 000 х 2 000 х 10 000 мм
                  </p>
                  <p>
                    Камеры предварительной подготовки (внутренний размер 6 500 x 3 500 x 2 700 мм)
                  </p>
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
