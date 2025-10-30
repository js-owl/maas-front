<script setup lang="ts">
import { ref } from 'vue'

const abilities = ref([
  {
    id: 1,
    title: 'Механическая обработка',
    link: '/mechanical',
    isDevelopment: false,
    imagePath: '/homePage/uslugi_machining.png',
  },
  {
    id: 2,
    title: '3d-печать',
    link: '/print',
    isDevelopment: false,
    imagePath: '/homePage/uslugi_printing.png',
  },
])
// {
//   id: 3,
//   title: 'Нанесение покрытий',
//   link: null,
//   isDevelopment: true,
//   imagePath: null,
// },
// {
//   id: 4,
//   title: 'Производство из композитных материалов',
//   link: null,
//   isDevelopment: true,
//   imagePath: null,
// },
// {
//   id: 5,
//   title: 'Сварочное производство',
//   link: null,
//   isDevelopment: true,
//   imagePath: null,
// },
// {
//   id: 6,
//   title: 'Лабораторные исследования',
//   link: null,
//   isDevelopment: true,
//   imagePath: null,
// },
</script>

<template>
  <section class="section-basic">
    <div class="section-title">УСЛУГИ</div>

    <div class="services-grid">
      <div
        class="service-card"
        v-for="ability in abilities"
        :key="ability.id"
        :class="{ 'card-development': ability.isDevelopment }"
      >
        <component :is="ability.link ? 'RouterLink' : 'div'" :to="ability.link" class="card-link">
          <div class="card-content">
            <h3 class="card-title">{{ ability.title }}</h3>

            <div v-if="ability.isDevelopment" class="development-notice">
              <span class="development-text">[Раздел в разработке]</span>
            </div>

            <div v-if="ability.imagePath" class="card-icon">
              <el-image :src="ability.imagePath" fit="contain" class="icon-image" />
            </div>
          </div>
        </component>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ability-title {
  text-align: left;
  font-size: 60px;
  color: #000;
  padding-bottom: 20px;
}

.services-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.service-card {
  background: var(--gray-footer);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 240px;
  width: 49%; /* 30% */
  position: relative;
  overflow: hidden;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-development {
  background: #e1e4e6;
}

.card-link {
  display: block;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.card-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.development-notice {
  position: absolute;
  bottom: 45px;
  left: 20px;
  margin-top: 0;
}

.development-text {
  font-size: 18px;
  color: #999;
  /* 
  font-style: italic;
  background-color: rgba(153, 153, 153, 0.15);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(153, 153, 153, 0.3); */
}

.card-icon {
  position: absolute;
  bottom: 40px;
  right: 40px;
  /* width: 60px; */
  height: 150px;
}

.icon-image {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .services-grid {
    flex-direction: column;
    gap: 16px;
    /* padding: 0 10px; */
  }

  .service-card {
    width: 100%;
    height: 130px;
  }

  .card-title {
    font-size: 16px;
  }

  .development-text {
    font-size: 14px;
  }

  .card-icon {
    bottom: 15px;
    right: 15px;
    height: 100px;
  }

  .card-content {
    padding: 16px;
  }
}
</style>
