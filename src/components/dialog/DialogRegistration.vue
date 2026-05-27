<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  createPhoneNumberValidator,
  formatPhoneDisplay,
  parsePhoneToDigits,
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
  phone_number: '7',
  inn: '',
})

const usernameError = ref('')

const regStore = useRegStore()
const loading = ref(false)
const isAgreementAccepted = ref(false)
const isPolicyAccepted = ref(false)

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
    { validator: createPhoneNumberValidator({ allowEmpty: false }), trigger: ['blur', 'change'] },
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
  isPolicyAccepted.value = false
  // Reset form when closing
  form.value = {
    username: '',
    password: '',
    confirmPassword: '',
    user_type: 'legal',
    email: '',
    full_name: '',
    phone_number: '7',
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
  if (!isAgreementAccepted.value || !isPolicyAccepted.value) {
    ElMessage({
      type: 'warning',
      message: 'Подтвердите согласие с условиями и обработкой данных',
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
    class="dialog-registration"
    title="Регистрация клиента"
    width="557"
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
        class="dialog-registration-form"
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
        <div class="form-field-group">
          <el-form-item prop="full_name">
            <Input v-model="form.full_name" placeholder="ФИО" />
          </el-form-item>
          <el-form-item prop="username" :error="usernameError">
            <Input v-model="form.username" placeholder="Логин" @input="usernameError = ''" />
          </el-form-item>
        </div>

        <div class="form-field-group">
          <el-form-item prop="email">
            <Input v-model="form.email" placeholder="email@mail.ru" type="email" />
          </el-form-item>

          <el-form-item prop="phone_number">
            <Input
              v-model="form.phone_number"
              placeholder="+7 (___) ___-__-__"
              type="tel"
              :formatter="formatPhoneDisplay"
              :parser="parsePhoneToDigits"
            />
          </el-form-item>
        </div>

        <!-- <el-form-item v-if="form.user_type === 'legal'" prop="inn">
          <Input v-model="form.inn" placeholder="ИНН" />
        </el-form-item> -->

        <div class="form-field-group">
          <el-form-item prop="password">
            <Input v-model="form.password" placeholder="Пароль" type="password" />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <Input v-model="form.confirmPassword" placeholder="Пароль" type="password" />
          </el-form-item>
        </div>
      </el-form>

      <div class="agreements">
        <Checkbox v-model="isAgreementAccepted" class="agreement-checkbox">
          Я согласен с
          <router-link
            to="/license"
            target="_blank"
            rel="noopener noreferrer"
            class="agreement-link"
            @click.stop
          >
            условиями Оферты
          </router-link>
        </Checkbox>
        <Checkbox v-model="isPolicyAccepted" class="agreement-checkbox">
          Я согласен на обработку моих персональных данных. С
          <router-link
            to="/policy"
            target="_blank"
            rel="noopener noreferrer"
            class="agreement-link"
            @click.stop
          >
            Политикой обработки персональных данных
          </router-link>
          ознакомлен
        </Checkbox>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="buttons">
          <Button width="fit-content" flat @click="onHaveAccount">Есть аккаунт</Button>
          <Button
            width="fit-content"
            flat
            :loading="loading"
            :disabled="!isAgreementAccepted || !isPolicyAccepted"
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
:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 0;
}

:deep(.el-dialog__body) {
  padding: 40px 0 0;
}

:deep(.el-dialog__footer) {
  padding: 40px 0 0;
}

.dialog-registration-form :deep(.el-form-item) {
  margin-bottom: 0;
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
  margin: 0;
  padding: 0;
}

.body-class {
  padding: 0;
}

.dialog-registration-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  --input-bg: var(--whity);
  --input-radius: 10px;
  --input-font-family: 'Montserrat-Medium';
  --input-text-color: var(--gray-footer);
  --input-font-size: 18px;
  --input-font-weight: 500;
  --input-padding: 14px 16px;
}

.dialog-registration-form :deep(.el-input__placeholder) {
  color: var(--gray-footer);
}

.dialog-registration-form :deep(.el-form-item__error) {
  position: static;
  padding-top: 6px;
  line-height: 1.2;
}

.form-field-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dialog-footer {
  padding: 0;
}

.buttons {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.agreements {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agreement-checkbox {
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
  --checkbox-check-width: 5px;
  --checkbox-check-height: 10px;
  --checkbox-check-border-width: 2px;
  --checkbox-check-color: #000;
  width: 100%;
}

.agreement-checkbox :deep(.el-checkbox__label) {
  white-space: normal;
}

.agreement-link {
  color: inherit;
  text-decoration: underline;
}

.buttons :deep(.btn.is-disabled) {
  background: var(--gray-footer) !important;
  color: #fff;
  opacity: 1;
}

@media (max-width: 767px) {
  :deep(.el-dialog__header) {
    padding: 16px 16px 0;
  }

  :deep(.el-dialog__body) {
    padding: 40px 16px 0;
  }

  :deep(.el-dialog__footer) {
    padding: 40px 16px 16px;
  }

  .buttons {
    gap: 12px;
  }
}
</style>

<style>
.dialog-registration {
  padding: 40px;
  border-radius: 20px !important;
  background: #fff;
  overflow: hidden;
}
</style>
