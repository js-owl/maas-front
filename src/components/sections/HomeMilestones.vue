<script setup lang="ts">
import { ref } from 'vue'
import DialogLogin from '@/components/dialog/DialogLogin.vue'

import imgRegistration from '@/assets/milestone-registration.png'
import imgFiles from '@/assets/milestone-files.png'
import imgCalc from '@/assets/milestone-calc.png'
import imgFeedback from '@/assets/milestone-feedback.png'

type Step = {
  id: number
  key: string
  title: string
  description: string
  image: string
  highlightWord?: string
  highlightLink?: 'registration'
}

const isLoginVisible = ref(false)

const steps: Step[] = [
  {
    id: 1,
    key: 'registration',
    title: 'Регистрация',
    description: 'Быстрая регистрация позволит вам сохранять историю расчетов цены и оформлять заказы',
    image: imgRegistration,
    highlightWord: 'регистрация',
    highlightLink: 'registration',
  },
  {
    id: 2,
    key: 'files',
    title: 'Загрузите файлы',
    description:
      'Сервис работает с форматами 3D. Если модели нет, но у вас есть чертеж - загрузите его, и специалист свяжется с вами',
    image: imgFiles,
  },
  {
    id: 3,
    key: 'calc',
    title: 'Разместите заявку на расчет',
    description: 'Мы ценим ваше время и быстро расчитываем стоимость изготовления изделия',
    image: imgCalc,
  },
  {
    id: 4,
    key: 'feedback',
    title: 'Обратная связь',
    description: 'Финальный этап - подтверждения стоимости выполнения заказа и доставки',
    image: imgFeedback,
  },
]
</script>

<template>
  <section class="home-milestones">
    <div class="milestones-wrap">
      <h2 class="milestones-title">Как создать заказ?</h2>

      <div class="steps">
        <div
          v-for="step in steps"
          :key="step.id"
          class="step-card"
          :class="`step-card--${step.key}`"
        >
          <div class="step-face step-face--front">
            <div class="step-title">
              <span class="step-title-number">{{ step.id }}.</span>
              {{ step.title }}
            </div>

            <div class="step-gears" aria-hidden="true">
              <img
                :src="step.image"
                alt=""
                class="step-gears-img"
                width="1254"
                height="1254"
              />
            </div>
          </div>

          <div class="step-face step-face--back">
            <div class="step-title">
              <span class="step-title-number">{{ step.id }}.</span>
              {{ step.title }}
            </div>

            <p class="step-description">
              <template v-if="step.highlightWord">
                {{ step.description.split(step.highlightWord)[0] }}
                <button
                  v-if="step.highlightLink === 'registration'"
                  type="button"
                  class="step-description-highlight step-description-link"
                  @click="isLoginVisible = true"
                >
                  {{ step.highlightWord }}
                </button>
                <span v-else class="step-description-highlight">{{ step.highlightWord }}</span>
                {{ step.description.split(step.highlightWord)[1] }}
              </template>
              <template v-else>{{ step.description }}</template>
            </p>
          </div>
        </div>
      </div>
    </div>
    <DialogLogin v-model="isLoginVisible" />
  </section>
</template>

<style scoped>
/* Desktop — Figma 5067:2665 (1440), cards 325×336 */
.home-milestones {
  margin: 0 0 2.5em;
  padding: 0;
}

.milestones-wrap {
  background-color: #ffffff;
  border-radius: 2.5em;
  padding: 2.5em;
  display: flex;
  flex-direction: column;
  gap: 1.25em;
  box-shadow: 0 0.375em 0.9375em rgba(224, 227, 237, 0.5);
  box-sizing: border-box;
}

.milestones-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 1.25em;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25em;
  height: auto;
}

