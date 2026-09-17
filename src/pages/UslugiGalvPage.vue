<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiGalv from '@/components/sections/uslugi/UslugiGalv.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/e96iy6upXth5rfRtLTi3j6/MaaS--Copy-?node-id=5650-15125 -->
  <div
    class="uslugi-page uslugi-galv-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-page--mobile': isMobile,
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
  gap: 40px;
  margin-bottom: 0;
  align-items: flex-start;
}

.uslugi-galv-page :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.4;
}

.uslugi-galv-page :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-galv-page :deep(.uslugi-image-wrapper) {
  flex: 0 0 500px;
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

@media (max-width: 1300px) and (min-width: 769px) {
  .uslugi-galv-page :deep(.uslugi-image-wrapper) {
    flex-basis: 360px;
    width: 360px;
    max-width: 360px;
    height: 269px;
    min-height: 269px;
  }

  .uslugi-galv-page :deep(.uslugi-image) {
    width: 360px;
    height: 269px;
  }
}

.uslugi-galv-page--mobile :deep(.uslugi-wrapper) {
  gap: 16px;
  margin-bottom: 0;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 0 5px #c8cfe3;
}

.uslugi-galv-page--mobile :deep(.uslugi-section) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 0;
  width: 100%;
  min-width: 0;
}

.uslugi-galv-page--mobile :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
}

.uslugi-galv-page--mobile :deep(.uslugi-text) {
  flex: none;
  width: 100%;
  min-width: 0;
  gap: 8px;
  font-size: 12px;
  line-height: normal;
  overflow-wrap: break-word;
}

.uslugi-galv-page--mobile :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  max-width: 100%;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
}

.uslugi-galv-page--mobile :deep(.uslugi-image) {
  width: 100%;
  max-width: 100%;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
  object-fit: cover;
}

.uslugi-galv-page--mobile :deep(.technical-requirements) {
  margin: 0;
}

.uslugi-galv-page--mobile :deep(.technical-requirements--expanded) {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.uslugi-galv-page--mobile :deep(.requirements-header .uslugi-table-title) {
  font-size: 16px;
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
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 12px;
  font-weight: 600;
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
