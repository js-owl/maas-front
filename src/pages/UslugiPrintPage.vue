<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiPrint from '@/components/sections/uslugi/UslugiPrint.vue'
import UslugiPrintExample from '@/components/sections/uslugi/UslugiPrintExample.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-2381 -->
  <div
    class="uslugi-page uslugi-print-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-page--mobile': isMobile,
      'uslugi-print-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-page__sections">
            <UslugiPrint />
            <UslugiPrintExample />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="printing" />
        </el-col>
        <UslugiPrint />
        <UslugiPrintExample />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-print-page--mobile :deep(.uslugi-print-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-print-page--mobile :deep(.uslugi-wrapper) {
  gap: 24px;
}

.uslugi-print-page--mobile :deep(.uslugi-wrapper--print-materials) {
  gap: 20px;
}

.uslugi-print-page--mobile :deep(.uslugi-wrapper--application) {
  gap: 16px;
}

.uslugi-print-page--mobile :deep(.technical-requirements) {
  margin: 0;
}

.uslugi-print-page--mobile :deep(.technical-requirements--expanded) {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.uslugi-print-page--mobile :deep(.requirements-header .uslugi-table-title) {
  font-size: 16px;
}

.uslugi-print-page--mobile :deep(.materials-mobile__item) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background-color: #f2f3f7;
  border: 1px solid var(--button-bg);
  border-top: none;
  box-sizing: border-box;
}

.uslugi-print-page--mobile :deep(.materials-mobile__item:first-child) {
  border-top: 1px solid var(--button-bg);
  border-radius: 8px 8px 0 0;
}

.uslugi-print-page--mobile :deep(.materials-mobile__item:last-child) {
  border-radius: 0 0 8px 8px;
}

.uslugi-print-page--mobile :deep(.materials-mobile__item:only-child) {
  border-radius: 8px;
}

.uslugi-print-page--mobile :deep(.materials-mobile__title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.materials-mobile__text) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.print-examples .uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.application-grid) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uslugi-print-page--mobile :deep(.application-card) {
  padding: 16px;
  border-radius: 8px;
  background-color: var(--bgcolor);
}

.uslugi-print-page--mobile :deep(.application-title) {
  margin: 0 0 10px;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.application-text) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}
</style>
