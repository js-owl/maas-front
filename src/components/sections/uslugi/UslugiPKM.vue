<script lang="ts" setup></script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="pkm-info">
      <div class="uslugi-section pkm-section">
        <div class="uslugi-text pkm-text">
          <div class="uslugi-title pkm-title">Изделия из полимерно-композиционных материалов</div>
          <p class="pkm-lead">
            <span>Основная технология:</span>
            вакуумная инфузия
          </p>
          <p>
            Позволяет изготавливать крупногабаритные детали с высокой точностью и равномерным
            распределением смолы. Обеспечивают прочную, гибкую и долговечную работу в сочетании с
            превосходным качеством поверхности и уровнем детализации.
          </p>
          <p class="pkm-lead">
            <span>Материалы:</span>
            углеткани, стеклоткани, арамидные и базальтовые ткани
          </p>
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/pkm-main.png" alt="Изделия из полимерно-композиционных материалов" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="uslugi-table-title">Технические требования для смол с отверждением в печи</div>
        <div class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--compact requirements-table--middle">
            <tbody>
              <tr>
                <td class="requirements-label">Габариты, мм</td>
                <td>до 7000 х 1000 х 600</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.pkm-info {
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 15px 0 var(--button-bg);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 80px;
  margin-bottom: 40px;
  padding: 40px;
}

.pkm-section {
  align-items: stretch;
  margin-bottom: 0;
}

.pkm-title {
  font-size: 32px;
  line-height: 1;
  margin-bottom: 20px;
}

.pkm-text {
  font-size: 18px;
  line-height: 1.35;
}

.pkm-text p {
  margin: 0 0 16px;
}

.pkm-text p:last-child {
  margin-bottom: 0;
}

.pkm-lead span {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
}

.technical-requirements .uslugi-table-title {
  line-height: 29px;
  margin: 0;
}

.technical-requirements {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.requirements-table-wrapper {
  border: 2px solid var(--button-bg);
  border-radius: 0;
  overflow: hidden;
  background-color: var(--whity);
}

.requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.requirements-table td {
  border-right: 2px solid var(--button-bg);
  border-bottom: none;
  font-size: 18px;
  padding: 12px 20px;
}

.requirements-table td:last-child {
  border-right: none;
}

.requirements-label {
  background-color: var(--bgcolor);
}

.uslugi-image-wrapper {
  flex: 1;
  min-height: 380px;
}

.uslugi-image {
  border-radius: 10px;
  box-shadow: none;
  height: 100%;
  min-height: 380px;
  object-fit: cover;
  width: 100%;
}

@media (max-width: 767px) {
  .pkm-info {
    gap: 40px;
    padding: 20px;
  }

  .pkm-title {
    font-size: 24px;
  }

  .pkm-lead span {
    font-size: 20px;
  }

  .uslugi-image-wrapper,
  .uslugi-image {
    min-height: 240px;
  }
}
</style>
