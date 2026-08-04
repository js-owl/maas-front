<script setup lang="ts">
import { ref } from 'vue'

const advantages = ref([
  {
    id: 1,
    title: 'Качество',
    text: 'Вы работаете напрямую с собственной сетью производств, мы гарантируем качество на каждом этапе выполнения заказа',
  },
  {
    id: 2,
    title: 'Скорость производства',
    text: 'Мы работаем быстро, чтобы вы получили заказ в точно назначенные сроки',
  },
  {
    id: 3,
    title: 'Гибкость',
    text: 'Специалисты учтут ваши пожелания и помогут найти оптимальные решения',
  },
  {
    id: 4,
    title: 'Материалы и оборудование',
    text: 'Мы гарантируем качество и работаем только с надежными поставщиками',
  },
  {
    id: 5,
    title: 'Доставка',
    text: 'Не беспокойтесь о логистике - мы сами позаботимся о доставке готовой продукции',
  },
])
</script>

<template>
  <section class="home-advantages">
    <div class="advantages-wrap">
      <h2 class="maas-title advantages-title">Наши преимущества</h2>

      <div class="items">
        <div v-for="advantage in advantages" :key="advantage.id" class="item">
          <div class="item-face item-face--front">
            <div class="item-head">
              <div
                class="maas-subtitle item-title"
                :class="{ 'item-title--first': advantage.id === 1 }"
              >
                <template v-if="advantage.id === 4">
                  Материалы и оборудование
                </template>
                <template v-else>{{ advantage.title }}</template>
              </div>
            </div>

            <div class="item-gears" aria-hidden="true">
              <img
                src="@/assets/advantage-gears.png"
                alt=""
                class="item-gears-img"
                width="736"
                height="736"
              />
            </div>
          </div>

          <div class="item-face item-face--back">
            <div class="item-head">
              <div
                class="maas-subtitle item-title item-title--back"
                :class="{ 'item-title--first': advantage.id === 1 }"
              >
                <template v-if="advantage.id === 4">
                  Материалы и оборудование
                </template>
                <template v-else>{{ advantage.title }}</template>
              </div>
            </div>

            <p class="maas-text item-text">{{ advantage.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-advantages {
  margin: 0 0 2.5em;
  padding: 0;
}

.advantages-wrap {
  background-color: #ffffff;
  border-radius: 2.5em;
  padding: 2.5em;
  display: flex;
  flex-direction: column;
  gap: 1.25em;
  box-shadow: 0 0.375em 0.9375em rgba(224, 227, 237, 0.5);
  box-sizing: border-box;
}

.advantages-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 1.25em;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.items {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1.25em;
  width: 100%;
}

.item {
  position: relative;
  background-color: #e84261;
  border-radius: 1.25em;
  padding: 1.875em;
  box-sizing: border-box;
  min-height: 17.5em;
  height: 17.5em;
  overflow: hidden;
  cursor: pointer;
}

/* Порядок как в макете: Качество, Материалы, Гибкость, Доставка, Скорость */
.item:nth-child(1) {
  order: 1;
  grid-column: span 2;
}

.item:nth-child(4) {
  order: 2;
  grid-column: span 2;
}

.item:nth-child(3) {
  order: 3;
  grid-column: span 2;
}

.item:nth-child(5) {
  order: 4;
  grid-column: span 3;
}

.item:nth-child(2) {
  order: 5;
  grid-column: span 3;
}

.item-face {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.item-face--front {
  position: relative;
  z-index: 1;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.item-face--back {
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 1.875em;
  border-radius: inherit;
  background-color: #e0e3ed;
  gap: 1.25em;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

@media (hover: hover) and (pointer: fine) {
  .item:hover .item-face--front {
    opacity: 0;
  }

  .item:hover .item-face--back {
    opacity: 1;
    pointer-events: auto;
  }
}

.item-head {
  display: flex;
  width: 100%;
  flex: none;
  gap: 1.25em;
  align-items: center;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.item-title {
  margin: 0;
  flex: 1 1 0;
  min-width: 0;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 1.75em;
  font-weight: 800;
  line-height: normal;
  color: #ffffff;
  text-transform: none;
  word-break: break-word;
}

.item-title--first {
  font-family: 'Montserrat-Black', sans-serif;
  font-weight: 800;
}

.item-title--back {
  color: #596269;
  font-family: 'Montserrat-Black', sans-serif;
  font-weight: 800;
}

/* Figma: Image 380×380 in 440 card / 610×610 in 670 card — square, clipped by overflow */
.item-gears {
  position: relative;
  flex: none;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin: 0;
  pointer-events: none;
  user-select: none;
}

.item-gears-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
}

.item-text {
  margin: 0;
  flex: 1 1 0;
  min-width: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 1em;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  word-break: break-word;
}

/* Tablet 960: 2×2 + Скорость на всю ширину — Figma 5050:4495 */
@media (max-width: 1300px) and (min-width: 769px) {
  .advantages-wrap {
    padding: 2.5em;
    gap: 1.25em;
    border-radius: 2.5em;
    box-shadow: 0 0.375em 0.9375em rgba(224, 227, 237, 0.5);
  }

  .advantages-title {
    font-size: 1.25em;
    color: #000000;
  }

  .items {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25em;
  }

  .item {
    min-height: 12.5em;
    height: 17.5em;
    padding: 1.875em;
    border-radius: 1.25em;
    background-color: #e84261;
    overflow: hidden;
    grid-column: span 1;
  }

  /* Порядок: Качество, Материалы, Гибкость, Доставка, Скорость — по 2 в ряду */
  .item:nth-child(1) {
    order: 1;
    grid-column: span 1;
  }

  .item:nth-child(4) {
    order: 2;
    grid-column: span 1;
  }

  .item:nth-child(3) {
    order: 3;
    grid-column: span 1;
  }

  .item:nth-child(5) {
    order: 4;
    grid-column: span 1;
  }

  .item:nth-child(2) {
    order: 5;
    grid-column: 1 / -1;
  }

  .item-face--back {
    padding: 1.875em;
  }

  .item-title {
    font-family: 'Montserrat-Black', sans-serif;
    font-size: 1.5em;
    font-weight: 800;
    line-height: 1.4;
    text-transform: none;
  }

  .item-title--first,
  .item-title--back {
    font-family: 'Montserrat-Black', sans-serif;
    font-weight: 800;
  }

  .item-gears {
    display: block;
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    width: 100%;
    max-width: none;
    aspect-ratio: 1 / 1;
    margin: 0;
  }

  .item-gears-img {
    object-fit: contain;
    object-position: center center;
  }

  /* Скорость: как в макете — квадрат 1:1 на всю ширину, clip overflow (не absolute) */
  .item:nth-child(2) .item-gears {
    margin-top: 0.25em;
  }
}

@media (max-width: 767px) {
  .home-advantages {
    margin-bottom: 0;
  }

  .advantages-wrap {
    border-radius: 16px;
    padding: 16px;
    gap: 16px;
    box-shadow: 0 0 5px #c8cfe3;
  }

  .advantages-title {
    font-size: 14px;
    color: #000000;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .item {
    order: initial;
    grid-column: auto;
    height: auto;
    min-height: 0;
    padding: 16px;
    border-radius: 8px;
    background-color: #e84261;
    cursor: default;
  }

  .item-face--front {
    display: none;
  }

  .item-face--back {
    position: static;
    inset: auto;
    padding: 0;
    border-radius: 0;
    background-color: transparent;
    gap: 8px;
    opacity: 1;
    pointer-events: auto;
  }

  .item-head {
    width: 100%;
  }

  .item-title,
  .item-title--back {
    font-size: 16px;
    font-family: 'Montserrat-Black', sans-serif;
    font-weight: 800;
    line-height: normal;
    text-transform: none;
    color: #ffffff;
  }

  .item-title--first {
    font-family: 'Montserrat-Black', sans-serif;
    font-weight: 800;
  }

  .item-text {
    display: block;
    font-size: 12px;
    line-height: normal;
    color: #ffffff;
  }
}
</style>
