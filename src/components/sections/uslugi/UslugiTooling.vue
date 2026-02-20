<script lang="ts" setup></script>

<template>
  <!-- Цех модельной оснастки -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">ЦЕХ МОДЕЛЬНОЙ ОСНАСТКИ</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Станки предназначены для обработки МДФ, дерева, фанеры, модельного пластика, композитных
          материалов.
          <br /><br />
          Производство мастер‑моделей из МДФ (мелкодисперсная фракция древесной плиты) с высокой
          точностью размеров особенно востребовано в авиационной и композитной промышленности.
          <br /><br />
          Производство уникальной технологической оснастки, необходимой для производства
          специфических изделий из дерева для последующих технологических процессов, таких как
          вакуумная формовка или формование композитных материалов.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/tooling.png" alt="Цех модельной оснастки" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="uslugi-title">ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <thead>
              <tr>
                <th>Оборудование и габариты</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>
                    Максимальные габариты обрабатываемых деталей составляют 2150 × 4075 × 275 мм.
                  </p>
                  <ul class="materials-list">
                    <li>Ленточнопильный станок по дереву</li>
                    <li>Фрезерный станок ЧПУ E 40 HTM по дереву 2000 × 4000</li>
                    <li>Фрезерный станок ЧПУ по дереву 2000 × 4000</li>
                    <li>Фрезерный станок ЧПУ E 40 HTM по дереву 1300 × 1500</li>
                    <li>Станок лазерной резки CO₂</li>
                    <li>Форматно‑раскроечный станок по дереву</li>
                    <li>Фрезерный станок ЧПУ по деревообработке 5‑ти координатный</li>
                  </ul>
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

