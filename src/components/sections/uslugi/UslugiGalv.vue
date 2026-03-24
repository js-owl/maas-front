<script lang="ts" setup></script>

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
        <div class="uslugi-title-table">Технические требования</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <colgroup>
              <col class="col-type" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>Вид покрытия</th>
                <th>Толщина нанесения покрытия, мкм</th>
                <th>Макс. габ. деталей, мм</th>
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
  width: 600px;
}

.requirements-table thead {
  background-color: var(--bgcolor);
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
