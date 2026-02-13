<script lang="ts" setup></script>

<template>
  <!-- Цех модельной оснастки -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="content-wrapper">
      <div class="main-title">ЦЕХ МОДЕЛЬНОЙ ОСНАСТКИ</div>

      <div class="description-section">
        <div class="description-text">
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

        <div class="image-wrapper">
          <img src="/uslugiPages/tooling.png" alt="Цех модельной оснастки" class="lathe-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="main-title">ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ</div>

        <div class="requirements-table-wrapper">
          <div class="requirements-table">
            <div class="requirements-title">Оборудование и габариты</div>
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
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.content-wrapper {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  padding: 60px 80px;
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 40px;
  text-align: left;
}

.description-section {
  display: flex;
  gap: 80px;
  margin-bottom: 60px;
  align-items: flex-start;
}

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
  .content-wrapper {
    padding: 30px 40px;
    margin: 0 0 40px 0;
  }

  .main-title {
    font-size: 28px;
    text-align: center;
    margin-bottom: 30px;
  }

  .description-section {
    flex-direction: column;
    gap: 30px;
    margin-bottom: 40px;
  }

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

