<script lang="ts" setup>
import IconIspitaniya from '@/icons/IconIspitaniya.vue'
</script>

<template>
  <!-- Внешние воздействующие факторы -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="content-wrapper">
      <div class="main-title">ВНЕШНИЕ ВОЗДЕЙСТВУЮЩИЕ ФАКТОРЫ</div>

      <div class="factors-grid">
        <div class="factors-column">
          <div class="factor-card">
            <IconIspitaniya class="factor-icon" :stroke-width="2.5" color="#9ca3af" />
            <div class="factor-title">КЛИМАТИЧЕСКИЕ (ТЕМПЕРАТУРА, ВЛАЖНОСТЬ)</div>
          </div>

          <div class="factor-card">
            <IconIspitaniya class="factor-icon" :stroke-width="2.5" color="#9ca3af" />
            <div class="factor-title">ЭЛЕКТРИЧЕСКИЕ ИЗМЕРЕНИЯ</div>
          </div>

          <div class="factor-card">
            <IconIspitaniya class="factor-icon" :stroke-width="2.5" color="#9ca3af" />
            <div class="factor-title">ВОЗДЕЙСТВИЕ ПЫЛИ И ПЕСКА</div>
          </div>
        </div>

        <div class="factors-column">
          <div class="factor-card">
            <IconIspitaniya class="factor-icon" :stroke-width="2.5" color="#9ca3af" />
            <div class="factor-title">МЕХАНИЧЕСКИЕ ИЗМЕРЕНИЯ</div>
          </div>

          <div class="factor-card">
            <IconIspitaniya class="factor-icon" :stroke-width="2.5" color="#9ca3af" />
            <div class="factor-title">ВОЗДЕЙСТВИЕ ВЛАГИ И СОЛЯНОГО ТУМАНА</div>
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.content-wrapper {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  padding: 60px 80px;
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 40px;
  text-align: left;
}

.description-section {
  display: flex;
  gap: 80px;
  margin-bottom: 60px;
  align-items: flex-start;
}

.description-text {
  flex: 1;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.6;
  color: #000;
  text-align: justify;
}

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
  background-color: #f3f4f6;
  border-radius: 8px;
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
  width: 40px;
  height: 40px;
  margin-right: 16px;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 30px 40px;
    margin: 0 0 40px 0;
  }

  .main-title {
    font-size: 28px;
    text-align: center;
    margin-bottom: 30px;
  }

  .description-section {
    flex-direction: column;
    gap: 30px;
    margin-bottom: 40px;
  }

  .description-text {
    font-size: 16px;
    text-align: left;
  }

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

