<script lang="ts" setup></script>

<template>
  <!-- Цех модельной оснастки -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Цех модельной оснастки</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Станки предназначены для обработки МДФ, дерева, фанеры, модельного пластика, композитных
          материалов.
          <br /><br />
          Производство мастер моделей из МДФ (мелкодисперсная фракция древесной плиты) с высокой
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
        <div class="uslugi-table-title">Технические требования</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <thead>
              <tr>
                <th class="uslugi-table-thead">Оборудование и габариты</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>
                    Максимальные габарты обрабатываемых деталей составляет 2150 x 4075 x 275 мм.
                  </p>
                  <ul class="materials-list">
                    <li>Ленточнопильный станок по дереву</li>
                    <li>Фрезерный станок ЧПУ E 40 HTM по дереву 2000 x 4000</li>
                    <li>Фрезерный станок ЧПУ по дереву 2000 x 4000</li>
                    <li>Фрезерный станок ЧПУ E 40 HTM по дереву 1300 x 1500</li>
                    <li>Станок лазерной резки CO²</li>
                    <li>Форматно раскроечный станок по дереву</li>
                    <li>Фрезерный станок ЧПУ по деревообработке 5-ти координатный</li>
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

.materials-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.materials-list li + li {
  margin-top: 4px;
}

@media (max-width: 767px) {
  .technical-requirements {
    display: none;
  }
}
</style>

