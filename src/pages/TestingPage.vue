<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import TestClimate from '@/components/sections/testing/TestClimate.vue'
import TestVibration from '@/components/sections/testing/TestVibration.vue'
import TestElectric from '@/components/sections/testing/TestElectric.vue'
import TestHumidity from '@/components/sections/testing/TestHumidity.vue'
import TestDust from '@/components/sections/testing/TestDust.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-3712 -->
  <div class="testing-page" :class="{ 'testing-page--mobile': isMobile }">
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="testing-page__sections">
            <TestClimate />
            <section id="vibration">
              <TestVibration />
            </section>
            <section id="electric">
              <TestElectric />
            </section>
            <section id="humidity">
              <TestHumidity />
            </section>
            <section id="dust">
              <TestDust />
            </section>
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <TestClimate />
          <section id="vibration">
            <TestVibration />
          </section>
          <section id="electric">
            <TestElectric />
          </section>
          <section id="humidity">
            <TestHumidity />
          </section>
          <section id="dust">
            <TestDust />
          </section>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.testing-page {
  background-color: var(--bgcolor);
  box-sizing: border-box;
}

.testing-page__sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 10px 40px;
  box-sizing: border-box;
}

.testing-page--mobile .testing-page__sections :deep(#vibration),
.testing-page--mobile .testing-page__sections :deep(#electric),
.testing-page--mobile .testing-page__sections :deep(#humidity),
.testing-page--mobile .testing-page__sections :deep(#dust) {
  display: contents;
}

.testing-page--mobile .testing-page__sections :deep(.section-basic) {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: auto;
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 0 5px #c8cfe3;
  box-sizing: border-box;
}

.testing-page--mobile .testing-page__sections :deep(.technical-requirements) {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.testing-page--mobile .testing-page__sections :deep(.uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.testing-page--mobile .testing-page__sections :deep(.vibration-section .technical-requirements > .uslugi-table-title) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.testing-page--mobile .testing-page__sections :deep(.uslugi-title-table2) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.testing-page--mobile .testing-page__sections :deep(.climate-section .technical-requirements) {
  gap: 24px;
}

.testing-page--mobile .testing-page__sections :deep(.climate-section .temperature-section),
.testing-page--mobile .testing-page__sections :deep(.climate-section .humidity-section) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.testing-page--mobile .testing-page__sections :deep(.vibration-section .technical-requirements) {
  gap: 8px;
}

.testing-page--mobile .testing-page__sections :deep(.vibration-section .subsection) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 0 0;
}

.testing-page--mobile .testing-page__sections :deep(.dust-section .technical-requirements) {
  gap: 16px;
}

.testing-page--mobile .testing-page__sections :deep(.dust-section .subsection) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.testing-page--mobile .testing-page__sections :deep(.dust-section .subsection + .subsection) {
  margin-top: 8px;
}

.testing-page--mobile .testing-page__sections :deep(.electric-section .technical-requirements),
.testing-page--mobile .testing-page__sections :deep(section.humidity-section .technical-requirements) {
  gap: 8px;
}

.testing-page--mobile .testing-page__sections :deep(.requirements-table-wrapper) {
  margin: 0;
  border: none;
  border-radius: 0;
  overflow: visible;
  background-color: transparent;
}

.testing-page--mobile .testing-page__sections :deep(.requirements-table) {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.testing-page--mobile .testing-page__sections :deep(.requirements-table colgroup) {
  display: none;
}

.testing-page--mobile .testing-page__sections :deep(.requirements-table td) {
  padding: 8px;
  border: 1px solid var(--button-bg);
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  vertical-align: middle;
  word-break: break-word;
  background-color: #f2f3f7;
}

.testing-page--mobile .testing-page__sections :deep(.requirements-table tbody tr:first-child td:first-child) {
  border-radius: 8px 0 0 0;
}

.testing-page--mobile .testing-page__sections :deep(.requirements-table tbody tr:first-child td:last-child) {
  border-radius: 0 8px 0 0;
}

.testing-page--mobile .testing-page__sections :deep(.requirements-table tbody tr:last-child td:first-child) {
  border-radius: 0 0 0 8px;
}

.testing-page--mobile .testing-page__sections :deep(.requirements-table tbody tr:last-child td:last-child) {
  border-radius: 0 0 8px 0;
}

.testing-page--mobile .testing-page__sections :deep(.normative-collapse) {
  margin: 0;
  width: 100%;
}

.testing-page--mobile .testing-page__sections :deep(.normative-collapse .el-collapse) {
  border: none;
}

.testing-page--mobile .testing-page__sections :deep(.normative-collapse .el-collapse-item__header) {
  min-height: auto;
  height: auto;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background-color: #cbd1d5;
  line-height: normal;
}

.testing-page--mobile .testing-page__sections :deep(.normative-collapse .el-collapse-item.is-active .el-collapse-item__header) {
  border-radius: 8px 8px 0 0;
}

.testing-page--mobile .testing-page__sections :deep(.normative-collapse .el-collapse-item__arrow) {
  margin: 0 0 0 8px;
  font-size: 24px;
}

.testing-page--mobile .testing-page__sections :deep(.normative-collapse .el-collapse-item__wrap) {
  border: none;
  border-radius: 0 0 8px 8px;
  background-color: #cbd1d5;
}

.testing-page--mobile .testing-page__sections :deep(.normative-collapse .el-collapse-item__content) {
  padding: 0 8px 8px;
}

.testing-page--mobile .testing-page__sections :deep(.normative-title) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.testing-page--mobile .testing-page__sections :deep(.normative-content) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.testing-page--mobile .testing-page__sections :deep(.normative-chip) {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #b9c0c5;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}
</style>
