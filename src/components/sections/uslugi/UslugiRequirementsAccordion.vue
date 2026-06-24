<script lang="ts" setup>
import IconArrowDown from '@/icons/IconArrowDown.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    isMobile: boolean
  }>(),
  {
    title: 'Технические требования',
  }
)

const isExpanded = defineModel<boolean>('expanded', { default: false })

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div
    class="technical-requirements"
    :class="{ 'technical-requirements--expanded': isExpanded && props.isMobile }"
  >
    <button
      v-if="props.isMobile"
      type="button"
      class="requirements-header requirements-header--mobile"
      @click="toggleExpanded"
    >
      <div class="uslugi-table-title">{{ props.title }}</div>
      <el-icon class="requirements-arrow" :class="{ expanded: isExpanded }">
        <IconArrowDown color="#000000" />
      </el-icon>
    </button>

    <div v-else class="requirements-header" @click="toggleExpanded">
      <div class="uslugi-table-title">{{ props.title }}</div>
      <el-icon class="requirements-arrow" :class="{ expanded: isExpanded }">
        <IconArrowDown />
      </el-icon>
    </div>

    <slot v-if="isExpanded && props.isMobile" name="mobile" />
    <slot v-else-if="isExpanded" name="desktop" />
  </div>
</template>
