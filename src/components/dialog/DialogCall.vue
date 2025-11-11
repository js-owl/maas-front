<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { req_json } from '../../api'
import { useWindowSize } from '@vueuse/core'

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

  // Проверяем, что номер содержит от 10 до 11 цифр и начинается с 7 или 8
  const isValid =
    (cleanNumber.length === 11 && cleanNumber.startsWith('7')) ||
    (cleanNumber.length === 10 && cleanNumber.startsWith('9')) ||
    (cleanNumber.length === 11 && cleanNumber.startsWith('8'))

  if (!isValid) {
    callback(new Error('Пожалуйста, введите корректный номер телефона'))
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
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :fullscreen="isMobile"
    @close="closeDialog"
  >
    <template #header="{ titleId }">
      <div class="dialog-header">
          <h3 :id="titleId" class="titleClass">Заказать звонок</h3>
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
      <el-form-item prop="name">
        <el-input v-model="form.name" placeholder="Имя" />
      </el-form-item>

      <el-form-item prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="+7 (___) ___-__-__"
          :formatter="(value: string) => formatPhone(value)"
          :parser="(value: string) => parsePhone(value)"
        />
      </el-form-item>

      <el-form-item prop="product">
        <el-select v-model="form.product" placeholder="Выберите продукт" style="width: 100%">
          <el-option label="Токарные работы" value="machining" />
          <el-option label="Фрезерные работы" value="milling" />
          <el-option label="Другое" value="other" />
        </el-select>
      </el-form-item>

      <el-form-item prop="time">
        <el-select v-model="form.time" placeholder="Выберите удобное время" style="width: 100%">
          <el-option label="9:00 - 10:00" value="09:00-10:00" />
          <el-option label="10:00 - 11:00" value="10:00-11:00" />
          <el-option label="11:00 - 12:00" value="11:00-12:00" />
          <el-option label="12:00 - 13:00" value="12:00-13:00" />
          <el-option label="13:00 - 14:00" value="13:00-14:00" />
          <el-option label="14:00 - 15:00" value="14:00-15:00" />
          <el-option label="15:00 - 16:00" value="15:00-16:00" />
          <el-option label="16:00 - 17:00" value="16:00-17:00" />
          <el-option label="17:00 - 18:00" value="17:00-18:00" />
          <el-option label="18:00 - 19:00" value="18:00-19:00" />
        </el-select>
      </el-form-item>

      <el-form-item prop="additional">
        <el-input
          v-model="form.additional"
          type="textarea"
          :rows="3"
          placeholder="Опишите ваш запрос или оставьте комментарий"
        />
      </el-form-item>

      <el-form-item prop="agreement">
        <el-checkbox v-model="form.agreement">
          <span class="agreement">Я согласен с «Пользовательскими соглашениями ЦКП»</span>
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          class="btn" 
          native-type="submit"
          style="width: 100%"
          :loading="loading"
          :disabled="!form.agreement"
        >
          {{ loading ? 'Отправка...' : 'Заказать звонок' }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.agreement {
  font-size: 15px;
}
:deep(.el-input__wrapper) {
  padding: 0;
}
:deep(.el-textarea__inner) {
  background-color: var(--bgcolor);
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  color: black;
  padding: 20px;
}
:deep(.el-select__wrapper) {
  padding: 15px 20px;
  background-color: var(--bgcolor);
  font-size: 16px;
  font-weight: 600;
  color: black;
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
.btn.is-disabled {
  background-color: var(--gray2);
  border: 1px solid var(--gray2);
  color: gray-footer;
}
.dialog-header {
  text-align: center;
}
.titleClass {
  font-size: 24px;
  font-weight: 600;
}
:deep(.el-form-item__content) { 
  margin-bottom: 20px;
}
@media (max-width: 767px) {
  .agreement {
    font-size: 12px;
  }
}
</style>
