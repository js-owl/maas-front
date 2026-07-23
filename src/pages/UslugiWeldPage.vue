<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiWeld from '@/components/sections/uslugi/UslugiWeld.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-4418 -->
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
.uslugi-weld-page--mobile :deep(.uslugi-weld-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-weld-page--mobile :deep(.uslugi-wrapper--weld-intro) {
  gap: 16px;
}

.uslugi-weld-page--mobile :deep(.uslugi-weld-intro) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.uslugi-weld-page--mobile :deep(.uslugi-weld-content) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.uslugi-weld-page--mobile :deep(.uslugi-title) {
  font-size: 16px;
}

.uslugi-weld-page--mobile :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
}

.uslugi-weld-page--mobile :deep(.uslugi-text p) {
  margin: 0;
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
