<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Сварка металла</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Сварка отличается от склеивания тем, что зазор между соединяемыми деталями заполняется материалом
          свариваемых деталей (в том числе с участием присадочного материала), в результате чего первоначальная
          граница раздела исчезает, превращаясь в переходный слой.
          <br />
          <br />
          Взаимное растворение и диффузия материала детали и припоя происходят в том числе и при пайке.
          Но граница между соединяемыми деталями заполняется припоем.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/weld.png" alt="Сварка металла" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="requirements-header" @click="isRequirementsExpanded = !isRequirementsExpanded">
          <div class="uslugi-table-title">Виды сварки</div>
          <el-icon class="requirements-arrow" :class="{ expanded: isRequirementsExpanded }">
            <IconArrowDown />
          </el-icon>
        </div>

        <div v-if="isRequirementsExpanded" class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--compact">
            <colgroup>
              <col class="col-type" />
              <col class="col-thickness" />
            </colgroup>
            <thead>
              <tr>
                <th>Тип сварки</th>
                <th>Свариваемые толщины</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Сварка кольцевых швов</td>
                <td>до 10 ... 15 мм</td>
              </tr>
              <tr>
                <td>Сварка продольные швов</td>
                <td>до 10 ... 15 мм</td>
              </tr>
              <tr>
                <td>Сварка сильфона</td>
                <td>до 10 ... 15 мм</td>
              </tr>
              <tr>
                <td>Сварка плавящимся электродом в углекислом газе углеродистых сталей</td>
                <td>до 10 ... 15 мм</td>
              </tr>
              <tr>
                <td>Аргонодуговая сварка легированных сталей, титановых сплавов и алюминиевых сплавов</td>
                <td>до 10 ... 15 мм</td>
              </tr>
              <tr>
                <td>Контактная точечная сварка легированных сталей, титановых и алюминиевых сплавов</td>
                <td>до 3 мм</td>
              </tr>
              <tr>
                <td>Контактная шовная сварка легированных сталей, титановых сплавов</td>
                <td>до 3 мм</td>
              </tr>
              <tr>
                <td>Контактная шовная сварка сильфонов и мембранных узлов</td>
                <td>до 3 мм</td>
              </tr>
              <tr>
                <td>Автоматическая сварка (кольцевых швов)</td>
                <td>диаметр 80 ... 1200 мм</td>
              </tr>
              <tr>
                <td>
                  Передвижная установка для аргонно-дуговой сварки (стали коррозионно-стойкие (жаропрочные),
                  титановые сплавы)
                </td>
                <td>толщиной до 2,5 мм.</td>
              </tr>
              <tr>
                <td>
                  Сварка продольных швов (стали коррозионно-стойкие, титановые сплавы, алюминиевые сплавы)
                </td>
                <td>
                  диаметр – 350 ... 1200 мм<br />
                  длина – 50 ... 2300 мм<br />
                  толщина стенки – 0,5 ... 10 мм
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
  margin-top: 0;
  width: 100%;
}

.uslugi-wrapper {
  padding: 40px;
  box-shadow: 0 10px 15px 0 var(--button-bg);
}

.uslugi-section {
  margin-bottom: 80px;
  /* align-items: center; */
  gap: 80px;
}

.uslugi-title {
  margin-bottom: 20px;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1;
}

.uslugi-text {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.2;
}

.uslugi-image-wrapper {
  flex: 0 0 561px;
}

.uslugi-image {
  width: 561px;
  height: 380px;
  max-width: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.requirements-header {
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.requirements-header :deep(.uslugi-table-title) {
  margin-bottom: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
}

.requirements-arrow {
  transition: transform 0.2s ease;
  transform: rotate(0deg);
  font-size: 24px;
  color: #000;
}

.requirements-arrow.expanded {
  transform: rotate(-180deg);
}

.requirements-table-wrapper {
  margin-top: 20px;
  border-radius: 0;
  overflow: hidden;
  border: 1px solid var(--button-bg);
  background-color: var(--whity);
}

.requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.col-type {
  width: calc(100% - 350px);
}

.col-thickness {
  width: 350px;
}

.requirements-table th {
  background-color: var(--bgcolor);
  font-family: 'Montserrat-Medium', sans-serif;
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 500;
  color: #000;
  text-align: left;
  border-bottom: 1px solid var(--button-bg);
  border-right: 1px solid var(--button-bg);
  vertical-align: top;
}

.requirements-table td {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #000;
  padding: 12px 20px;
  text-align: left;
  border-bottom: 1px solid var(--button-bg);
  border-right: 1px solid var(--button-bg);
  vertical-align: top;
}

.requirements-table th:last-child {
  border-right: none;
}

.requirements-table td:last-child {
  border-right: none;
}

@media (max-width: 768px) {
  .uslugi-wrapper {
    padding: 30px 40px;
  }

  .uslugi-section {
    margin-bottom: 40px;
    gap: 30px;
  }

  .uslugi-title {
    font-size: 32px;
  }

  .uslugi-text {
    font-size: 16px;
    line-height: 1.4;
  }

  .uslugi-image-wrapper {
    flex: 1;
  }

  .uslugi-image {
    width: 100%;
    height: auto;
  }

  .requirements-header :deep(.uslugi-table-title) {
    font-size: 20px;
  }

  .requirements-table th {
    font-size: 16px;
  }
}

@media (max-width: 767px) {
  .technical-requirements {
    display: none;
  }
}
</style>
