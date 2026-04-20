<script lang="ts" setup></script>

<template>
  <!-- 3D-печать -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">3D-Печать</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          SLS - технология наращивания модели из полимерного материала при помощи лазера (метод
          селективного лазерного спекания). Идеально подходит для массового производства, изделия
          обладают механической прочностью, особенно при использовании пластиков инженерного класса.
          Удобен для изготовления сложных прототипов, так как в отличие от большинства других метод
          не требует использования поддерживающих элементов. Это упрощает процесс печати и позволяет
          реализовать сложную геометрию.
          Мы используем принтеры с увеличенным объемом печати и многозонной системой стабилизации
          температуры, что позволяет добиться высокого качества изделий.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/print.webp" alt="3D-печать" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="uslugi-table-title">Технические требования</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <thead>
              <tr>
                <th class="uslugi-table-thead">Применение</th>
                <th class="uslugi-table-thead">Материалы</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ul class="materials-list">
                    <li>
                      Автомобилестроение: корпусные детали, воздуховоды, ложементы и зажимы,
                      вспомогательные инструменты, аксессуары
                    </li>
                    <li>
                      Машиностроение: оснастка, формы для литья, крыльчатки, корпуса, шестерни, рамы,
                      рукоятки;
                    </li>
                    <li>
                      Электроника: корпуса приборов, коннекторы, изделия для робототехники и пр.;
                    </li>
                    <li>Макеты и модели.</li>
                  </ul>
                </td>
                <td>
                  <ul class="materials-list">
                    <li>Термопластичный полиуретан</li>
                    <li>Термопластичный эластомер</li>
                    <li>Полиамид (11, 12)</li>
                    <li>Полистирол</li>
                    <li>Полипропилен</li>
                    <li>Полиэтилен</li>
                  </ul>
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
