<script lang="ts" setup></script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
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
        <div class="uslugi-table-title">Виды резины*</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
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
                <td>Каландрированная резиновая смесь ИРП-3012</td>
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

        <div style="margin-top: 10px; font-size: 16px; color: #000;">*Указаны не все доступные материалы</div>
      </div>

      <div class="technical-requirements">
        <div class="uslugi-table-title">Примеры изделий</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
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

.requirements-table-wrapper {
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

.requirements-table th,
.requirements-table td {
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

.requirements-table th:last-child,
.requirements-table td:last-child {
  border-right: none;
}

.requirements-table tr:last-child td {
  border-bottom: none;
}

@media (max-width: 768px) {
  .requirements-table th,
  .requirements-table td {
    font-size: 14px;
    padding: 10px 12px;
  }

  .requirements-table th {
    font-size: 16px;
  }
}
</style>

