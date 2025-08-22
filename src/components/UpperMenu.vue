<script lang="ts" setup>
import { ref } from "vue";
import DialogLogin from "./dialog/DialogLogin.vue";
import DialogCall from "./dialog/DialogCall.vue";
import { useAuthStore } from "../stores/auth.store";
import { useRouter } from "vue-router";

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const isLoginVisible = ref(false);
const isCallVisible = ref(false);

const authStore = useAuthStore();
const router = useRouter();

function onLogout() {
  authStore.clearToken();
  router.push({ name: "home" });
}

function onCallRequest() {
  isCallVisible.value = true;
}
</script>

<template>
  <el-row :gutter="0" style="background-color: #be2a44">
    <el-col :offset="2" :span="21">
      <el-header
        style="display: flex; justify-content: space-between; height: 80px"
      >
        <div style="display: flex; align-items: center">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            background-color="#be2a44"
            text-color="#fff"
            active-text-color="black"
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
                <el-menu-item index="1-1-1" disabled>
                  Сверлильные работы
                </el-menu-item>
                <el-menu-item index="1-1-2" disabled>Шлифовка</el-menu-item>
                <el-menu-item index="/milling" :route="{ path: '/milling' }">
                  Фрезерные работы
                </el-menu-item>
                <el-menu-item
                  index="/machining"
                  :route="{ path: '/machining' }"
                >
                  Токарные работы
                </el-menu-item>
                <el-menu-item index="1-1-5" disabled>
                  Раскрой металла / заготовительный участок
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item index="/plastic" :route="{ path: '/plastic' }">
                Производство из композитных материалов
              </el-menu-item>
              <el-menu-item index="/paint" :route="{ path: '/paint' }">
                Нанесение лакокрасочных покрытий
              </el-menu-item>
              <el-menu-item index="/paint" :route="{ path: '/paint' }" disabled>
                Сборочная линия
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
            <el-menu-item index="/#about"> О нас </el-menu-item>

            <el-sub-menu index="5" v-show="authStore.getToken">
              <template #title>Заказы</template>
              <el-menu-item
                index="/order-list"
                :route="{ path: '/order-list' }"
              >
                Мои заказы
              </el-menu-item>
            </el-sub-menu>
          </el-menu>

          <el-button
            type="primary"
            plain
            style="
              background-color: transparent;
              color: white;
              border: none;
              margin-left: 20px;
              font-size: 18px;
              height: 60px;
              padding: 0 20px;
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
            style="background-color: #be2a44; color: white"
            @click="isLoginVisible = true"
          >
            Войти/ Регистрация
          </el-button>
        </div>

        <div v-else style="display: flex; align-items: center">
          <el-icon :size="30" style="margin-right: 10px; color: white">
            <User />
          </el-icon>
          <el-button
            type="primary"
            plain
            style="background-color: #be2a44; color: white"
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
}
.el-menu-item {
  font-size: 18px;
}
:deep(.el-header) {
  padding-left: 0px;
}
:deep(.el-sub-menu__title) {
  font-size: 18px;
  /* padding: 5px; */
}
:deep(.el-sub-menu) {
  font-size: 18px;
  /* padding: 5px; */
}
.first-element {
  margin: 0 40px 0 0px;
  font-size: 30px;
  color: white;
  text-decoration: none;
  font-weight: 700;
}
.first-element.is-active {
  color: white !important;
  border-bottom: none !important;
}
</style>
