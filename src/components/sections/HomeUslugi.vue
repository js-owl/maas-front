<script setup lang="ts">
import { ref, markRaw, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
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
    isDevelopment: true,
    icon: markRaw(IconMech),
  },
  {
    id: 2,
    title: '3D-печать',
    link: '/print',
    isDevelopment: true,
    icon: markRaw(Icon3DView),
  },
  {
    id: 3,
    title: 'Изделия из полимерно-композиционных материалов',
    link: '/pkm',
    isDevelopment: true,
    icon: markRaw(IconPKM),
  },
  {
    id: 4,
    title: 'Нанесение ЛКМ',
    link: '/painting',
    isDevelopment: true,
    icon: markRaw(IconLKM),
  },
  {
    id: 5,
    title: 'Производство из резины',
    link: '/rubber',
    isDevelopment: true,
    icon: markRaw(IconRubber),
  },
  {
    id: 6,
    title: 'Гальваника',
    link: '/galv',
    isDevelopment: true,
    icon: markRaw(IconGalv),
  },
  {
    id: 7,
    title: 'Сварка',
    link: '/weld',
    isDevelopment: true,
    icon: markRaw(IconWelding),
  },
  {
    id: 8,
    title: 'Испытательные ресурсы',
    link: '/test',
    isDevelopment: true,
    icon: markRaw(IconIspitaniya),
  },

])

const { width } = useWindowSize()
const isMobileLayout = computed(() => width.value <= 768)

const isCardRouterLink = (ability: (typeof abilities.value)[number]) =>
  Boolean(ability.link && !(ability.isDevelopment && isMobileLayout.value))
</script>

<template>
  <section class="section-basic uslugi-section2">
    <h2 class="maas-title uslugi-title">Услуги</h2>

    <div class="services-grid">
      <div
        class="service-card"
        v-for="ability in abilities"
        :key="ability.id"
      >
        <component
          :is="isCardRouterLink(ability) ? 'RouterLink' : 'div'"
          v-bind="isCardRouterLink(ability) ? { to: ability.link } : {}"
          class="card-link"
        >
          <div class="card-left">
            <div v-if="ability.icon" class="card-icon">
              <el-icon :size="44">
                <component :is="ability.icon" :color="'#7d8083'" :backgroundColor="'#cbd1d5'" />
              </el-icon>
            </div>
            <div class="card-title montserrat-medium">{{ ability.title }}</div>
          </div>
          <img
            src="@/assets/service-chevron.svg"
            alt=""
            class="card-chevron"
            aria-hidden="true"
            width="36"
            height="36"
          />
        </component>
      </div>
    </div>
  </section>
</template>

<style scoped>
.uslugi-section2.section-basic {
  min-height: auto;
  margin-top: -615px;
  margin-bottom: 40px;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 13px rgba(85, 88, 91, 0.2);
  box-sizing: border-box;
}

.uslugi-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: normal;
  color: #c84359;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
}

.service-card {
  background-color: #cbd1d5;
  border-radius: 10px;
  height: 80px;
  box-sizing: border-box;
  overflow: hidden;
}

.card-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 100%;
  padding: 0 30px;
  text-decoration: none;
  color: inherit;
  box-sizing: border-box;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
  flex: 1 1 auto;
}

.card-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon :deep(svg) {
  width: 44px;
  height: 44px;
}

.card-title {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  text-align: left;
  word-break: break-word;
}

.card-chevron {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: block;
}

@media (max-width: 768px) {
  .uslugi-section2 {
    margin-top: 24px;
    padding: 20px;
    gap: 20px;
    border-radius: 0;
    box-shadow: none;
  }

  .uslugi-title {
    font-size: 24px;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .service-card {
    height: auto;
    min-height: 80px;
  }

  .card-link {
    padding: 18px 20px;
  }

  .card-left {
    gap: 16px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
  }

  .card-icon :deep(svg) {
    width: 40px;
    height: 40px;
  }

  .card-title {
    font-size: 16px;
  }

  .card-chevron {
    width: 28px;
    height: 28px;
  }
}
</style>
