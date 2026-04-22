<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Гальваническая обработка</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Гальваническое покрытие металла - один из самых эффективных способов повысить
          эксплуатационные характеристики металлических изделий. Метод основан на электролитическом
          нанесении тонкого слоя металла, который не только защищает изделие от коррозии, но и
          улучшает его внешний вид, повышает прочность, устойчивость к износу и придает
          дополнительные функциональные свойства.
          <br />
          Благодаря сочетанию доступности и высокой эффективности гальваника активно применяется в
          промышленности, строительстве, электронике, автомобилестроении и в производстве
          декоративных элементов.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/galv.png" alt="Гальваническая обработка" class="uslugi-image" />
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
              <col class="col-type" />
              <col class="col-thickness" />
              <col class="col-size" />
            </colgroup>
            <thead>
              <tr>
                <th class="uslugi-table-thead">Вид покрытия</th>
                <th class="uslugi-table-thead">Толщина нанесения покрытия, мкм</th>
                <th class="uslugi-table-thead">Макс. габ. деталей, мм</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Оксидирование анодное алюминиевых сплавов</td>
                <td>5 ... 8</td>
                <td>5800 x 600 x 1350</td>
              </tr>
              <tr>
                <td>Оксидирование химическое алюминиевых сплавов</td>
                <td>5 ... 8</td>
                <td>5800 x 700 x 1450</td>
              </tr>
              <tr>
                <td>Оксидирование твердое анодное алюминиевых сплавов</td>
                <td>10 ... 40</td>
                <td>5800 x 600 x 1350</td>
              </tr>
              <tr>
                <td>Фосфатирование сталей</td>
                <td>10 ... 40</td>
                <td>1800 x 600 x 750</td>
              </tr>
              <tr>
                <td>Цинкование</td>
                <td>1 ... 12</td>
                <td>2800 x 300 x 850</td>
              </tr>
              <tr>
                <td>Кадмирование хлористоаммонийное</td>
                <td>1 ... 15</td>
                <td>2800 x 300 x 850</td>
              </tr>
              <tr>
                <td>Оксидирование магниевых сплавов</td>
                <td>-</td>
                <td>1700 x 600 x 900</td>
              </tr>
              <tr>
                <td>Химическая обработка нержавеющих сталей</td>
                <td>-</td>
                <td>2800 x 850 x 950</td>
              </tr>
              <tr>
                <td>Фосфатирование сталей</td>
                <td>-</td>
                <td>1800 x 600 x 750</td>
              </tr>
              <tr>
                <td>Кадмирование сернокислое</td>
                <td>1 ... 15</td>
                <td>1000 x 190 x 350</td>
              </tr>
              <tr>
                <td>Никелирование сернокислое</td>
                <td>2 ... 3</td>
                <td>1000 x 190 x 350</td>
              </tr>
              <tr>
                <td>Никелирование хлористое</td>
                <td>5 ... 15</td>
                <td>1000 x 190 x 350</td>
              </tr>
              <tr>
                <td>Покрытие гальвано термический никель-кадмий</td>
                <td>1 ... 18</td>
                <td>1000 x 190 x 350</td>
              </tr>
              <tr>
                <td>Олово-висмут</td>
                <td>1 ... 20</td>
                <td>1000 x 190 x 350</td>
              </tr>
              <tr>
                <td>Химическая обработка титановых сплавов</td>
                <td>-</td>
                <td>2800 x 800 x 850</td>
              </tr>
              <tr>
                <td>Химическая обработка нержавеющих сталей (трубы)</td>
                <td>-</td>
                <td>тр.8x1 x 3900</td>
              </tr>
              <tr>
                <td>Хромирование</td>
                <td>10 ... 60</td>
                <td>1400 x 200 x 550</td>
              </tr>
              <tr>
                <td>Серебрение</td>
                <td>0,5 .. 15</td>
                <td>1500 x 150 x 30</td>
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
  margin-top: 20px;
}

.requirements-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  min-height: 32px;
  padding-top: 4px;
  user-select: none;
}

.requirements-arrow {
  color: var(--gray-footer);
  font-size: 16px;
  transition: transform 0.2s ease;
  transform: rotate(0deg);
}

.requirements-arrow.expanded {
  transform: rotate(-180deg);
}

.requirements-table-wrapper {
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--button-bg);
  background-color: var(--whity);
}

.requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.requirements-table th,
.requirements-table td {
  border: 1px solid var(--button-bg);
  color: var(--blacky);
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  padding: 12px 20px;
  text-align: left;
  vertical-align: middle;
}

.requirements-table thead th {
  background-color: var(--bgcolor);
  min-height: 74px;
  padding: 12px 20px;
}

.requirements-table tbody td {
  background-color: var(--whity);
}

.requirements-table tr {
  height: 57px;
}

.col-type {
  width: 600px;
}

.col-thickness {
  width: 239px;
}

.col-size {
  width: 363px;
}

.uslugi-wrapper {
  box-shadow: 0 10px 15px 0 var(--button-bg);
  border-radius: 20px;
  margin-bottom: 40px;
  padding: 40px;
}

.uslugi-title {
  font-size: 32px;
  line-height: 1;
  margin-bottom: 20px;
}

.uslugi-section {
  align-items: stretch;
  gap: 80px;
  margin-bottom: 80px;
}

.uslugi-text {
  font-size: 18px;
  font-family: 'Montserrat-Medium', sans-serif;
  line-height: 1.3;
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

.uslugi-table-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  line-height: 1;
  margin-bottom: 0;
}

@media (max-width: 767px) {
  .uslugi-wrapper {
    border-radius: 0;
    margin-bottom: 20px;
    padding: 20px;
  }

  .uslugi-title {
    font-size: 28px;
  }

  .uslugi-section {
    gap: 30px;
    margin-bottom: 40px;
  }

  .uslugi-image-wrapper {
    flex: 1 1 auto;
  }

  .uslugi-table-title {
    font-size: 20px;
  }

  .technical-requirements {
    display: none;
  }
}

</style>
