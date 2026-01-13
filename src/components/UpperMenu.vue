<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import DialogLogin from './dialog/DialogLogin.vue'
import DialogCall from './dialog/DialogCall.vue'
import { useAuthStore } from '../stores/auth.store'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProfileStore } from '../stores/profile.store'
import { ArrowDown, Menu, User } from '@element-plus/icons-vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const isLoginVisible = ref(false)
const isCallVisible = ref(false)

const authStore = useAuthStore()
const profileStore = useProfileStore()
const router = useRouter()
const route = useRoute()

let color = ref('')
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const isDrawerOpen = ref(false)
const isHomePage = computed(() => route.path === '/')

// Check token on component mount
onMounted(() => {
  const rootStyles = getComputedStyle(document.documentElement)
  color.value = rootStyles.getPropertyValue('--bgcolor').trim()

  checkTokenValidity()
  const tokenCheckInterval = setInterval(checkTokenValidity, 5 * 60 * 1000)

  // Apply styles to printing menu item if on home page
  if (isHomePage.value) {
    const applyPrintingStyles = () => {
      const printingItem = document.querySelector('.printing-menu-item')
      if (printingItem) {
        const element = printingItem as HTMLElement
        element.style.color = '#333'
        const textSpan = element.querySelector('.printing-text')
        if (textSpan) {
          ;(textSpan as HTMLElement).style.color = '#333'
        }
      }
    }

    // Apply immediately and after a short delay to ensure DOM is ready
    applyPrintingStyles()
    setTimeout(applyPrintingStyles, 100)

    // Watch for route changes
    const unwatch = router.afterEach(() => {
      setTimeout(applyPrintingStyles, 100)
    })

    onUnmounted(() => {
      clearInterval(tokenCheckInterval)
      unwatch()
    })
  } else {
    onUnmounted(() => {
      clearInterval(tokenCheckInterval)
    })
  }
})

// Function to check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    console.log('isTokenExpired', payload.exp - currentTime)
    return payload.exp < currentTime
  } catch (error) {
    console.error('Error parsing token:', error)
    return true // Consider invalid tokens as expired
  }
}

// Function to check token validity and logout if expired
function checkTokenValidity() {
  const token = authStore.getToken
  if (token && isTokenExpired(token)) {
    console.log('Token expired, logging out...')
    ElMessage.warning('Сессия истекла. Войдите в систему снова.')
    authStore.clearToken()
    router.push({ name: 'home' })
  }
}

function onLogout() {
  authStore.clearToken()
  router.push({ name: 'home' })
}

function onCallRequest() {
  isCallVisible.value = true
}

// function scrollToAbout() {
//   const aboutElement = document.getElementById("about");
//   if (aboutElement) {
//     aboutElement.scrollIntoView({ behavior: "smooth" });
//   }
// }
</script>

