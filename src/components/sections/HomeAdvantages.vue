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

    title: 'Проверенные материалы и оборудование',

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

          <div class="item-row">

            <div class="item-head">

              <div class="item-number" aria-hidden="true">{{ advantage.id }}</div>

              <div
                class="maas-subtitle item-title"
                :class="{ 'item-title--first': advantage.id === 1 }"
              >
                <template v-if="advantage.id === 4">
                  Проверенные материалы<br />и оборудование
                </template>
                <template v-else>{{ advantage.title }}</template>
              </div>

              <img
                src="@/assets/advantage-chevron.svg"
                alt=""
                class="item-chevron"
                aria-hidden="true"
                width="16"
                height="39"
              />

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
  border-radius: 1.25em;
  padding: 2.5em;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  box-shadow: 0 0.6875em 0.46875em var(--button-bg);
  box-sizing: border-box;
}

.advantages-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 1.5em;
  font-weight: 600;
  line-height: normal;
  color: #d4354f;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 1.25em;
  width: 100%;
}

.item {
  background-color: #d4354f;
  border-radius: 1.25em;
  padding: 1.875em;
  box-sizing: border-box;
}

.item-row {
  display: flex;
  gap: 2.5em;
  align-items: center;
  width: 100%;
}

.item-head {
  display: flex;
  flex: 1 1 0;
  gap: 1.25em;
  align-items: center;
  min-width: 0;
}

.item-number {
  flex-shrink: 0;
  box-sizing: border-box;
  width: 1.6em;
  height: 1.6em;
  padding: 0.2em;
  border: 0.0667em solid #ffffff;
  border-radius: 0.333em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 1.875em;
  font-weight: 500;
  line-height: normal;
  color: #ffffff;
  text-align: center;
}

.item-title {
  margin: 0;
  flex: 1 1 0;
  min-width: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 1.5em;
  font-weight: 600;
  line-height: normal;
  color: #ffffff;
  text-transform: uppercase;
  word-break: break-word;
}

.item-title--first {
  font-family: 'Montserrat-Medium', sans-serif;
  font-weight: 500;
}

.item-chevron {
  flex-shrink: 0;
  width: 1em;
  height: 2.4375em;
  display: block;
}

.item-text {
  margin: 0;
  flex: 1 1 0;
  min-width: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 1.5em;
  font-weight: 500;
  line-height: normal;
  color: #ffffff;
  word-break: break-word;
}



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
  }

  /* Порядок как в макете: Качество, Материалы, Гибкость, Доставка, Скорость */
  .item:nth-child(1) {
    order: 1;
  }

  .item:nth-child(4) {
    order: 2;
  }

  .item:nth-child(3) {
    order: 3;
  }

  .item:nth-child(5) {
    order: 4;
  }

  .item:nth-child(2) {
    order: 5;
    grid-column: 1 / -1;
  }

  .item-row {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0;
    height: 100%;
  }

  .item-head {
    width: 100%;
    flex: none;
  }

  .item-number,
  .item-chevron,
  .item-text {
    display: none;
  }

  .item-title {
    font-family: 'Montserrat-Black', sans-serif;
    font-size: 1.5em;
    font-weight: 800;
    line-height: 1.4;
    text-transform: none;
  }

  .item-title--first {
    font-family: 'Montserrat-Black', sans-serif;
    font-weight: 800;
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

    gap: 8px;

  }



  .item {

    padding: 16px;

    border-radius: 8px;

    background-color: #e84261;

  }



  .item-row {

    flex-direction: column;

    align-items: flex-start;

    gap: 8px;

  }



  .item-head {

    width: 100%;

  }



  .item-number,

  .item-chevron {

    display: none;

  }



  .item-title {

    font-size: 14px;

    font-family: 'Montserrat-SemiBold', sans-serif;

    font-weight: 600;

    line-height: normal;

    text-transform: none;

  }



  .item-title--first {

    font-family: 'Montserrat-SemiBold', sans-serif;

    font-weight: 600;

  }



  .item-text {

    font-size: 12px;

    line-height: normal;

  }

}

</style>
