<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useWindowSize } from '@vueuse/core'
import { req_json_auth } from '../../api'

const dialogFormVisible = defineModel<boolean>()

// User interface - defines the structure of user data
interface IUser {
  id?: number
  user_id?: number
  username?: string
  email?: string
  full_name?: string
  user_type?: string
  phone_number?: string
  inn?: string
  [key: string]: any
}

// Prop to receive user data for editing
const props = defineProps<{
  user?: IUser | null
}>()

interface FormData {
  username: string
  user_type: string
  email: string
  full_name?: string
  phone_number?: string
  inn?: string
}

const formRef = ref<FormInstance>()
const form = ref<FormData>({
  username: '',
  user_type: 'individual',
  email: '',
  full_name: '',
  phone_number: '',
  inn: '',
})

const usernameError = ref('')
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

const validateEmailNoCyrillic = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (containsCyrillic(value)) {
    callback(new Error('Email не должен содержать кириллицу'))
  } else {
    callback()
  }
}

const validatePhoneNumber = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback()
    return
  }
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
    { validator: validatePhoneNumber, trigger: ['blur', 'change'] },
  ],
})

// Watch for user prop changes to populate form
watch(
  () => props.user,
  (newUser) => {
    if (newUser && dialogFormVisible.value) {
      form.value = {
        username: newUser.username || '',
        user_type: newUser.user_type || 'individual',
        email: newUser.email || '',
        full_name: newUser.full_name || '',
        phone_number: newUser.phone_number || '',
        inn: newUser.inn || '',
      }
      usernameError.value = ''
    }
  },
  { immediate: true }
)

// Watch for dialog visibility to populate form when opened
watch(dialogFormVisible, (isVisible) => {
  if (isVisible && props.user) {
    form.value = {
      username: props.user.username || '',
      user_type: props.user.user_type || 'individual',
      email: props.user.email || '',
      full_name: props.user.full_name || '',
      phone_number: props.user.phone_number || '',
      inn: props.user.inn || '',
    }
    usernameError.value = ''
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  }
})

const closeDialog = () => {
  dialogFormVisible.value = false
  // Reset form when closing
  form.value = {
    username: '',
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
  if (!formRef.value || !props.user) return

  // Use user_id if available, otherwise fall back to id
  const userId = props.user.user_id || props.user.id
  if (!userId) {
    ElMessage.error('Не удалось определить ID пользователя')
    return
  }

  try {
    await formRef.value.validate()
    loading.value = true

    // Prepare update payload - exclude undefined values
    const updateData: Partial<FormData> = {
      username: form.value.username,
      user_type: form.value.user_type,
      email: form.value.email,
    }

    if (form.value.full_name) updateData.full_name = form.value.full_name
    if (form.value.phone_number) updateData.phone_number = form.value.phone_number
    if (form.value.inn) updateData.inn = form.value.inn

    // Make PUT request to update user using user_id endpoint
    const response = await req_json_auth(`/users/${userId}`, 'PUT', updateData)

    if (response && response.ok) {
      ElMessage({
        type: 'success',
        message: 'Пользователь успешно обновлен!',
      })

      // Emit event to notify parent component to refresh the list
      closeDialog()
      // Emit custom event for parent to handle refresh
      emit('updated')
    } else {
      ElMessage({
        type: 'error',
        message: 'Ошибка при обновлении пользователя',
      })
    }
  } catch (error) {
    console.error('Form validation/submit failed:', { error })
    if (error instanceof Error && /400 Bad Request/i.test(error.message)) {
      usernameError.value = 'Такой пользователь уже существует'
      return
    }
    ElMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Ошибка при обновлении пользователя',
    })
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  updated: []
}>()
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="Редактирование пользователя"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :fullscreen="isMobile"
    @close="closeDialog"
  >
    <template #header="{ titleId }">
      <div class="dialog-header">
        <h3 :id="titleId" class="titleClass">Редактирование пользователя</h3>
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

      <el-form-item>
        <el-button type="primary" class="btn" native-type="submit" style="width: 100%; margin-top: 10px;" :loading="loading">
          {{ loading ? 'Сохранение...' : 'Сохранить' }}
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

