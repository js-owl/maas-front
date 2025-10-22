<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import DialogLogin from "./dialog/DialogLogin.vue";
import DialogCall from "./dialog/DialogCall.vue";
import { useAuthStore } from "../stores/auth.store";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useProfileStore } from "../stores/profile.store";
import { ArrowDown, Menu, User } from "@element-plus/icons-vue";

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const isLoginVisible = ref(false);
const isCallVisible = ref(false);

const authStore = useAuthStore();
const profileStore = useProfileStore();
const router = useRouter();

let color = ref("");
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);
const isDrawerOpen = ref(false);

// Check token on component mount
onMounted(() => {
  const rootStyles = getComputedStyle(document.documentElement);
  color.value = rootStyles.getPropertyValue("--bgcolor").trim();

  checkTokenValidity();
  const tokenCheckInterval = setInterval(checkTokenValidity, 5 * 60 * 1000);
  onUnmounted(() => {
    clearInterval(tokenCheckInterval);
  });
});

// Function to check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("isTokenExpired", payload.exp - currentTime);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error parsing token:", error);
    return true; // Consider invalid tokens as expired
  }
}

// Function to check token validity and logout if expired
function checkTokenValidity() {
  const token = authStore.getToken;
  if (token && isTokenExpired(token)) {
    console.log("Token expired, logging out...");
    ElMessage.warning("Сессия истекла. Войдите в систему снова.");
    authStore.clearToken();
    router.push({ name: "home" });
  }
}

function onLogout() {
  authStore.clearToken();
  router.push({ name: "home" });
}

function onCallRequest() {
  isCallVisible.value = true;
}

