<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import UslugiRequirementsAccordion from '@/components/sections/uslugi/UslugiRequirementsAccordion.vue'

const isRequirementsExpanded = ref(false)
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>

<template>
  <!-- Цех модельной оснастки -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper uslugi-wrapper--tooling">
      <div class="uslugi-title">Цех модельной оснастки</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Станки предназначены для обработки МДФ, дерева, фанеры, модельного пластика, композитных
          материалов.
          <br /><br />
          Производство мастер моделей из МДФ (мелкодисперсная фракция древесной плиты) с высокой
          точностью размеров особенно востребовано в авиационной и композитной промышленности.
          <br /><br />
          Производство уникальной технологической оснастки, необходимой для производства
          специфических изделий из дерева для последующих технологических процессов, таких как
          вакуумная формовка или формование композитных материалов.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/tooling.png" alt="Цех модельной оснастки" class="uslugi-image" />
        </div>
      </div>

      <div v-if="isMobile" class="tooling-equipment">
        <p class="tooling-equipment__title">Наше оборудование</p>
        <div class="tooling-equipment__box">
          <ul class="tooling-equipment__list">
            <li>Ленточнопильный станок по дереву</li>
            <li>Фрезерный станок ЧПУ по дереву 2000 х 4000</li>
            <li>Станок лазерной резки СО²</li>
            <li>Форматно-раскроечный станок по дереву</li>
            <li>Фрезерный станок ЧПУ по деревообработке 5-ти координатный</li>
          </ul>
          <p class="tooling-equipment__note">
            Максимальные габариты обрабатываемых деталей составляет 2150 x 4075 x 275 мм.
          </p>
        </div>
      </div>

      <UslugiRequirementsAccordion
        v-else
        v-model:expanded="isRequirementsExpanded"
        :is-mobile="false"
      >
        <template #desktop>
          <div class="requirements-table-wrapper">
            <table class="requirements-table">
              <thead>
                <tr>
                  <th class="uslugi-table-thead">Оборудование и габариты</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <p>
                      Максимальные габариты обрабатываемых деталей составляет 2150 x 4075 x 275 мм.
                    </p>
                    <ul class="materials-list">
                      <li>Ленточнопильный станок по дереву</li>
                      <li>Фрезерный станок ЧПУ E 40 HTM по дереву 2000 x 4000</li>
                      <li>Фрезерный станок ЧПУ по дереву 2000 x 4000</li>
                      <li>Фрезерный станок ЧПУ E 40 HTM по дереву 1300 x 1500</li>
                      <li>Станок лазерной резки CO²</li>
                      <li>Форматно раскроечный станок по дереву</li>
                      <li>Фрезерный станок ЧПУ по деревообработке 5-ти координатный</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </UslugiRequirementsAccordion>
    </div>
  </el-col>
</template>
