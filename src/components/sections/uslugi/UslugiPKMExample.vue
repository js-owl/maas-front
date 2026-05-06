<script lang="ts" setup>
const examples = [
  '/uslugiPages/pkm-example-1.png',
  '/uslugiPages/pkm-example-2.png',
  '/uslugiPages/pkm-example-3.png',
  '/uslugiPages/pkm-example-4.png',
]

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
    <div class="uslugi-wrapper pkm-examples">
      <div class="uslugi-table-title">Примеры работ</div>
      <div class="examples-grid">
        <img v-for="(example, index) in examples" :key="index" :src="example" alt="Пример работ ПКМ" />
      </div>

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
.uslugi-wrapper {
  box-shadow: 0 10px 15px 0 var(--button-bg);
  padding: 40px;
}

.pkm-examples {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.examples-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);
}

.examples-grid img {
  border-radius: 10px;
  height: 240px;
  object-fit: cover;
  width: 100%;
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

@media (max-width: 1200px) {
  .examples-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .uslugi-wrapper {
    padding: 20px;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .examples-grid img {
    height: 200px;
  }

  .application-tag {
    font-size: 20px;
  }
}
</style>
