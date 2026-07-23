<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiPaint from '@/components/sections/uslugi/UslugiPaint.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const isTablet = computed(() => width.value >= 768 && width.value <= 1300)
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-2581 -->
  <div
    class="uslugi-paint-page"
    :class="{ 'uslugi-paint-page--mobile': isMobile, 'uslugi-paint-page--tablet': isTablet }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-paint-page__sections">
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
.uslugi-paint-page {
  background-color: var(--bgcolor);
  box-sizing: border-box;
}

.uslugi-paint-page:not(.uslugi-paint-page--mobile) {
  padding-top: 2.5em;
  padding-bottom: 2.5em;
}

.uslugi-paint-page--tablet {
  padding-left: 2.5em;
  padding-right: 2.5em;
}

.uslugi-paint-page--mobile {
  padding: 0;
}

@media (max-width: 1300px) and (min-width: 768px) {
  .uslugi-paint-page :deep(.el-col) {
    max-width: 100% !important;
    flex: 0 0 100% !important;
    margin-left: 0 !important;
  }
}

.uslugi-paint-page__sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 10px 40px;
  box-sizing: border-box;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.el-col) {
  width: 100%;
  max-width: 100%;
  flex: 0 0 100%;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.uslugi-paint-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.uslugi-wrapper) {
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

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.uslugi-paint-info) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  height: 200px;
  min-height: 200px;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.uslugi-image) {
  display: block;
  width: 100%;
  height: 200px;
  min-height: 200px;
  max-width: none;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: none;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.ral-library-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.ral-groups) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.ral-group) {
  padding: 0;
  background-color: transparent;
  border-radius: 0;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.ral-grid--mobile) {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}

.uslugi-paint-page--mobile .uslugi-paint-page__sections :deep(.ral-tag--mobile) {
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
