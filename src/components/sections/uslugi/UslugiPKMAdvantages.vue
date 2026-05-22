<script lang="ts" setup>
const advantages = [
  {
    title: 'Прочность и легкость',
    text: 'Способность выдерживать значительные нагрузки при минимальном весе. Меньшая масса по сравнению со сталью и алюминием снижает энергопотребление и повышает эффективность.',
  },
  {
    title: 'Электроизоляция / электропроводность',
    text: 'Хорошая электроизоляционная способность подходит для элементов и корпусов в электронике и электроэнергетике.',
  },
  {
    title: 'Сопротивление коррозии',
    text: 'Высокая устойчивость к агрессивным средам делает композиты идеальными для морской промышленности и строительства.',
  },
  {
    title: 'Гибкость в формировании',
    text: 'Композиты легко принимают разные формы, давая свободу для инновационных продуктов. Лёгкая подгонка под разные формы и размеры при создании сложной геометрии.',
  },
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="pkm-advantages">
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
.pkm-advantages {
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  padding: 40px;
}

.pkm-advantages .uslugi-table-title {
  line-height: 29px;
  margin: 0;
}

.advantages-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.advantage-card {
  background-color: var(--bgcolor);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 200px;
  padding: 20px;
}

.advantage-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  line-height: 1.05;
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
  .pkm-advantages {
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
