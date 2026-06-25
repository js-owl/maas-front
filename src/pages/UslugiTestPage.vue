<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiTestExternal from '@/components/sections/uslugi/UslugiTestExternal.vue'
import UslugiTestOptical from '@/components/sections/uslugi/UslugiTestOptical.vue'
import UslugiTestEquipment from '@/components/sections/uslugi/UslugiTestEquipment.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-3090 -->
  <div class="uslugi-test-page" :class="{ 'uslugi-test-page--mobile': isMobile }">
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-test-page__sections">
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
.uslugi-test-page {
  background-color: var(--bgcolor);
  box-sizing: border-box;
}

.uslugi-test-page__sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 10px 40px;
  box-sizing: border-box;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.el-col) {
  width: 100%;
  max-width: 100%;
  flex: 0 0 100%;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.uslugi-wrapper) {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 16px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 0 5px #c8cfe3;
  box-sizing: border-box;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
  text-transform: none;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.factors-grid) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.factors-column) {
  display: contents;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.factors-column:first-child .factor-card:nth-child(1)) {
  order: 1;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.factors-column:last-child .factor-card:nth-child(1)) {
  order: 2;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.factors-column:first-child .factor-card:nth-child(2)) {
  order: 3;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.factors-column:last-child .factor-card:nth-child(2)) {
  order: 4;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.factors-column:first-child .factor-card:nth-child(3)) {
  order: 5;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.factor-card) {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  min-height: 0;
  padding: 16px;
  border-radius: 8px;
  background-color: #f2f3f7;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.factor-title) {
  flex: 1 1 0;
  min-width: 0;
  order: 1;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.factor-icon) {
  flex-shrink: 0;
  order: 2;
  width: 28px;
  height: 28px;
  margin: 0;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.technical-requirements) {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.requirements-table-wrapper) {
  margin: 0;
  border: none;
  border-radius: 0;
  overflow: visible;
  background-color: transparent;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.requirements-table thead) {
  display: none;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.requirements-table td) {
  padding: 16px;
  border-radius: 10px;
  background-color: #f2f3f7;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.materials-list) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.materials-list li) {
  position: relative;
  padding-left: 18px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.materials-list li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #000000;
}

.uslugi-test-page--mobile .uslugi-test-page__sections :deep(.materials-list li + li) {
  margin-top: 0;
}
</style>