<template>
  <div class="uppermenu-wrapper" :class="{ 'fullscreen-bg': isHomePage }">
    <div v-if="isHomePage" class="background-overlay"></div>
    <el-row :gutter="0" class="uppermenu-row">
      <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
        <el-header class="uppermenu-header">
          <div class="left-wrap">
            <el-button v-if="isMobile" class="burger-btn" text @click="isDrawerOpen = true">
              <el-icon size="26" color="#fff">
                <Menu />
              </el-icon>
            </el-button>

            <div v-if="!isMobile" class="menu-container">
              <!-- Красная кнопка АЭРОМАКС -->
              <el-button class="logo-btn" @click="router.push({ path: '/' })"> АЭРОМАКС </el-button>

              <!-- Меню с выпадающим списком -->
              <el-menu
                :default-active="activeIndex"
                class="main-menu"
                mode="horizontal"
                :ellipsis="false"
                background-color="transparent"
                :text-color="isHomePage ? '#fff' : '#333'"
                :active-text-color="isHomePage ? '#fff' : '#333'"
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
                    <template #title>Механообрабатывающее производство ></template>
                    <el-menu-item index="/machining" :route="{ path: '/machining' }">
                      Токарные работы
                    </el-menu-item>
                    <el-menu-item index="/milling" :route="{ path: '/milling' }">
                      Фрезерные работы
                    </el-menu-item>
                  </el-sub-menu>
                  <el-menu-item
                    index="/printing"
                    :route="{ path: '/printing' }"
                    class="printing-menu-item"
                  >
                    <span class="printing-text">3D печать</span>
                  </el-menu-item>
                  <!-- <el-menu-item index="/paint" :route="{ path: '/paint' }" disabled>
                    Лабораторные исследования
                  </el-menu-item> -->
                  <!-- <el-sub-menu index="1-2" disabled>
                    <template #title>Сварочное производство</template>
                    <el-menu-item index="1-2-1">Аргонодуговая сварка</el-menu-item>
                    <el-menu-item index="1-2-2">
                      Сварка в углекислом газе
                    </el-menu-item>
                    <el-menu-item index="1-2-3">Контактная сварка</el-menu-item>
                  </el-sub-menu>  -->
                </el-sub-menu>
              </el-menu>

              <el-button class="call-btn" @click="onCallRequest"> Заказать звонок </el-button>
            </div>
          </div>

          <div class="right-wrap">
            <template v-if="!authStore.getToken">
              <el-button v-if="!isMobile" class="auth-btn" @click="isLoginVisible = true">
                Войти / Регистрация
              </el-button>
              <el-button
                v-else
                class="auth-btn"
                @click="isLoginVisible = true"
                circle
                :aria-label="'Войти или зарегистрироваться'"
              >
                <el-icon :size="22">
                  <User />
                </el-icon>
              </el-button>
            </template>
            <template v-else>
              <span class="username" @click="router.push({ path: '/personal' })">
                {{ profileStore.profile?.username }}
              </span>
              <el-icon :size="30" class="user-icon" @click="router.push({ path: '/personal' })">
                <User />
              </el-icon>
              <el-button class="auth-btn" @click="onLogout"> Выйти </el-button>
            </template>
          </div>
        </el-header>
      </el-col>
      <DialogLogin v-model="isLoginVisible" />
      <DialogCall v-model="isCallVisible" />
    </el-row>

    <!-- Hero content on home page -->
    <div v-if="isHomePage" class="hero-content">
      <el-row :gutter="0">
        <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
          <h1 class="hero-title">
            КОМПЛЕКС ПРЕДПРИЯТИЙ<br />
            ПОЛНОГО ЦИКЛА
          </h1>
          <p class="hero-description">
            АЭРОМАКС - комплекс предприятий для выполнения<br />
            задач в области механообработки, работы<br />
            с полимерными и композиционными материалами.
          </p>
          <p class="hero-slogan">Оптимизируйте, развивайте и производите.</p>
        </el-col>
      </el-row>
    </div>
  </div>

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
            <template #title>Мех. производство ></template>
            <el-menu-item index="/machining" :route="{ path: '/machining' }"
              >Токарные работы</el-menu-item
            >
            <el-menu-item index="/milling" :route="{ path: '/milling' }"
              >Фрезерные работы</el-menu-item
            >
            <!-- <el-menu-item index="m1-1-5" disabled>Раскрой металла / заготовительный участок</el-menu-item> -->
            <!-- <el-menu-item index="m1-1-1" disabled>Сверлильные работы</el-menu-item> -->
            <!-- <el-menu-item index="m1-1-2" disabled>Шлифовка</el-menu-item> -->
          </el-sub-menu>
          <!-- <el-menu-item index="/plastic" :route="{ path: '/plastic' }" disabled>Производство из композитных материалов</el-menu-item> -->
          <!-- <el-menu-item index="/paint" :route="{ path: '/paint' }" disabled>Нанесение лакокрасочных покрытий</el-menu-item> -->
          <el-menu-item index="/printing" :route="{ path: '/printing' }">3D печать</el-menu-item>
          <!-- <el-menu-item index="/paint" :route="{ path: '/paint' }" disabled>Лабораторные исследования</el-menu-item> -->
          <!-- <el-sub-menu index="m1-2" disabled>
            <template #title>Сварочное производство</template>
            <el-menu-item index="m1-2-1">Аргонодуговая сварка</el-menu-item>
            <el-menu-item index="m1-2-2">Сварка в углекислом газе</el-menu-item>
            <el-menu-item index="m1-2-3">Контактная сварка</el-menu-item>
          </el-sub-menu> -->
        </el-sub-menu>
        <!-- <el-menu-item index="/#about" @click="() => { scrollToAbout(); }">О нас</el-menu-item> -->
      </el-menu>
    </div>
  </el-drawer>
</template>

<style scoped>
.uppermenu-wrapper {
  position: relative;
  width: 100%;
  background-color: var(--bgcolor);
}

.uppermenu-wrapper.fullscreen-bg {
  height: 573px;
  background-image: url('/homePage/about.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  position: relative;
}

.uppermenu-wrapper.fullscreen-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 0;
  pointer-events: none;
}

