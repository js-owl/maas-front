<script lang="ts" setup></script>

<template>
  <!-- Токарная обработка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="content-wrapper">
      <div class="main-title">ТОКАРНАЯ ОБРАБОТКА</div>

      <div class="description-section">
        <div class="description-text">
          Токарная обработка представляет собой механическую операцию, при которой вращающаяся
          деталь обрабатывается режущим инструментом, последовательно снимающим слои материала.
          Технология позволяет создавать цилиндрические, конические и сложные профилированные
          поверхности с высокой степенью точности. Применяется в производстве металлических,
          пластиковых и других изделий, обеспечивая превосходное качество финишной обработки.
        </div>

        <div class="calculator-card" @click="$router.push('/other')">
          <div class="calculator-text">Калькулятор стоимости токарной обработки</div>
          <img src="/calc.webp" alt="calculator icon" class="calculator-icon" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="requirements-title">ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ</div>

        <div class="requirements-grid">
          <div class="requirement-column">
            <div class="requirement-title">Оборудование</div>
            <div class="requirement-item">Токарно-винторезные станки</div>
            <div class="requirement-item">Станок с ЧПУ</div>
          </div>

          <div class="requirement-column">
            <div class="requirement-title">Максимальный размер</div>
            <div class="requirement-item">Длина до 1000 мм</div>
            <div class="requirement-item">Диаметр до 600 мм</div>
          </div>

          <div class="requirement-column">
            <div class="requirement-title">Материалы</div>
            <div class="requirement-item">Нержавеющие, легированные стали</div>
            <div class="requirement-item">Полиамиды, фторопласт</div>
            <div class="requirement-item">Алюминиевые, бронзовые, медные сплавы</div>
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.content-wrapper {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  padding: 60px 80px;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 40px;
  text-align: left;
}

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
