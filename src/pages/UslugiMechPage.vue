<script lang="ts" setup>
import UslugiLathe from '../components/sections/uslugi/UslugiLathe.vue'
import UslugiMilling from '../components/sections/uslugi/UslugiMilling.vue'
import UslugiGrinding from '../components/sections/uslugi/UslugiGrinding.vue'
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/e96iy6upXth5rfRtLTi3j6/MaaS--Copy-?node-id=5068-44871 -->
  <div
    class="uslugi-page uslugi-mech-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-page--mobile': isMobile,
      'uslugi-mech-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-page__sections">
            <UslugiCalc service_id="cnc-milling" />
            <h1 class="uslugi-mech-page__title">Механическая обработка</h1>
            <UslugiLathe />
            <UslugiMilling />
            <UslugiGrinding />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="cnc-milling" />
          <h1 class="uslugi-mech-page__title">Механическая обработка</h1>
        </el-col>
        <UslugiLathe />
        <UslugiMilling />
        <UslugiGrinding />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-mech-page__title {
  margin: 0 0 40px;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 52px;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  color: #000;
}

.uslugi-mech-page :deep(.uslugi-wrapper) {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 40px;
  padding: 40px;
  border-radius: 40px;
  box-shadow: 0 6px 7.5px rgba(224, 227, 237, 0.5);
}

.uslugi-mech-page :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
}

.uslugi-mech-page :deep(.uslugi-section) {
  gap: 80px;
  margin-bottom: 0;
  align-items: flex-start;
}

.uslugi-mech-page :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.4;
}

.uslugi-mech-page :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-mech-page :deep(.uslugi-image-wrapper) {
  flex: 1 1 0;
  max-width: 500px;
  min-width: 0;
  min-height: 380px;
  height: 380px;
  border-radius: 20px;
  background-color: var(--bgcolor);
  overflow: hidden;
}

.uslugi-mech-page :deep(.uslugi-wrapper--lathe .uslugi-image-wrapper) {
  height: 391px;
  min-height: 380px;
}

.uslugi-mech-page :deep(.uslugi-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
}

.uslugi-mech-page :deep(.technical-requirements) {
  margin: 0;
  width: 100%;
}

.uslugi-mech-page :deep(.requirements-header) {
  height: auto;
  min-height: 34px;
}

.uslugi-mech-page :deep(.uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.4;
}

@media (max-width: 1300px) and (min-width: 769px) {
  .uslugi-mech-page__title {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .uslugi-mech-page :deep(.uslugi-image-wrapper) {
    max-width: 360px;
    height: 341px;
    min-height: 341px;
  }

  .uslugi-mech-page :deep(.uslugi-wrapper--lathe .uslugi-image-wrapper) {
    height: 341px;
    min-height: 341px;
  }
}

.uslugi-mech-page--mobile .uslugi-mech-page__title {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.uslugi-mech-page--mobile :deep(.uslugi-wrapper) {
  gap: 24px;
  margin-bottom: 0;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 0 5px #c8cfe3;
}

.uslugi-mech-page--mobile :deep(.uslugi-mech-content) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.uslugi-mech-page--mobile :deep(.uslugi-mech-intro) {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.uslugi-mech-page--mobile :deep(.uslugi-wrapper--milling .uslugi-mech-intro),
.uslugi-mech-page--mobile :deep(.uslugi-wrapper--grinding .uslugi-mech-intro) {
  gap: 10px;
}

.uslugi-mech-page--mobile :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 20px;
  font-weight: 800;
  line-height: normal;
}

.uslugi-mech-page--mobile :deep(.uslugi-text) {
  gap: 8px;
  font-size: 12px;
  line-height: normal;
}

.uslugi-mech-page--mobile :deep(.uslugi-image-wrapper),
.uslugi-mech-page--mobile :deep(.uslugi-wrapper--lathe .uslugi-image-wrapper) {
  display: block;
  flex: none;
  width: 100%;
  max-width: none;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
  background-color: var(--bgcolor);
  overflow: hidden;
}

.uslugi-mech-page--mobile :deep(.uslugi-image) {
  width: 100%;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
  object-fit: contain;
}

.uslugi-mech-page--mobile :deep(.technical-requirements) {
  margin: 0;
}

.uslugi-mech-page--mobile :deep(.technical-requirements--expanded) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uslugi-mech-page--mobile :deep(.requirements-header .uslugi-table-title) {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
}
</style>
