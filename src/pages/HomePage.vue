<script setup lang="ts">
import { ref } from "vue";
import SectionAbility from "../components/SectionAbility.vue";

const h: string = "Производство по требованию";
const input = ref("");
</script>

<template>
  <!-- Section Upload-->
  <el-row
    :gutter="20"
    style="background-color: #eee; padding: 30px 0 20px 0; min-height: 500px"
  >
    <el-col :span="8" :offset="2">
      <h1 style="font-size: 40px">{{ h.toUpperCase() }}</h1>
      <p style="font-size: 24px">
        Получите доступ к огромному выбору производственных процессов,
        материалов и отделки.
      </p>
      <p style="font-size: 24px">
        Мы предоставляем управление программами, консультации по DFM и
        управление цепочками поставок.
      </p>
      <el-button
        type="primary"
        plain
        style="
          background-color: #be2a44;
          color: white;
          font-size: 24px;
          padding: 24px;
        "
      >
        Оставить заявку
      </el-button>
    </el-col>
    <el-col :offset="2" :span="10" style="text-align: center">
      <h1>Загрузите Вашу 3D модель</h1>
      <p>Перетащите файл (.stl,.obj) в область ниже или кликните для выбора.</p>
      <el-upload
        class="upload-demo"
        drag
        action="http://mdgkd-vlabal.int.kronshtadt.ru:7000/calculate-volume/"
        multiple
      >
        <div class="el-upload__text" style="height: 100px; font-size: 24px">
          Загрузить ваши файлы
        </div>
        <div class="el-upload__text" style="height: 70px; font-size: 24px">
          <div style="color: black">STEP STP SLDPRT STL DXR</div>
          <div style="color: black">IPT X_T X_B 3DXML CATPART PRT SAT 3MF</div>
        </div>
        <template #tip>
          <div class="el-upload__tip" style="font-size: 20px; color: black">
            Сертификация по ISO ISO 9001:2015, ISO 13485:2016 и ГОСТ
          </div>
        </template>
      </el-upload>
      <el-button
        type="primary"
        plain
        style="
          margin: 20px 0;
          background-color: #aaa;
          color: white;
          font-size: 24px;
          padding: 24px;
        "
        @click="$router.push('/machining')"
      >
        Калькулятор стоимости изделия
      </el-button>
    </el-col>
  </el-row>

  <SectionAbility />

  <!-- Section Advantages -->
  <el-row
    :gutter="20"
    style="background-color: #eee; padding-top: 30px; height: 500px"
  >
    <el-col :offset="2" :span="20">
      <h1>Преимущества работы с нами</h1>
    </el-col>
  </el-row>
  <!-- Section How Work -->
  <el-row
    :gutter="20"
    style="background-color: #fff; padding-top: 30px; height: 500px"
  >
    <el-col :offset="2" :span="20">
      <h1>Как это работает?</h1>
    </el-col>
  </el-row>
  <!-- Section Email -->
  <el-row
    :gutter="20"
    style="background-color: #444; padding-top: 30px; height: 200px"
  >
    <el-col :offset="2" :span="7">
      <div style="font-size: 30px; color: white">
        Присоединяйтесь к нашей команде
      </div>
    </el-col>
    <el-col :offset="1" :span="7">
      <el-input placeholder="Ваш e-mail" v-model="input"></el-input>
    </el-col>
    <el-col :offset="1" :span="6" style="display: block">
      <el-button
        type="primary"
        plain
        style="background-color: #444; color: white; font-size: 20px"
      >
        Подписаться
      </el-button>
    </el-col>
  </el-row>
</template>
