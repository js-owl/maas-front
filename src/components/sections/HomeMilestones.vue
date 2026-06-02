<script setup lang="ts">
import { markRaw, ref } from 'vue'
import DialogLogin from '@/components/dialog/DialogLogin.vue'
import IconOne from '@/icons/IconOne.vue'
import IconTwo from '@/icons/IconTwo.vue'
import IconThree from '@/icons/IconThree.vue'
import IconFour from '@/icons/IconFour.vue'

type Step = {
  id: number
  icon: unknown
  title: string
  description: string
  highlightWord?: string
  highlightLink?: 'registration'
}

const isLoginVisible = ref(false)

const steps: Step[] = [
  {
    id: 1,
    icon: markRaw(IconOne),
    title: 'Регистрация',
    description: 'Быстрая регистрация позволит вам сохранять историю расчетов цены и оформлять заказы',
    highlightWord: 'регистрация',
    highlightLink: 'registration',
  },
  {
    id: 2,
    icon: markRaw(IconTwo),
    title: 'Загрузите файлы',
    description:
      'Сервис работает с форматами 3D. Если у нас нет модели, но есть чертеж - наш специалист свяжется с вами',
  },
  {
    id: 3,
    icon: markRaw(IconThree),
    title: 'Разместите заявку на расчет',
    description: 'Мы ценим ваше время и быстро рассчитываем стоимость изготовления детали',
  },
  {
    id: 4,
    icon: markRaw(IconFour),
    title: 'Обратная связь',
    description: 'Финальный этап - подтверждения стоимости выполнения заказа и доставки',
  },
]

</script>

<template>
  <section class="home-milestones">
    <div class="milestones-wrap">
      <h2 class="maas-title milestones-title">Как создать заказ?</h2>

      <div class="steps">
        <div v-for="step in steps" :key="step.id" class="step-card">
          <div class="step-content">
            <div class="maas-subtitle step-title">{{ step.title }}</div>
            <p class="maas-text step-description">
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

          <component :is="step.icon" class="step-icon" aria-hidden="true" focusable="false" />
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
}

.milestones-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: normal;
  color: #d4354f;
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
  font-size: 24px;
  line-height: normal;
  text-transform: uppercase;
  word-break: break-word;
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

.step-icon {
  display: none;
}

@media (max-width: 1199px) {
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    height: auto;
  }

  .step-card {
    min-height: 300px;
  }
}

@media (max-width: 767px) {
  .home-milestones {
    margin-bottom: 40px;
  }

  .milestones-wrap {
    border-radius: 0;
    padding: 20px;
    gap: 20px;
  }

  .milestones-title {
    font-size: 24px;
  }

  .steps {
    grid-template-columns: 1fr;
    height: auto;
  }

  .step-card {
    min-height: 0;
    padding: 30px 20px;
  }

  .step-title {
    font-size: 24px;
  }

  .step-description {
    font-size: 18px;
  }
}
</style>

