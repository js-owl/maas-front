<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiPKM from '@/components/sections/uslugi/UslugiPKM.vue'
import UslugiPKMAdvantages from '@/components/sections/uslugi/UslugiPKMAdvantages.vue'
import UslugiPKMExample from '@/components/sections/uslugi/UslugiPKMExample.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-2460 -->
  <div
    class="uslugi-pkm-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-pkm-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-pkm-page__sections">
            <UslugiPKM />
            <UslugiPKMAdvantages />
            <UslugiPKMExample />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="other" />
        </el-col>
        <UslugiPKM />
        <UslugiPKMAdvantages />
        <UslugiPKMExample />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-pkm-page__sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 10px 40px;
  box-sizing: border-box;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.el-col) {
  width: 100%;
  max-width: 100%;
  flex: 0 0 100%;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-info),
.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-advantages),
.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-applications) {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 0 5px #c8cfe3;
  box-sizing: border-box;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-info) {
  gap: 20px;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-section) {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 0;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-text) {
  display: flex;
  flex-direction: column;
  gap: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-title) {
  margin: 0 0 16px;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-text p) {
  margin: 0 0 12px;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-text p:last-child) {
  margin-bottom: 0;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-lead span) {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  height: 200px;
  min-height: 200px;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.uslugi-image) {
  display: block;
  width: 100%;
  height: 200px;
  min-height: 200px;
  max-width: none;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: none;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.technical-requirements) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.technical-requirements .uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.requirements-table-wrapper) {
  border: none;
  border-radius: 0;
  overflow: visible;
  background-color: transparent;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.requirements-table) {
  display: flex;
  width: 100%;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.requirements-table tbody),
.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.requirements-table tr) {
  display: flex;
  width: 100%;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.requirements-table td) {
  flex: 1 1 0;
  min-width: 0;
  padding: 8px;
  border: 1px solid var(--button-bg);
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.requirements-label) {
  border-radius: 8px 0 0 8px;
  background-color: var(--bgcolor);
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.requirements-table td:last-child) {
  border-radius: 0 8px 8px 0;
  background-color: #f2f3f7;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-advantages) {
  gap: 10px;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-advantages .uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.advantages-grid) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.advantage-card) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--bgcolor);
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.advantage-title) {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.advantage-text) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-applications) {
  gap: 10px;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-applications__title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-applications__tags) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-applications__row) {
  display: contents;
}

.uslugi-pkm-page--mobile .uslugi-pkm-page__sections :deep(.pkm-applications__tag) {
  display: inline-flex;
  align-items: center;
  height: auto;
  min-height: 0;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: var(--bgcolor);
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  white-space: nowrap;
}
</style>
