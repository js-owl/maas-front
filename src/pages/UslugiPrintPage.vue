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
    class="uslugi-print-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-print-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-print-page__sections">
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
.uslugi-print-page__sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 10px 40px;
  box-sizing: border-box;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.el-col) {
  width: 100%;
  max-width: 100%;
  flex: 0 0 100%;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.uslugi-print-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.uslugi-wrapper) {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 0 5px #c8cfe3;
  box-sizing: border-box;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.uslugi-wrapper--print) {
  gap: 24px;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.uslugi-wrapper--print-materials) {
  gap: 20px;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.uslugi-wrapper--application) {
  gap: 16px;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.uslugi-text) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  height: 200px;
  min-height: 200px;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.uslugi-image) {
  display: block;
  width: 100%;
  height: 200px;
  min-height: 200px;
  max-width: none;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: none;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.technical-requirements) {
  margin: 0;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.technical-requirements--expanded) {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.requirements-header .uslugi-table-title) {
  font-size: 16px;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.materials-mobile__item) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background-color: #f2f3f7;
  border: 1px solid var(--button-bg);
  border-top: none;
  box-sizing: border-box;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.materials-mobile__item:first-child) {
  border-top: 1px solid var(--button-bg);
  border-radius: 8px 8px 0 0;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.materials-mobile__item:last-child) {
  border-radius: 0 0 8px 8px;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.materials-mobile__item:only-child) {
  border-radius: 8px;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.materials-mobile__title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.materials-mobile__text) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.print-examples .uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.application-grid) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.application-card) {
  padding: 16px;
  border-radius: 8px;
  background-color: var(--bgcolor);
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.application-title) {
  margin: 0 0 10px;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile .uslugi-print-page__sections :deep(.application-text) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}
</style>
