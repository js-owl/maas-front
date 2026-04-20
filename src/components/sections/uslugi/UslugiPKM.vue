<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
</script>

<template>
  <!-- Полимерно-композитные материалы -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Полимерно-композитные материалы</div> 

      <div class="uslugi-section">
        <div class="uslugi-text">
          Основная технология: вакуумная инфузия, которая позволяет получать высококачественные
          композитные конструкции с минимальным содержанием внутренних дефектов.
          Позволяет изготавливать крупногабаритные детали с высокой точностью и равномерным
          распределением смолы.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/pkm.webp" alt="Полимерно-композитные материалы" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="requirements-header" @click="isRequirementsExpanded = !isRequirementsExpanded">
          <div class="uslugi-table-title">Технические требования</div>
          <el-icon class="requirements-arrow" :class="{ expanded: isRequirementsExpanded }">
            <IconArrowDown />
          </el-icon>
        </div>

        <div v-if="isRequirementsExpanded" class="requirements-table-wrapper">
          <table class="requirements-table">
            <thead>
              <tr>
                <th class="uslugi-table-thead">Оборудование</th>
                <th class="uslugi-table-thead">Габариты</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ul class="materials-list">
                    <li>Окрасочно-сушильная камера</li>
                    <li>Автоматизированная вакуумная станция AVS 020 220</li>
                    <li>Камера сушильная (полимеризации)</li>
                    <li>Сушильный шкаф</li>
                    <li>Раскройный комплекс ЧПУ (по неметаллам)</li>
                    <li>Камера холода для хранения препрегов</li>
                  </ul>
                </td>
                <td>
                  <p>
                    Горячее формование композитов в камере полимеризации размером до 7000 x 2500 x
                    2500 мм
                  </p>
                  <p>
                    Раскройно разметочный комплекс предназначен для автоматизированного раскроя
                    композитных материалов:
                  </p>
                  <ul class="materials-list">
                    <li>углеткани</li>
                    <li>стеклоткани,</li>
                    <li>арамидные и базальтовые ткани</li>
                  </ul>
                  <p>Рабочее поле 1200 х 1300 мм</p>
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

.requirements-header {
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.requirements-arrow {
  transition: transform 0.2s ease;
  transform: rotate(0deg);
}

.requirements-arrow.expanded {
  transform: rotate(-180deg);
}

.requirements-table-wrapper {
  margin-top: 12px;
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