function scrollToAbout() {
  const aboutElement = document.getElementById("about");
  if (aboutElement) {
    aboutElement.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<template>
  <el-row :gutter="0" class="uppermenu-row">
    <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
      <el-header class="uppermenu-header">
        <div class="left-wrap">
          <el-button
            v-if="isMobile"
            class="burger-btn"
            text
            @click="isDrawerOpen = true"
          >
            <el-icon size="26" color="#fff">
              <Menu />
            </el-icon>
          </el-button>

          <div v-if="!isMobile" class="menu-container">
            <!-- Красная кнопка ЦКП -->
            <el-button
              class="logo-btn"
              @click="router.push({ path: '/' })"
            >
              ЦКП
            </el-button>

            <!-- Меню с выпадающим списком -->
            <el-menu
              :default-active="activeIndex"
              class="main-menu"
              mode="horizontal"
              :ellipsis="false"
              background-color="transparent"
              text-color="#333"
              active-text-color="#333"
              :router="true"
              @select="handleSelect"
            >
              <el-sub-menu index="1" class="services-menu">
                <template #title>
                  <span class="services-title">Услуги</span>
                  <el-icon class="dropdown-icon">
                    <ArrowDown />
                  </el-icon>
                </template>
                <el-sub-menu index="1-1">
                  <template #title>Механообрабатывающее производство</template>
                  <el-menu-item
                    index="/machining"
                    :route="{ path: '/machining' }"
                  >
                    Токарные работы
                  </el-menu-item>
                  <el-menu-item index="/milling" :route="{ path: '/milling' }">
                    Фрезерные работы
                  </el-menu-item>
                  <el-menu-item index="1-1-5" disabled>
                    Раскрой металла / заготовительный участок
                  </el-menu-item>
                  <el-menu-item index="1-1-1" disabled>
                    Сверлильные работы
                  </el-menu-item>
                  <el-menu-item index="1-1-2" disabled>Шлифовка</el-menu-item>
                </el-sub-menu>
                <el-menu-item
                  index="/plastic"
                  :route="{ path: '/plastic' }"
                  disabled
                >
                  Производство из композитных материалов
                </el-menu-item>
                <el-menu-item index="/paint" :route="{ path: '/paint' }" disabled>
                  Нанесение лакокрасочных покрытий
                </el-menu-item>
                <el-menu-item index="/printing" :route="{ path: '/printing' }">
                  3D печать
                </el-menu-item>
                <el-menu-item index="/paint" :route="{ path: '/paint' }" disabled>
                  Лабораторные исследования
                </el-menu-item>
                <el-sub-menu index="1-2" disabled>
                  <template #title>Сварочное производство</template>
                  <el-menu-item index="1-2-1">Аргонодуговая сварка</el-menu-item>
                  <el-menu-item index="1-2-2">
                    Сварка в углекислом газе
                  </el-menu-item>
                  <el-menu-item index="1-2-3">Контактная сварка</el-menu-item>
                </el-sub-menu>
              </el-sub-menu>
            </el-menu>
          </div>
        </div>
        
        <div class="right-wrap">
          <el-button
            class="call-btn"
            @click="onCallRequest"
          >
            Заказать звонок
          </el-button>
          <template v-if="!authStore.getToken">
            <el-button
              class="auth-btn"
              @click="isLoginVisible = true"
            >
              Войти / Регистрация
            </el-button>
          </template>
          <template v-else>
            <span class="username" @click="router.push({ path: '/personal' })">
              {{ profileStore.profile?.username }}
            </span>
            <el-icon :size="30" class="user-icon" @click="router.push({ path: '/personal' })">
              <User />
            </el-icon>
            <el-button
              class="auth-btn"
              @click="onLogout"
            >
              Выйти
            </el-button>
          </template>
        </div>
      </el-header>
    </el-col>
    <DialogLogin v-model="isLoginVisible" />
    <DialogCall v-model="isCallVisible" />
  </el-row>

  <el-drawer v-model="isDrawerOpen" direction="ltr" :with-header="false" size="80%">
    <div class="drawer-content">
      <el-menu
        :default-active="activeIndex"
        mode="vertical"
        :background-color="'#fff'"
        text-color="#283d5b"
        active-text-color="#283d5b"
        :router="true"
        @select="() => (isDrawerOpen = false)"
      >
        <el-menu-item index="/" :route="{ path: '/' }">Главная</el-menu-item>
        <el-sub-menu index="m1">
          <template #title>Услуги</template>
          <el-sub-menu index="m1-1">
            <template #title>Механообрабатывающее производство</template>
            <el-menu-item index="/machining" :route="{ path: '/machining' }">Токарные работы</el-menu-item>
            <el-menu-item index="/milling" :route="{ path: '/milling' }">Фрезерные работы</el-menu-item>
            <el-menu-item index="m1-1-5" disabled>Раскрой металла / заготовительный участок</el-menu-item>
            <el-menu-item index="m1-1-1" disabled>Сверлильные работы</el-menu-item>
            <el-menu-item index="m1-1-2" disabled>Шлифовка</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/plastic" :route="{ path: '/plastic' }" disabled>Производство из композитных материалов</el-menu-item>
          <el-menu-item index="/paint" :route="{ path: '/paint' }" disabled>Нанесение лакокрасочных покрытий</el-menu-item>
          <el-menu-item index="/printing" :route="{ path: '/printing' }">3D печать</el-menu-item>
          <el-menu-item index="/paint" :route="{ path: '/paint' }" disabled>Лабораторные исследования</el-menu-item>
          <el-sub-menu index="m1-2" disabled>
            <template #title>Сварочное производство</template>
            <el-menu-item index="m1-2-1">Аргонодуговая сварка</el-menu-item>
            <el-menu-item index="m1-2-2">Сварка в углекислом газе</el-menu-item>
            <el-menu-item index="m1-2-3">Контактная сварка</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="/#about" @click="() => { scrollToAbout(); }">О нас</el-menu-item>
      </el-menu>
    </div>
  </el-drawer>
</template>

<style scoped>
.uppermenu-row {
  background-color: var(--bgcolor);
}
.uppermenu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  margin-right: -40px;
  padding: 0 20px;
}
.left-wrap {
  display: flex;
  align-items: center;
}
.right-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
}
.menu-container {
  display: flex;
  align-items: center;
  gap: 30px;
}
.logo-btn {
  background-color: #d61e3c;
  color: white;
  border: none;
  font-size: 18px;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 4px;
  height: auto;
}
.logo-btn:hover,
.logo-btn:focus,
.logo-btn:active {
  background-color: #c01a35 !important;
  border-color: #c01a35 !important;
  color: white !important;
}
.main-menu {
  border: none !important;
}
.services-menu {
  display: flex;
  align-items: center;
}
.services-title {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}
.dropdown-icon {
  color: #d61e3c;
  margin-left: 8px;
  font-size: 12px;
}
.burger-btn {
  color: #333;
}
.call-btn {
  background-color: transparent;
  color: #333;
  border: none;
  font-size: 18px;
  font-weight: 500;
  padding: 8px 16px;
  height: auto;
}
.call-btn:hover,
.call-btn:focus,
.call-btn:active {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #333 !important;
}
.auth-btn {
  background-color: transparent;
  color: #333;
  border: none;
  font-size: 18px;
  font-weight: 500;
  padding: 8px 16px;
  height: auto;
}
.auth-btn:hover,
.auth-btn:focus,
.auth-btn:active {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #333 !important;
}
.username {
  color: #333;
  padding-right: 5px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
}
.user-icon {
  margin-right: 10px;
  color: #333;
  cursor: pointer;
}
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
.el-menu-item {
  font-size: 18px;
}
:deep(.el-header) {
  padding-left: 0px;
}
:deep(.el-sub-menu__title) {
  font-size: 18px;
  color: #333 !important;
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
}
:deep(.el-sub-menu) {
  font-size: 18px;
}
:deep(.el-sub-menu__title:hover) {
  color: #333 !important;
  background-color: transparent !important;
}
:deep(.el-menu--horizontal .el-sub-menu .el-sub-menu__title) {
  border-bottom: none !important;
}
:deep(.el-menu--horizontal .el-sub-menu .el-sub-menu__title:hover) {
  border-bottom: none !important;
}
:deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
  display: none !important;
}

@media (max-width: 767px) {
  .uppermenu-header {
    height: 56px;
    margin-right: 0;
    padding: 0 8px;
  }
  .call-btn,
  .auth-btn {
    font-size: 14px;
    height: 40px;
    margin-left: 8px;
    padding: 0 8px;
  }
  .username {
    display: none;
  }
  .user-icon {
    margin-right: 4px;
  }
  .logo-btn {
    font-size: 16px;
    padding: 8px 16px;
  }
  .menu-container {
    gap: 15px;
  }
  .services-title {
    font-size: 16px;
  }
}

.drawer-content {
  padding: 12px;
}
</style>
