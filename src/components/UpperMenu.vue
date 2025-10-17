<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import DialogLogin from "./dialog/DialogLogin.vue";
import DialogCall from "./dialog/DialogCall.vue";
import { useAuthStore } from "../stores/auth.store";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useProfileStore } from "../stores/profile.store";

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
  color.value = rootStyles.getPropertyValue("--upper-menu-bg").trim();

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

          <el-menu
            v-if="!isMobile"
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            :background-color="color"
            text-color="#fff"
            active-text-color="#fff"
            :router="true"
            @select="handleSelect"
          >
            <el-menu-item
              index="/"
              :route="{ path: '/' }"
              class="first-element"
            >
              ЦКП
            </el-menu-item>
            <el-sub-menu index="1">
              <template #title>Услуги</template>
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
            <el-menu-item v-show="false" index="/#about" @click="scrollToAbout">
              О нас
            </el-menu-item>

          </el-menu>
        </div>
        <div class="center-spacer" />
        <div class="right-wrap">
          <el-button
            class="call-btn"
            type="primary"
            plain
            @click="onCallRequest"
          >
            Заказать звонок
          </el-button>
          <template v-if="!authStore.getToken">
            <el-button
              class="auth-btn"
              type="primary"
              plain
              @click="isLoginVisible = true"
            >
              Войти/ Регистрация
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
              type="primary"
              plain
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
  background-color: var(--upper-menu-bg);
}
.uppermenu-header {
  display: flex;
  justify-content: space-between;
  height: 100px;
  margin-right: -40px;
}
.left-wrap {
  display: flex;
  align-items: center;
}
.right-wrap {
  display: flex;
  align-items: center;
}
.center-spacer {
  flex: 1;
}
.burger-btn {
  color: #fff;
}
.call-btn {
  background-color: transparent;
  color: white;
  border: none;
  margin-left: 20px;
  font-size: 20px;
  height: 80px;
  padding-left: 0px;
  font-weight: normal;
}
.call-btn:hover,
.call-btn:focus,
.call-btn:active {
  background-color: transparent !important;
  border-color: transparent !important;
  color: white !important;
}
.auth-btn {
  background-color: var(--upper-menu-bg);
  color: white;
  border: none;
  font-size: 20px;
}
.auth-btn:hover,
.auth-btn:focus,
.auth-btn:active {
  background-color: var(--upper-menu-bg) !important;
  border-color: transparent !important;
  color: white !important;
}
.username {
  color: white;
  padding-right: 5px;
  cursor: pointer;
  font-size: 20px;
}
.user-icon {
  margin-right: 10px;
  color: white;
  cursor: pointer;
}
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
.el-menu-item {
  font-size: 20px;
}
:deep(.el-header) {
  padding-left: 0px;
}
:deep(.el-sub-menu__title) {
  font-size: 20px;
}
:deep(.el-sub-menu) {
  font-size: 20px;
}
.first-element {
  font-size: 30px;
  color: white !important;
  text-decoration: none;
  font-weight: 700;
  margin-right: 100px !important;
}
.first-element.is-active {
  color: white !important;
  border-bottom: none !important;
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
  .first-element {
    margin-right: 0 !important;
    font-size: 22px;
  }
}

.drawer-content {
  padding: 12px;
}
</style>
