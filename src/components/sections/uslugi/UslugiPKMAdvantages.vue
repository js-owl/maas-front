<script lang="ts" setup>
const advantages = [
  {
    title: 'Прочность и легкость',
    text: 'Способность выдерживать значительные нагрузки при минимальном весе. Меньшая масса по сравнению со сталью и алюминием снижает вес изделий, энергопотребление и повышает эффективность.',
  },
  {
    title: 'Электроизоляция / электропроводность',
    text: 'Хорошая электроизоляционная способность подходит для элементов и корпусов в электронике и электроэнергетике. При необходимости композиты могут быть специально разработаны для хорошей электропроводности.',
  },
  {
    title: 'Долговечность',
    text: 'Сохранение свойств на протяжении длительного времени идеально для малых архитектурных форм, строительства и инфраструктурных объектов.',
  },
  {
    title: 'Гибкость в формировании',
    text: 'Композиты легко принимают разные формы и текстуры, давая свободу для инновационных продуктов. Легкая подгонка под разные формы и размеры при создании сложной геометрии.',
  },
  {
    title: 'Теплоизоляция',
    text: 'Необходимое качество для аэрокосмической техники и энергетических установок.',
  },
  {
    title: 'Сопротивление коррозии',
    text: 'Высокая устойчивость к агрессивным средам делает композиты идеальными для морской промышленности и строительства.',
  },
  {
    title: 'Сопротивление ударам',
    text: 'Выдающаяся ударопрочность идеальна для защитных конструкций: шлемов и бронежилетов.',
  },
  {
    title: 'Акустические характеристики',
    text: 'Композиты проектируются для лучшей звукоизоляции, что полезно в автомобилестроении и строительстве.',
  },
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper pkm-advantages">
      <div class="uslugi-table-title">Преимущества</div>

      <div class="advantages-grid">
        <div v-for="advantage in advantages" :key="advantage.title" class="advantage-card">
          <div class="advantage-title">{{ advantage.title }}</div>
          <div class="advantage-text">{{ advantage.text }}</div>
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

.pkm-advantages {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.advantages-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.advantage-card {
  background-color: var(--bgcolor);
  border-radius: 10px;
  min-height: 200px;
  padding: 20px;
}

.advantage-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  line-height: 1.05;
  margin-bottom: 20px;
}

.advantage-text {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 20px;
  line-height: 1.25;
}

@media (max-width: 1200px) {
  .advantage-card {
    min-height: auto;
  }
}

@media (max-width: 767px) {
  .uslugi-wrapper {
    padding: 20px;
  }

  .advantages-grid {
    grid-template-columns: 1fr;
  }

  .advantage-title {
    font-size: 22px;
  }

  .advantage-text {
    font-size: 18px;
  }
}
</style>
