<script lang="ts" setup>
const applications = [
  {
    title: 'Автомобилестроение',
    items: [
      'Корпусные детали',
      'Воздуховоды',
      'Ложементы и зажимы',
      'Вспомогательные инструменты',
      'Аксессуары',
    ],
  },
  {
    title: 'Электроника',
    items: ['Корпуса приборов', 'Коннекторы', 'Изделия для робототехники'],
  },
  {
    title: 'Машиностроение',
    items: [
      'Оснастка, формы для литья',
      'Крыльчатки',
      'Корпуса',
      'Шестерни',
      'Рамы',
      'Рукоятки',
      'Макеты и модели.',
    ],
  },
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper print-examples uslugi-wrapper--application">
      <div class="uslugi-table-title">Применение</div>
      <div class="application-panel">
        <div v-for="application in applications" :key="application.title" class="application-card">
          <div class="application-title">{{ application.title }}</div>
          <ul class="application-list">
            <li v-for="item in application.items" :key="item">{{ item }}</li>
          </ul>
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

.print-examples .uslugi-table-title {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.4;
}

.application-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  width: 100%;
  padding: 30px;
  border-radius: 10px;
  background-color: var(--bgcolor);
  box-sizing: border-box;
}

.application-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 0;
  background: none;
}

.application-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  color: #000;
}

.application-list {
  margin: 0;
  padding-left: 27px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  color: #000;
  list-style-type: disc;
}

.application-list li + li {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .print-examples .uslugi-table-title {
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: normal;
  }

  .application-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0;
    background: none;
    border-radius: 0;
  }

  .application-card {
    padding: 16px;
    border-radius: 8px;
    background-color: var(--bgcolor);
  }

  .application-title {
    font-size: 16px;
    line-height: normal;
  }

  .application-list {
    padding-left: 18px;
    font-size: 12px;
    line-height: normal;
  }
}
</style>
