<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiPrint from '@/components/sections/uslugi/UslugiPrint.vue'
import UslugiPrintExample from '@/components/sections/uslugi/UslugiPrintExample.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/i3nw5hviaUA3ssmMQiXijG/MaaS?node-id=5653-18559 -->
  <div
    class="uslugi-page uslugi-print-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-page--mobile': isMobile,
      'uslugi-print-page--tablet': isTablet,
      'uslugi-print-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-page__sections">
            <UslugiCalc service_id="printing" />
            <UslugiPrint />
            <UslugiPrintExample />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="printing" />
          <h1 class="uslugi-print-page__title">3D-печать</h1>
        </el-col>
        <UslugiPrint />
        <UslugiPrintExample />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-print-page__title {
  margin: 0 0 40px;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 52px;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  color: #000;
}

.uslugi-print-page :deep(.uslugi-wrapper) {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 40px;
  padding: 40px;
  border-radius: 40px;
  box-shadow: 0 6px 7.5px rgba(224, 227, 237, 0.5);
}

.uslugi-print-page :deep(.uslugi-wrapper--application) {
  gap: 20px;
}

.uslugi-print-page :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
}

.uslugi-print-page :deep(.uslugi-section) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 500px);
  grid-template-rows: auto auto;
  gap: 40px 80px;
  margin-bottom: 0;
  align-items: start;
}

.uslugi-print-page :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  grid-column: 1;
  grid-row: 1;
  gap: 8px;
  line-height: 1.4;
}

.uslugi-print-page :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-print-page :deep(.uslugi-image-wrapper) {
  display: block;
  flex: none;
  grid-column: 2;
  grid-row: 1 / 3;
  width: 100%;
  max-width: 500px;
  min-width: 0;
  min-height: 433px;
  height: 433px;
  border-radius: 20px;
  background-color: var(--bgcolor);
  overflow: hidden;
}

.uslugi-print-page :deep(.uslugi-keywords) {
  grid-column: 1;
  grid-row: 2;
}

.uslugi-print-page :deep(.uslugi-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
}

.uslugi-print-page :deep(.uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
}

.uslugi-print-page :deep(.print-examples .uslugi-table-title) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-weight: 500;
  line-height: 1.4;
}

.uslugi-print-page :deep(.requirements-table-wrapper) {
  margin: 0;
}

.uslugi-print-page--tablet :deep(.uslugi-calc-section) {
  padding: 40px;
  border-radius: 40px;
  box-shadow: 0 6px 7.5px rgba(224, 227, 237, 0.5);
}

.uslugi-print-page--tablet :deep(.uslugi-calc-wrap) {
  gap: 80px;
  align-items: center;
}

.uslugi-print-page--tablet :deep(.uslugi-calc-left) {
  gap: 40px;
}

.uslugi-print-page--tablet :deep(.uslugi-calc-title) {
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
}

.uslugi-print-page--tablet :deep(.uslugi-calc-description) {
  padding-right: 20px;
  font-size: 18px;
}

.uslugi-print-page--tablet :deep(.uslugi-calc-upload-files .upload) {
  padding: 30px;
  border: 2px dashed #e84261;
  border-radius: 20px;
  background-color: transparent !important;
}

.uslugi-print-page--tablet :deep(.uslugi-calc-upload-files .upload:hover:not(.is-disabled)) {
  border-color: #e84261;
}

.uslugi-print-page--tablet :deep(.uslugi-calc-upload-files .custom) {
  gap: 20px;
}

.uslugi-print-page--tablet :deep(.uslugi-calc-upload-files .el-upload__text) {
  font-size: 20px !important;
}

.uslugi-print-page--tablet :deep(.uslugi-calc-upload-files .upload-subtitle) {
  font-size: 16px;
  color: #e84261;
}

.uslugi-print-page--tablet :deep(.uslugi-calc-upload-files .upload-subtitle + .upload-subtitle) {
  margin-top: -12px;
}

.uslugi-print-page--tablet :deep(.uslugi-section) {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 40px 80px;
}

.uslugi-print-page--tablet :deep(.uslugi-image-wrapper) {
  grid-column: 2;
  grid-row: 1;
  max-width: none;
  height: 369px;
  min-height: 369px;
}

.uslugi-print-page--tablet :deep(.uslugi-keywords) {
  grid-column: 1 / -1;
  grid-row: 2;
}

.uslugi-print-page--tablet :deep(.uslugi-table-thead),
.uslugi-print-page--tablet :deep(.requirements-table td) {
  padding: 10px 12px;
  font-size: 16px;
}

.uslugi-print-page--tablet :deep(.requirements-table-wrapper) {
  border-radius: 8px;
  border-color: var(--button-bg);
  background-color: #f2f3f7;
}

.uslugi-print-page--tablet :deep(.application-panel) {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.uslugi-print-page--mobile :deep(.uslugi-print-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-print-page--mobile :deep(.uslugi-wrapper) {
  gap: 16px;
  margin-bottom: 0;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 0 5px #c8cfe3;
}

.uslugi-print-page--mobile :deep(.uslugi-wrapper--print) {
  gap: 24px;
}

.uslugi-print-page--mobile :deep(.uslugi-wrapper--print-materials) {
  gap: 20px;
}

.uslugi-print-page--mobile :deep(.uslugi-wrapper--application) {
  gap: 16px;
}

.uslugi-print-page--mobile :deep(.uslugi-print-intro) {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.uslugi-print-page--mobile :deep(.uslugi-section) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 0;
}

.uslugi-print-page--mobile :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 20px;
  font-weight: 800;
  line-height: normal;
  text-transform: none;
}

.uslugi-print-page--mobile :deep(.uslugi-text) {
  gap: 8px;
  font-size: 12px;
  line-height: normal;
}

.uslugi-print-page--mobile :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  max-width: none;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
}

.uslugi-print-page--mobile :deep(.uslugi-image) {
  width: 100%;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
  object-fit: contain;
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

.uslugi-print-page--mobile :deep(.requirements-mobile) {
  border-color: var(--button-bg);
}

.uslugi-print-page--mobile :deep(.requirements-mobile__row:not(:last-child)) {
  border-bottom-color: var(--button-bg);
}

.uslugi-print-page--mobile :deep(.requirements-mobile__row:not(.requirements-mobile__row--materials)
  .requirements-mobile__cell:first-child) {
  border-right-color: var(--button-bg);
}

.uslugi-print-page--mobile :deep(.requirements-mobile__row--head .requirements-mobile__cell) {
  background-color: var(--bgcolor);
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

.uslugi-print-page--mobile :deep(.materials-mobile__texts) {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 20px;
  font-weight: 800;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.application-panel) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
  background-color: var(--bgcolor);
  border-radius: 10px;
}

.uslugi-print-page--mobile :deep(.application-card) {
  padding: 0;
  background: none;
}

.uslugi-print-page--mobile :deep(.application-title) {
  margin: 0;
  font-family: 'Montserrat-Bold', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.application-list) {
  padding-left: 21px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.application-list li + li) {
  margin-top: 0;
}
</style>
