<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  createPhoneNumberValidator,
  normalizePhoneInput,
} from '../../composables/usePhoneValidation'
import { useRegStore } from '../../stores/reg.store'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useWindowSize } from '@vueuse/core'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import Checkbox from '../ui/Checkbox.vue'

const dialogFormVisible = defineModel<boolean>()
const emit = defineEmits<{
  openLogin: []
}>()

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
  user_type: 'legal',
  email: '',
  full_name: '',
  phone_number: '',
  inn: '',
})

const usernameError = ref('')

const regStore = useRegStore()
const loading = ref(false)
const isAgreementAccepted = ref(false)

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

const onPhoneInput = (val: string) => {
  form.value.phone_number = normalizePhoneInput(val)
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
    { validator: createPhoneNumberValidator(), trigger: ['blur', 'change'] },
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
  isAgreementAccepted.value = false
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
  if (!isAgreementAccepted.value) {
    ElMessage({
      type: 'warning',
      message: 'Подтвердите согласие на обработку данных',
    })
    return
  }

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

const onHaveAccount = () => {
  closeDialog()
  emit('openLogin')
}
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="Регистрация клиента"
    width="600"
    :append-to-body="true"
    :modal-append-to-body="true"
    :z-index="4000"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :fullscreen="isMobile"
    @close="closeDialog"
  >
    <template #header="{ titleId }">
      <div class="dialog-header">
        <div :id="titleId" class="maas-subtitle">Регистрация клиента</div>
      </div>
    </template>
    <div class="body-class">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
        label-position="top"
        @submit.prevent="submitForm"
      >
        <!-- <el-form-item prop="user_type">
          <el-radio-group v-model="form.user_type" class="user-type-toggle">
            <el-radio-button value="individual">Частное лицо</el-radio-button>
            <el-radio-button value="legal">Компания</el-radio-button>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item prop="full_name">
          <Input v-model="form.full_name" placeholder="Название компании" />
        </el-form-item>
        <el-form-item prop="username" :error="usernameError">
          <Input v-model="form.username" placeholder="Логин" @input="usernameError = ''" />
        </el-form-item>

        <el-form-item prop="email">
          <Input v-model="form.email" placeholder="Email" type="email" />
        </el-form-item>



        <el-form-item prop="phone_number">
          <Input
            v-model="form.phone_number"
            placeholder="Телефон"
            type="tel"
            @input="onPhoneInput"
          />
        </el-form-item>

        <!-- <el-form-item v-if="form.user_type === 'legal'" prop="inn">
          <Input v-model="form.inn" placeholder="ИНН" />
        </el-form-item> -->

        <el-form-item prop="password">
          <Input v-model="form.password" placeholder="Пароль" type="password" />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <Input v-model="form.confirmPassword" placeholder="Пароль" type="password" />
        </el-form-item>
      </el-form>

      <div class="agreement-row">
        <Checkbox v-model="isAgreementAccepted" class="agreement-checkbox">
          Я согласен с условиями обработки моих данных
        </Checkbox>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="buttons">
          <Button width="42%" @click="onHaveAccount">Есть аккаунт</Button>
          <Button
            width="56%"
            :loading="loading"
            :disabled="!isAgreementAccepted"
            @click="submitForm"
          >
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </Button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 20px;
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
:deep(
    .el-radio-button.is-active
      .el-radio-button__original-radio:not(:disabled)
      + .el-radio-button__inner
  ) {
  background-color: var(--gray-footer);
  border: none;
  border-radius: 5px;
  color: white;
}
.dialog-header {
  margin: 20px 0;
  padding: 0 30px;
}

.body-class {
  padding: 0 30px 30px;
}

.dialog-footer {
  padding: 0px 30px 15px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.agreement-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.agreement-checkbox {
  --checkbox-font-size: 14px;
  --checkbox-text-color: #000;
  --checkbox-label-padding-left: 10px;
  --checkbox-font-family: 'Montserrat-Medium';
  --checkbox-font-weight: 500;
  --checkbox-label-size: 16px;
  --checkbox-line-height: 1.2;
  --checkbox-size: 18px;
  --checkbox-radius: 4px;
}
</style>
