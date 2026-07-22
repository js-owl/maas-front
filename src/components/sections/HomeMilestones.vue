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
          <div class="step-content">
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
  margin: 0 0 40px;
  padding: 0;
}

.milestones-wrap {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 11px 15px var(--button-bg);
  box-sizing: border-box;
}

.milestones-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: normal;
  color: #c84359;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  height: 300px;
}

.step-card {
  background-color: var(--bgcolor);
  border-radius: 20px;
  padding: 30px 20px;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
}

.step-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
  text-transform: uppercase;
  word-break: break-word;
}

.step-title-number {
  margin-right: 0.25em;
}

.step-description {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  word-break: break-word;
}

.step-description-highlight {
  color: #e84261;
  font-family: inherit;
  font-weight: 500;
}

.step-description-link {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: #e84261;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.step-description-link:hover {
  text-decoration: none;
}

@media (max-width: 1300px) and (min-width: 769px) {
  .milestones-wrap {
    padding: 40px;
    gap: 20px;
    border-radius: 40px;
    box-shadow: 0 6px 15px rgba(224, 227, 237, 0.5);
  }

  .milestones-title {
    font-size: 20px;
    color: #000000;
  }

  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    height: auto;
  }

  .step-card {
    min-height: 240px;
    height: 336px;
    padding: 20px;
    border-radius: 20px;
    background-color: #9bacb9;
  }

  .step-content {
    gap: 40px;
    justify-content: flex-start;
  }

  .step-title {
    font-family: 'Montserrat-Black', sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.4;
    text-transform: none;
    color: #596269;
  }

  .step-title-number {
    display: none;
  }

  .step-description {
    font-size: 16px;
    color: #596269;
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
    gap: 16px;
  }

  .step-card {
    min-height: 0;
    padding: 4px 0 4px 16px;
    background-color: transparent;
    border-radius: 0;
    border-left: 4px solid #e84261;
  }

  .step-content {
    gap: 10px;
    justify-content: flex-start;
  }

  .step-title {
    font-size: 14px;
    text-transform: none;
    color: #e84261;
  }

  .step-description {
    font-size: 12px;
    line-height: normal;
  }

  .step-description-link {
    text-decoration: none;
  }
}
</style>
