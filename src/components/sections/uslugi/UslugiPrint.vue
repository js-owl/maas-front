<script lang="ts" setup>
import { useUslugiRequirementsExpand } from '@/composables/useUslugiRequirementsExpand'
import UslugiRequirementsAccordion from '@/components/sections/uslugi/UslugiRequirementsAccordion.vue'
import UslugiKeywords from '@/components/sections/uslugi/UslugiKeywords.vue'

const { isRequirementsExpanded, isMobile } = useUslugiRequirementsExpand()
const { isRequirementsExpanded: isMaterialsExpanded } = useUslugiRequirementsExpand()

const keywords = [
  'SLS 3D печать на заказ',
  '3D печать полиамидом',
  'SLS печать деталей',
  'Печать PA12',
  'Изготовление деталей по 3D модели',
]

const technicalRows = [
  { space: '300 х 300 х 400', formats: 'STL, OBJ, 3DS, CLI, 3MF' },
  { space: '530 х 530 х 550', formats: 'STL, CLI' },
]

const materials = [
  {
    name: 'PA11 (Полиамид 11)',
    description: [
      'Пластичный и ударопрочный материал для функциональных деталей с механическими нагрузками.',
      'Это идеальный выбор для производства деталей, которые должны выдерживать высокие механические нагрузки, таких как петли, внутренние детали автомобиля или конструкции наружных крыльев.',
    ],
  },
  {
    name: 'PA12 (Полиамид 12)',
    description: ['Прочный износостойкий инженерный полиамид для функциональных деталей и сложной геометрии.'],
  },
  {
    name: 'TPU (Термопластичный полиуретан)',
    description: [
      'Гибкие и износостойкие детали, работающие при ударных и циклических нагрузках. Высокий уровень детализации.',
    ],
  },
  {
    name: 'TPE (Термопластичный эластомер)',
    description: [
      'Эластичные изделия, сочетающие свойства пластика и резины. TPE можно сравнить с вулканизированной резиной: он прочен, но в то же время устойчив к деформации.',
    ],
  },
  {
    name: 'PP (Полипропилен)',
    description: [
      'Высокая химическая стойкость. Низкий коэффициент трения. Возможность печати как мелких, так и крупных изделий.',
    ],
  },
  {
    name: 'PS (Полистирол)',
    description: [
      'Служит для создания форм и изделий с максимально качественной поверхностью. Используются для изготовления мастер-моделей для вакуумного, гипсового и керамического литья. Имеет меньшую усадку при плавлении.',
    ],
  },
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <template v-if="isMobile">
      <div class="uslugi-print-cards">
        <div class="uslugi-wrapper uslugi-wrapper--print">
          <div class="uslugi-title">SLS-печать</div>

          <div class="uslugi-text">
            <p>
              SLS - технология наращивания модели из полимерного материала при помощи лазера (метод
              селективного лазерного спекания). Идеально подходит для массового производства, изделия
              обладают механической прочностью, особенно при использовании пластиков инженерного класса.
            </p>
            <p>
              Удобен для изготовления сложных прототипов, так как в отличие от большинства других метод не
              требует использования поддерживающих элементов. Это упрощает процесс печати и позволяет
              реализовать сложную геометрию.
            </p>
            <p>
              Мы используем принтеры с увеличенным объемом печати и многозонной системой стабилизации
              температуры, что позволяет добиться высокого качества изделий.
            </p>
          </div>

          <div class="uslugi-image-wrapper">
            <img
              src="/uslugiPages/print-main.png"
              alt="SLS-печать"
              class="uslugi-image"
              width="500"
              height="433"
            />
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

                <div v-for="row in technicalRows" :key="row.space" class="requirements-mobile__row">
                  <div class="requirements-mobile__cell">{{ row.space }}</div>
                  <div class="requirements-mobile__cell">{{ row.formats }}</div>
                </div>
              </div>
            </template>
          </UslugiRequirementsAccordion>
        </div>

        <div class="uslugi-wrapper uslugi-wrapper--print-materials">
          <UslugiRequirementsAccordion
            v-model:expanded="isMaterialsExpanded"
            title="Материалы"
            :is-mobile="isMobile"
          >
            <template #mobile>
              <div class="materials-mobile">
                <div v-for="material in materials" :key="material.name" class="materials-mobile__item">
                  <div class="materials-mobile__title">{{ material.name }}</div>
                  <p
                    v-for="(paragraph, index) in material.description"
                    :key="index"
                    class="materials-mobile__text"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </div>
            </template>
          </UslugiRequirementsAccordion>
        </div>
      </div>
    </template>

    <div v-else class="uslugi-wrapper uslugi-wrapper--print">
      <div class="uslugi-title">SLS-печать</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          <p>
            SLS - технология наращивания модели из полимерного материала при помощи лазера (метод
            селективного лазерного спекания). Идеально подходит для массового производства, изделия
            обладают механической прочностью, особенно при использовании пластиков инженерного класса.
          </p>
          <p>
            Удобен для изготовления сложных прототипов, так как в отличие от большинства других метод не
            требует использования поддерживающих элементов. Это упрощает процесс печати и позволяет
            реализовать сложную геометрию.
          </p>
          <p>
            Мы используем принтеры с увеличенным объемом печати и многозонной системой стабилизации
            температуры, что позволяет добиться высокого качества изделий.
          </p>
        </div>

        <div class="uslugi-image-wrapper">
          <img
            src="/uslugiPages/print-main.png"
            alt="SLS-печать"
            class="uslugi-image"
            width="500"
            height="433"
          />
        </div>

        <UslugiKeywords :tags="keywords" />
      </div>

      <div class="uslugi-print-table">
        <div class="uslugi-table-title">Технические требования</div>
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
      </div>

      <div class="uslugi-print-table">
        <div class="uslugi-table-title">Материалы</div>
        <div class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--middle">
            <colgroup>
              <col style="width: 50%" />
              <col style="width: 50%" />
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
                    v-for="(paragraph, index) in material.description"
                    :key="index"
                    class="uslugi-print-table__paragraph"
                  >
                    {{ paragraph }}
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
.uslugi-print-table {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.uslugi-print-table .uslugi-table-title {
  margin: 0;
}

.uslugi-print-table__paragraph {
  margin: 0;
}

.uslugi-print-table__paragraph + .uslugi-print-table__paragraph {
  margin-top: 12px;
}
</style>
