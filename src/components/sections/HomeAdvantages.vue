<script setup lang="ts">
import { ref } from 'vue'

import imgQuality from '@/assets/advantage-quality.png'
import imgMaterials from '@/assets/advantage-materials.png'
import imgFlexibility from '@/assets/advantage-flexibility.png'
import imgDelivery from '@/assets/advantage-delivery.png'
import imgSpeed from '@/assets/advantage-speed.png'
import imgSecurity from '@/assets/advantage-security.png'

const advantages = ref([
  {
    id: 1,
    key: 'quality',
    title: 'Качество',
    text: 'Вы работаете напрямую с собственной сетью производств, мы гарантируем качество на каждом этапе выполнения заказа',
    image: imgQuality,
  },
  {
    id: 2,
    key: 'materials',
    title: 'Материалы',
    text: 'Мы гарантируем качество и работаем только с надежными поставщиками',
    image: imgMaterials,
  },
  {
    id: 3,
    key: 'flexibility',
    title: 'Гибкость',
    text: 'Специалисты учтут ваши пожелания и помогут найти оптимальные решения',
    image: imgFlexibility,
  },
  {
    id: 4,
    key: 'delivery',
    title: 'Доставка',
    text: 'Не беспокойтесь о логистике - мы сами позаботимся о доставке готовой продукции',
    image: imgDelivery,
  },
  {
    id: 5,
    key: 'speed',
    title: 'Скорость производства',
    text: 'Мы работаем быстро, чтобы вы получили заказ в точно назначенные сроки',
    image: imgSpeed,
  },
  {
    id: 6,
    key: 'security',
    title: 'Безопасность',
    text: 'Обеспечиваем конфиденциальность данных и надёжную защиту заказов на всех этапах',
    image: imgSecurity,
  },
])
</script>

<template>
  <section class="home-advantages">
    <div class="advantages-wrap">
      <h2 class="maas-title advantages-title">Наши преимущества</h2>

      <div class="items">
        <div
          v-for="advantage in advantages"
          :key="advantage.id"
          class="item"
          :class="`item--${advantage.key}`"
        >
          <div class="item-face item-face--front">
            <div class="item-head">
              <div class="maas-subtitle item-title">
                <template v-if="advantage.key === 'speed'">
                  Скорость<br />производства
                </template>
                <template v-else>{{ advantage.title }}</template>
              </div>
            </div>

            <div class="item-visual" aria-hidden="true">
              <img
                :src="advantage.image"
                alt=""
                class="item-visual-img"
                width="512"
                height="512"
              />
            </div>
          </div>

          <div class="item-face item-face--back">
            <div class="item-head">
              <div class="maas-subtitle item-title item-title--back">
                <template v-if="advantage.key === 'speed'">
                  Скорость<br />производства
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
/* Desktop — Figma 5067:2657 (1440) */
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25em;
  width: 100%;
}

