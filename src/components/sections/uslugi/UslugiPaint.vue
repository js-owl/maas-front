<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(true)
</script>

<template>
  <!-- Лакокрасочные материалы -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Лакокрасочные материалы</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Порошковая покраска — метод получения полимерных покрытий с высокими защитными и
          декоративными свойствами.
          В отличие от жидких материалов, порошковая краска наносится электростатическим методом,
          благодаря чему частицы равномерно притягиваются к поверхности.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/paint.webp" alt="Порошковая покраска" class="uslugi-image" />
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
                  <p>Мы предлагаем: <br> Различные виды покрытий, включая:</p>
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
  transform: rotate(-90deg);
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
