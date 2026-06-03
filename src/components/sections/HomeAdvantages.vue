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

              <div class="maas-subtitle item-title">{{ advantage.title }}</div>

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

  margin: 0 0 40px;

  padding: 0;

}



.advantages-wrap {

  background-color: #ffffff;

  border-radius: 20px;

  padding: 40px;

  display: flex;

  flex-direction: column;

  gap: 24px;

  box-shadow: 0 11px 7.5px var(--button-bg);

  box-sizing: border-box;

}



.advantages-title {

  margin: 0;

  font-family: 'Montserrat-SemiBold', sans-serif;

  font-size: 24px;

  font-weight: 600;

  line-height: normal;

  color: #d4354f;

}



.items {

  display: flex;

  flex-direction: column;

  gap: 20px;

  width: 100%;

}



.item {

  background-color: #d4354f;

  border-radius: 20px;

  padding: 30px;

  box-sizing: border-box;

}



.item-row {

  display: flex;

  gap: 40px;

  align-items: center;

  width: 100%;

}



.item-head {

  display: flex;

  flex: 1 1 0;

  gap: 20px;

  align-items: center;

  min-width: 0;

}



.item-number {

  flex-shrink: 0;

  box-sizing: border-box;

  width: 50px;

  height: 50px;

  padding: 10px;

  border-radius: 10px;

  background-color: rgba(255, 255, 255, 0.5);

  display: flex;

  align-items: center;

  justify-content: center;

  font-family: 'Montserrat-SemiBold', sans-serif;

  font-size: 36px;

  font-weight: 600;

  line-height: normal;

  color: #d4354f;

  text-align: center;

}



.item-title {

  margin: 0;

  flex: 1 1 0;

  min-width: 0;

  font-family: 'Montserrat-Black', sans-serif;

  font-size: 24px;

  font-weight: 700;

  line-height: normal;

  color: #ffffff;

  text-transform: uppercase;

  word-break: break-word;

}



.item-text {

  margin: 0;

  flex: 0 1 650px;

  max-width: 650px;

  min-width: 0;

  font-family: 'Montserrat-SemiBold', sans-serif;

  font-size: 24px;

  font-weight: 600;

  line-height: normal;

  color: #ffffff;

  word-break: break-word;

}



@media (max-width: 767px) {

  .home-advantages {

    margin-bottom: 40px;

  }



  .advantages-wrap {

    border-radius: 0;

    padding: 20px;

    gap: 20px;

  }



  .advantages-title {

    font-size: 24px;

  }



  .item {

    padding: 30px 20px;

  }



  .item-row {

    flex-direction: column;

    align-items: flex-start;

    gap: 20px;

  }



  .item-head {

    width: 100%;

  }



  .item-text {

    flex: 1 1 auto;

    max-width: 100%;

    font-size: 24px;

  }

}

</style>

