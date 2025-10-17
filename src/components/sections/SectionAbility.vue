<script setup lang="ts">
import { ref } from "vue";

const abilities = ref([
  {
    id: 1,
    image: "homePage/ability_mechanical.webp",
    title: "Механообрабатывающее производство",
    link: "/mechanical",
    fit: "cover",
    isDevelopment: false,
    span: 6,
    offset: 3,
  },
  {
    id: 2,
    image: "homePage/ability_composite.webp",
    title: "Производство изделий из композитных материалов",
    link: null,
    fit: "contain",
    isDevelopment: true,
    span: 6,
    offset: 0,
  },
  {
    id: 3,
    image: "homePage/ability_painting.webp",
    title: "Нанесение лакокрасочных покрытий",
    link: null,
    fit: "cover",
    isDevelopment: true,
    span: 6,
    offset: 0,
  },
  {
    id: 4,
    image: "homePage/ability_assembly.webp",
    title: "Сборочное производство",
    link: null,
    fit: "cover",
    isDevelopment: true,
    span: 6,
    offset: 3,
  },
  {
    id: 5,
    image: "homePage/ability_thermo.webp",
    title: "Лабораторные исследования",
    link: null,
    fit: "cover",
    isDevelopment: true,
    span: 6,
    offset: 0,
  },
  {
    id: 6,
    image: "homePage/ability_welding.webp",
    title: "Сварочное производство",
    link: null,
    fit: "cover",
    isDevelopment: true,
    span: 6,
    offset: 0,
  },
]);
</script>

<template>
  <section class="ability-section">
    <el-row :gutter="20">
      <el-col :offset="3" :span="18">
        <div class="ability-title">НАШИ ВОЗМОЖНОСТИ</div>
      </el-col>
    </el-row>

    <!-- Первый ряд -->
    <el-row :gutter="20">
      <el-col
        v-for="ability in abilities.slice(0, 3)"
        :key="ability.id"
        :offset="ability.offset"
        :span="ability.span"
        :xs="24"
      >
        <div class="item">
          <component
            :is="ability.link ? 'RouterLink' : 'div'"
            :to="ability.link"
          >
            <el-image
              :src="ability.image"
              :fit="ability.fit"
              :class="{ 'item-img': ability.id === 6 }"
            />

            <div v-if="ability.isDevelopment" class="overlay-development">
              <div class="development-text">
                <p class="main-text">Раздел в разработке</p>
              </div>
            </div>

            <div class="overlay">
              <p class="item-text">{{ ability.title }}</p>
            </div>
          </component>
        </div>
      </el-col>
    </el-row>

    <!-- Второй ряд -->
    <el-row :gutter="20" class="row-gap">
      <el-col
        v-for="ability in abilities.slice(3, 6)"
        :key="ability.id"
        :offset="ability.offset"
        :span="ability.span"
        :xs="24"
      >
        <div class="item">
          <component
            :is="ability.link ? 'RouterLink' : 'div'"
            :to="ability.link"
          >
            <el-image
              :src="ability.image"
              :fit="ability.fit"
              :class="{ 'item-img': ability.id === 6 }"
            />

            <div v-if="ability.isDevelopment" class="overlay-development">
              <div class="development-text">
                <p class="main-text">Раздел в разработке</p>
              </div>
            </div>

            <div class="overlay">
              <p class="item-text">{{ ability.title }}</p>
            </div>
          </component>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<style scoped>
.ability-section {
  background-color: #fff;
  padding-bottom: 40px;
  min-height: 600px;
}

.ability-title {
  text-align: center;
  font-size: 60px;
  color: #283d5b;
  padding: 40px 0;
}

.row-gap {
  margin-top: 15px;
}

.item {
  position: relative;
  width: 100%;
}
.item-img {
  width: 100%;
}
.overlay {
  position: absolute;
  bottom: 3px;
  left: 0px;
  right: 0px;
  background-color: rgba(190, 42, 68, 0.8);
  height: 90px;
  padding: 0 12px 0px 12px;
}
.item-text {
  margin-top: 8px;
  font-size: 28px;
  text-decoration: none;
  color: white;
}
.item-text:hover {
  color: #aaa;
}

.overlay-development {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(40, 61, 91, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.development-text {
  text-align: center;
  color: white;
}

.main-text {
  font-size: 34px;
  font-weight: bold;
  margin: 0 0 20px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  opacity: 0.9;
}

@media (max-width: 767px) {
  .ability-section {
    min-height: auto;
    padding-bottom: 24px;
  }

  .ability-title {
    font-size: 28px;
    padding: 16px 0;
  }

  .row-gap {
    margin-top: 8px;
  }

  .overlay {
    height: auto;
    padding: 8px 12px;
  }

  .item-text {
    font-size: 16px;
    margin: 0;
  }

  .main-text {
    font-size: 18px;
  }
}
</style>
