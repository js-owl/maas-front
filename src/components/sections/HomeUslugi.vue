<script setup lang="ts">
import { ref, markRaw } from 'vue'
import IconMech from '@/icons/home/IconMech.vue'
import Icon3DView from '@/icons/home/Icon3DView.vue'
import IconPKM from '@/icons/home/IconPKM.vue'
import IconLKM from '@/icons/home/IconLKM.vue'
import IconIspitaniya from '@/icons/home/IconIspitaniya.vue'
import IconGalv from '@/icons/home/IconGalv.vue'
import IconWelding from '@/icons/home/IconWelding.vue'
import IconRubber from '@/icons/home/IconRubber.vue'

const abilities = ref([
  {
    id: 1,
    title: 'Механическая обработка',
    link: '/mechanical',
    isDevelopment: false,
    icon: markRaw(IconMech),
  },
  {
    id: 2,
    title: '3Д-печать',
    link: '/print',
    isDevelopment: false,
    icon: markRaw(Icon3DView),
  },
  {
    id: 3,
    title: 'Полимерно-композитный материал',
    link: '/pkm',
    isDevelopment: false,
    icon: markRaw(IconPKM),
  },
  {
    id: 4,
    title: 'Нанесение ЛКМ',
    link: '/painting',
    isDevelopment: false,
    icon: markRaw(IconLKM),
  },
  {
    id: 5,
    title: 'Испытательные ресурсы',
    link: '/test',
    isDevelopment: false,
    icon: markRaw(IconIspitaniya),
  },
  {
    id: 6,
    title: 'Гальваника',
    link: '/galv',
    isDevelopment: false,
    icon: markRaw(IconGalv),
  },
  {
    id: 7,
    title: 'Сварка',
    link: '/other',
    isDevelopment: false,
    icon: markRaw(IconWelding),
  },
  {
    id: 8,
    title: 'Производство из резины',
    link: '/rubber',
    isDevelopment: false,
    icon: markRaw(IconRubber),
  },
])
</script>

<template>
  <section class="section-basic uslugi-section2">
    <div style="font-size: 38px; font-weight: 600; color: #000; text-align: left; padding-bottom: 20px;">Услуги</div>

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
              <el-icon :size="60">
                <component :is="ability.icon" :color="'#7d8083'" :backgroundColor="'#cbd1d5'" />
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
  background: #cbd1d5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100px;
  width: 49%; /* 30% */
  position: relative;
  overflow: hidden;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-development {
  background: var(--bgcolor);
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
  font-weight: 600;
  color: #000;
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

/* Планшет: 769px — 1024px */
@media (min-width: 769px) and (max-width: 1500px) {
  .section-basic {
    margin-top: 32px !important;
  }

  .services-grid {
    gap: 16px;
  }

  .service-card {
    width: 100%;
    height: 100px;
  }

  .card-content {
    padding-left: 20px;
    gap: 12px;
  }

  .card-icon :deep(svg) {
    width: 40px;
    height: 40px;
  }

  .card-title {
    font-size: 18px;
  }

  .development-text {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .uslugi-section2 {
    margin-top: 24px;
  }

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

.uslugi-section2 {
  margin-top: -615px;
  position: relative;
  z-index: 3;
  display: block;
}
</style>
