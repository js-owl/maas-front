<script lang="ts" setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import { useEmailStore } from '../../stores/email.store'
import DialogRegistration from './DialogRegistration.vue'
import DialogForgotPassword from './DialogForgotPassword.vue'
import Button from '../ui/Button.vue'
import Checkbox from '../ui/Checkbox.vue'
import Input from '../ui/Input.vue'
import { useWindowSize } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  EMAIL_JUST_CONFIRMED_KEY,
  isEmailNotVerifiedError,
  UI_MESSAGES,
} from '../../helpers/email-verification'
import { PASSWORD_JUST_RESET_KEY } from '../../helpers/password-recovery'

let dialogFormVisible = defineModel<boolean>()

const LOGIN_CREDENTIALS_KEY = 'login-credentials'

const formData = reactive({
  username: '',
  password: '',
})

const isRememberMe = ref(false)
const loginError = ref('')
const showEmailVerification = ref(false)
const resendEmail = ref('')
const isResending = ref(false)
const isRegistrationVisible = ref(false)
const isForgotPasswordVisible = ref(false)

const authStore = useAuthStore()
const emailStore = useEmailStore()
const route = useRoute()

function loadSavedCredentials() {
  try {
    const raw = localStorage.getItem(LOGIN_CREDENTIALS_KEY)
    if (!raw) {
      formData.username = ''
      formData.password = ''
      isRememberMe.value = false
      return
    }
    const saved = JSON.parse(raw) as { username?: string; password?: string }
    formData.username = saved.username ?? ''
    formData.password = saved.password ?? ''
    isRememberMe.value = true
  } catch {
    localStorage.removeItem(LOGIN_CREDENTIALS_KEY)
    formData.username = ''
    formData.password = ''
    isRememberMe.value = false
  }
}

function saveCredentials() {
  if (!isRememberMe.value) {
    localStorage.removeItem(LOGIN_CREDENTIALS_KEY)
    return
  }
  localStorage.setItem(
    LOGIN_CREDENTIALS_KEY,
    JSON.stringify({
      username: formData.username,
      password: formData.password,
    }),
  )
}

onMounted(loadSavedCredentials)

watch(isRememberMe, (remember) => {
  if (!remember) {
    localStorage.removeItem(LOGIN_CREDENTIALS_KEY)
    formData.username = ''
    formData.password = ''
  }
})

watch(dialogFormVisible, (visible) => {
  if (visible) {
    loadSavedCredentials()
    if (route.query.verify === '1') {
      showEmailVerification.value = true
      loginError.value = UI_MESSAGES.loginEmailNotVerified
    }
    if (sessionStorage.getItem(EMAIL_JUST_CONFIRMED_KEY) === '1') {
      sessionStorage.removeItem(EMAIL_JUST_CONFIRMED_KEY)
      ElMessage.success('Email подтверждён. Войдите в аккаунт.')
    }
    if (sessionStorage.getItem(PASSWORD_JUST_RESET_KEY) === '1') {
      sessionStorage.removeItem(PASSWORD_JUST_RESET_KEY)
      ElMessage.success('Пароль изменён. Войдите с новым паролем.')
    }
  } else {
    showEmailVerification.value = false
  }
})

watch(
  () => route.query.verify,
  (verify) => {
    if (verify === '1' && dialogFormVisible.value) {
      showEmailVerification.value = true
      loginError.value = UI_MESSAGES.loginEmailNotVerified
    }
  },
)

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const canResendEmail = computed(() => emailStore.canResend())

const onResendConfirmation = async () => {
  if (!resendEmail.value.trim()) {
    ElMessage.warning('Введите email для повторной отправки письма')
    return
  }
  isResending.value = true
  try {
    const result = await emailStore.sendConfirmation(resendEmail.value)
    ElMessage.success(result.message)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : 'Не удалось отправить письмо')
  } finally {
    isResending.value = false
  }
}

const onSubmit = async () => {
  console.log('onSubmit', { formData })
  if (!formData.username || !formData.password) return
  loginError.value = ''
  showEmailVerification.value = false
  try {
    await authStore.login(formData, isRememberMe.value)
    console.log('Dialog-login: token', authStore.getToken)

    saveCredentials()
    if (!isRememberMe.value) {
      formData.username = ''
      formData.password = ''
    }
    loginError.value = ''
    showEmailVerification.value = false
    dialogFormVisible.value = false
  } catch (e) {
    if (isEmailNotVerifiedError(e)) {
      showEmailVerification.value = true
      resendEmail.value = formData.username
      loginError.value = UI_MESSAGES.loginEmailNotVerified
      return
    }
    const message = e instanceof Error ? e.message : 'Ошибка входа'
    console.log({ message })
    loginError.value = 'Неправильное имя пользователя или пароль'
  }
}

const onRegistration = async () => {
  console.log('onRegistration')
  dialogFormVisible.value = false
  isRegistrationVisible.value = true
}

const onOpenLogin = () => {
  isRegistrationVisible.value = false
  isForgotPasswordVisible.value = false
  loginError.value = ''
  showEmailVerification.value = false
  dialogFormVisible.value = true
}

