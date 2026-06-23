<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import DialogLogin from './dialog/DialogLogin.vue'
// import DialogCall from './dialog/DialogCall.vue'
import DialogRegistration from './dialog/DialogRegistration.vue'
import { useAuthStore } from '../stores/auth.store'
import { useRouter, useRoute } from 'vue-router'
import IconLogoHeader2 from '../icons/IconLogoHeader2.vue'
import IconLogoMark from '../icons/IconLogoMark.vue'
import IconMobileMenu from '../icons/IconMobileMenu.vue'
import IconCalculate from '../icons/IconCalculate.vue'
import IconReg from '../icons/IconReg.vue'
// import IconCall from '@/icons/IconCall.vue'
import IconEnter from '@/icons/IconEnter.vue'
import IconProfile from '@/icons/IconProfile.vue'
// import IconChat from '@/icons/IconChat.vue'
import IconExit from '@/icons/IconExit.vue'
import ServicesCabinetMenu from './ServicesCabinetMenu.vue'

const isLoginVisible = ref(false)
// const isCallVisible = ref(false)
const isRegistrationVisible = ref(false)

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

let color = ref('')
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const isHomePage = computed(() => route.path === '/')
const isCabinetMenuVisible = ref(false)
const isGuestCabinetMenuVisible = ref(false)
const isMobileMenuVisible = ref(false)
const isServicesMenuVisible = ref(false)

watch(
  () => route.query.login,
  (loginQuery) => {
    if (loginQuery === '1') {
      isLoginVisible.value = true
    }
  },
  { immediate: true }
)

onMounted(() => {
  const rootStyles = getComputedStyle(document.documentElement)
  color.value = rootStyles.getPropertyValue('--bgcolor').trim()
})

async function onLogout() {
  await authStore.logout()
  isCabinetMenuVisible.value = false
  isMobileMenuVisible.value = false
  router.push({ name: 'home' })
}

function openCabinetPage() {
  isCabinetMenuVisible.value = false
  isMobileMenuVisible.value = false
  router.push({ path: '/personal' })
}

function openOrdersPage() {
  isCabinetMenuVisible.value = false
  isMobileMenuVisible.value = false
  router.push({ path: '/personal/orders' })
}

// function openChatPage() {
//   isCabinetMenuVisible.value = false
//   router.push({ path: '/personal' })
// }

// function requestCall() {
//   isCabinetMenuVisible.value = false
//   isGuestCabinetMenuVisible.value = false
//   isCallVisible.value = true
// }

function openGuestRegistration() {
  isGuestCabinetMenuVisible.value = false
  isMobileMenuVisible.value = false
  isRegistrationVisible.value = true
}

function openGuestLogin() {
  isGuestCabinetMenuVisible.value = false
  isMobileMenuVisible.value = false
  isLoginVisible.value = true
}

function openLoginFromRegistration() {
  isRegistrationVisible.value = false
  isLoginVisible.value = true
}

function openServicePage(path: string) {
  isServicesMenuVisible.value = false
  router.push({ path })
}

