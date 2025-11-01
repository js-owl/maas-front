<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMaterialStore } from '../stores/material.store'

const route = useRoute()
const materialStore = useMaterialStore()

const activeKey = computed(() => {
  // ensure parent path when at /personal
  if (route.path === '/personal') return '/personal/profile'
  return route.path
})

onMounted(async () => {
  // Check localStorage first
  if (materialStore.allMaterials.length > 0) {
    // Use materials from localStorage
    materialStore.setMaterials(materialStore.allMaterials)
  } else {
    // Load from API if localStorage is empty
    await materialStore.loadMaterials('cnc-lathe')
    if (materialStore.materials.length > 0) {
      materialStore.setAllMaterials(materialStore.materials)
    }
  }
})
</script>

<template>
  <el-row :gutter="0" style="padding-top: 30px; min-height: 300px">
    <el-col :offset="3" :span="18">
      <div class="personal-layout">
        <aside class="sidebar">
          <el-menu :default-active="activeKey" class="menu" router>
            <el-menu-item index="/personal/profile">
              <span>Профиль</span>
            </el-menu-item>
            <el-menu-item index="/personal/orders">
              <span>Заказы</span>
            </el-menu-item>
          </el-menu>
        </aside>
        <main class="content">
          <RouterView />
        </main>
      </div>
    </el-col>
  </el-row>
</template>


<style scoped>
.personal-layout {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  padding-bottom: 20px;
}

.sidebar {
  background: #fff;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
}

.menu {
  border-right: 0;
}

.content {
  background: #fff;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 16px;
  min-height: 60vh;
  /* Prevent grid child from overflowing horizontally */
  min-width: 0;
  /* Allow inner scroll for wide tables/content */
  overflow: auto;
}

@media (max-width: 1024px) {
  .personal-layout {
    grid-template-columns: 1fr;
  }
}

/* Make Element Plus tables adapt inside the content block */
:deep(.content .el-table) {
  width: 100%;
}

:deep(.content .el-table__body-wrapper) {
  overflow: auto;
}
</style>
