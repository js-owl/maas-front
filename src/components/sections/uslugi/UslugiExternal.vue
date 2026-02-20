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
      <div class="uslugi-title">ВНЕШНИЕ ВОЗДЕЙСТВУЮЩИЕ ФАКТОРЫ</div>

      <div class="factors-grid">
        <div class="factors-column">
          <div class="factor-card">
            <icon-external1 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">КЛИМАТИЧЕСКИЕ (ТЕМПЕРАТУРА, ВЛАЖНОСТЬ)</div>
          </div>

          <div class="factor-card">
            <IconExternal3 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">ЭЛЕКТРИЧЕСКИЕ ИЗМЕРЕНИЯ</div>
          </div>

          <div class="factor-card">
            <IconExternal5 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">ВОЗДЕЙСТВИЕ ПЫЛИ И ПЕСКА</div>
          </div>
        </div>

        <div class="factors-column">
          <div class="factor-card">
            <IconExternal2 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">МЕХАНИЧЕСКИЕ ИЗМЕРЕНИЯ</div>
          </div>

          <div class="factor-card">
            <IconExternal4 class="factor-icon" :stroke-width="2.5" color="#7d8083" />
            <div class="factor-title">ВОЗДЕЙСТВИЕ ВЛАГИ И СОЛЯНОГО ТУМАНА</div>
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.image-wrapper {
  flex: 0 0 420px;
  display: flex;
  justify-content: flex-end;
}

.lathe-image {
  max-width: 600px;
  /* height: 260px; */
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.technical-requirements {
  margin-top: 40px;
}

.requirements-title {
  font-size: 36px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 40px;
  text-align: left;
}

.requirements-table-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.requirements-table thead {
  background-color: var(--bgcolor);
}
.requirements-table th{
  font-size: 24px;
}

.requirements-table th,
.requirements-table td {
  padding: 16px 20px;
  font-size: 20px;
  font-weight: 500;
  color: #000;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  vertical-align: top;
}

.requirements-table th {
  font-size: 24px;
  font-weight: 600;
}

.requirements-table th:last-child,
.requirements-table td:last-child {
  border-right: none;
}

.requirements-table tr:last-child td {
  border-bottom: none;
}

.materials-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.materials-list li + li {
  margin-top: 4px;
}

.factors-grid {
  display: flex;
  gap: 24px;
}

.factors-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.factor-card {
  background-color: #e1e4e6;
  border-radius: 10px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  min-height: 80px;
}

.factor-title {
  font-size: 24px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
}

.factor-icon {
  width: 60px;
  height: 60px;
  margin-right: 16px;
}

@media (max-width: 768px) {
  .image-wrapper {
    flex: 1;
    justify-content: center;
  }

  .lathe-image {
    max-width: 100%;
    height: auto;
  }

  .requirements-title {
    font-size: 22px;
    text-align: center;
    margin-bottom: 30px;
  }

  .requirements-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .factors-grid {
    flex-direction: column;
  }
}
</style>

