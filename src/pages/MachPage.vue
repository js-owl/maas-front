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
    <el-col :offset="3" :span="8" class="left-section">
      <div class="title-text">ПРИМЕНЕНИЕ</div>
      <div v-for="item in items" :key="item.id" class="items">
        <!-- <el-icon class="check-icon"><Check /></el-icon> -->
        <div style="padding-top: 5px">
          <el-image src="arrow.webp" fit="cover" class="check-img" />
        </div>
        <div>{{ item.text }}</div>
      </div>
      <div
        style="
          display: flex;
          margin-top: 50px;
          padding: 15px;
          background-color: white;
          width: 350px;
          margin-bottom: 30px;
        "
      >
        <div>
          <IconDrawing
            color="black"
            style="
              display: block;
              width: 100px;
              height: 100px;
              padding-right: 20px;
            "
          />
        </div>
        <div
          style="font-size: 22px; cursor: pointer"
          @click="$router.push('/machining')"
        >
          Калькулятор стоимости токарной обработки
        </div>
      </div>
      <el-row>
        <el-col :span="12">
          <el-button
            type="primary"
            plain
            class="submit"
            @click="$router.push({ name: 'order-list' })"
          >
            < В меню
          </el-button>
        </el-col>
      </el-row>
    </el-col>

    <!-- 2. Правая часть -->
    <el-col :span="13" class="right-section">
      <el-row>
        <el-col
          :offset="2"
          :span="17"
          style="font-size: 38px; font-weight: 600; padding-bottom: 30px"
        >
          <div>ТОКАРНАЯ ОБРАБОТКА</div>
        </el-col>
        <el-col :offset="2" :span="17" style="padding-bottom: 40px">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis,
          tempora magni soluta delectus expedita perferendis quis rem quae id
          eos esse. Consequuntur obcaecati debitis, necessitatibus inventore
          fugiat aperiam natus veritatis officia sed, placeat totam recusandae
          sint perferendis. Sed repudiandae maxime molestiae sit et, sapiente
          nesciunt, itaque blanditiis tempora cum expedita cumque reiciendis?
          Maxime nostrum maiores alias assumenda molestias doloremque mollitia.
          Eveniet ab ad, ratione minima animi dolor accusamus qui nam tempora
          perferendis laboriosam, assumenda explicabo molestiae dolorum beatae
          culpa, commodi velit nostrum doloremque accusantium quod quae
          reprehenderit suscipit corrupti! Non tempore doloremque cumque ex
          optio facere aperiam cupiditate quibusdam eum?
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :offset="2"
          :span="17"
          style="font-size: 38px; font-weight: 600; padding-bottom: 30px"
        >
          <div>ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ</div>
        </el-col>
      </el-row>
      <el-row style="padding-bottom: 30px">
        <el-col :offset="2" :span="8">
          <div class="mark">Оборудование</div>
          <div class="mark-text">Токарно-винторезные станки</div>
          <div class="mark-text">Станок с ЧПУ</div>
        </el-col>
        <el-col :offset="1" :span="8">
          <div class="mark">Размеры детали/ заготовки</div>
          <div class="mark-text">Длина до 1000 мм</div>
          <div class="mark-text">Диаметр до 600 мм</div>
        </el-col>
      </el-row>
      <el-row style="padding-bottom: 30px">
        <el-col :offset="2" :span="8">
          <div class="mark">Материалы</div>
          <div class="mark-text">Нержавеющие, легированные стали</div>
          <div class="mark-text">Полиамиды, фторопласт</div>
          <div class="mark-text">Алюминиевые, бронзовые, медные сплавы</div>
        </el-col>
        <el-col :offset="1" :span="8"> </el-col>
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
</style>
