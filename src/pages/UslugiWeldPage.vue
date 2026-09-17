<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiWeld from '@/components/sections/uslugi/UslugiWeld.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/e96iy6upXth5rfRtLTi3j6/MaaS--Copy-?node-id=5650-15973 -->
  <div
    class="uslugi-page uslugi-weld-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-page--mobile': isMobile,
      'uslugi-weld-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-page__sections">
            <UslugiCalc service_id="other" />
            <UslugiWeld />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="other" />
        </el-col>
        <UslugiWeld />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-weld-page :deep(.uslugi-wrapper) {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 40px;
  padding: 40px;
  border-radius: 40px;
  box-shadow: 0 6px 7.5px rgba(224, 227, 237, 0.5);
}

.uslugi-weld-page :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
}

.uslugi-weld-page :deep(.uslugi-section) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 500px;
  grid-template-rows: auto auto;
  gap: 40px 80px;
  margin-bottom: 0;
  align-items: start;
}

.uslugi-weld-page :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  grid-column: 1;
  grid-row: 1;
  gap: 8px;
  line-height: 1.4;
}

.uslugi-weld-page :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-weld-page :deep(.uslugi-image-wrapper) {
  display: block;
  flex: none;
  grid-column: 2;
  grid-row: 1 / 3;
  width: 500px;
  max-width: 500px;
  min-width: 0;
  height: 380px;
  min-height: 380px;
  border-radius: 20px;
  background-color: var(--bgcolor);
  overflow: hidden;
}

.uslugi-weld-page :deep(.uslugi-image) {
  display: block;
  width: 500px;
  height: 380px;
  object-fit: contain;
  border-radius: 20px;
}

.uslugi-weld-page :deep(.uslugi-keywords) {
  grid-column: 1;
  grid-row: 2;
}

.uslugi-weld-page :deep(.uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.4;
}

.uslugi-weld-page :deep(.requirements-table-wrapper) {
  margin: 0;
}

@media (max-width: 1300px) and (min-width: 769px) {
  .uslugi-weld-page :deep(.uslugi-section) {
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 40px 80px;
  }

  .uslugi-weld-page :deep(.uslugi-image-wrapper) {
    grid-column: 2;
    grid-row: 1;
    width: 400px;
    max-width: 400px;
    height: 344px;
    min-height: 344px;
  }

  .uslugi-weld-page :deep(.uslugi-image) {
    width: 400px;
    height: 344px;
  }

  .uslugi-weld-page :deep(.uslugi-keywords) {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}

.uslugi-weld-page--mobile :deep(.uslugi-weld-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-weld-page--mobile :deep(.uslugi-wrapper) {
  gap: 16px;
  margin-bottom: 0;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 0 5px #c8cfe3;
}

.uslugi-weld-page--mobile :deep(.uslugi-wrapper--weld-intro) {
  gap: 16px;
}

.uslugi-weld-page--mobile :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
}

.uslugi-weld-page--mobile :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
  font-size: 12px;
  line-height: normal;
  overflow-wrap: break-word;
}

.uslugi-weld-page--mobile :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  max-width: 100%;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
}

.uslugi-weld-page--mobile :deep(.uslugi-image) {
  width: 100%;
  max-width: 100%;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
  object-fit: contain;
}

.uslugi-weld-page--mobile :deep(.uslugi-keywords) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
}

.uslugi-weld-page--mobile :deep(.uslugi-keyword) {
  padding: 6px 12px;
  font-size: 10px;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table) {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table th),
.uslugi-weld-page--mobile :deep(.weld-mobile-table td) {
  padding: 8px;
  border: 1px solid var(--button-bg);
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  vertical-align: middle;
  word-break: break-word;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table th) {
  background-color: var(--button-bg);
  text-align: left;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table th:last-child) {
  text-align: center;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table td) {
  background-color: #f2f3f7;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table .col-thickness) {
  width: 120px;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table td:last-child) {
  text-align: center;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table thead th:first-child) {
  border-radius: 8px 0 0 0;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table thead th:last-child) {
  border-radius: 0 8px 0 0;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table tbody tr:last-child td:first-child) {
  border-radius: 0 0 0 8px;
}

.uslugi-weld-page--mobile :deep(.weld-mobile-table tbody tr:last-child td:last-child) {
  border-radius: 0 0 8px 0;
}
</style>
