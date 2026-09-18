<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiGalv from '@/components/sections/uslugi/UslugiGalv.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/igpM43koIC6EeepqFK9FW4/MaaS--Copy-?node-id=5650-15238 -->
  <div
    class="uslugi-page uslugi-galv-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-page--mobile': isMobile,
      'uslugi-galv-page--tablet': isTablet,
      'uslugi-galv-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-page__sections">
            <UslugiCalc service_id="electroplating_auto" />
            <UslugiGalv />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="electroplating_auto" />
        </el-col>
        <UslugiGalv />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-galv-page :deep(.uslugi-wrapper) {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 40px;
  padding: 40px;
  border-radius: 40px;
  box-shadow: 0 6px 7.5px rgba(224, 227, 237, 0.5);
}

.uslugi-galv-page :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
}

.uslugi-galv-page :deep(.uslugi-section) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 500px;
  grid-template-rows: auto auto;
  gap: 40px;
  margin-bottom: 0;
  align-items: start;
}

.uslugi-galv-page :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  grid-column: 1;
  grid-row: 1;
  gap: 8px;
  line-height: 1.4;
}

.uslugi-galv-page :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-galv-page :deep(.uslugi-media) {
  display: contents;
}

.uslugi-galv-page :deep(.uslugi-image-wrapper) {
  display: block;
  flex: none;
  grid-column: 2;
  grid-row: 1;
  width: 500px;
  max-width: 500px;
  min-width: 0;
  min-height: 374px;
  height: 374px;
  border-radius: 20px;
  background-color: var(--bgcolor);
  overflow: hidden;
}

.uslugi-galv-page :deep(.uslugi-image) {
  display: block;
  width: 500px;
  height: 374px;
  object-fit: cover;
  border-radius: 20px;
}

.uslugi-galv-page :deep(.uslugi-keywords) {
  grid-column: 1 / -1;
  grid-row: 2;
}

.uslugi-galv-page :deep(.uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.4;
}

.uslugi-galv-page :deep(.requirements-table-wrapper) {
  margin: 0;
}

.uslugi-galv-page--tablet :deep(.uslugi-section) {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto;
  gap: 40px;
}

.uslugi-galv-page--tablet :deep(.uslugi-text) {
  grid-column: auto;
  grid-row: auto;
}

.uslugi-galv-page--tablet :deep(.uslugi-media) {
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-width: 0;
}

.uslugi-galv-page--tablet :deep(.uslugi-image-wrapper) {
  grid-column: auto;
  grid-row: auto;
  width: 100%;
  max-width: none;
  height: 303px;
  min-height: 303px;
}

.uslugi-galv-page--tablet :deep(.uslugi-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.uslugi-galv-page--tablet :deep(.uslugi-keywords) {
  grid-column: auto;
  grid-row: auto;
}

.uslugi-galv-page--tablet :deep(.uslugi-table-thead),
.uslugi-galv-page--tablet :deep(.requirements-table td) {
  padding: 10px 12px;
  font-size: 16px;
}

.uslugi-galv-page--tablet :deep(.requirements-table-wrapper) {
  border-radius: 4px;
  border-color: var(--button-bg);
  background-color: #f2f3f7;
}

.uslugi-galv-page--tablet :deep(.requirements-table col) {
  width: 33.333%;
}

.uslugi-galv-page--mobile :deep(.uslugi-galv-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-galv-page--mobile :deep(.uslugi-wrapper) {
  gap: 16px;
  margin-bottom: 0;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 0 5px #c8cfe3;
}

.uslugi-galv-page--mobile :deep(.uslugi-wrapper--galv-intro) {
  gap: 32px;
}

.uslugi-galv-page--mobile :deep(.uslugi-wrapper--galv-services) {
  gap: 16px;
}

.uslugi-galv-page--mobile :deep(.uslugi-galv-intro) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.uslugi-galv-page--mobile :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 20px;
  font-weight: 800;
  line-height: normal;
}

.uslugi-galv-page--mobile :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  flex: none;
  width: 100%;
  min-width: 0;
  gap: 8px;
  font-size: 12px;
  line-height: normal;
  overflow-wrap: break-word;
}

.uslugi-galv-page--mobile :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-galv-page--mobile :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  max-width: 100%;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
  background-color: var(--bgcolor);
}

.uslugi-galv-page--mobile :deep(.uslugi-image) {
  width: 100%;
  max-width: 100%;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
  object-fit: contain;
}

.uslugi-galv-page--mobile :deep(.uslugi-keywords) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
}

.uslugi-galv-page--mobile :deep(.uslugi-keyword) {
  padding: 6px 12px;
  font-size: 10px;
}

.uslugi-galv-page--mobile :deep(.galv-mobile-card__title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-galv-page--mobile :deep(.galv-mobile-list) {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.uslugi-galv-page--mobile :deep(.galv-mobile-list__item) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border: 1px solid var(--button-bg);
  margin-top: -1px;
  background-color: #f2f3f7;
  box-sizing: border-box;
}

.uslugi-galv-page--mobile :deep(.galv-mobile-list__item:first-child) {
  margin-top: 0;
  border-radius: 8px 8px 0 0;
}

.uslugi-galv-page--mobile :deep(.galv-mobile-list__item:last-child) {
  border-radius: 0 0 8px 8px;
}

.uslugi-galv-page--mobile :deep(.galv-mobile-list__item:only-child) {
  border-radius: 8px;
}

.uslugi-galv-page--mobile :deep(.galv-mobile-list__name) {
  margin: 0;
  font-family: 'Montserrat-Bold', sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: normal;
  color: #000000;
}

.uslugi-galv-page--mobile :deep(.galv-mobile-list__row) {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
}

.uslugi-galv-page--mobile :deep(.galv-mobile-list__label),
.uslugi-galv-page--mobile :deep(.galv-mobile-list__value) {
  flex: 1 1 0;
  min-width: 0;
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}
</style>
