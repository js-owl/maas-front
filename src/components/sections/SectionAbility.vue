<script setup lang="ts">
import { ref } from 'vue'

const abilities = ref([
  {
    id: 1,
    title: 'Механическая обработка',
    link: '/mechanical',
    isDevelopment: false,
    imagePath: '/homePage/ability_mechanical.png',
  },
  {
    id: 2,
    title: '3d-печать',
    link: '/printing',
    isDevelopment: false,
    imagePath: '/plastic.png',
  },
  {
    id: 3,
    title: 'Нанесение покрытий',
    link: null,
    isDevelopment: true,
    imagePath: null,
  },
  {
    id: 4,
    title: 'Производство из композитных материалов',
    link: null,
    isDevelopment: true,
    imagePath: null,
  },
  {
    id: 5,
    title: 'Сварочное производство',
    link: null,
    isDevelopment: true,
    imagePath: null,
  },
  {
    id: 6,
    title: 'Лабораторные исследования',
    link: null,
    isDevelopment: true,
    imagePath: null,
  },
])
</script>

<template>
  <section class="section-basic">
    <div class="ability-title">УСЛУГИ</div>

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
              <span class="development-text">(Раздел в разработке)</span>
            </div>
            
            <div v-if="ability.imagePath" class="card-icon">
              <el-image
                :src="ability.imagePath"
                fit="contain"
                class="icon-image"
              />
            </div>
          </div>
        </component>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ability-title {
  font-size: 50px;
  color: #000;
  /* font-weight: bold; */
  padding: 10px 0 20px 20px;
  margin: 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  /* max-width: 1200px;
  margin: 0 auto; */
}

.service-card {
  background: #f4f6f8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 200px;
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
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.development-notice {
  margin-top: auto;
}

.development-text {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.card-icon {
  position: absolute;
  bottom: 20px;
  right: 20px;
  /* width: 60px; */
  height: 150px;
}

.icon-image {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 1fr);
    gap: 15px;
  }
  
  .ability-title {
    font-size: 28px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .card-icon {
    /* width: 50px;
    height: 50px; */
  }
}

@media (max-width: 480px) {
  .section-basic {
    padding: 20px 15px;
  }
  
  .ability-title {
    font-size: 24px;
  }
  
  .card-content {
    padding: 15px;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .development-text {
    font-size: 12px;
  }
}
</style>
