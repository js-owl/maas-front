<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import {
  pvzCoordinates,
  pvzStaticMapUrl,
  pvzYandexMapsUrl,
  type CdekPvz,
} from '@/helpers/cdek-delivery'

const props = defineProps<{
  point: CdekPvz | null
}>()

const mapFailed = ref(false)

const coords = computed(() => pvzCoordinates(props.point))
const mapUrl = computed(() => pvzStaticMapUrl(props.point))
const yandexUrl = computed(() => pvzYandexMapsUrl(props.point))
const showMap = computed(() => Boolean(coords.value && mapUrl.value && yandexUrl.value && !mapFailed.value))

const onMapError = () => {
  mapFailed.value = true
}

watch(
  () => props.point?.code,
  () => {
    mapFailed.value = false
  }
)
</script>

<template>
  <div v-if="coords && yandexUrl" class="pvz-map-preview">
    <a
      class="pvz-map-preview__link"
      :href="yandexUrl"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Открыть ${point?.code || 'ПВЗ'} в Яндекс.Картах`"
    >
      <img
        v-if="showMap"
        class="pvz-map-preview__image"
        :src="mapUrl!"
        :alt="`Карта: ${point?.code || 'ПВЗ'}`"
        loading="lazy"
        decoding="async"
        @error="onMapError"
      />
      <div v-else class="pvz-map-preview__fallback">
        <span>Открыть пункт на карте</span>
      </div>
    </a>
    <p v-if="showMap" class="pvz-map-preview__attribution">© Яндекс</p>
  </div>
</template>

<style scoped>
.pvz-map-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pvz-map-preview__link {
  display: block;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #e4e7ec;
  text-decoration: none;
  cursor: pointer;
}

.pvz-map-preview__image {
  display: block;
  width: 100%;
  height: 160px;
  object-fit: cover;
  background: #f2f4f7;
}

.pvz-map-preview__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: 16px;
  background: linear-gradient(135deg, #f9fafb 0%, #eef2f6 100%);
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  color: #344054;
}

.pvz-map-preview__attribution {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 11px;
  line-height: 1.2;
  color: #98a2b3;
}
</style>
