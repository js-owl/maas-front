<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import { useAuthStore } from '../stores/auth.store'
import { usePasswordStore } from '../stores/password.store'
import {
  PASSWORD_JUST_RESET_KEY,
  parseTokenFromRoute,
  UI_MESSAGES,
} from '../helpers/password-recovery'

type PageState = 'form' | 'success' | 'error' | 'missingToken'

interface FormData {
  password: string
  confirmPassword: string
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const passwordStore = usePasswordStore()

const formRef = ref<FormInstance>()
const form = ref<FormData>({
  password: '',
  confirmPassword: '',
})
const pageState = ref<PageState>('form')
const errorMessage = ref<string>(UI_MESSAGES.recoveryInvalidLink)
const isSubmitting = ref(false)

const token = computed(() => parseTokenFromRoute(route.query))

const containsCyrillic = (value: string) => /[\u0400-\u04FF]/.test(value)

const validatePassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('Пожалуйста, введите пароль'))
  } else if (value.length < 6) {
    callback(new Error('Пароль должен содержать минимум 6 символов'))
  } else if (containsCyrillic(value)) {
    callback(new Error('Пароль не должен содержать кириллицу'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('Пожалуйста, подтвердите пароль'))
  } else if (containsCyrillic(value)) {
    callback(new Error('Пароль не должен содержать кириллицу'))
  } else if (value !== form.value.password) {
    callback(new Error('Пароли не совпадают'))
  } else {
    callback()
  }
}

const rules = ref<FormRules<FormData>>({
  password: [
    { required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Пожалуйста, подтвердите пароль', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
})

if (!token.value) {
  pageState.value = 'missingToken'
  errorMessage.value = UI_MESSAGES.recoveryMissingToken
}

const goHome = () => {
  router.push({ name: 'home' }).catch(() => undefined)
}

const goLogin = () => {
  router.push({ name: 'home', query: { login: '1' } }).catch(() => undefined)
}

const submitForm = async () => {
  if (!token.value || !formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  isSubmitting.value = true
  try {
    const result = await passwordStore.resetPassword(token.value, form.value.password)

    // Бэкенд отзывает refresh-сессии — очищаем локальный токен и cookie.
    if (authStore.getToken) {
      await authStore.logout()
    } else {
      authStore.clearToken()
    }

    pageState.value = 'success'
    sessionStorage.setItem(PASSWORD_JUST_RESET_KEY, '1')
    ElMessage.success(result.message || UI_MESSAGES.recoveryResetSuccess)

    setTimeout(() => {
      goLogin()
    }, 1500)
  } catch (error) {
    pageState.value = 'error'
    errorMessage.value =
      error instanceof Error ? error.message : UI_MESSAGES.recoveryInvalidLink
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <el-row :gutter="0" style="padding: 60px 0 80px; min-height: 50vh; background-color: var(--bgcolor)">
    <el-col :offset="3" :span="18">
      <div class="reset-password-card">
        <div v-if="pageState === 'form'" class="reset-password-state">
          <div class="maas-subtitle">Новый пароль</div>
          <p class="reset-password-text">
            Введите новый пароль для вашего аккаунта.
          </p>

          <el-form
            ref="formRef"
            id="reset-password-form"
            :model="form"
            :rules="rules"
            class="reset-password-form"
            label-width="0"
            @submit.prevent="submitForm"
          >
            <el-form-item prop="password">
              <Input v-model="form.password" placeholder="Новый пароль" type="password" />
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <Input v-model="form.confirmPassword" placeholder="Подтвердите пароль" type="password" />
            </el-form-item>
          </el-form>

          <Button
            form="reset-password-form"
            width="fit-content"
            flat
            :loading="isSubmitting"
            @click="submitForm"
          >
            Сохранить пароль
          </Button>
        </div>

        <div v-else-if="pageState === 'success'" class="reset-password-state">
          <div class="maas-subtitle">Пароль изменён</div>
          <p class="reset-password-text">{{ UI_MESSAGES.recoveryResetSuccess }}</p>
          <Button width="fit-content" flat @click="goLogin">Войти</Button>
        </div>

        <div v-else class="reset-password-state">
          <div class="maas-subtitle">Не удалось изменить пароль</div>
          <p class="reset-password-text">{{ errorMessage }}</p>
          <Button width="fit-content" flat @click="goHome">На главную</Button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.reset-password-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
}

.reset-password-state {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 420px;
}

.reset-password-text {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--gray-footer);
}

.reset-password-form {
  --input-bg: var(--whity);
  --input-radius: 10px;
  --input-font-family: 'Montserrat-Medium';
  --input-text-color: var(--gray-footer);
  --input-font-size: 18px;
  --input-font-weight: 500;
  --input-padding: 14px 16px;
}

.reset-password-form :deep(.el-form-item) {
  margin-bottom: 10px;
}
</style>
