<script lang="ts" setup>
const examples = [
  '/uslugiPages/print-example-1.png',
  '/uslugiPages/print-example-2.png',
  '/uslugiPages/print-example-3.png',
  '/uslugiPages/print-example-4.png',
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper print-examples">
      <div class="uslugi-table-title">Примеры работ</div>
      <div class="examples-grid">
        <img v-for="(example, index) in examples" :key="index" :src="example" alt="Пример работ" />
      </div>

      <div class="uslugi-table-title">Применение</div>
      <div class="application-grid">
        <div class="application-card">
          <div class="application-title">Автомобилестроение</div>
          <div class="application-text">
            корпусные детали, воздуховоды, ложементы и зажимы, вспомогательные инструменты, аксессуары
          </div>
        </div>
        <div class="application-card">
          <div class="application-title">Машиностроение</div>
          <div class="application-text">
            оснастка, формы для литья, крыльчатки, корпуса, шестерни, рамы, рукоятки
            <br /><br />
            Макеты и модели.
          </div>
        </div>
        <div class="application-card">
          <div class="application-title">Электроника</div>
          <div class="application-text">корпуса приборов, коннекторы, изделия для робототехники и пр</div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.print-examples {
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

.application-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}

.application-card {
  background-color: var(--bgcolor);
  border-radius: 10px;
  padding: 20px;
}

.application-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  margin-bottom: 20px;
}

.application-text {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  line-height: 1.3;
}

@media (max-width: 1200px) {
  .examples-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .application-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .examples-grid {
    grid-template-columns: 1fr;
  }

  .examples-grid img {
    height: 200px;
  }
}
</style>
