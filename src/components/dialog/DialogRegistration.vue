<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRegStore } from '../../stores/reg.store'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useWindowSize } from '@vueuse/core'

const dialogFormVisible = defineModel<boolean>()

interface FormData {
  username: string
  password: string
  confirmPassword: string
  user_type: string
  email: string
  full_name?: string
  phone_number?: string
  inn?: string
}

const formRef = ref<FormInstance>()
const form = ref<FormData>({
  username: '',
  password: '',
  confirmPassword: '',
  user_type: 'individual',
  email: '',
  full_name: '',
  phone_number: '',
  inn: '',
})

const usernameError = ref('')

const regStore = useRegStore()
const loading = ref(false)

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const containsCyrillic = (value: string) => /[\u0400-\u04FF]/.test(value)

const validateLogin = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('Пожалуйста, введите логин'))
  } else if (value.length < 4) {
    callback(new Error('Логин должен содержать минимум 4 символа'))
  } else if (containsCyrillic(value)) {
    callback(new Error('Логин не должен содержать кириллицу'))
  } else {
    callback()
  }
}

const validatePassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
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

const validateConfirmPassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
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

const validateEmailNoCyrillic = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (containsCyrillic(value)) {
    callback(new Error('Email не должен содержать кириллицу'))
  } else {
    callback()
  }
}

const validatePhoneNumber = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!/^\d+$/.test(value)) {
    callback(new Error('Телефон должен содержать только цифры'))
    return
  }
  const length = value.length
  if (length < 10 || length > 15) {
    callback(new Error('Введите корректный номер телефона (10–15 цифр)'))
    return
  }
  callback()
}

const onPhoneInput = (val: string) => {
  form.value.phone_number = (val || '').replace(/\D/g, '')
}

const rules = ref<FormRules<FormData>>({
  user_type: [{ required: true, message: 'Выберите тип пользователя', trigger: 'change' }],
  username: [
    { required: true, message: 'Пожалуйста, введите логин', trigger: 'blur' },
    { validator: validateLogin, trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Пожалуйста, введите email', trigger: 'blur' },
    { type: 'email', message: 'Введите корректный email', trigger: ['blur', 'change'] },
    { validator: validateEmailNoCyrillic, trigger: ['blur', 'change'] },
  ],
  phone_number: [
    { required: true, message: 'Пожалуйста, введите телефон', trigger: 'blur' },
    { validator: validatePhoneNumber, trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Пожалуйста, подтвердите пароль', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
})

const closeDialog = () => {
  dialogFormVisible.value = false
  // Reset form when closing
  form.value = {
    username: '',
    password: '',
    confirmPassword: '',
    user_type: 'individual',
    email: '',
    full_name: '',
    phone_number: '',
    inn: '',
  }
  usernameError.value = ''
  // Clear validation errors
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    console.log('Form submitted:', form.value)
    await regStore.register(form)

    ElMessage({
      type: 'success',
      message: 'Регистрация успешно завершена!',
    })

    // Close dialog and reset form
    closeDialog()
  } catch (error) {
    console.error('Form validation/submit failed:', { error })
    if (error instanceof Error && /400 Bad Request/i.test(error.message)) {
      usernameError.value = 'Такой пользователь уже существует'
      return
    }
    ElMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Ошибка при регистрации',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="Регистрация"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :fullscreen="isMobile"
    @close="closeDialog"
  >
    <template #header="{ titleId }">
      <div class="dialog-header">
          <h3 :id="titleId" class="titleClass">Регистрация</h3>
        </div>
    </template>
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="0"
      label-position="top"
      @submit.prevent="submitForm"
    >
      <el-form-item prop="user_type">
        <el-radio-group v-model="form.user_type" class="user-type-toggle">
          <el-radio-button value="individual">Частное лицо</el-radio-button>
          <el-radio-button value="legal">Компания</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="username" :error="usernameError">
        <el-input
          v-model="form.username"
          placeholder="Логин"
          @input="usernameError = ''"
        />
      </el-form-item>

      <el-form-item prop="email">
        <el-input v-model="form.email" placeholder="Email" type="email" />
      </el-form-item>

      <el-form-item prop="full_name">
        <el-input v-model="form.full_name" placeholder="Полное имя" />
      </el-form-item>

      <el-form-item prop="phone_number">
        <el-input
          v-model="form.phone_number"
          placeholder="Телефон"
          type="tel"
          inputmode="numeric"
          @input="onPhoneInput"
        />
      </el-form-item>

      <el-form-item v-if="form.user_type === 'legal'" prop="inn">
        <el-input v-model="form.inn" placeholder="ИНН" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          placeholder="Пароль"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          placeholder="Пароль"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="btn" native-type="submit" style="width: 100%; margin-top: 10px;" :loading="loading">
          {{ loading ? 'Регистрация...' : 'Регистрация' }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 20px;
}
:deep(.el-input__wrapper) {
  padding: 0;
}
:deep(.el-input__inner) {
  background-color: var(--bgcolor);
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  color: black;
  padding: 20px;
}
.btn {
  background-color: var(--gray-footer);
  border: 1px solid var(--gray-footer);
  padding: 18px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
}
.user-type-toggle {
  display: flex;
  gap: 30px;
  width: 100%;
}
:deep(.user-type-toggle .el-radio-button) {
  flex: 1;
}
:deep(.user-type-toggle .el-radio-button__inner) {
  background-color: var(--gray2);
  border: none;
  border-radius: 5px;
  color: gray-footer;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 0;
  width: 100%;
  transition: background-color 0.2s ease, color 0.2s ease;
}
:deep(.el-radio-button.is-active .el-radio-button__original-radio:not(:disabled)+.el-radio-button__inner) {
  background-color: var(--gray-footer);
  border: none;
  border-radius: 5px;
  color: white;
}
.dialog-header {
  text-align: center;
}
.titleClass {
  font-size: 24px;
  font-weight: 600;
}
</style>
