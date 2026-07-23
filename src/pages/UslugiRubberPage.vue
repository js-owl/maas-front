<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiRubber from '@/components/sections/uslugi/UslugiRubber.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const isTablet = computed(() => width.value >= 768 && width.value <= 1300)
</script>

<template>
  <!-- https://www.figma.com/design/0JRYgu37H4xKjqliiJLvI1/MaaS-Frontend--Copy-?node-id=4510-4539 -->
  <div
    class="uslugi-rubber-page"
    :class="{ 'uslugi-rubber-page--mobile': isMobile, 'uslugi-rubber-page--tablet': isTablet }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-rubber-page__sections">
            <UslugiRubber />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="other" />
        </el-col>
        <UslugiRubber />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-rubber-page {
  background-color: var(--bgcolor);
  box-sizing: border-box;
}

.uslugi-rubber-page:not(.uslugi-rubber-page--mobile) {
  padding-top: 2.5em;
  padding-bottom: 2.5em;
}

.uslugi-rubber-page--tablet {
  padding-left: 2.5em;
  padding-right: 2.5em;
}

.uslugi-rubber-page--mobile {
  padding: 0;
}

@media (max-width: 1300px) and (min-width: 768px) {
  .uslugi-rubber-page :deep(.el-col) {
    max-width: 100% !important;
    flex: 0 0 100% !important;
    margin-left: 0 !important;
  }
}

.uslugi-rubber-page__sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 10px 40px;
  box-sizing: border-box;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.el-col) {
  width: 100%;
  max-width: 100%;
  flex: 0 0 100%;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.uslugi-rubber-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.uslugi-wrapper) {
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

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.uslugi-wrapper--rubber-intro) {
  gap: 16px;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.uslugi-rubber-intro) {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.uslugi-wrapper--rubber-intro .uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  gap: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  height: 200px;
  min-height: 200px;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.uslugi-image) {
  display: block;
  width: 100%;
  height: 200px;
  min-height: 200px;
  max-width: none;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: none;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-card__title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-card__title--types) {
  font-size: 16px;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-card__note) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-card__header) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-list) {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-list__item) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--button-bg);
  margin-top: -1px;
  background-color: #f2f3f7;
  box-sizing: border-box;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-list__item:first-child) {
  margin-top: 0;
  border-radius: 8px 8px 0 0;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-list__item:last-child) {
  border-radius: 0 0 8px 8px;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-list__item:only-child) {
  border-radius: 8px;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-list__name) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-list__row) {
  display: flex;
  gap: 4px;
  align-items: flex-start;
  width: 100%;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-list__label),
.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-list__value) {
  flex: 1 1 0;
  min-width: 0;
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-rubber-page--mobile .uslugi-rubber-page__sections :deep(.rubber-mobile-list__value) {
  white-space: pre-line;
}
</style>
