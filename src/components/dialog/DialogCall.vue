<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { req_json } from '../../api'
import { useWindowSize } from '@vueuse/core'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import Checkbox from '../ui/Checkbox.vue'

const dialogFormVisible = defineModel<boolean>()

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

interface FormData {
  name: string
  phone: string
  product: string
  time: string
  additional: string
  agreement: boolean
}

const formRef = ref<FormInstance>()
const form = ref<FormData>({
  name: '',
  phone: '',
  product: '',
  time: '',
  additional: '',
  agreement: false,
})

const loading = ref(false)

const validatePhone = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback()
    return
  }

  // Получаем чистый номер (только цифры)
  const cleanNumber = value.replace(/\D/g, '')

  // Проверяем только длину номера: от 10 до 15 цифр
  const isValid = cleanNumber.length >= 10 && cleanNumber.length <= 15

  if (!isValid) {
    callback(new Error('Номер телефона должен содержать от 10 до 15 цифр'))
  } else {
    callback()
  }
}

const validateAgreement = (_rule: any, value: boolean, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('Необходимо согласиться с условиями'))
  } else {
    callback()
  }
}

// Функции для маски телефона
const formatPhone = (value: string) => {
  if (!value) return value

  // Убираем все нечисловые символы
  const numbers = value.replace(/\D/g, '')

  // Нормализуем номер
  let cleanNumber = numbers
  if (numbers.startsWith('8') && numbers.length === 11) {
    cleanNumber = '7' + numbers.slice(1)
  } else if (numbers.startsWith('9') && numbers.length === 10) {
    cleanNumber = '7' + numbers
  }

  // Форматируем номер
  if (cleanNumber.length <= 1) return cleanNumber
  if (cleanNumber.length <= 4) return `+7 (${cleanNumber.slice(1)}`
  if (cleanNumber.length <= 7) return `+7 (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4)}`
  if (cleanNumber.length <= 9)
    return `+7 (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4, 7)}-${cleanNumber.slice(7)}`
  return `+7 (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4, 7)}-${cleanNumber.slice(
    7,
    9
  )}-${cleanNumber.slice(9, 11)}`
}

const parsePhone = (value: string) => {
  if (!value) return value

  // Убираем все нечисловые символы
  const numbers = value.replace(/\D/g, '')

  // Если номер начинается с 8, заменяем на 7
  return numbers.startsWith('8') ? '7' + numbers.slice(1) : numbers
}

const rules = ref<FormRules<FormData>>({
  name: [
    { required: true, message: 'Пожалуйста, введите имя', trigger: 'blur' },
    {
      min: 2,
      message: 'Имя должно содержать минимум 2 символа',
      trigger: 'blur',
    },
  ],
  phone: [
    {
      required: true,
      message: 'Пожалуйста, введите номер телефона',
      trigger: 'blur',
    },
    { validator: validatePhone, trigger: 'blur' },
  ],
  time: [
    {
      required: true,
      message: 'Пожалуйста, выберите удобное время',
      trigger: 'change',
    },
  ],
  agreement: [{ validator: validateAgreement, trigger: 'change' }],
})

const closeDialog = () => {
  dialogFormVisible.value = false
  // Reset form when closing
  form.value = {
    name: '',
    phone: '',
    product: '',
    time: '',
    additional: '',
    agreement: false,
  }
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

    console.log('Call request submitted:', form.value)

    // Отправляем данные на бэкенд
    await req_json('/call-request', 'POST', form.value)

    ElMessage({
      type: 'success',
      message: 'Заявка на звонок отправлена! Мы свяжемся с вами в ближайшее время.',
    })

    // Close dialog and reset form
    closeDialog()
  } catch (error) {
    console.error('Form submission failed:', error)
    ElMessage({
      type: 'error',
      message: 'Ошибка при отправке заявки. Попробуйте еще раз.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    width="477"
    :z-index="4000"
    append-to-body
    modal-class="dialog-call-overlay"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :fullscreen="isMobile"
    @close="closeDialog"
  >
    <template #header="{ titleId }">
      <div class="dialog-header">
        <div :id="titleId" class="maas-subtitle">Заказать звонок</div>
      </div>
    </template>
    <div class="body-class">
      <el-form
        ref="formRef"
        class="dialog-call-form"
        :model="form"
        :rules="rules"
        label-width="0"
        label-position="top"
        @submit.prevent="submitForm"
      >
        <el-form-item prop="name">
          <Input v-model="form.name" placeholder="Имя" />
        </el-form-item>

        <el-form-item prop="phone">
          <Input
            v-model="form.phone"
            placeholder="+7 (___) ___-__-__"
            type="tel"
            :formatter="(value: string) => formatPhone(value)"
            :parser="(value: string) => parsePhone(value)"
          />
        </el-form-item>

        <el-form-item prop="product">
          <Input v-model="form.product" placeholder="Интересующая услуга" />
        </el-form-item>

        <el-form-item prop="time">
          <Input v-model="form.time" placeholder="Когда вам позвонить?" />
        </el-form-item>

        <el-form-item prop="additional">
          <Input v-model="form.additional" placeholder="Дополнительная информация" />
        </el-form-item>

        <el-form-item prop="agreement" class="agreement-row">
          <Checkbox v-model="form.agreement">
            Я согласен с
            <router-link to="/offer-client" class="agreement-link" @click.stop="closeDialog">
              "Пользовательскими соглашениями ЦКП"
            </router-link>
          </Checkbox>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button
          class="dialog-call-submit"
          width="fit-content"
          flat
          :loading="loading"
          :disabled="!form.agreement"
          @click="submitForm"
        >
          {{ loading ? 'Отправка...' : 'Заказать звонок' }}
        </Button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.el-dialog) {
  border-radius: 20px;
  background: #fff;
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

:deep(.el-form-item) {
  margin-bottom: 10px;
}

.dialog-header {
  margin: 0;
  padding: 0;
}

.body-class {
  padding: 0;
}

.agreement-row {
  margin-top: 20px;
  margin-bottom: 0;
}

.agreement-row :deep(.checkbox) {
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
}

.dialog-call-form {
  --input-bg: var(--whity);
  --input-radius: 10px;
  --input-font-family: 'Montserrat-Medium';
  --input-text-color: var(--gray-footer);
  --input-font-size: 18px;
  --input-font-weight: 500;
  --input-padding: 14px 16px;
  max-width: 397px;
}

.dialog-call-form :deep(.el-input__placeholder) {
  color: var(--gray-footer);
}

.dialog-call-form :deep(.el-form-item__error) {
  position: static;
  padding-top: 6px;
  line-height: 1.2;
}

.agreement-link {
  color: inherit;
  text-decoration: underline;
}

.dialog-footer {
  text-align: left;
  padding: 40px 0 0;
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

  .dialog-header {
    margin: 0;
    padding: 0;
  }

  .body-class {
    padding: 0;
  }

  .dialog-footer {
    padding-top: 24px;
  }
}
</style>

<style>
.dialog-call-overlay {
  z-index: 4000 !important;
}
</style>