.step-card {
  position: relative;
  background-color: var(--button-bg, #cbd1d5);
  border-radius: 1.25em;
  padding: 1.875em;
  height: 21em;
  min-height: 15em;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
}

.step-face {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.step-face--front {
  position: static;
  z-index: 1;
  gap: 0;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.step-face--back {
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
  .step-card:hover .step-face--front {
    opacity: 0;
  }

  .step-card:hover .step-face--back {
    opacity: 1;
    pointer-events: auto;
  }
}

.step-title {
  margin: 0;
  flex: none;
  width: 100%;
  font-family: 'Montserrat-Bold', sans-serif;
  font-size: 1.75em;
  font-weight: 700;
  line-height: normal;
  color: var(--gray-footer, #55585b);
  text-transform: none;
  word-break: break-word;
  position: relative;
  z-index: 1;
}

.step-title-number {
  display: none;
}

/* Figma image frames — absolute, overflow clipped */
.step-gears {
  position: absolute;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
}

.step-gears-img {
  display: block;
  position: absolute;
  max-width: none;
  object-fit: contain;
  pointer-events: none;
}

/* Регистрация: 297×264, right 0, bottom -5 */
.step-card--registration .step-gears {
  right: 0;
  bottom: -1.4881%;
  width: 91.3846%;
  height: 78.5714%;
}

.step-card--registration .step-gears-img {
  left: 13.64%;
  top: 9.74%;
  width: 77.5%;
  height: 87.25%;
}

/* Загрузите файлы: 308×248, right -13, bottom 0 */
.step-card--files .step-gears {
  right: -4%;
  bottom: 0;
  width: 94.7692%;
  height: 73.8095%;
}

.step-card--files .step-gears-img {
  left: 10.88%;
  top: 2.02%;
  width: 78.9%;
  height: 97.98%;
}

/* Разместите заявку: 319×268, right -13, bottom 4 */
.step-card--calc .step-gears {
  right: -4%;
  bottom: 1.1905%;
  width: 98.1538%;
  height: 79.7619%;
}

.step-card--calc .step-gears-img {
  left: 10.66%;
  top: 10.04%;
  width: 79.88%;
  height: 95.18%;
}

/* Обратная связь: 229×229, right 0, bottom -5 */
.step-card--feedback .step-gears {
  right: 0;
  bottom: -1.4881%;
  width: 70.4615%;
  height: 68.1548%;
}

.step-card--feedback .step-gears-img {
  left: -2.57%;
  top: -2.12%;
  width: 102.61%;
  height: 100%;
}

.step-description {
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

.step-description-highlight {
  color: #000000;
  font-family: inherit;
  font-weight: 500;
}

.step-description-link {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: #000000;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.125em;
}

.step-description-link:hover {
  text-decoration: none;
}

/* Tablet — Figma 5067:2735 (960), cards 430×336, 2 columns */
@media (max-width: 1300px) and (min-width: 768px) {
  .milestones-wrap {
    padding: 2.5em;
    gap: 1.25em;
    border-radius: 2.5em;
    box-shadow: 0 0.375em 0.9375em rgba(224, 227, 237, 0.5);
  }

  .milestones-title {
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 1.25em;
    font-weight: 600;
    line-height: normal;
    color: #000000;
  }

  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25em;
  }

  .step-card {
    min-height: 15em;
    height: 21em;
    padding: 1.875em;
    border-radius: 1.25em;
    background-color: var(--button-bg, #cbd1d5);
    overflow: hidden;
  }

  .step-face--back {
    padding: 1.875em;
  }

  .step-title {
    font-family: 'Montserrat-Bold', sans-serif;
    font-size: 1.75em;
    font-weight: 700;
    line-height: normal;
    color: var(--gray-footer, #55585b);
    text-transform: none;
  }

  .step-description {
    font-size: 1em;
  }

  .step-card--registration .step-gears {
    right: 0;
    bottom: -1.4881%;
    width: 69.0698%;
    height: 78.5714%;
  }

  .step-card--files .step-gears {
    right: -3.0233%;
    bottom: 0;
    width: 71.6279%;
    height: 73.8095%;
  }

  .step-card--calc .step-gears {
    right: -3.0233%;
    bottom: 1.1905%;
    width: 74.186%;
    height: 79.7619%;
  }

  .step-card--feedback .step-gears {
    right: 0;
    bottom: -1.4881%;
    width: 53.2558%;
    height: 68.1548%;
  }
}

@media (max-width: 767px) {
  .home-milestones {
    margin-bottom: 0;
  }

  .milestones-wrap {
    border-radius: 16px;
    padding: 16px;
    gap: 16px;
    box-shadow: 0 0 5px #c8cfe3;
  }

  .milestones-title {
    font-size: 14px;
    color: #000000;
  }

  .steps {
    grid-template-columns: 1fr;
    height: auto;
    gap: 8px;
  }

  .step-card {
    height: auto;
    min-height: 0;
    width: 100%;
    padding: 16px;
    background-color: #9bacb9;
    border-radius: 8px;
    border-left: none;
    overflow: visible;
    cursor: default;
  }

  .step-face--front {
    display: none;
  }

  .step-face--back {
    position: static;
    inset: auto;
    padding: 0;
    border-radius: 0;
    background-color: transparent;
    gap: 10px;
    opacity: 1;
    pointer-events: auto;
  }

  .step-title {
    font-family: 'Montserrat-Bold', sans-serif;
    font-weight: 700;
    font-size: 16px;
    text-transform: none;
    color: #596269;
  }

  .step-description {
    font-size: 12px;
    line-height: normal;
    color: #000000;
  }

  .step-description-highlight,
  .step-description-link {
    color: #000000;
    text-decoration: none;
  }
}
</style>