.item {
  position: relative;
  background-color: #b82130;
  border-radius: 1.25em;
  padding: 1.875em;
  box-sizing: border-box;
  min-height: 17.5em;
  height: 17.5em;
  overflow: hidden;
  cursor: pointer;
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

.item-title--back {
  color: #596269;
  font-family: 'Montserrat-Black', sans-serif;
  font-weight: 800;
}

/* Figma 440×280 cards — visual frames absolute, overflow clipped */
.item-visual {
  position: absolute;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
}

.item-visual-img {
  display: block;
  position: absolute;
  max-width: none;
  object-fit: contain;
  pointer-events: none;
}

/* Качество: 258×259, bottom 0, right -12 */
.item--quality .item-visual {
  right: -2.727%;
  bottom: 0;
  width: 58.636%;
  height: 92.5%;
}

.item--quality .item-visual-img {
  left: 0.06%;
  top: 7.32%;
  width: 92.68%;
  height: 92.68%;
}

/* Материалы: 290×245, left 163, top 46 */
.item--materials .item-visual {
  left: 37.045%;
  top: 16.429%;
  width: 65.909%;
  height: 87.5%;
}

.item--materials .item-visual-img {
  left: 6.15%;
  top: -2.54%;
  width: 84.48%;
  height: 100%;
}

/* Гибкость: 276×233, left 164, top 47 */
.item--flexibility .item-visual {
  left: 37.273%;
  top: 16.786%;
  width: 62.727%;
  height: 83.214%;
}

.item--flexibility .item-visual-img {
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Доставка: 376×222, bottom -29, right -31 */
.item--delivery .item-visual {
  right: -7.045%;
  bottom: -10.357%;
  width: 85.455%;
  height: 79.286%;
}

.item--delivery .item-visual-img {
  left: 3.23%;
  top: 4.67%;
  width: 100%;
  height: 95.32%;
}

/* Скорость: 295×228, bottom -25, right -25 */
.item--speed .item-visual {
  right: -5.682%;
  bottom: -8.929%;
  width: 67.045%;
  height: 81.429%;
}

.item--speed .item-visual-img {
  left: 1.87%;
  top: 5.61%;
  width: 103.33%;
  height: 100.04%;
}

/* Безопасность: 273×225, bottom -18, right -27 */
.item--security .item-visual {
  right: -6.136%;
  bottom: -6.429%;
  width: 62.045%;
  height: 80.357%;
}

.item--security .item-visual-img {
  left: 4.68%;
  top: 7.57%;
  width: 95.35%;
  height: 92.64%;
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

/* Tablet — Figma 5067:2727 (960), cards 430×280, 2 columns */
@media (max-width: 1300px) and (min-width: 768px) {
  .advantages-wrap {
    padding: 2.5em;
    gap: 1.25em;
    border-radius: 2.5em;
    box-shadow: 0 0.375em 0.9375em rgba(224, 227, 237, 0.5);
  }

  .advantages-title {
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 1.25em;
    font-weight: 600;
    line-height: normal;
    color: #000000;
  }

  .items {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25em;
  }

  .item {
    min-height: 17.5em;
    height: 17.5em;
    padding: 1.875em;
    border-radius: 1.25em;
    background-color: #b82130;
    overflow: hidden;
  }

  .item-face--back {
    padding: 1.875em;
  }

  .item-title {
    font-family: 'Montserrat-Black', sans-serif;
    font-size: 1.75em;
    font-weight: 800;
    line-height: normal;
    text-transform: none;
  }

  .item-title--back {
    font-family: 'Montserrat-Black', sans-serif;
    font-weight: 800;
  }

  /* Tablet card 430×280 — image frames from Figma instances */
  .item--quality .item-visual {
    right: -2.791%;
    bottom: 0;
    width: 60%;
    height: 92.5%;
  }

  .item--materials .item-visual {
    left: 37.907%;
    top: 16.429%;
    width: 67.442%;
    height: 87.5%;
  }

  .item--flexibility .item-visual {
    left: 38.14%;
    top: 16.786%;
    width: 64.186%;
    height: 83.214%;
  }

  .item--delivery .item-visual {
    right: -7.209%;
    bottom: -10.357%;
    width: 87.442%;
    height: 79.286%;
  }

  .item--speed .item-visual {
    right: -5.814%;
    bottom: -8.929%;
    width: 68.605%;
    height: 81.429%;
  }

  .item--security .item-visual {
    right: -6.279%;
    bottom: -6.429%;
    width: 63.488%;
    height: 80.357%;
  }
}

/* Mobile — Figma 5067:2517 (360) */
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
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    color: #000000;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .item {
    height: auto;
    min-height: 0;
    padding: 16px;
    border-radius: 8px;
    background-color: #b82130;
    cursor: default;
  }

  .item-face--front {
    display: none;
  }

  .item-face,
  .item-face--back {
    height: auto;
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
    line-height: 1;
    letter-spacing: 0;
    text-transform: none;
    color: #ffffff;
  }

  .item-text {
    display: block;
    flex: none;
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    color: #ffffff;
  }
}
</style>
