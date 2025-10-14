<template>
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
  
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeKey = computed(() => {
  // ensure parent path when at /personal
  if (route.path === '/personal') return '/personal/profile'
  return route.path
})
</script>

<style scoped>
.personal-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  padding: 24px 16px;
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
}

@media (max-width: 1024px) {
  .personal-layout { grid-template-columns: 1fr; }
}
</style>


