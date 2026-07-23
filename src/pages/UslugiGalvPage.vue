<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiGalv from '@/components/sections/uslugi/UslugiGalv.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-3516 -->
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
            <UslugiGalv />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="other" />
        </el-col>
        <UslugiGalv />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-galv-page--mobile :deep(.uslugi-galv-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-galv-page--mobile :deep(.uslugi-wrapper--galv-intro) {
  gap: 0;
}

.uslugi-galv-page--mobile :deep(.uslugi-wrapper--galv-services) {
  gap: 16px;
  box-shadow: none;
}

.uslugi-galv-page--mobile :deep(.uslugi-galv-intro) {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.uslugi-galv-page--mobile :deep(.uslugi-galv-content) {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.uslugi-galv-page--mobile :deep(.uslugi-text) {
  margin: 0;
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
