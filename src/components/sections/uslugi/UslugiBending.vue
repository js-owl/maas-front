<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
</script>

<template>
  <!-- Гибка металла -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Гибка металла</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Проводится на гибочных станках с числовым программным управлением (ЧПУ) и кооперационных
          линиях.
          <br /><br />
          Используется для пластин различных толщин, формируя нужные углы и профили в соответствии с
          чертежами.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/bending.png" alt="Гибка металла" class="uslugi-image" />
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
            <colgroup>
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th class="uslugi-table-thead">Оборудование</th>
                <th class="uslugi-table-thead">Габариты, материалы</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Листогибочный станок с ЧПУ BARUS предназначен для точной гибки и формовки деталей из
                  листовых материалов (сталь, алюминиевые сплавы).
                </td>
                <td>
                  Длина гибки 3 000 мм,<br />
                  Толщина обрабатываемых материалов:<br />
                  Нержавеющая сталь до 5 мм,<br />
                  Сталь до 5 мм,<br />
                  Алюминиевые сплавы до 5 мм
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

.uslugi-table-thead {
  font-size: 18px;
  font-weight: 500;
  padding: 16px 20px;
  color: #000;
  background-color: var(--bgcolor);
  text-align: left;
}

@media (max-width: 767px) {
  .technical-requirements {
    display: none;
  }
}

</style>