.uppermenu-row {
  position: relative;
  z-index: 2;
  background-color: transparent;
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

.fullscreen-bg .services-title {
  color: #fff;
}

.dropdown-icon {
  color: #d61e3c;
  margin-left: 8px;
  font-size: 12px;
}

.burger-btn {
  color: #333;
}

.fullscreen-bg .burger-btn {
  color: #fff;
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

.fullscreen-bg .call-btn {
  color: #fff;
}

.call-btn:hover,
.call-btn:focus,
.call-btn:active {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #333 !important;
}

.fullscreen-bg .call-btn:hover,
.fullscreen-bg .call-btn:focus,
.fullscreen-bg .call-btn:active {
  color: #fff !important;
}

.auth-btn {
  background-color: transparent;
  color: #333;
  border: none;
  font-size: 18px;
  font-weight: 500;
  padding: 8px 16px;
  margin-right: 8px;
  height: auto;
}

.fullscreen-bg .auth-btn {
  color: #fff;
}

.auth-btn:hover,
.auth-btn:focus,
.auth-btn:active {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #333 !important;
  margin-right: 8px !important;
}

.fullscreen-bg .auth-btn:hover,
.fullscreen-bg .auth-btn:focus,
.fullscreen-bg .auth-btn:active {
  color: #fff !important;
}

.username {
  color: #333;
  padding-right: 5px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
}

.fullscreen-bg .username {
  color: #fff;
}

.user-icon {
  margin-right: 10px;
  color: #333;
  cursor: pointer;
}

.fullscreen-bg .user-icon {
  color: #fff;
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

.fullscreen-bg :deep(.el-sub-menu__title) {
  color: #fff !important;
}

:deep(.el-sub-menu) {
  font-size: 18px;
}

:deep(.el-sub-menu__title:hover) {
  color: #333 !important;
  background-color: transparent !important;
}

.fullscreen-bg :deep(.el-sub-menu__title:hover) {
  color: #fff !important;
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

:deep(.el-menu-item) {
  color: #333 !important;
}

.fullscreen-bg :deep(.main-menu > .el-menu-item),
.fullscreen-bg :deep(.el-sub-menu__title) {
  color: #fff !important;
}

:deep(.el-menu-item:hover) {
  color: #333 !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.fullscreen-bg :deep(.main-menu > .el-menu-item:hover),
.fullscreen-bg :deep(.el-sub-menu__title:hover) {
  color: #fff !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-sub-menu .el-menu .el-menu-item) {
  color: #333 !important;
}

:deep(.el-sub-menu .el-menu .el-menu-item:hover) {
  color: #333 !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

:deep(.el-sub-menu .el-menu) {
  background-color: #fff !important;
}

:deep(.el-sub-menu .el-menu .el-menu-item) {
  color: #333 !important;
}

:deep(.el-sub-menu .el-menu .el-menu-item:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.fullscreen-bg :deep(.services-menu .el-menu .el-menu-item.printing-menu-item),
.fullscreen-bg :deep(.el-sub-menu .el-menu .el-menu-item.printing-menu-item) {
  color: #333 !important;
}

.fullscreen-bg :deep(.services-menu .el-menu .el-menu-item.printing-menu-item .printing-text),
.fullscreen-bg :deep(.el-sub-menu .el-menu .el-menu-item.printing-menu-item .printing-text),
.fullscreen-bg :deep(.services-menu .el-menu .el-menu-item.printing-menu-item *),
.fullscreen-bg :deep(.el-sub-menu .el-menu .el-menu-item.printing-menu-item *) {
  color: #333 !important;
}

.fullscreen-bg :deep(.services-menu .el-menu .el-menu-item.printing-menu-item:hover),
.fullscreen-bg :deep(.el-sub-menu .el-menu .el-menu-item.printing-menu-item:hover) {
  color: #333 !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.fullscreen-bg :deep(.services-menu .el-menu .el-menu-item.printing-menu-item:hover .printing-text),
.fullscreen-bg :deep(.el-sub-menu .el-menu .el-menu-item.printing-menu-item:hover .printing-text) {
  color: #333 !important;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 60px 0 80px;
}

.hero-title {
  font-size: 64px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  line-height: 1.2;
  margin: 0 0 40px 0;
  letter-spacing: 2px;
  text-align: left;
}

.hero-description {
  font-size: 24px;
  color: #fff;
  line-height: 1.6;
  margin: 0 0 30px 0;
  text-align: left;
}

.hero-slogan {
  font-size: 20px;
  color: #fff;
  font-weight: 500;
  margin: 0;
  text-align: left;
}

@media (max-width: 767px) {
  .uppermenu-wrapper {
    min-height: auto;
  }

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

  .hero-content {
    padding: 40px 20px 60px;
  }

  .hero-title {
    font-size: 32px;
    margin-bottom: 24px;
    letter-spacing: 1px;
    text-align: center;
  }

  .hero-description {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
  }

  .hero-slogan {
    font-size: 16px;
    text-align: center;
  }
}

.drawer-content {
  padding: 12px;
}
</style>
