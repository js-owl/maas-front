<script setup lang="ts">
import { ref } from 'vue'

const abilities = ref([
  {
    id: 1,
    image: 'homePage/ability_mechanical.webp',
    title: 'Механообрабатывающее производство',
    link: '/mechanical',
    fit: 'cover',
    isDevelopment: false,
    span: 6,
    offset: 3,
  },
  {
    id: 2,
    image: 'homePage/ability_composite.webp',
    title: 'Производство изделий из композитных материалов',
    link: null,
    fit: 'contain',
    isDevelopment: true,
    span: 6,
    offset: 0,
  },
  {
    id: 3,
    image: 'homePage/ability_painting.webp',
    title: 'Нанесение лакокрасочных покрытий',
    link: null,
    fit: 'cover',
    isDevelopment: true,
    span: 6,
    offset: 0,
  },
  {
    id: 4,
    image: 'homePage/ability_assembly.webp',
    title: 'Сборочное производство',
    link: null,
    fit: 'cover',
    isDevelopment: true,
    span: 6,
    offset: 3,
  },
  {
    id: 5,
    image: 'homePage/ability_thermo.webp',
    title: 'Лабораторные исследования',
    link: null,
    fit: 'cover',
    isDevelopment: true,
    span: 6,
    offset: 0,
  },
  {
    id: 6,
    image: 'homePage/ability_welding.webp',
    title: 'Сварочное производство',
    link: null,
    fit: 'cover',
    isDevelopment: true,
    span: 6,
    offset: 0,
  },
])
</script>

<template>
  <section class="section-basic">
    <div class="ability-title">УСЛУГИ</div>

    <div class="items">
      <div class="item" v-for="ability in abilities" :key="ability.id">
        <div class="item-wrap">
          <component :is="ability.link ? 'RouterLink' : 'div'" :to="ability.link">
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
      </div>
    </div>
  </section>
</template>

<style scoped>
.ability-title {
  /* text-align: center; */
  font-size: 50px;
  color: #283d5b;
  padding: 10px 0 20px 0px;
}

.items {
  display: flex;
  gap: 1%;
  justify-content: space-between;
  flex-wrap: wrap;
}
.item {
  width: 32%;
  padding-bottom: 20px;
}
.item-wrap {
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
  .section-basic {
    padding: 20px 30px 24px 30px;
  }

  .ability-title {
    font-size: 28px;
    padding: 16px 0;
  }
  .item {
    width: 100%;
    padding-bottom: 10px;
  }
  .item-text {
    font-size: 20px;
  }
  .main-text {
    font-size: 18px;
  }
}
</style>
