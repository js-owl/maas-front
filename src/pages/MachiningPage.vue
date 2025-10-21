<script lang="ts" setup>
import { ref } from "vue";
import IconDrawing from "../icons/IconDrawing.vue";

const items = ref([
  { id: 1, text: "Точение цилиндрических и конусных поверхностей" },
  { id: 2, text: "Нарезание резьбы (метрической, дюймовой, трапецеидальной)" },
  { id: 3, text: "Снятие фасок, канавок и пазов" },
  { id: 4, text: "Наружное и внутреннее точение, резьба" },
  { id: 5, text: "Высокоточное сверление и обработка отверстий, расточка" },
  { id: 6, text: "Фасонная обработка торцевых и сложных поверхностей" },
]);
</script>

<template>
  <el-row :gutter="0" class="main-container">
    <!-- 1. Левая часть -->
    <el-col :offset="3" :span="8" :xs="{ span: 24, offset: 0 }" class="left-section">
      <div class="title-text">ПРИМЕНЕНИЕ</div>
      <div v-for="item in items" :key="item.id" class="items">
        <!-- <el-icon class="check-icon"><Check /></el-icon> -->
        <div style="padding-top: 5px">
          <el-image src="arrow.webp" fit="cover" class="check-img" />
        </div>
        <div>{{ item.text }}</div>
      </div>
      <div class="calculator-card">
        <div>
          <IconDrawing
            color="black"
            class="calculator-icon"
          />
        </div>
        <div
          class="calculator-text"
          @click="$router.push('/machining')"
        >
          Калькулятор стоимости токарной обработки
        </div>
      </div>
      <el-row>
        <el-col :span="12" :xs="24">
          <el-button
            type="primary"
            plain
            class="submit"
            @click="$router.push({ path: '/personal/orders' })"
          >
            < В меню
          </el-button>
        </el-col>
      </el-row>
    </el-col>

    <!-- 2. Правая часть -->
    <el-col :span="13" :xs="{ span: 24, offset: 0 }" class="right-section">
      <el-row>
        <el-col
          :offset="2"
          :span="17"
          :xs="{ span: 24, offset: 0 }"
          class="section-title"
        >
          <div>ТОКАРНАЯ ОБРАБОТКА</div>
        </el-col>
        <el-col
          :offset="2"
          :span="17"
          :xs="{ span: 24, offset: 0 }"
          class="section-description"
        >
          Токарная обработка представляет собой механическую операцию, при
          которой вращающаяся деталь обрабатывается режущим инструментом,
          последовательно снимающим слои материала. Технология позволяет
          создавать цилиндрические, конические и сложные профилированные
          поверхности с высокой степенью точности. Применяется в производстве
          металлических, пластиковых и других изделий, обеспечивая превосходное
          качество финишной обработки.
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :offset="2"
          :span="17"
          :xs="{ span: 24, offset: 0 }"
          class="section-title"
        >
          <div>ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ</div>
        </el-col>
      </el-row>
      <el-row class="requirements-row">
        <el-col :offset="2" :span="8" :xs="{ span: 24, offset: 0 }">
          <div class="mark">Оборудование</div>
          <div class="mark-text">Токарно-винторезные станки</div>
          <div class="mark-text">Станок с ЧПУ</div>
        </el-col>
        <el-col :offset="1" :span="8" :xs="{ span: 24, offset: 0 }">
          <div class="mark">Размеры детали/ заготовки</div>
          <div class="mark-text">Длина до 1000 мм</div>
          <div class="mark-text">Диаметр до 600 мм</div>
        </el-col>
      </el-row>
      <el-row class="requirements-row">
        <el-col :offset="2" :span="8" :xs="{ span: 24, offset: 0 }">
          <div class="mark">Материалы</div>
          <div class="mark-text">Нержавеющие, легированные стали</div>
          <div class="mark-text">Полиамиды, фторопласт</div>
          <div class="mark-text">Алюминиевые, бронзовые, медные сплавы</div>
        </el-col>
        <el-col :offset="1" :span="8" :xs="{ span: 24, offset: 0 }"> </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
/* Основные цвета и фоны */
.main-container {
  min-height: 500px;
  background-color: var(--left-section-bg);
}

.left-section {
  padding: 30px 50px 40px 20px;
}

.right-section {
  background-color: #fff;
  padding-top: 30px;
}

/* Текстовые стили */
.title-text {
  color: var(--left-section-color);
  font-size: 38px;
  font-weight: 600;
  padding-bottom: 30px;
}

.items {
  display: flex;
  color: var(--left-section-color);
  padding-bottom: 30px;
  font-size: 24px;
}
.check-img {
  width: 38px;
  height: 38px;
  margin-right: 25px;
}
.mark {
  background-color: #d1e5ff;
  padding: 10px;
  width: fit-content;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  border-radius: 5px;
}
.mark-text {
  padding-bottom: 10px;
  font-size: 18px;
}

.submit {
  background-color: var(--upper-menu-bg);
  border: 1px solid white;
  color: white;
  font-size: 26px;
  padding: 30px 0;
  width: 100%;
}

.calculator-card {
  display: flex;
  margin-top: 50px;
  padding: 15px;
  background-color: white;
  width: 350px;
  margin-bottom: 30px;
}

.calculator-icon {
  display: block;
  width: 100px;
  height: 100px;
  padding-right: 20px;
}

.calculator-text {
  font-size: 22px;
  cursor: pointer;
}

.section-title {
  font-size: 38px;
  font-weight: 600;
  padding-bottom: 30px;
}

.section-description {
  padding-bottom: 40px;
  font-size: 24px;
}

.requirements-row {
  padding-bottom: 30px;
}

@media (max-width: 767px) {
  .main-container {
    min-height: auto;
  }

  .left-section {
    padding: 16px 12px 24px 12px;
  }

  .right-section {
    padding-top: 16px;
  }

  .title-text {
    font-size: 28px;
    text-align: center;
    padding-bottom: 16px;
  }

  .items {
    font-size: 18px;
    padding-bottom: 16px;
  }

  .check-img {
    width: 28px;
    height: 28px;
    margin-right: 16px;
  }

  .calculator-card {
    width: 100%;
    margin-top: 24px;
    margin-bottom: 16px;
    padding: 12px;
  }

  .calculator-icon {
    width: 60px;
    height: 60px;
    padding-right: 12px;
  }

  .calculator-text {
    font-size: 16px;
  }

  .submit {
    font-size: 18px;
    padding: 16px 0;
  }

  .section-title {
    font-size: 24px;
    padding-bottom: 16px;
    text-align: center;
  }

  .section-description {
    font-size: 16px;
    padding-bottom: 24px;
    text-align: center;
  }

  .requirements-row {
    padding-bottom: 16px;
  }

  .mark {
    font-size: 14px;
    padding: 8px;
    margin-bottom: 12px;
  }

  .mark-text {
    font-size: 14px;
    padding-bottom: 6px;
  }
}
</style>
