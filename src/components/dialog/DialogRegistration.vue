<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  createPhoneNumberValidator,
  formatPhoneDisplay,
  parsePhoneToDigits,
} from '../../composables/usePhoneValidation'
import { useRegStore } from '../../stores/reg.store'
import { useEmailStore } from '../../stores/email.store'
import { UI_MESSAGES } from '../../helpers/email-verification'
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
  full_name: string
  personal_email: string
  personal_phone_number: string
  password: string
  confirmPassword: string
}

const formRef = ref<FormInstance>()
const form = ref<FormData>({
  full_name: '',
  personal_email: '',
  personal_phone_number: '7',
  password: '',
  confirmPassword: '',
})

const emailError = ref('')

const regStore = useRegStore()
const emailStore = useEmailStore()
const loading = ref(false)
const isAgreementAccepted = ref(false)
const isPolicyAccepted = ref(false)

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const containsCyrillic = (value: string) => /[\u0400-\u04FF]/.test(value)

// Зеркалим бэкенд-валидатор UserCreate: full_name не может быть пустым после trim.
const validateFullName = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value || !value.trim()) {
    callback(new Error('Пожалуйста, введите ФИО'))
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
  full_name: [
    { required: true, message: 'Пожалуйста, введите ФИО', trigger: 'blur' },
    { validator: validateFullName, trigger: 'blur' },
  ],
  personal_email: [
    { required: true, message: 'Пожалуйста, введите email', trigger: 'blur' },
    { type: 'email', message: 'Введите корректный email', trigger: ['blur', 'change'] },
    { validator: validateEmailNoCyrillic, trigger: ['blur', 'change'] },
  ],
  personal_phone_number: [
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
  form.value = {
    full_name: '',
    personal_email: '',
    personal_phone_number: '7',
    password: '',
    confirmPassword: '',
  }
  emailError.value = ''
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
    const { email } = await regStore.register(form)
    const sendResult = await emailStore.sendConfirmation(email)

    ElMessage({
      type: 'success',
      message: UI_MESSAGES.registrationCheckEmail(email),
      duration: 8000,
    })
    if (sendResult.message) {
      ElMessage({
        type: 'info',
        message: sendResult.message,
        duration: 6000,
      })
    }

    closeDialog()
  } catch (error) {
    console.error('Form validation/submit failed:', { error })
    if (error instanceof Error && /уже зарегистрирован/i.test(error.message)) {
      emailError.value = error.message
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
        <el-form-item prop="personal_email" :error="emailError">
          <Input
            v-model="form.personal_email"
            placeholder="E-mail"
            type="email"
            @input="emailError = ''"
          />
        </el-form-item>

        <el-form-item prop="full_name">
          <Input v-model="form.full_name" placeholder="ФИО" />
        </el-form-item>

        <el-form-item prop="personal_phone_number">
          <Input
            v-model="form.personal_phone_number"
            placeholder="+7 (___) ___-__-__"
            type="tel"
            :formatter="formatPhoneDisplay"
            :parser="parsePhoneToDigits"
          />
        </el-form-item>

        <div class="form-field-group">
          <el-form-item prop="password">
            <Input v-model="form.password" placeholder="Пароль" type="password" />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <Input v-model="form.confirmPassword" placeholder="Подтвердите пароль" type="password" />
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
  --checkbox-font-family: 'Montserrat-Regular';
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

