<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import HomeCalc from '@/components/sections/HomeCalc.vue'
import UslugiGalv from '@/components/sections/uslugi/UslugiGalv.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>

<template>
  <div class="main-container">
    <el-row>
      <div v-if="!isMobile">
        <el-col :offset="3" :span="18">
          <div class="galv-homecalc">
            <HomeCalc />
          </div>
        </el-col>
      </div>
      <UslugiGalv />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}

.galv-homecalc {
  margin-bottom: 40px;
}

.galv-homecalc :deep(.section-basic) {
  background-color: var(--whity);
  border-radius: 20px;
  box-shadow: 0 10px 15px 0 var(--button-bg);
  margin: 0;
  min-height: 308px;
  padding: 40px;
}

.galv-homecalc :deep(.calc-wrap) {
  align-items: stretch;
  gap: 80px;
}

.galv-homecalc :deep(.calc-left) {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 0;
}

.galv-homecalc :deep(.maas-title) {
  font-size: 32px;
  line-height: 1;
  margin-bottom: 40px;
  max-width: 590px;
}

.galv-homecalc :deep(.maas-text) {
  font-size: 18px;
  line-height: 1.25;
  max-width: 590px;
}

.galv-homecalc :deep(.calc-right) {
  align-self: stretch;
  background: transparent;
  box-shadow: none;
}

.galv-homecalc :deep(.calc-form) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  justify-content: center;
}

.galv-homecalc :deep(.upload-files-bordered .upload) {
  background-color: var(--bgcolor);
  border-color: var(--gray-footer);
  min-height: 150px;
  padding: 20px;
}

.galv-homecalc :deep(.action-row) {
  gap: 20px;
  justify-content: flex-end;
  margin-top: 0;
}

/* Keep existing component logic, only tune proportions for this page */
.galv-homecalc :deep(.action-row .el-form-item) {
  flex: 1 1 auto;
  max-width: 290px;
}

.galv-homecalc :deep(.calc-submit-button) {
  --bgcolor: var(--button-bg);
  border-radius: 30px;
  flex: 0 0 auto;
  min-height: 44px;
  min-width: 140px;
  padding: 10px 24px;
}

@media (max-width: 768px) {
  .galv-homecalc {
    margin-bottom: 24px;
  }

  .galv-homecalc :deep(.section-basic) {
    min-height: auto;
    padding: 20px;
  }

  .galv-homecalc :deep(.calc-wrap) {
    gap: 30px;
  }

  .galv-homecalc :deep(.maas-title) {
    font-size: 28px;
    margin-bottom: 20px;
  }

  .galv-homecalc :deep(.maas-text) {
    font-size: 16px;
    max-width: 100%;
  }

  .galv-homecalc :deep(.action-row .el-form-item) {
    max-width: 100%;
  }
}
</style>