const onRestore = () => {
  dialogFormVisible.value = false
  isForgotPasswordVisible.value = true
}
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    class="dialog-login"
    title="Вход в аккаунт"
    width="477"
    :fullscreen="isMobile"
    :append-to-body="true"
    :modal-append-to-body="true"
    :z-index="4000"
  >
    <template #header="{ titleId }">
      <div class="dialog-header">
        <div :id="titleId" class="maas-subtitle">Вход в аккаунт</div>
        <div v-if="loginError" class="login-error">{{ loginError }}</div>
      </div>
    </template>
    <div class="body-class">
      <el-form
        id="dialog-login-form"
        class="dialog-login-form"
        :model="formData"
        autocomplete="on"
        @submit.prevent="onSubmit"
      >
        <el-form-item>
          <Input
            id="login-username"
            v-model="formData.username"
            name="username"
            autocomplete="username"
            placeholder="Email"
          />
        </el-form-item>
        <el-form-item>
          <Input
            id="login-password"
            v-model="formData.password"
            name="password"
            type="password"
            autocomplete="current-password"
            placeholder="Пароль"
          />
        </el-form-item>
      </el-form>
      <div class="remember-row">
        <Checkbox v-model="isRememberMe" class="remember-checkbox">
          Запомнить данные
        </Checkbox>
      </div>
      <div v-if="showEmailVerification" class="email-verification-block">
        <p class="email-verification-text">{{ UI_MESSAGES.loginEmailNotVerified }}</p>
        <el-form-item>
          <Input
            v-model="resendEmail"
            type="email"
            placeholder="Email для повторной отправки"
            autocomplete="email"
          />
        </el-form-item>
        <Button
          width="fit-content"
          flat
          :loading="isResending"
          :disabled="!canResendEmail"
          @click="onResendConfirmation"
        >
          Отправить письмо снова
        </Button>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div class="buttons">
          <Button form="dialog-login-form" width="fit-content" flat @click="onSubmit">Войти</Button>
          <Button v-if="true" width="fit-content" flat @click="onRegistration"> Регистрация </Button>
        </div>
        <div class="restore" @click="onRestore">Восстановить пароль</div>
      </div>
    </template>
  </el-dialog>
  <DialogRegistration v-model="isRegistrationVisible" @open-login="onOpenLogin" />
  <DialogForgotPassword v-model="isForgotPasswordVisible" @open-login="onOpenLogin" />
</template>

<style scoped>
.buttons {
  display: flex;
  gap: 12px;
  padding-bottom: 0;
  flex-wrap: wrap;
}
.dialog-header {
  margin: 0;
  padding: 0;
}

.login-error {
  margin-top: 10px;
  color: #f56c6c;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
}
.dialog-footer {
  padding: 40px 0 0;
}
.restore {
  margin: 20px 0 50px;
  cursor: pointer;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
}
:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 40px 40px 0;
}

:deep(.el-dialog__body) {
  padding: 40px 40px 0;
}

:deep(.el-dialog__footer) {
  padding: 0 40px 40px;
}

.body-class {
  padding: 0;
}

.dialog-login-form {
  --input-bg: var(--whity);
  --input-radius: 10px;
  --input-font-family: 'Montserrat-Medium';
  --input-text-color: var(--gray-footer);
  --input-font-size: 18px;
  --input-font-weight: 500;
  --input-padding: 14px 16px;
  max-width: 397px;
}

.dialog-login-form :deep(.el-form-item) {
  margin-bottom: 10px;
}

.dialog-login-form :deep(.el-input__placeholder) {
  color: var(--gray-footer);
}

.dialog-login-form :deep(.el-form-item__error) {
  position: static;
  padding-top: 6px;
  line-height: 1.2;
}

.remember-row {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.email-verification-block {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 397px;
}

.email-verification-text {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: var(--gray-footer);
}

.remember-checkbox {
  --checkbox-font-size: 12px;
  --checkbox-text-color: #000;
  --checkbox-label-padding-left: 12px;
  --checkbox-font-family: 'Montserrat-Medium';
  --checkbox-font-weight: 400;
  --checkbox-label-size: 12px;
  --checkbox-line-height: 14px;
  --checkbox-size: 24px;
  --checkbox-border-width: 2px;
  --checkbox-border-color: #7d8083;
  --checkbox-bg-color: var(--bgcolor);
  --checkbox-radius: 4px;
  --checkbox-checked-border-color: #7d8083;
  --checkbox-checked-bg-color: var(--bgcolor);
  --checkbox-check-left: 8px;
  --checkbox-check-top: 4px;
  --checkbox-check-width: 5px;
  --checkbox-check-height: 10px;
  --checkbox-check-border-width: 2px;
  --checkbox-check-color: #000;
}

@media (max-width: 767px) {
  :deep(.el-dialog__header) {
    padding: 16px 16px 0;
  }

  :deep(.el-dialog__body) {
    padding: 24px 16px 0;
  }

  :deep(.el-dialog__footer) {
    padding: 0 16px 16px;
  }

  .dialog-footer {
    padding-top: 24px;
  }
}
</style>

<style>
.dialog-login {
  padding: 40px;
  border-radius: 20px !important;
  background: #fff;
  overflow: hidden;
}
</style>
