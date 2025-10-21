<script setup lang="ts">
import { ref } from 'vue'

const advantages = ref([
   
  {
    id: 1,
    title: 'Скорость',
    text: 'Мы работаем максимально быстро и качественно, вы получаете результаты точно в назначенные сроки',
  },
  {
    id: 2,
    title: 'Доставка',
    text: 'Вам больше не нужно беспокоиться о логистике – мы сами надежно упакуем и доставим вам готовую продукцию',
  },
  {
    id: 3,
    title: 'Проверенные материалы и оборудование',
    text: 'Мы гарантируем качество и работаем только с надежными поставщиками материалов и оборудования',
  },
  {
    id: 4,
    title: 'Гибкость',
    text: 'Наши специалисты помогут найти все необходимые решения, учтут ваши пожелания и нюансы заказов.',
  }

])
</script>

<template>
  <section class="section-basic">
    <div class="advantages-title">НАШИ ПРЕИМУЩЕСТВА</div>

    <div class="items">
      <div class="item" v-for="advantage in advantages" :key="advantage.id">
        <div class="item-title">{{ advantage.title }}</div>
        <p class="item-text">{{ advantage.text }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.advantages-title {
  text-align: center;
  font-size: 60px;
  color: #283d5b;
  padding: 40px 0;
}

.items {
  display: flex;
  gap: 1%;
  justify-content: space-between;
  flex-wrap: wrap;
}

.item {
  width: 47%;
  background-color: #e1e4e6;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  height: 300px;
}

.item-title {
  font-size: 26px;
  color: red;
  font-weight: bold;
}

.item-text {
  font-size: 22px;
}

@media (max-width: 767px) {
  .section-basic {
    padding-bottom: 24px;
  }

  .advantages-title {
    font-size: 28px;
    padding: 16px 0;
  }

  .item {
    width: 100%;
    padding-bottom: 10px;
    height: auto;
  }

  .item-title {
    font-size: 18px;
  }

  .item-text {
    font-size: 16px;
  }
}
</style>
