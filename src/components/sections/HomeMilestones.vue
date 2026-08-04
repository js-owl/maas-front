<script setup lang="ts">
import { ref } from 'vue'
import DialogLogin from '@/components/dialog/DialogLogin.vue'

type Step = {
  id: number
  title: string
  description: string
  highlightWord?: string
  highlightLink?: 'registration'
}

const isLoginVisible = ref(false)

const steps: Step[] = [
  {
    id: 1,
    title: 'Регистрация',
    description: 'Быстрая регистрация позволит вам сохранять историю расчетов цены и оформлять заказы',
    highlightWord: 'регистрация',
    highlightLink: 'registration',
  },
  {
    id: 2,
    title: 'Загрузите файлы',
    description:
      'Сервис работает с форматами 3D. Если модели нет, но у вас есть чертеж - загрузите его, и специалист свяжется с вами',
  },
  {
    id: 3,
    title: 'Разместите заявку на расчет',
    description: 'Мы ценим ваше время и быстро расчитываем стоимость изготовления изделия',
  },
  {
    id: 4,
    title: 'Обратная связь',
    description: 'Финальный этап - подтверждения стоимости выполнения заказа и доставки',
  },
]
</script>

<template>
  <section class="home-milestones">
    <div class="milestones-wrap">
      <h2 class="milestones-title">Как создать заказ?</h2>

      <div class="steps">
        <div v-for="step in steps" :key="step.id" class="step-card">
          <div class="step-face step-face--front">
            <div class="step-title">
              <span class="step-title-number">{{ step.id }}.</span>
              {{ step.title }}
            </div>

            <div class="step-gears" aria-hidden="true">
              <img
                src="@/assets/advantage-gears.png"
                alt=""
                class="step-gears-img"
                width="736"
                height="736"
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
  background-color: #9bacb9;
  border-radius: 1.25em;
  padding: 1.25em;
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
  position: relative;
  z-index: 1;
  gap: 2.5em;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.step-face--back {
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 1.25em;
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
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 1.75em;
  font-weight: 800;
  line-height: normal;
  color: #596269;
  text-transform: none;
  word-break: break-word;
}

.step-title-number {
  display: none;
}

.step-gears {
  position: relative;
  flex: none;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin: 0;
  pointer-events: none;
  user-select: none;
}

.step-gears-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
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

@media (max-width: 1300px) and (min-width: 769px) {
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .step-title {
    font-size: 1.5em;
    line-height: 1.4;
  }

  .step-description {
    font-size: 1em;
  }
}

@media (max-width: 768px) {
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
    font-family: 'Montserrat-SemiBold', sans-serif;
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
