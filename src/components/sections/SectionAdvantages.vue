<script setup lang="ts">
import { ref } from 'vue'

const advantages = ref([
  {
    id: 1,
    title: 'Скорость',
    text: 'Мы работаем максимально быстро и качественно, вы получаете результаты точно в назначенные сроки',
    image: 'homePage/ability_mechanical.webp',
  },
  {
    id: 2,
    title: 'Доставка',
    text: 'Вам больше не нужно беспокоиться о логистике – мы сами надежно упакуем и доставим вам готовую продукцию',
    image: 'homePage/ability_composite.webp',
  },
  {
    id: 3,
    title: 'Проверенные материалы и оборудование',
    text: 'Мы гарантируем качество и работаем только с надежными поставщиками материалов и оборудования',
    image: 'homePage/ability_painting.webp',
  },
  {
    id: 4,
    title: 'Гибкость',
    text: 'Наши специалисты помогут найти все необходимые решения, учтут ваши пожелания и нюансы заказов.',
    image: 'homePage/ability_assembly.webp',
  }
])
</script>

<template>
  <section class="section-basic">
    <div class="advantages-title">НАШИ ПРЕИМУЩЕСТВА</div>

    <div class="items">
      <div class="item" v-for="advantage in advantages" :key="advantage.id">
        <div class="item-wrap">
          <div class="item-text-content">
            <div class="item-title">{{ advantage.title }}</div>
            <p class="item-text">{{ advantage.text }}</p>
          </div>
          <div class="item-image-container">
            <el-image
              :src="advantage.image"
              fit="cover"
              class="item-img"
            />
          </div>
        </div>
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
  /* gap: 1%; */
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.item {
  width: 46%;
  margin: 1%;
  border-radius: 5px;
  height: 300px;
}

.item-wrap {
  display: flex;
  /* align-items: center; */
  width: 100%;
  height: 100%;
  background-color: #e1e4e6;
  border-radius: 5px;
  overflow: hidden;
}

.item-text-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.item-image-container {
  width: 35%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-title {
  font-size: 26px;
  color: red;
  font-weight: bold;
  margin-bottom: 15px;
}

.item-text {
  font-size: 16px;
  color: #333;
  margin: 0;
  line-height: 1.4;
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
    margin: 5px 0;
    height: auto;
  }

  .item-wrap {
    flex-direction: column;
  }

  .item-text-content {
    padding: 15px;
    order: 2;
  }

  .item-image-container {
    width: 100%;
    height: 200px;
    order: 1;
  }

  .item-title {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .item-text {
    font-size: 14px;
  }
}
</style>
