<script lang="ts" setup>
import IconExternal1 from '@/icons/IconExternal1.vue';
import IconExternal2 from '@/icons/IconExternal2.vue';
import IconExternal3 from '@/icons/IconExternal3.vue';
import IconExternal4 from '@/icons/IconExternal4.vue';
import IconExternal5 from '@/icons/IconExternal5.vue';
</script>

<template>
  <!-- Внешние воздействующие факторы -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Испытания на внешние воздействующие факторы (ВВФ)</div>

      <div class="factors-grid">
        <div class="factors-column">
          <router-link class="factor-card factor-card-link" to="/testing">
            <icon-external1 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">Климатические испытания (температура, влажность)</div>
          </router-link>

          <router-link class="factor-card factor-card-link" to="/testing#electric">
            <IconExternal3 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">Электрические испытания</div>
          </router-link>

          <router-link class="factor-card factor-card-link" to="/testing#dust">
            <IconExternal5 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">Воздействие статической и динамической пыли</div>
          </router-link>
        </div>

        <div class="factors-column">
          <router-link class="factor-card factor-card-link" to="/testing#vibration">
            <IconExternal2 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">Механические испытания (вибрация, удар)</div>
          </router-link>

          <router-link class="factor-card factor-card-link" to="/testing#humidity">
            <IconExternal4 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">Воздействие соляного тумана</div>
          </router-link>
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

.factor-card-link {
  text-decoration: none;
  color: inherit;
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

