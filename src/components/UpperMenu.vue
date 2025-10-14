<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
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
  <el-row :gutter="0" style="background-color: var(--upper-menu-bg)">
    <el-col :offset="3" :span="18">
      <el-header
        style="
          display: flex;
          justify-content: space-between;
          height: 100px;
          margin-right: -40px;
        "
      >
        <div style="display: flex; align-items: center">
          <el-menu
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
              <template #title>Решения</template>
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

            <el-sub-menu index="5" v-show="authStore.getToken">
              <template #title>Кабинет</template>
              
            </el-sub-menu>
          </el-menu>
        </div>
        <div style="display: flex; align-items: center">
          <el-button
            type="primary"
            plain
            style="
              background-color: transparent;
              color: white;
              border: none;
              margin-left: 20px;
              font-size: 20px;
              height: 80px;
              padding-left: 0px;
              font-weight: normal;
            "
            @click="onCallRequest"
          >
            Заказать звонок
          </el-button>
        </div>
        <div
          v-if="!authStore.getToken"
          style="display: flex; align-items: center"
        >
          <el-button
            type="primary"
            plain
            style="
              background-color: var(--upper-menu-bg);
              color: white;
              border: none;
              font-size: 20px;
            "
            @click="isLoginVisible = true"
          >
            Войти/ Регистрация
          </el-button>
        </div>

        <div v-else style="display: flex; align-items: center">
          <span style="color: white; padding-right: 5px">
            {{ profileStore.profile?.username }}
          </span>
          <el-icon :size="30" style="margin-right: 10px; color: white">
            <User />
          </el-icon>
          <el-button
            type="primary"
            plain
            style="
              background-color: var(--upper-menu-bg);
              color: white;
              border: none;
              font-size: 20px;
            "
            @click="onLogout"
          >
            Выйти
          </el-button>
        </div>
      </el-header>
    </el-col>
    <DialogLogin v-model="isLoginVisible" />
    <DialogCall v-model="isCallVisible" />
  </el-row>
</template>

<style scoped>
.el-menu.el-menu--horizontal {
  border-bottom: none;
  /* margin-right: 100px; */
}
.el-menu-item {
  font-size: 20px;
}
:deep(.el-header) {
  padding-left: 0px;
}
:deep(.el-sub-menu__title) {
  font-size: 20px;
  /* padding: 5px; */
}
:deep(.el-sub-menu) {
  font-size: 20px;
  /* padding: 5px; */
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
</style>
