<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiWeld from '@/components/sections/uslugi/UslugiWeld.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const isTablet = computed(() => width.value >= 768 && width.value <= 1300)
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-4418 -->
  <div
    class="uslugi-weld-page"
    :class="{ 'uslugi-weld-page--mobile': isMobile, 'uslugi-weld-page--tablet': isTablet }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-weld-page__sections">
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
.uslugi-weld-page {
  background-color: var(--bgcolor);
  box-sizing: border-box;
}

.uslugi-weld-page:not(.uslugi-weld-page--mobile) {
  padding-top: 2.5em;
  padding-bottom: 2.5em;
}

.uslugi-weld-page--tablet {
  padding-left: 2.5em;
  padding-right: 2.5em;
}

.uslugi-weld-page--mobile {
  padding: 0;
}

@media (max-width: 1300px) and (min-width: 768px) {
  .uslugi-weld-page :deep(.el-col) {
    max-width: 100% !important;
    flex: 0 0 100% !important;
    margin-left: 0 !important;
  }
}

.uslugi-weld-page__sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 10px 40px;
  box-sizing: border-box;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.el-col) {
  width: 100%;
  max-width: 100%;
  flex: 0 0 100%;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.uslugi-weld-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.uslugi-wrapper) {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 0 5px #c8cfe3;
  box-sizing: border-box;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.uslugi-wrapper--weld-intro) {
  gap: 16px;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.uslugi-weld-intro) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.uslugi-weld-content) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  height: 200px;
  min-height: 200px;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.uslugi-image) {
  display: block;
  width: 100%;
  height: 200px;
  min-height: 200px;
  max-width: none;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: none;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table) {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table th),
.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table td) {
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

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table th) {
  background-color: var(--button-bg);
  text-align: left;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table th:last-child) {
  text-align: center;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table td) {
  background-color: #f2f3f7;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table .col-thickness) {
  width: 120px;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table td:last-child) {
  text-align: center;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table thead th:first-child) {
  border-radius: 8px 0 0 0;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table thead th:last-child) {
  border-radius: 0 8px 0 0;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table tbody tr:last-child td:first-child) {
  border-radius: 0 0 0 8px;
}

.uslugi-weld-page--mobile .uslugi-weld-page__sections :deep(.weld-mobile-table tbody tr:last-child td:last-child) {
  border-radius: 0 0 8px 0;
}
</style>
