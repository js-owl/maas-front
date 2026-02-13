<script lang="ts" setup>
import MachLathe from '../sections/MachLathe.vue'
</script>

<template>
  <div class="main-container">

    <el-row>
      <MachLathe />
      <!-- Фрезерная обработка -->
      <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
        <div class="content-wrapper">

          <div class="main-title">ФРЕЗЕРНАЯ ОБРАБОТКА</div>

          <!-- Описание и калькулятор фрезерной обработки -->
          <div class="description-section">
            <div class="description-text">
              Фрезерная обработка представляет собой технологический процесс, при котором
              специальный режущий инструмент (фреза) вращается и удаляет материал, создавая изделия
              заданной конфигурации. Методика эффективна как для изготовления плоских элементов, так
              и для формирования трёхмерных объектов. Она обеспечивает прецизионную точность и
              широко применяется при работе с различными материалами: металлами, полимерами,
              древесиной.
            </div>

            <div class="calculator-card" @click="$router.push('/milling')">
              <div class="calculator-text">Калькулятор стоимости фрезерной обработки</div>
              <img src="/calc.webp" alt="calculator icon" class="calculator-icon" />
            </div>
          </div>

          <!-- Технические требования фрезерной обработки -->
          <div class="technical-requirements">
            <div class="requirements-title">ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ</div>

            <div class="requirements-grid">
              <div class="requirement-column">
                <div class="requirement-title">Оборудование</div>
                <div class="requirement-item">Универсальные станки</div>
                <div class="requirement-item">Станки ЧПУ, 5-осевой</div>
                <div class="requirement-item"></div>
                <div class="requirement-item">Станки ЧПУ, 3-осевой</div>
                <div class="requirement-item">Фрезерно-гравировальный станок</div>
              </div>

              <div class="requirement-column">
                <div class="requirement-title">Максимальный размер</div>
                <div class="requirement-item">до 1400 мм (Д х Ш х В)</div>
                <div class="requirement-item">max: 13 866 × 1571 × 1150 мм (дерево)</div>
                <div class="requirement-item">max: 4 200 x 3200 х 1250 мм (металл)</div>
                <div class="requirement-item">max: 4 200 x 3200 х 1250 мм (металл)</div>
                <div class="requirement-item">max: 2 200 x 1610 мм (металл)</div>
                <div class="requirement-item">max: 4 000 × 2070 мм (дерево)</div>
              </div>

              <div class="requirement-column">
                <div class="requirement-title">Материалы</div>
                <div class="requirement-item">Алюминиевые сплавы</div>
                <div class="requirement-item">Сталь</div>
                <div class="requirement-item">Дерево</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
/* Основной контейнер */
.main-container {
  /* min-height: 100vh; */
  background-color: var(--bgcolor);
  /* padding: 40px 0; */
}

.content-wrapper {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  padding: 60px 80px;
}

/* Заголовок */
.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 40px;
  text-align: left;
}

/* Секция описания */
.description-section {
  display: flex;
  gap: 120px;
  margin-bottom: 60px;
  align-items: flex-start;
}

.description-text {
  flex: 1;
  font-size: 22px;
  line-height: 1.6;
  color: #000;
  text-align: justify;
}

/* Калькулятор */
.calculator-card {
  display: flex;
  align-items: center;
  background-color: var(--whity);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 400px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.calculator-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.calculator-icon {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  flex-shrink: 0;
}

.calculator-text {
  font-size: 22px;
  font-weight: 500;
  color: #000;
  line-height: 1.4;
}

/* Разделитель между секциями */
.section-divider {
  height: 2px;
  background-color: #e0e0e0;
  margin: 60px 0;
  border-radius: 1px;
}

/* Технические требования */
.technical-requirements {
  margin-top: 40px;
}

.requirements-title {
  font-size: 36px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 40px;
  text-align: left;
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.requirement-column {
  display: flex;
  flex-direction: column;
}

.requirement-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
  background-color: #d1e5ff;
  padding: 12px 16px;
  border-radius: 6px;
  width: fit-content;
}

.requirement-item {
  height: 20px;
  font-size: 16px;
  color: #000;
  margin-bottom: 12px;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 30px 40px;
    margin: 0 0 40px 0;
  }

  .main-title {
    font-size: 28px;
    text-align: center;
    margin-bottom: 30px;
  }

  .description-section {
    flex-direction: column;
    gap: 30px;
    margin-bottom: 40px;
  }

  .description-text {
    font-size: 16px;
    text-align: left;
  }

  .calculator-card {
    min-width: auto;
    width: 100%;
    padding: 16px;
  }

  .calculator-icon {
    width: 60px;
    height: 60px;
    margin-right: 16px;
  }

  .calculator-text {
    font-size: 16px;
  }

  .requirements-title {
    font-size: 22px;
    text-align: center;
    margin-bottom: 30px;
  }

  .requirements-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .requirement-title {
    font-size: 16px;
    padding: 10px 14px;
    margin-bottom: 16px;
  }

  .requirement-item {
    font-size: 15px;
    margin-bottom: 10px;
  }
}
</style>
