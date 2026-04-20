<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)
const isMaterialsExpanded = ref(true)
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
          <table class="requirements-table requirements-table--middle">
            <thead>
              <tr>
                <th class="uslugi-table-thead">Пространство построения, мм</th>
                <th class="uslugi-table-thead">Форматы файлов</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>300 x 300 x 400</td>
                <td>STL, OBJ, 3DS, CLI, 3MF</td>
              </tr>
              <tr>
                <td>530 x 530 x 550</td>
                <td>STL, CLI</td>
              </tr>
              <tr>
                <td>?</td>
                <td>?</td>
              </tr>
            </tbody>
          </table>
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
          <table class="requirements-table materials-table">
            <colgroup>
              <col class="material-col-name" />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th class="uslugi-table-thead">Вид материала</th>
                <th class="uslugi-table-thead">Свойства</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="material-name">Термопластичный полиуретан</td>
                <td>
                  <p class="material-text">
                    Идеально подходящий для производства деталей, требующих поглощения удара, возврата
                    энергии.
                  </p>
                  <p class="material-text">
                    Обеспечивают прочную, гибкую и долговечную работу в сочетании с превосходным
                    качеством поверхности и уровнем детализации
                  </p>
                </td>
              </tr>
              <tr>
                <td class="material-name">Термопластичный эластомер</td>
                <td>
                  <p class="material-text">
                    имеет уникальные физические характеристики, так как сочетает в себе преимущества
                    пластика и резины.
                    <br />
                    ТРЕ можно сравнить с вулканизированной резиной: он прочен, но в то же время устойчив
                    к деформации. В отличие от резины, ТРЕ используется в аддитивном производстве для
                    изготовления шлангов, трубок или прототипов обуви.
                  </p>
                </td>
              </tr>
              <tr>
                <td class="material-name">Полиамид 11</td>
                <td>
                  <p class="material-text">
                    биологически чистый материал для передовых применений, где важна прочность. Он
                    предлагает исключительно высокую пластичность и ударную вязкость для любого
                    применения, требующего деформации и ударной вязкости, от автомобильного до
                    медицинского.
                  </p>
                  <p class="material-text">
                    Это идеальный выбор для производства деталей, которые должны выдерживать высокие
                    механические нагрузки, таких как петли, внутренние детали автомобиля или конструкции
                    наружных крыльев.
                  </p>
                </td>
              </tr>
              <tr>
                <td class="material-name">Полиамид 12</td>
                <td>
                  <p class="material-text">
                    Печать с использованием этого материала обеспечивает высокую селективность и высокое
                    разрешение деталей. Кроме того, он характеризуется хорошей химической стойкостью,
                    низким коэффициентом трения и хорошей стойкостью к истиранию.
                  </p>
                  <p class="material-text">
                    Одной из типичных характеристик спеченных деталей в полиамиде является идеальная
                    гармония между механической прочностью и эластичностью в широком диапазоне
                    температур, что делает этот материал пригодным для деталей с различной геометрией,
                    размерами и требованиями.
                  </p>
                  <p class="material-text">
                    Прочный нейлоновый материал для изготовления функциональных изделий, устойчивый к
                    механическим нагрузкам
                  </p>
                </td>
              </tr>
              <tr>
                <td class="material-name">Полистирол</td>
                <td>
                  <p class="material-text">
                    Полистирол применяется довольно редко при печати функциональных деталей, поскольку
                    детали получаются более хрупкими, чем из полиамида. Однако он служит для создания
                    форм и изделий с максимально качественной поверхностью. Используются для изготовления
                    мастер-моделей для вакуумного, гипсового и керамического литья. Имеет меньшую усадку
                    при плавлении, а выжигается с минимальным количеством золы.
                  </p>
                </td>
              </tr>
              <tr>
                <td class="material-name">Полипропилен</td>
                <td>
                  <p class="material-text">
                    Высокая химическая стойкость. Низкий коэффициент трения. Возможность печати как
                    мелких, так и крупных изделий.
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
}

.requirements-table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

/* .requirements-table td:last-child,
.requirements-table th:last-child {
  border-right: none;
}

.requirements-table tr:last-child td {
  border-bottom: none;
} */

.materials-table .material-col-name {
  width: 24%;
}

.material-name {
  white-space: normal;
}

.material-text {
  margin: 0;
}

.material-text + .material-text {
  margin-top: 10px;
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
