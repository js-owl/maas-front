<script setup lang="ts">
import { onMounted } from 'vue'
// import { useRoute } from 'vue-router'
import { useMaterialStore } from '../stores/material.store'
// import { useProfileStore } from '../stores/profile.store'

// const route = useRoute()
const materialStore = useMaterialStore()
// const profileStore = useProfileStore()

// const activeKey = computed(() => {
//   // ensure parent path when at /personal
//   if (route.path === '/personal') return '/personal/profile'
//   return route.path
// })

// const isAdmin = computed(() => profileStore.profile?.username === 'admin')

onMounted(async () => {
  await materialStore.setAllMaterials()
})
</script>

<template>
  <el-row
    :gutter="0"
    class="personal-page"
  >
    <el-col
      class="personal-page__col"
      :offset="3"
      :span="18"
      :xs="{ span: 24, offset: 0 }"
      :sm="{ span: 24, offset: 0 }"
    >
      <div>
        <!-- <aside class="sidebar">
          <el-menu :default-active="activeKey" class="menu" router>
            <el-menu-item index="/personal/profile">
              <span>Профиль</span>
            </el-menu-item>
            <el-menu-item index="/personal/orders">
              <span>Заказы</span>
            </el-menu-item>
            <el-menu-item v-if="isAdmin" index="/personal/users">
              <span>Пользователи</span>
            </el-menu-item>
          </el-menu>
        </aside> -->
        <main class="personal-page__main">
          <RouterView />
        </main>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.personal-page {
  padding: 30px 0 40px;
  min-height: 60vh;
  background-color: var(--bgcolor);
  box-sizing: border-box;
}

.personal-page__main {
  min-width: 0;
}

.personal-layout {
  /* display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px; */
  padding-bottom: 40px;
}

.sidebar {
  background: #fff;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(18, 24, 40, 0.12);
}

.menu {
  border-right: 0;
}

:deep(.menu .el-menu-item) {
  font-size: 16px;
  font-weight: 600;
}

.content {
  background: #fff;
  /* border: 1px solid var(--el-border-color); */
  border-radius: 8px;
  padding: 0 16px;
  /* min-height: 60vh; */
  /* Prevent grid child from overflowing horizontally */
  min-width: 0;
  overflow: auto;
  box-shadow: 0 12px 32px rgba(18, 24, 40, 0.12);
}

@media (max-width: 767px) {
  .personal-page {
    padding: 32px 10px 40px;
  }
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
