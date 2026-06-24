<script lang="ts" setup>
import { useUslugiRequirementsExpand } from '@/composables/useUslugiRequirementsExpand'
import UslugiRequirementsAccordion from '@/components/sections/uslugi/UslugiRequirementsAccordion.vue'
import UslugiTable from '@/components/sections/uslugi/UslugiTable.vue'

const { isRequirementsExpanded, isMobile } = useUslugiRequirementsExpand()
const { isRequirementsExpanded: isMaterialsExpanded } = useUslugiRequirementsExpand()

const technicalRows = [
  { space: '300 x 300 x 400', formats: 'STL, OBJ, 3DS, CLI, 3MF' },
  { space: '530 x 530 x 550', formats: 'STL, CLI' },
]

const materials = [
  {
    name: 'Термопластичный полиуретан',
    description:
      'Идеально подходящий для производства деталей, требующих поглощения удара, возврата энергии.\n\nОбеспечивают прочную, гибкую и долговечную работу в сочетании с превосходным качеством поверхности и уровнем детализации',
  },
  {
    name: 'Термопластичный эластомер',
    description:
      'имеет уникальные физические характеристики, так как сочетает в себе преимущества пластика и резины.\n\nТРЕ можно сравнить с вулканизированной резиной: он прочен, но в то же время устойчив к деформации. В отличие от резины, ТРЕ используется в аддитивном производстве для изготовления шлангов, трубок или прототипов обуви.',
  },
  {
    name: 'Полиамид 11',
    description:
      'биологически чистый материал для передовых применений, где важна прочность. Он предлагает исключительно высокую пластичность и ударную вязкость для любого применения, требующего деформации и ударной вязкости, от автомобильного до медицинского.\n\nЭто идеальный выбор для производства деталей, которые должны выдерживать высокие механические нагрузки, таких как петли, внутренние детали автомобиля или конструкции наружных крыльев.',
  },
  {
    name: 'Полиамид 12',
    description:
      'Печать с использованием этого материала обеспечивает высокую селективность и высокое разрешение деталей. Кроме того, он характеризуется хорошей химической стойкостью, низким коэффициентом трения и хорошей стойкостью к истиранию.\n\nОдной из типичных характеристик спеченных деталей в полиамиде является идеальная гармония между механической прочностью и эластичностью в широком диапазоне температур, что делает этот материал пригодным для деталей с различной геометрией, размерами и требованиями.\n\nПрочный нейлоновый материал для изготовления функциональных изделий, устойчивый к механическим нагрузкам',
  },
  {
    name: 'Полистирол',
    description:
      'Полистирол применяется довольно редко при печати функциональных деталей, поскольку детали получаются более хрупкими, чем из полиамида. Однако он служит для создания форм и изделий с максимально качественной поверхностью. Используются для изготовления мастер-моделей для вакуумного, гипсового и керамического литья. Имеет меньшую усадку при плавлении, а выжигается с минимальным количеством золы.',
  },
  {
    name: 'Полипропилен',
    description:
      'Высокая химическая стойкость. Низкий коэффициент трения. Возможность печати как мелких, так и крупных изделий.',
  },
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <template v-if="isMobile">
      <div class="uslugi-print-cards">
        <div class="uslugi-wrapper uslugi-wrapper--print">
          <div class="uslugi-title">3D-печать</div>

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
            <img src="/uslugiPages/print-main.png" alt="3D-печать" class="uslugi-image" />
          </div>

          <UslugiRequirementsAccordion
            v-model:expanded="isRequirementsExpanded"
            :is-mobile="isMobile"
          >
            <template #mobile>
              <div class="requirements-mobile">
                <div class="requirements-mobile__row requirements-mobile__row--head">
                  <div class="requirements-mobile__cell">Пространство построения, мм</div>
                  <div class="requirements-mobile__cell">Форматы файлов</div>
                </div>

                <div
                  v-for="row in technicalRows"
                  :key="row.space"
                  class="requirements-mobile__row"
                >
                  <div class="requirements-mobile__cell">{{ row.space }}</div>
                  <div class="requirements-mobile__cell">{{ row.formats }}</div>
                </div>
              </div>
            </template>

            <template #desktop>
              <div class="requirements-table-wrapper">
                <table class="requirements-table">
                  <thead>
                    <tr>
                      <th class="uslugi-table-thead">Пространство построения, мм</th>
                      <th class="uslugi-table-thead">Форматы файлов</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in technicalRows" :key="row.space">
                      <td>{{ row.space }}</td>
                      <td>{{ row.formats }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </UslugiRequirementsAccordion>
        </div>

        <div class="uslugi-wrapper uslugi-wrapper--print-materials">
          <UslugiRequirementsAccordion
            v-model:expanded="isMaterialsExpanded"
            title="Виды материалов"
            :is-mobile="isMobile"
          >
            <template #mobile>
              <div class="materials-mobile">
                <div v-for="material in materials" :key="material.name" class="materials-mobile__item">
                  <div class="materials-mobile__title">{{ material.name }}</div>
                  <p
                    v-for="(paragraph, index) in material.description.split('\n\n')"
                    :key="index"
                    class="materials-mobile__text"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </div>
            </template>

            <template #desktop>
              <div class="requirements-table-wrapper">
                <table class="requirements-table requirements-table--middle">
                  <colgroup>
                    <col style="width: 24%" />
                    <col style="width: 76%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="uslugi-table-thead">Вид материала</th>
                      <th class="uslugi-table-thead">Свойства</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="material in materials" :key="material.name">
                      <td>{{ material.name }}</td>
                      <td>
                        <p
                          v-for="(paragraph, index) in material.description.split('\n\n')"
                          :key="index"
                        >
                          {{ paragraph }}
                          <br v-if="index < material.description.split('\n\n').length - 1" /><br
                            v-if="index < material.description.split('\n\n').length - 1"
                          />
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </UslugiRequirementsAccordion>
        </div>
      </div>
    </template>

    <div v-else class="uslugi-wrapper">
      <div class="uslugi-title">3D-печать</div>

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
          <img src="/uslugiPages/print-main.png" alt="3D-печать" class="uslugi-image" />
        </div>
      </div>

      <UslugiTable
        title="Технические требования"
        :columns="['Пространство построения, мм', 'Форматы файлов']"
      >
        <tr v-for="row in technicalRows" :key="row.space">
          <td>{{ row.space }}</td>
          <td>{{ row.formats }}</td>
        </tr>
      </UslugiTable>

      <UslugiTable
        title="Виды материалов"
        :columns="['Вид материала', 'Свойства']"
        :column-widths="['24%', '76%']"
      >
        <tr v-for="material in materials" :key="material.name">
          <td>{{ material.name }}</td>
          <td>
            <template
              v-for="(paragraph, index) in material.description.split('\n\n')"
              :key="index"
            >
              {{ paragraph }}
              <br v-if="index < material.description.split('\n\n').length - 1" /><br
                v-if="index < material.description.split('\n\n').length - 1"
              />
            </template>
          </td>
        </tr>
      </UslugiTable>
    </div>
  </el-col>
</template>
