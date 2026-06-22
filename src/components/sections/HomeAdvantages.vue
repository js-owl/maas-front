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
              >{{ advantage.title }}</div>

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

  width: 48px;

  height: 48px;

  padding: 6px;

  border: 2px solid #ffffff;

  border-radius: 10px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-family: 'Montserrat-Medium', sans-serif;

  font-size: 30px;

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

  font-size: 24px;

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

  width: 16px;

  height: 39px;

  display: block;

}



.item-text {

  margin: 0;

  flex: 1 1 0;

  min-width: 0;

  font-family: 'Montserrat-Medium', sans-serif;

  font-size: 24px;

  font-weight: 500;

  line-height: normal;

  color: #ffffff;

  word-break: break-word;

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

    text-transform: none;

  }



  .item-title--first {

    font-family: 'Montserrat-SemiBold', sans-serif;

    font-weight: 600;

  }



  .item-text {

    font-size: 12px;

  }

}

</style>
