<script setup lang="ts">
import { ref } from 'vue'
import IconMech from '../../icons/IconMech.vue'
import Icon3DView from '../../icons/Icon3DView.vue'

const abilities = ref([
  {
    id: 1,
    title: 'МЕХАНИЧЕСКАЯ ОБРАБОТКА',
    link: '/mechanical',
    isDevelopment: false,
    icon: IconMech,
  },
  {
    id: 2,
    title: '3Д-ПЕЧАТЬ',
    link: '/print',
    isDevelopment: false,
    icon: Icon3DView,
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
  <section class="section-basic" style="margin-top: 40px;">
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
            <div v-if="ability.icon" class="card-icon">
              <el-icon :size="48" color="#fff">
                <component :is="ability.icon" />
              </el-icon>
            </div>
            <div class="card-text">
              <h3 class="card-title">{{ ability.title }}</h3>
              <div v-if="ability.isDevelopment" class="development-notice">
                <span class="development-text">[Раздел в разработке]</span>
              </div>
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
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.service-card {
  background: var(--custom-red);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 120px;
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
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  min-height: 100%;
  text-decoration: none;
  color: inherit;
}

.card-content {
  padding-left: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
}

.card-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-text {
  min-width: 0;
  text-align: left;
  padding-left: 10px;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.development-notice {
  margin-top: 4px;
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

  .card-content {
    padding: 16px;
  }
}
</style>
