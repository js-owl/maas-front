<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const isRubberTypesExpanded = ref(false)
const isProductsExpanded = ref(false)

const rubberProducts = [
  {
    name: 'Защитные чехлы гофрированные',
    environment: 'Литол, смазки, тормозная жидкость.',
    temperature: 'от -40°C до 100°C',
  },
  {
    name:
      'Уплотнительные кольца различных сечений для создания герметичности в уплотнениях тормозных систем звуке и электроизоляции, в том числе сальники и манжеты резиновые и резинометаллические.',
    environment: 'Тормозная жидкость, амортизационная жидкость, воздух, вода, масло, топливо, газ.',
    temperature: 'от -50°C до 100°C',
  },
  {
    name:
      'Резиновые и резинометаллические амортизаторы для смягчения ударов, поглощения шума при движении узлов машины',
    environment: 'Воздух, вода с попаданием масла.',
    temperature: 'от -40°C до 80°C.',
  },
  {
    name:
      'Уплотнительные прокладки, клапаны и диафрагмы для регулирования и дозирования подаваемой жидкости и газа.',
    environment: 'Воздух, масло, пары.',
    temperature: 'от -40°C до 130°C',
  },
]

const rubberTypes = [
  {
    name: 'Резиновая смесь 3311',
    type: 'На основе натурального каучука',
    properties: 'Кислотостойкие, теплостойкие морозостойкие',
  },
  {
    name: 'Резиновая смесь 1847',
    type: 'На основе натурального каучука',
    properties: 'Кислотостойкие, морозостойкие',
  },
  {
    name: 'Резиновая смесь 2959',
    type: 'На основе натурального каучука',
    properties: 'Кислотостойкие',
  },
  {
    name: 'Резиновая смесь НО-68-1',
    type: 'Хлоропреновый каучук\nБутадиен-нитрильный каучук',
    properties: 'Маслостойкие, бензостойкие, морозостойкие',
  },
  {
    name: 'Каландрованная резиновая смесь ИРП-3012',
    type: 'Бутадиен-нитрильный каучук',
    properties: 'Маслостойкие, бензостойкие',
  },
  {
    name: 'Резиновая смесь В-14',
    type: 'Бутадиен-нитрильный каучук',
    properties: 'Маслостойкие, бензостойкие, морозостойкие',
  },
  {
    name: 'Резиновая смесь 1338',
    type: 'Силиконовый каучук',
    properties: 'Пищевые, теплостойкие, морозостойкие',
  },
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <template v-if="isMobile">
      <div class="uslugi-rubber-cards">
        <div class="uslugi-wrapper uslugi-wrapper--rubber-intro">
          <div class="uslugi-rubber-intro">
            <div class="uslugi-title">Производство из резины</div>
            <div class="uslugi-text">
              <p>
                Изготовление формовых резинотехнических изделий методами прямого прессования и
                литья под давлением: комплектующие, использующиеся в машиностроении, авиастроении,
                сантехническом оборудовании, бытовые изделия.
              </p>
              <p>&nbsp;</p>
              <p>Проектирование и изготовление оснастки по техническим заданиям заказчика.</p>
              <p>&nbsp;</p>
              <p>
                Изготовление резинотехнических изделий на пресс-формах заказчика (максимальные
                размеры пресс-формы 600x600x500 мм).
              </p>
            </div>
          </div>

          <div class="uslugi-image-wrapper">
            <img src="/uslugiPages/rubber.png" alt="Производство из резины" class="uslugi-image" />
          </div>
        </div>

        <div class="uslugi-wrapper uslugi-wrapper--rubber-products">
          <div class="rubber-mobile-card__title">Примеры изделий</div>

          <div class="rubber-mobile-list">
            <div v-for="product in rubberProducts" :key="product.name" class="rubber-mobile-list__item">
              <p class="rubber-mobile-list__name">{{ product.name }}</p>
              <div class="rubber-mobile-list__row">
                <p class="rubber-mobile-list__label">Рабочая среда:</p>
                <p class="rubber-mobile-list__value">{{ product.environment }}</p>
              </div>
              <div class="rubber-mobile-list__row">
                <p class="rubber-mobile-list__label">Темп. интервал работоспособности:</p>
                <p class="rubber-mobile-list__value">{{ product.temperature }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="uslugi-wrapper uslugi-wrapper--rubber-types">
          <div class="rubber-mobile-card__header">
            <div class="rubber-mobile-card__title rubber-mobile-card__title--types">Виды резины*</div>
            <p class="rubber-mobile-card__note">*Указаны не все доступные материалы</p>
          </div>

          <div class="rubber-mobile-list">
            <div v-for="rubber in rubberTypes" :key="rubber.name" class="rubber-mobile-list__item">
              <p class="rubber-mobile-list__name">{{ rubber.name }}</p>
              <div class="rubber-mobile-list__row">
                <p class="rubber-mobile-list__label">Тип резины</p>
                <p class="rubber-mobile-list__value">{{ rubber.type }}</p>
              </div>
              <div class="rubber-mobile-list__row">
                <p class="rubber-mobile-list__label">Особые свойства</p>
                <p class="rubber-mobile-list__value">{{ rubber.properties }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="uslugi-wrapper">
      <div class="uslugi-title">Производство из резины</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Изготовление формовых резинотехнических изделий: методами прямого прессования и литья под
          давлением; комплектующие, использующиеся в машиностроении, авиастроении, сантехническом
          оборудовании, бытовые изделия.
          <br />
          <br />
          Проектирование и изготовление оснастки по техническим заданиям заказчика.
          <br />
          <br />
          Изготовление резинотехнических изделий на пресс-формах заказчика (максимальные размеры
          пресс-формы 600х600х500 мм).
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/rubber.png" alt="Производство из резины" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="requirements-header" @click="isRubberTypesExpanded = !isRubberTypesExpanded">
          <div class="uslugi-table-title">Виды резины*</div>
          <el-icon class="requirements-arrow" :class="{ expanded: isRubberTypesExpanded }">
            <IconArrowDown />
          </el-icon>
        </div>

        <div v-if="isRubberTypesExpanded" class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--compact">
            <colgroup>
              <col class="col-type" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>Вид</th>
                <th>Тип резины</th>
                <th>Особые свойства</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Резиновая смесь 3311</td>
                <td>На основе натурального каучука</td>
                <td>Кислотостойкие, теплостойкие морозостойкие</td>
              </tr>
              <tr>
                <td>Резиновая смесь 1847</td>
                <td>На основе натурального каучука</td>
                <td>Кислотостойкие, морозостойкие</td>
              </tr>
              <tr>
                <td>Резиновая смесь 2959</td>
                <td>На основе натурального каучука</td>
                <td>Кислотостойкие</td>
              </tr>
              <tr>
                <td>Резиновая смесь НО-68-1</td>
                <td>Хлоропреновый каучук<br />Бутадиен-нитрильный каучук</td>
                <td>Маслостойкие, бензостойкие, морозостойкие</td>
              </tr>
              <tr>
                <td>Каландрованная резиновая смесь ИРП-3012</td>
                <td>Бутадиен-нитрильный каучук</td>
                <td>Маслостойкие, бензостойкие</td>
              </tr>
              <tr>
                <td>Резиновая смесь В-14</td>
                <td>Бутадиен-нитрильный каучук</td>
                <td>Маслостойкие, бензостойкие, морозостойкие</td>
              </tr>
              <tr>
                <td>Резиновая смесь 1338</td>
                <td>Силиконовый каучук</td>
                <td>Пищевые, теплостойкие, морозостойкие</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="isRubberTypesExpanded" style="margin-top: 10px; font-size: 16px; color: #000;">
          *Указаны не все доступные материалы
        </div>
      </div>

      <div class="technical-requirements">
        <div class="requirements-header" @click="isProductsExpanded = !isProductsExpanded">
          <div class="uslugi-table-title">Примеры изделий</div>
          <el-icon class="requirements-arrow" :class="{ expanded: isProductsExpanded }">
            <IconArrowDown />
          </el-icon>
        </div>

        <div v-if="isProductsExpanded" class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--compact">
            <colgroup>
              <col class="col-product" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>Изделия</th>
                <th>Темп. интервал работоспособности</th>
                <th>Рабочая среда</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Защитные чехлы гофрированные</td>
                <td>от -40°C до 100°C</td>
                <td>Литол, смазки, тормозная жидкость.</td>
              </tr>
              <tr>
                <td>
                  Уплотнительные кольца различных сечений для создания герметичности в уплотнениях тормозных
                  систем звуке и электроизоляции, в том числе сальники и манжеты резиновые и резинометаллические.
                </td>
                <td>от -50°C до 100°C</td>
                <td>
                  Тормозная жидкость, амортизационная жидкость, воздух, вода, масло, топливо, газ.
                </td>
              </tr>
              <tr>
                <td>
                  Резиновые и резинометаллические амортизаторы для смягчения ударов, поглощения шума при движении
                  узлов машины
                </td>
                <td>от -40°C до 80°C.</td>
                <td>Воздух, вода с попаданием масла.</td>
              </tr>
              <tr>
                <td>
                  Уплотнительные прокладки, клапаны и диафрагмы для регулирования и дозирования подаваемой жидкости и
                  газа.
                </td>
                <td>от -40°C до 130°C</td>
                <td>Воздух, масло, пары.</td>
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

.col-type {
  width: 400px;
}

.col-product {
  width: 520px;
}

.requirements-table th {
  background-color: var(--bgcolor, #e1e4e6);
  font-family: 'Montserrat-Medium', sans-serif;
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 500;
  color: #000;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  vertical-align: top;
}

.requirements-table th {
  font-size: 18px;
  font-weight: 500;
}

.requirements-table th:last-child {
  border-right: none;
}

@media (max-width: 768px) {
  .requirements-table th {
    font-size: 16px;
  }
}
</style>
