<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
const isMaterialsExpanded = ref(false)
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">3D-Печать</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          SLS - технология наращивания модели из полимерного материала при помощи лазера (метод
          селективного лазерного спекания). Идеально подходит для массового производства, изделия
          обладают механической прочностью, особенно при использовании пластиков инженерного класса.
          <br /><br />
          Удобен для изготовления сложных прототипов, так как в отличие от большинства других метод не
          требует использования поддерживающих элементов. Это упрощает процесс печати и позволяет
          реализовать сложную геометрию.
          <br /><br />
          Мы используем принтеры с увеличенным объемом печати и многозонной системой стабилизации
          температуры, что позволяет добиться высокого качества изделий.
        </div>

        <div class="uslugi-image-wrapper">
          <img
            src="https://www.figma.com/api/mcp/asset/0b10ee62-3b88-48b5-b9f7-cfa825ec17e7"
            alt="3D-печать"
            class="uslugi-image"
          />
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
          <p class="accordion-text">
            3D-модель или чертеж должны содержать габаритные размеры, требуемую точность и описание
            назначения детали.
          </p>
        </div>
      </div>

      <div class="technical-requirements">
        <div class="requirements-header" @click="isMaterialsExpanded = !isMaterialsExpanded">
          <div class="uslugi-table-title">Виды материалов</div>
          <el-icon class="requirements-arrow" :class="{ expanded: isMaterialsExpanded }">
            <IconArrowDown />
          </el-icon>
        </div>

        <div v-if="isMaterialsExpanded" class="requirements-table-wrapper">
          <ul class="materials-list">
            <li>Термопластичный полиуретан</li>
            <li>Термопластичный эластомер</li>
            <li>Полиамид (11, 12)</li>
            <li>Полистирол</li>
            <li>Полипропилен</li>
            <li>Полиэтилен</li>
          </ul>
        </div>
      </div>
    </div>

  </el-col>
</template>

<style scoped>
.print-top-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 15px 0 var(--button-bg);
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 40px;
  padding: 40px;
}

.print-top-info {
  align-self: center;
}

.print-top-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 32px;
  line-height: 1.1;
  margin: 0 0 20px;
}

.print-top-text {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  line-height: 1.4;
  margin: 0;
}

.print-upload {
  align-items: center;
  background: var(--bgcolor);
  border: 2px dashed #7d8083;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.print-upload-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 20px;
}

.print-upload-text {
  color: #7d8083;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  line-height: 1.25;
  margin: 0;
}

.print-send-wrapper {
  display: flex;
  grid-column: 2 / 3;
  justify-content: flex-end;
}

.print-send-button {
  --el-button-bg-color: var(--button-bg);
  --el-button-border-color: var(--button-bg);
  --el-button-hover-bg-color: #b6bec4;
  --el-button-hover-border-color: #b6bec4;
  --el-button-text-color: #000;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 20px;
  padding: 10px 24px;
}

.technical-requirements {
  margin-top: 28px;
}

.requirements-header {
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
}

.requirements-arrow {
  transform: rotate(0deg);
  transition: transform 0.2s ease;
}

.requirements-arrow.expanded {
  transform: rotate(-180deg);
}

.requirements-table-wrapper {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-top: 12px;
  overflow: hidden;
  padding: 20px;
}

.accordion-text {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  line-height: 1.4;
  margin: 0;
}

.materials-list {
  margin: 0;
  padding-left: 20px;
}

.materials-list li + li {
  margin-top: 6px;
}

@media (max-width: 1200px) {
  .print-top-card {
    grid-template-columns: 1fr;
  }

  .print-send-wrapper {
    grid-column: 1 / 2;
  }
}

@media (max-width: 767px) {
  .print-top-card {
    border-radius: 0;
    margin-bottom: 20px;
    padding: 20px;
  }

  .print-top-title {
    font-size: 24px;
  }

  .print-top-text {
    font-size: 16px;
  }
}
</style>
