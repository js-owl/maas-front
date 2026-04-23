<script lang="ts" setup>
import IconOptical1 from '@/icons/IconOptical1.vue'
import IconOptical2 from '@/icons/IconOptical2.vue'
import IconOptical3 from '@/icons/IconOptical3.vue'
// import IconOptical4 from '@/icons/IconOptical4.vue'
import IconOptical5 from '@/icons/IconOptical5.vue'
import IconOptical6 from '@/icons/IconOptical6.vue'
</script>

<template>
  <!-- Оптические измерения -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Оптические измерения</div>

      <div class="factors-grid">
        <div class="factors-column">
          <div class="factor-card">
            <IconOptical1 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">Фотометрические измерения</div>
          </div>

          <div class="factor-card">
            <IconOptical3 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">Спектральные измерения</div>
          </div>

          <div class="factor-card">
            <IconOptical5 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">Колориметрические измерения</div>
          </div>
        </div>

        <div class="factors-column">
          <div class="factor-card">
            <IconOptical2 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">Радиометрические измерения</div>
          </div>

          <div class="factor-card">
            <IconOptical6 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">Контроль оптических систем</div>
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.uslugi-wrapper {
  box-shadow: 0 10px 15px var(--button-bg);
}

.uslugi-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 20px;
}

.factors-grid {
  display: flex;
  gap: 20px;
}

.factors-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.factor-card {
  background-color: var(--bgcolor);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  min-height: 100px;
}

.factor-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
  color: #000000;
}

.factor-icon {
  width: 60px;
  height: 60px;
  margin-right: 20px;
}

@media (max-width: 768px) {
  .factors-grid {
    flex-direction: column;
  }

  .uslugi-title {
    font-size: 24px;
  }

  .factor-card {
    min-height: 88px;
    padding: 16px;
  }

  .factor-title {
    font-size: 20px;
  }
}
</style>

