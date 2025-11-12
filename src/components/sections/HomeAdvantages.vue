<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const advantages = ref([
  {
    id: 1,
    title: 'Скорость',
    text: 'Мы работаем максимально быстро и качественно, вы получаете результаты точно в назначенные сроки',
    image: 'homePage/adv_spark.png',
  },
  {
    id: 2,
    title: 'Доставка',
    text: 'Вам больше не нужно беспокоиться о логистике – мы сами надежно упакуем и доставим вам готовую продукцию',
    image: 'homePage/adv_car.png',
  },
  {
    id: 3,
    title: 'Проверенные материалы и оборудование',
    text: 'Мы гарантируем качество и работаем только с надежными поставщиками материалов и оборудования',
    image: 'homePage/adv_box.png',
  },
  {
    id: 4,
    title: 'Гибкость',
    text: 'Наши специалисты помогут найти все необходимые решения, учтут ваши пожелания и нюансы заказов.',
    image: 'homePage/adv_puzzle.png',
  },
])

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 767)
</script>

<template>
  <section class="section-basic">
    <div class="section-title">НАШИ ПРЕИМУЩЕСТВА</div>

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
              :fit="isMobile ? 'contain' : 'cover'"
              class="item-img"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.items {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.item {
  width: 49%;
  border-radius: 5px;
  height: 300px;
  margin-bottom: 22px;
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
  width: 40%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-img {
  /* width: 100%; */
  height: 60%;
  /* object-fit: cover; */
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
  .item {
    width: 100%;
    margin: 5px 0;
    height: 175px;
  }

  .item-text-content {
    padding: 10px;
    /* order: 2; */
  }

  .item-title {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .item-text {
    font-size: 14px;
  }

  .item-img {
    /* width: 100%; */
    height: 40%;
    /* object-fit: cover; */
  }
}
</style>
