<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const advantages = ref([
  {
    id: 1,
    title: 'Скорость',
    text: 'Мы работаем максимально быстро и качественно, вы получаете результаты в назначенные сроки',
    image: 'homePage/adv_spark.png',
  },
  {
    id: 2,
    title: 'Доставка',
    text: 'Больше не нужно беспокоиться о логистике - мы сами позаботимся о доставке готовой продукции',
    image: 'homePage/adv_car.png',
  },
  {
    id: 3,
    title: 'Проверенные материалы и оборудование',
    text: 'Вы получаете надежного партнера, который работает с лучшими поставщиками и гарантирует качество',
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
    <div class="maas-title">Наши преимущества</div>

    <div class="items">
      <div class="item" v-for="advantage in advantages" :key="advantage.id">
        <div class="item-wrap">
          <div class="item-text-content">
            <div class="maas-subtitle">{{ advantage.title }}</div>
            <p class="maas-text">{{ advantage.text }}</p>
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
  flex-wrap: wrap;
  gap: 22px 20px;
  margin-top: 20px;
}

.item {
  width: calc((100% - 20px) / 2);
  box-sizing: border-box;
  border-radius: 5px;
  height: 300px;
}

.item-wrap {
  display: flex;
  /* align-items: center; */
  width: 100%;
  height: 100%;
  background-color: var(--bgcolor);
  border-radius: 10px;
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
  width: 38%;
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
  font-size: 24px;
  color: black;
  font-weight: bold;
  margin-bottom: 40px;
}

.item-text {
  font-size: 20px;
  color: black;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 767px) {
  .items {
    row-gap: 10px;
    column-gap: 0;
  }

  .item {
    width: 100%;
    margin: 0;
    /* height: 175px; */
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
