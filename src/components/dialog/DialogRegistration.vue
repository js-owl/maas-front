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

const validateLogin = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('Пожалуйста, введите логин'))
  } else if (value.length < 4) {
    callback(new Error('Логин должен содержать минимум 4 символа'))
  } else {
    callback()
  }
}

const validatePassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('Пожалуйста, введите пароль'))
  } else if (value.length < 6) {
    callback(new Error('Пароль должен содержать минимум 6 символов'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('Пожалуйста, подтвердите пароль'))
  } else if (value !== form.value.password) {
    callback(new Error('Пароли не совпадают'))
  } else {
    callback()
  }
}

const rules = ref<FormRules<FormData>>({
  user_type: [{ required: true, message: 'Выберите тип пользователя', trigger: 'change' }],
  username: [{ validator: validateLogin, trigger: 'blur' }],
  email: [
    { required: true, message: 'Пожалуйста, введите email', trigger: 'blur' },
    { type: 'email', message: 'Введите корректный email', trigger: ['blur', 'change'] },
  ],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
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
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="0"
      label-position="top"
      @submit.prevent="submitForm"
    >
      <el-form-item prop="user_type">
        <el-radio-group v-model="form.user_type">
          <el-radio-button value="individual">Частное лицо</el-radio-button>
          <el-radio-button value="legal">Компания</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Логин*" prop="username" :error="usernameError">
        <el-input
          v-model="form.username"
          placeholder="Введите username"
          @input="usernameError = ''"
        />
      </el-form-item>

      <el-form-item label="Email*" prop="email">
        <el-input v-model="form.email" placeholder="Введите email" type="email" />
      </el-form-item>

      <el-form-item label="Полное имя" prop="full_name">
        <el-input v-model="form.full_name" placeholder="Введите полное имя (необязательно)" />
      </el-form-item>

      <el-form-item label="Телефон" prop="phone_number">
        <el-input v-model="form.phone_number" placeholder="Введите телефон (необязательно)" />
      </el-form-item>

      <el-form-item v-if="form.user_type === 'legal'" label="ИНН" prop="inn">
        <el-input v-model="form.inn" placeholder="Введите ИНН" />
      </el-form-item>

      <el-form-item label="Пароль*" prop="password">
        <el-input
          v-model="form.password"
          placeholder="Введите пароль"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item label="Подтвердите пароль*" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          placeholder="Подтвердите пароль"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit" style="width: 100%" :loading="loading">
          {{ loading ? 'Регистрация...' : 'Регистрация' }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
