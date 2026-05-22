<script lang="ts" setup>
const applications = [
  'Авиация',
  'Машиностроение',
  'Строительство',
  'Урбанистика',
  'Спорт',
  'Медицина',
  'Электроника',
  'Транспорт',
  'Дизайн',
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper pkm-applications">
      <div class="uslugi-table-title">Применение</div>
      <div class="application-tags">
        <div v-for="application in applications" :key="application" class="application-tag">
          {{ application }}
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.pkm-applications {
  box-shadow: 0 10px 15px 0 var(--button-bg);
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  padding: 40px;
}

.application-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.application-tag {
  align-items: center;
  background-color: var(--bgcolor);
  border-radius: 40px;
  color: #7d8083;
  display: inline-flex;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  line-height: 1.05;
  min-height: 49px;
  padding: 10px 20px;
}

@media (max-width: 767px) {
  .pkm-applications {
    padding: 20px;
  }

  .application-tag {
    font-size: 20px;
  }
}
</style>
