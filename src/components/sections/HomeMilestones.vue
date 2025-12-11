<script setup lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const steps = [
  {
    number: '1',
    title: 'РЕГИСТРАЦИЯ',
    description: 'Быстрая регистрация позволит вам сохранять историю расчетов цены и оформлять заказы',
  },
  {
    number: '2',
    title: 'ЗАГРУЗИТЕ 3D-МОДЕЛЬ',
    description:
      'Сервис работает с форматами STEP, STP, STL. Если у вас нет модели, но готов чертеж - вы можете прислать его и с вами свяжется специалист.',
  },
  {
    number: '3',
    title: 'ПОЛУЧИТЕ РАСЧЕТ',
    description: 'Мы ценим ваше время и мгновенно рассчитываем стоимость изготовления детали',
  },
  {
    number: '4',
    title: 'РАЗМЕСТИТЕ ЗАЯВКУ',
    description: 'При оформлении заявки на производство свяжемся с вами в течение 1 рабочего дня.',
  },
  {
    number: '5',
    title: 'ОБРАТНАЯ СВЯЗЬ',
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
        <div class="left-column">
          <div class="steps-title">КАК СОЗДАТЬ ЗАКАЗ?</div>
          <div class="illustration" aria-hidden="true">
            <div class="illustration-placeholder" />
          </div>
        </div>

        <div class="steps">
          <div v-for="step in steps" :key="step.number" class="step-card">
            <div class="step-number">{{ step.number }}</div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <p class="step-description">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  /* border: 1px solid #e5e5e5; */
  border-radius: 16px;
  padding: 40px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  align-items: start;
}

.milestones-wrap.mobile {
  grid-template-columns: 1fr;
  padding: 24px;
  gap: 24px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.illustration {
  width: 100%;
  background: #f5f5f5;
  border-radius: 12px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-placeholder {
  width: 90%;
  height: 85%;
  background: #e8e8e8;
  border-radius: 8px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.steps-title {
  font-size: 48px;
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
  font-weight: 700;
  color: #000000;
  line-height: 1.2;
}

.step-description {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  line-height: 1.4;
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
    grid-template-columns: 1fr;
    padding: 24px;
    gap: 24px;
  }

  .illustration {
    min-height: 280px;
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

  .illustration {
    min-height: 220px;
  }
}
</style>

