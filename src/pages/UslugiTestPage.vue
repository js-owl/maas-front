<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiTestExternal from '@/components/sections/uslugi/UslugiTestExternal.vue'
import UslugiTestOptical from '@/components/sections/uslugi/UslugiTestOptical.vue'
import UslugiTestEquipment from '@/components/sections/uslugi/UslugiTestEquipment.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-3090 -->
  <div
    class="uslugi-page uslugi-test-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-page--mobile': isMobile,
      'uslugi-test-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-page__sections">
            <UslugiTestExternal />
            <UslugiTestOptical />
            <UslugiTestEquipment />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="other" />
        </el-col>
        <UslugiTestExternal />
        <UslugiTestOptical />
        <UslugiTestEquipment />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-test-page--mobile :deep(.uslugi-title) {
  text-transform: none;
}

.uslugi-test-page--mobile :deep(.factors-grid) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uslugi-test-page--mobile :deep(.factors-column) {
  display: contents;
}

.uslugi-test-page--mobile :deep(.factors-column:first-child .factor-card:nth-child(1)) {
  order: 1;
}

.uslugi-test-page--mobile :deep(.factors-column:last-child .factor-card:nth-child(1)) {
  order: 2;
}

.uslugi-test-page--mobile :deep(.factors-column:first-child .factor-card:nth-child(2)) {
  order: 3;
}

.uslugi-test-page--mobile :deep(.factors-column:last-child .factor-card:nth-child(2)) {
  order: 4;
}

.uslugi-test-page--mobile :deep(.factors-column:first-child .factor-card:nth-child(3)) {
  order: 5;
}

.uslugi-test-page--mobile :deep(.factor-card) {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  min-height: 0;
  padding: 16px;
  border-radius: 8px;
  background-color: #f2f3f7;
}

.uslugi-test-page--mobile :deep(.factor-title) {
  flex: 1 1 0;
  min-width: 0;
  order: 1;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-test-page--mobile :deep(.factor-icon) {
  flex-shrink: 0;
  order: 2;
  width: 28px;
  height: 28px;
  margin: 0;
}

.uslugi-test-page--mobile :deep(.technical-requirements) {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
}

.uslugi-test-page--mobile :deep(.requirements-table-wrapper) {
  margin: 0;
  border: none;
  border-radius: 0;
  overflow: visible;
  background-color: transparent;
}

.uslugi-test-page--mobile :deep(.requirements-table thead) {
  display: none;
}

.uslugi-test-page--mobile :deep(.requirements-table td) {
  padding: 16px;
  border-radius: 10px;
  background-color: #f2f3f7;
}

.uslugi-test-page--mobile :deep(.materials-list) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.uslugi-test-page--mobile :deep(.materials-list li) {
  position: relative;
  padding-left: 18px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-test-page--mobile :deep(.materials-list li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #000000;
}

.uslugi-test-page--mobile :deep(.materials-list li + li) {
  margin-top: 0;
}
</style>
