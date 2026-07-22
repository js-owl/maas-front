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
const isCompactLayout = computed(() => width.value <= 1300)

const isCardRouterLink = (ability: (typeof abilities.value)[number]) => Boolean(ability.link)
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
          :class="{
            'card-link--mobile': isMobileLayout,
            'card-link--tablet': isCompactLayout && !isMobileLayout,
          }"
        >
          <template v-if="isCompactLayout">
            <div
              class="card-title card-title--mobile montserrat-semibold"
              :class="{ 'card-title--tablet': !isMobileLayout }"
            >
              {{ ability.title }}
            </div>
            <div
              v-if="ability.icon"
              class="card-icon card-icon--mobile"
              :class="{ 'card-icon--tablet': !isMobileLayout }"
            >
              <component
                :is="ability.icon"
                class="card-icon-svg"
                color="#e84261"
                backgroundColor="transparent"
                bgColor="transparent"
              />
            </div>
          </template>
          <template v-else>
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
          </template>
        </component>
      </div>
    </div>
  </section>
</template>

<style scoped>
.uslugi-section2.section-basic {
  min-height: auto;
  margin-top: -38.4375em;
  margin-bottom: 2.5em;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 1.25em;
  padding: 2.5em;
  background-color: #ffffff;
  border-radius: 1.25em;
  box-shadow: 0 1.25em 0.8125em rgba(85, 88, 91, 0.2);
  box-sizing: border-box;
}

.uslugi-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 1.5em;
  font-weight: 600;
  line-height: normal;
  color: #c84359;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1em;
  width: 100%;
}

.service-card {
  background-color: #cbd1d5;
  border-radius: 0.625em;
  height: 5em;
  box-sizing: border-box;
  overflow: hidden;
}

.card-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  height: 100%;
  padding: 0 1.875em;
  text-decoration: none;
  color: inherit;
  box-sizing: border-box;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 1.25em;
  min-width: 0;
  flex: 1 1 auto;
}

.card-icon {
  flex-shrink: 0;
  width: 2.75em;
  height: 2.75em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon :deep(svg) {
  width: 2.75em;
  height: 2.75em;
}

.card-title {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 1.5em;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  text-align: left;
  word-break: break-word;
}

.card-chevron {
  flex-shrink: 0;
  width: 2.25em;
  height: 2.25em;
  display: block;
}

@media (max-width: 1300px) and (min-width: 769px) {
  .uslugi-section2.section-basic {
    margin-top: 0;
    margin-bottom: 0;
    padding: 2.5em;
    gap: 1.25em;
    border-radius: 2.5em;
    box-shadow: 0 0.375em 0.9375em rgba(224, 227, 237, 0.5);
  }

  .uslugi-title {
    font-size: 1.25em;
    color: #000000;
  }

  .services-grid {
    gap: 1.25em;
  }

  .service-card {
    height: auto;
    min-height: 6.25em;
    background-color: #f2f3f7;
    border-radius: 1.25em;
  }

  .card-link--tablet {
    align-items: center;
    justify-content: flex-start;
    gap: 2.5em;
    padding: 1.25em 1.875em;
    cursor: pointer;
  }

  .card-title--tablet {
    flex: 1 1 0;
    min-width: 0;
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 1.25em;
    font-weight: 600;
    line-height: 1.4;
  }

  .card-icon--tablet {
    flex-shrink: 0;
    width: 2.75em;
    height: 2.75em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-icon--tablet :deep(.card-icon-svg),
  .card-icon--tablet :deep(svg) {
    width: 2.75em;
    height: 2.75em;
    display: block;
  }

  .card-icon--tablet :deep(.cls-1),
  .card-icon--tablet :deep(#Layer_1 path),
  .card-icon--tablet :deep(#Layer_1 rect),
  .card-icon--tablet :deep(.st0),
  .card-icon--tablet :deep(.icon-galv .st0),
  .card-icon--tablet :deep(.icon-welding .st0) {
    fill: transparent;
  }

  .card-icon--tablet :deep(.cls-2),
  .card-icon--tablet :deep(.st1),
  .card-icon--tablet :deep(.icon-galv .st1),
  .card-icon--tablet :deep(.icon-welding .st1) {
    fill: #e84261;
  }
}

@media (max-width: 768px) {
  .uslugi-section2.section-basic {
    margin-top: 0;
    margin-bottom: 0;
    padding: 16px;
    gap: 16px;
    border-radius: 16px;
    box-shadow: 0 0 5px #c8cfe3;
  }

  .uslugi-title {
    font-size: 14px;
    color: #000000;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .service-card {
    height: auto;
    min-height: 0;
    background-color: #f2f3f7;
    border-radius: 8px;
  }

  .card-link--mobile {
    align-items: center;
    justify-content: flex-start;
    padding: 16px;
    gap: 8px;
    cursor: pointer;
  }

  .card-title--mobile {
    flex: 1 1 0;
    min-width: 0;
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
  }

  .card-icon--mobile {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-icon--mobile :deep(.card-icon-svg),
  .card-icon--mobile :deep(svg) {
    width: 24px;
    height: 24px;
    display: block;
  }

  .card-icon--mobile :deep(.cls-1),
  .card-icon--mobile :deep(#Layer_1 path),
  .card-icon--mobile :deep(#Layer_1 rect),
  .card-icon--mobile :deep(.st0),
  .card-icon--mobile :deep(.icon-galv .st0),
  .card-icon--mobile :deep(.icon-welding .st0) {
    fill: transparent;
  }

  .card-icon--mobile :deep(.cls-2),
  .card-icon--mobile :deep(.st1),
  .card-icon--mobile :deep(.icon-galv .st1),
  .card-icon--mobile :deep(.icon-welding .st1) {
    fill: #e84261;
  }
}
</style>
