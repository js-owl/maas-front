<script lang="ts" setup>
import UslugiTable from '@/components/sections/uslugi/UslugiTable.vue'
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

      <UslugiTable
        title="Технические требования"
        :columns="['Пространство построения, мм', 'Форматы файлов']"
      >
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
      </UslugiTable>

      <UslugiTable
        title="Виды материалов"
        :columns="['Вид материала', 'Свойства']"
        :column-widths="['24%', '76%']"
      >
        <tr>
          <td>Термопластичный полиуретан</td>
          <td>
            Идеально подходящий для производства деталей, требующих поглощения удара, возврата энергии.
            <br /><br />
            Обеспечивают прочную, гибкую и долговечную работу в сочетании с превосходным качеством
            поверхности и уровнем детализации
          </td>
        </tr>
        <tr>
          <td>Термопластичный эластомер</td>
          <td>
            имеет уникальные физические характеристики, так как сочетает в себе преимущества пластика и
            резины.
            <br />
            ТРЕ можно сравнить с вулканизированной резиной: он прочен, но в то же время устойчив к
            деформации. В отличие от резины, ТРЕ используется в аддитивном производстве для изготовления
            шлангов, трубок или прототипов обуви.
          </td>
        </tr>
        <tr>
          <td>Полиамид 11</td>
          <td>
            биологически чистый материал для передовых применений, где важна прочность. Он предлагает
            исключительно высокую пластичность и ударную вязкость для любого применения, требующего
            деформации и ударной вязкости, от автомобильного до медицинского.
            <br /><br />
            Это идеальный выбор для производства деталей, которые должны выдерживать высокие механические
            нагрузки, таких как петли, внутренние детали автомобиля или конструкции наружных крыльев.
          </td>
        </tr>
        <tr>
          <td>Полиамид 12</td>
          <td>
            Печать с использованием этого материала обеспечивает высокую селективность и высокое
            разрешение деталей. Кроме того, он характеризуется хорошей химической стойкостью, низким
            коэффициентом трения и хорошей стойкостью к истиранию.
            <br /><br />
            Одной из типичных характеристик спеченных деталей в полиамиде является идеальная гармония
            между механической прочностью и эластичностью в широком диапазоне температур, что делает
            этот материал пригодным для деталей с различной геометрией, размерами и требованиями.
            <br /><br />
            Прочный нейлоновый материал для изготовления функциональных изделий, устойчивый к
            механическим нагрузкам
          </td>
        </tr>
        <tr>
          <td>Полистирол</td>
          <td>
            Полистирол применяется довольно редко при печати функциональных деталей, поскольку детали
            получаются более хрупкими, чем из полиамида. Однако он служит для создания форм и изделий с
            максимально качественной поверхностью. Используются для изготовления мастер-моделей для
            вакуумного, гипсового и керамического литья. Имеет меньшую усадку при плавлении, а
            выжигается с минимальным количеством золы.
          </td>
        </tr>
        <tr>
          <td>Полипропилен</td>
          <td>
            Высокая химическая стойкость. Низкий коэффициент трения. Возможность печати как мелких, так
            и крупных изделий.
          </td>
        </tr>
      </UslugiTable>
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
