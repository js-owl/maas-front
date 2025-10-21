<script lang="ts" setup>
import IconDrawing from "../icons/IconDrawing.vue";
</script>

<template>
  <div class="main-container">
    <!-- Основной контент -->
    <div class="content-wrapper">
      <!-- Заголовок -->
      <div class="main-title">ТОКАРНАЯ ОБРАБОТКА</div>
      
      <!-- Описание и калькулятор -->
      <div class="description-section">
        <div class="description-text">
          Токарная обработка представляет собой механическую операцию, при которой вращающаяся деталь обрабатывается режущим инструментом, последовательно снимающим слои материала. Технология позволяет создавать цилиндрические, конические и сложные профилированные поверхности с высокой степенью точности. Применяется в производстве металлических, пластиковых и других изделий, обеспечивая превосходное качество финишной обработки.
        </div>
        
        <div class="calculator-card">
          <IconDrawing
            color="black"
            class="calculator-icon"
          />
          <div
            class="calculator-text"
            @click="$router.push('/machining')"
          >
            Калькулятор стоимости токарной обработки
          </div>
        </div>
      </div>
      
      <!-- Технические требования -->
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
  </div>
</template>

<style scoped>
/* Основной контейнер */
.main-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 40px 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  gap: 40px;
  margin-bottom: 60px;
  align-items: flex-start;
}

.description-text {
  flex: 1;
  font-size: 18px;
  line-height: 1.6;
  color: #000;
  text-align: justify;
}

/* Калькулятор */
.calculator-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-width: 300px;
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
  font-size: 18px;
  font-weight: 500;
  color: #000;
  line-height: 1.4;
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
  font-size: 16px;
  color: #000;
  margin-bottom: 12px;
  line-height: 1.4;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 40px 60px;
  }
  
  .main-title {
    font-size: 40px;
  }
  
  .requirements-title {
    font-size: 32px;
  }
  
  .requirements-grid {
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 30px 40px;
    margin: 0 20px;
  }
  
  .main-title {
    font-size: 32px;
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
    font-size: 28px;
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

@media (max-width: 480px) {
  .content-wrapper {
    padding: 20px 24px;
    margin: 0 16px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .requirements-title {
    font-size: 24px;
  }
  
  .description-text {
    font-size: 15px;
  }
  
  .calculator-text {
    font-size: 15px;
  }
  
  .requirement-title {
    font-size: 15px;
  }
  
  .requirement-item {
    font-size: 14px;
  }
}
</style>
