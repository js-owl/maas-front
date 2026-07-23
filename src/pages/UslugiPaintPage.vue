<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiPaint from '@/components/sections/uslugi/UslugiPaint.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-2581 -->
  <div
    class="uslugi-page uslugi-paint-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-page--mobile': isMobile,
      'uslugi-paint-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-page__sections">
            <UslugiPaint />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="other" />
        </el-col>
        <UslugiPaint />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-paint-page--mobile :deep(.uslugi-paint-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-paint-page--mobile :deep(.uslugi-paint-info) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.uslugi-paint-page--mobile :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-paint-page--mobile :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-paint-page--mobile :deep(.ral-library-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-paint-page--mobile :deep(.ral-groups) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uslugi-paint-page--mobile :deep(.ral-group) {
  padding: 0;
  background-color: transparent;
  border-radius: 0;
}

.uslugi-paint-page--mobile :deep(.ral-grid--mobile) {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}

.uslugi-paint-page--mobile :deep(.ral-tag--mobile) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  min-height: 26px;
  min-width: 0;
  padding: 0 10px;
  border-radius: 4px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
}
</style>
