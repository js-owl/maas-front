<script lang="ts" setup>
import { ref } from 'vue'

const isRequirementsExpanded = ref(true)
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Полимерно-композитные материалы</div>

      <div class="uslugi-section pkm-section">
        <div class="uslugi-text pkm-text">
          <p class="pkm-lead"><span>Основная технология:</span> вакуумная инфузия</p>
          <p>
            Позволяет изготавливать крупногабаритные детали с высокой точностью и равномерным
            распределением смолы. Обеспечивает прочную, гибкую и долговечную работу в сочетании с
            превосходным качеством поверхности и уровнем детализации.
          </p>
          <p>Идеально подходит для производства деталей, требующих поглощения удара, возврата энергии.</p>
          <p class="pkm-lead">
            <span>Материалы:</span> углеткани, стеклоткани, арамидные и базальтовые ткани
          </p>
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/pkm.webp" alt="Полимерно-композитные материалы" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="uslugi-table-title">Технические требования</div>
        <div v-if="isRequirementsExpanded" class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--compact requirements-table--middle">
            <tbody>
              <tr>
                <td class="requirements-label">Габариты, мм</td>
                <td>до 7000 x 2500 x 2500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.uslugi-wrapper {
  box-shadow: 0 10px 15px 0 var(--button-bg);
  padding: 40px;
}

.uslugi-title {
  line-height: 1;
  margin-bottom: 20px;
}

.technical-requirements {
  margin-top: 20px;
}

.requirements-table-wrapper {
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--button-bg);
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

.pkm-section {
  align-items: stretch;
  margin-bottom: 0;
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

.uslugi-image-wrapper {
  flex: 0 0 590px;
}

.uslugi-image {
  border-radius: 10px;
  box-shadow: none;
  height: 100%;
  width: 100%;
}

@media (max-width: 767px) {
  .uslugi-wrapper {
    padding: 20px;
  }

  .uslugi-image-wrapper {
    flex: 1;
  }

  .pkm-lead span {
    font-size: 20px;
  }
}
</style>
