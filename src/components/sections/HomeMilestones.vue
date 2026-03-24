<script setup lang="ts">
import { computed, markRaw, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
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
      'Сервис работает с форматами STEP, STP, STL. Если у вас нет модели, но готов чертеж - вы можете прислать его и с вами свяжется специалист.',
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
    description: 'Финальный этап - подтверждение стоимости выполнения заказа и доставки.',
  },
]

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 1024)
</script>

<template>
  <section class="section-basic home-milestones">
    <div class="milestones-container" :class="{ mobile: isMobile }">
        <div class="milestones-wrap">
        <div style="font-size: 38px; font-weight: 600; color: #000; text-align: left; padding-bottom: 10px;">Как создать заказ?</div>
        <div class="steps">
          <div v-for="step in steps" :key="step.id" class="step-card">
            <div class="step-number">
              <component :is="step.icon" />
            </div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
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
    </div>
    <DialogLogin v-model="isLoginVisible" />
  </section>
</template>

<style scoped>
.home-milestones {
  padding: 5px 0;
}

.milestones-container {
  width: 100%;
}

.milestones-wrap {
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.milestones-wrap.mobile {
  padding: 24px;
  gap: 24px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.steps-title {
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  line-height: 1.1;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}

.step-card {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 20px;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  align-items: center;
}

.step-number {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  background: #e0e0e0;
  color: #666666;
  font-weight: 700;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-title {
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  line-height: 1.2;
}

.step-description {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  line-height: 1.4;
}

.step-description-highlight {
  color: #c45c5c;
  font-weight: 700;
}

.step-description-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.step-description-link:hover {
  text-decoration: none;
}

@media (max-width: 1199px) {
  .milestones-wrap {
    padding: 32px;
    gap: 32px;
  }

  .steps-title {
    font-size: 36px;
  }

  .step-card {
    grid-template-columns: 70px 1fr;
    padding: 18px 20px;
  }

  .step-number {
    width: 64px;
    height: 64px;
    font-size: 36px;
  }
}

@media (max-width: 1023px) {
  .home-milestones {
    padding: 32px 0;
  }

  .milestones-wrap {
    padding: 24px;
    gap: 24px;
  }

  .steps-title {
    font-size: 32px;
  }
}

@media (max-width: 767px) {
  .home-milestones {
    padding: 24px 0;
  }

  .milestones-wrap {
    padding: 20px;
    gap: 20px;
  }

  .steps-title {
    font-size: 28px;
  }

  .step-card {
    grid-template-columns: 60px 1fr;
    gap: 16px;
    padding: 16px 18px;
  }

  .step-number {
    width: 56px;
    height: 56px;
    font-size: 32px;
  }

  .step-title {
    font-size: 16px;
  }

  .step-description {
    font-size: 13px;
  }
}
</style>