function scrollToCalcSection() {
  if (isHomePage.value) {
    document.querySelector('.calc-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  router.push({ path: '/' })
}

const mobilePopperOptions = computed(() => ({
  modifiers: [
    {
      name: 'fullWidth',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn({ state }: { state: { styles: { popper: Record<string, string> }; modifiersData: { popperOffsets?: { y: number } } } }) {
        const offsetY = state.modifiersData.popperOffsets?.y ?? 0
        state.styles.popper.width = `${width.value}px`
        state.styles.popper.left = '0px'
        state.styles.popper.right = 'auto'
        state.styles.popper.transform = `translate3d(0px, ${offsetY}px, 0px)`
      },
    },
  ],
}))

// function onCallRequest() {
//   isCallVisible.value = true
// }

// function scrollToAbout() {
//   const aboutElement = document.getElementById("about");
//   if (aboutElement) {
//     aboutElement.scrollIntoView({ behavior: "smooth" });
//   }
// }
</script>

<template>
  <div class="uppermenu-wrapper" :class="{ 'uppermenu-wrapper--home': isHomePage }">
    <el-row :gutter="0" class="uppermenu-row">
      <el-col :offset="isMobile ? 0 : 3" :span="isMobile ? 24 : 18">
        <el-header class="uppermenu-header" :class="{ 'uppermenu-header--mobile': isMobile }">
          <div v-if="isMobile" class="mobile-header">
            <button
              type="button"
              class="mobile-logo-btn"
              @click="router.push({ path: '/' })"
              aria-label="Перейти на главную"
            >
              <IconLogoMark class="mobile-logo-icon" />
            </button>

            <button type="button" class="mobile-calc-btn montserrat-semibold" @click="scrollToCalcSection">
              Расчет стоимости
            </button>

            <el-popover
              v-model:visible="isMobileMenuVisible"
              trigger="click"
              placement="bottom"
              :show-arrow="false"
              popper-class="cabinet-menu-popper cabinet-menu-popper--mobile"
              :popper-options="mobilePopperOptions"
              :offset="8"
            >
              <template #reference>
                <button
                  type="button"
                  class="mobile-menu-btn"
                  aria-label="Открыть меню"
                >
                  <IconMobileMenu class="mobile-menu-icon" />
                </button>
              </template>
              <div v-if="!authStore.getToken" class="cabinet-menu">
                <button
                  type="button"
                  class="cabinet-menu-item montserrat-medium"
                  @click="openGuestRegistration"
                >
                  <el-icon :size="22" class="cabinet-menu-icon"><IconReg /></el-icon>
                  <span>Регистрация</span>
                </button>
                <button
                  type="button"
                  class="cabinet-menu-item montserrat-medium"
                  @click="openGuestLogin"
                >
                  <el-icon :size="22" class="cabinet-menu-icon"><IconEnter /></el-icon>
                  <span>Вход в аккаунт</span>
                </button>
              </div>
              <div v-else class="cabinet-menu">
                <button type="button" class="cabinet-menu-item montserrat-medium" @click="openCabinetPage">
                  <el-icon :size="22" class="cabinet-menu-icon"><IconProfile /></el-icon>
                  <span>Профиль</span>
                </button>
                <button type="button" class="cabinet-menu-item montserrat-medium" @click="openOrdersPage">
                  <el-icon :size="22" class="cabinet-menu-icon"><IconCalculate color="#7в8083" /></el-icon>
                  <span>Расчеты и заказы</span>
                </button>
                <button type="button" class="cabinet-menu-item montserrat-medium" @click="onLogout">
                  <el-icon :size="22" class="cabinet-menu-icon"><IconExit /></el-icon>
                  <span>Выход из аккаунта</span>
                </button>
              </div>
            </el-popover>
          </div>

          <template v-else>
          <div class="left-wrap">
            <div class="menu-container">
              <el-button class="logo-btn" @click="router.push({ path: '/' })" aria-label="Перейти на главную">
                <IconLogoHeader2 class="logo-icon" />
              </el-button>

              <el-popover
                v-model:visible="isServicesMenuVisible"
                trigger="click"
                placement="bottom-start"
                width="321px"
                :show-arrow="false"
                popper-class="cabinet-menu-popper"
                :offset="12"
              >
                <template #reference>
                  <el-button class="cabinet-btn services-title montserrat-semibold">
                    Расчет стоимости
                  </el-button>
                </template>
                <ServicesCabinetMenu @open-service="openServicePage" />
              </el-popover>

              <!-- <el-button class="call-btn" @click="onCallRequest"> Заказать звонок </el-button> -->
            </div>
          </div>

          <div class="right-wrap">
            <!-- Незарегистрированный пользователь -->
            <template v-if="!authStore.getToken">
              <el-popover
                v-model:visible="isGuestCabinetMenuVisible"
                trigger="click"
                placement="bottom-end"
                width="265px"
                :show-arrow="false"
                popper-class="cabinet-menu-popper"
                :offset="12"
              >
                <template #reference>
                  <el-button class="cabinet-btn montserrat-semibold">Вход / Регистрация</el-button>
                </template>
                <div class="cabinet-menu">
                  <button
                    type="button"
                    class="cabinet-menu-item montserrat-medium"
                    @click="openGuestRegistration"
                  >
                    <el-icon :size="22" class="cabinet-menu-icon"><IconReg /></el-icon>
                    <span>Регистрация</span>
                  </button>
                  <!-- <button
                    type="button"
                    class="cabinet-menu-item montserrat-medium"
                    @click="requestCall"
                  >
                    <el-icon :size="22" class="cabinet-menu-icon"><IconCall /></el-icon>
                    <span>Заказать звонок</span>
                  </button> -->
                  <button
                    type="button"
                    class="cabinet-menu-item montserrat-medium"
                    @click="openGuestLogin"
                  >
                    <el-icon :size="22" class="cabinet-menu-icon"><IconEnter /></el-icon>
                    <span>Вход в аккаунт</span>
                  </button>
                </div>
              </el-popover>
              <!-- <el-button
                v-else
                class="auth-btn  montserrat-semibold"
                @click="isLoginVisible = true"
                circle
                :aria-label="'Войти или зарегистрироваться'"
              >
                <el-icon :size="22">
                  <User />
                </el-icon>
              </el-button> -->
            </template>

            <!-- Зарегистрированный пользователь -->
            <template v-else>
              <el-popover
                v-model:visible="isCabinetMenuVisible"
                trigger="click"
                placement="bottom-end"
                width="265px"
                :show-arrow="false"
                popper-class="cabinet-menu-popper"
                :offset="12"
              >
                <template #reference>
                  <el-button class="cabinet-btn montserrat-semibold">Личный кабинет</el-button>
                </template>
                <div class="cabinet-menu">
                  <button type="button" class="cabinet-menu-item montserrat-medium" @click="openCabinetPage">
                    <el-icon :size="22" class="cabinet-menu-icon"><IconProfile /></el-icon>
                    <span>Профиль</span>
                  </button>
                  <button type="button" class="cabinet-menu-item montserrat-medium" @click="openOrdersPage">
                    <el-icon :size="22" class="cabinet-menu-icon"><IconCalculate color="#7в8083" /></el-icon>
                    <span>Расчеты и заказы</span>
                  </button>
                  <!-- <button type="button" disabled class="cabinet-menu-item montserrat-medium" @click="openChatPage">
                    <el-icon :size="22" class="cabinet-menu-icon"><IconChat /></el-icon>
                    <span>Чат</span>
                  </button> -->
                  <!-- <button type="button" class="cabinet-menu-item montserrat-medium" @click="requestCall">
                    <el-icon :size="22" class="cabinet-menu-icon"><IconCall /></el-icon>
                    <span>Заказать звонок</span>
                  </button> -->
                  <button type="button" class="cabinet-menu-item montserrat-medium" @click="onLogout">
                    <el-icon :size="22" class="cabinet-menu-icon"><IconExit /></el-icon>
                    <span>Выход из аккаунта</span>
                  </button>
                </div>
              </el-popover>
              <!-- <el-button v-else class="auth-btn montserrat-semibold" @click="openCabinetPage" circle>
                <el-icon :size="22">
                  <User />
                </el-icon>
              </el-button> -->
            </template>
          </div>
          </template>
        </el-header>
      </el-col>
      <DialogLogin v-model="isLoginVisible" />
      <DialogRegistration v-model="isRegistrationVisible" @open-login="openLoginFromRegistration" />
      <!-- <DialogCall v-model="isCallVisible" /> -->
    </el-row>

  </div>
</template>

<style scoped>
.uppermenu-wrapper {
  position: relative;
  width: 100%;
  background-color: var(--bgcolor);
  padding: 10px 0;
  box-sizing: border-box;
}

.uppermenu-wrapper--home {
  padding: 60px 0 0;
}

.uppermenu-wrapper--home .uppermenu-header {
  height: 53px;
  /* padding: 0 20px; */
}

.uppermenu-wrapper.fullscreen-bg {
  height: 1000px;
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
  width: 100%;
  margin-right: 0;
  padding: 0 20px;
}

.left-wrap {
  display: flex;
  align-items: center;
}

.right-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  gap: 20px;
}

.menu-container {
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo-btn {
  background-color: transparent;
  border: none;
  padding: 0;
  height: auto;
}

.logo-btn:hover,
.logo-btn:focus,
.logo-btn:active {
  background-color: transparent !important;
  border-color: transparent !important;
}

.logo-icon {
  width: 240px;
}

.services-title {
  display: inline-flex;
  align-items: center;
}

.burger-btn {
  color: #333;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  box-sizing: border-box;
}

.mobile-logo-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58.068px;
  height: 36px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.mobile-logo-icon {
  display: block;
  width: 58.068px;
  height: 36px;
}

.mobile-calc-btn {
  flex-shrink: 0;
  height: 36px;
  padding: 8px 24px;
  border: none;
  border-radius: 8px;
  background-color: #ffffff;
  color: #000000;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
  cursor: pointer;
}

.mobile-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background-color: #ffffff;
  box-sizing: border-box;
  cursor: pointer;
}

.mobile-menu-icon {
  display: block;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.fullscreen-bg .burger-btn {
  color: #fff;
}

.auth-btn {
  background-color: transparent;
  color: #333;
  border: none;
  font-size: 24px;
  padding: 8px 16px;
  margin-right: 8px;
  height: auto;
}

.cabinet-btn {
  background-color: #fff;
  color: #55585b;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 24px;
  padding: 0 24px;
  height: 46px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.cabinet-btn:hover,
.cabinet-btn:focus,
.cabinet-btn:active {
  color: #5f646c !important;
  background-color: #fff !important;
  border-color: transparent !important;
}

.cabinet-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  /* min-width: 280px; */
  padding: 3px;
}

.cabinet-menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  border: none;
  background-color: transparent;
  color: #14161a;
  font-size: 18px;
  line-height: 1.2;
  text-align: left;
  padding: 10px 5px;
  border-radius: 12px;
  cursor: pointer;
}

.cabinet-menu-item:hover {
  background-color: #f3f4f6;
}

.cabinet-menu-icon {
  color: #8b9098;
  flex-shrink: 0;
}

:deep(.cabinet-menu-popper.el-popper),
:deep(.cabinet-menu-popper.el-popper.is-light),
:deep(.cabinet-menu-popper.el-popover) {
  --el-popover-border-radius: 20px;
  border-radius: 20px !important;
  border: none;
  box-shadow: 0 14px 34px rgba(30, 35, 44, 0.18);
  padding: 0;
  overflow: hidden;
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

:deep(.el-header) {
  padding-left: 0;
  padding-right: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 60px 0 80px;
}

.hero-title {
  font-size: 64px;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  line-height: 1.2;
  margin: 0 0 40px 0;
  letter-spacing: 2px;
  text-align: left;
}

@media (max-width: 767px) {
  .uppermenu-wrapper {
    min-height: auto;
    padding: 40px 10px 0;
  }

  .uppermenu-wrapper--home {
    padding: 40px 10px 0;
  }

  .uppermenu-header,
  .uppermenu-header--mobile {
    height: 36px;
    margin-right: 0;
    padding: 0;
  }

  .auth-btn {
    font-size: 14px;
    height: 40px;
    margin-left: 8px;
    padding: 0 8px;
  }

  .cabinet-btn {
    font-size: 14px;
    padding: 0 8px;
    height: 40px;
  }

  .logo-btn {
    padding: 0;
  }

  .logo-icon {
    width: 140px;
  }

  .menu-container {
    gap: 15px;
  }

  .services-title {
    font-size: 16px;
  }

  .hero-content {
    padding: 40px 20px 20px;
  }

  .hero-title {
    font-size: 32px;
    margin-bottom: 24px;
    letter-spacing: 1px;
    text-align: center;
  }

}
</style>

<style>
.cabinet-menu-popper.el-popper,
.cabinet-menu-popper.el-popper.is-light,
.cabinet-menu-popper.el-popover {
  --el-popover-border-radius: 20px;
  border-radius: 20px !important;
  overflow: hidden;
}

.cabinet-menu-popper--mobile.el-popper,
.cabinet-menu-popper--mobile.el-popover {
  --el-popover-border-radius: 0;
  width: 100vw !important;
  max-width: 100vw !important;
  border-radius: 0 !important;
  box-shadow: 0 14px 34px rgba(30, 35, 44, 0.18);
}

.cabinet-menu-popper--mobile .cabinet-menu {
  padding: 8px 10px;
}
</style>
