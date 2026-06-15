<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import { usePasswordStore } from '../../stores/password.store'
import { UI_MESSAGES } from '../../helpers/password-recovery'

const dialogFormVisible = defineModel<boolean>()
const emit = defineEmits<{
  openLogin: []
}>()

const email = ref('')
const isSending = ref(false)
const successMessage = ref('')

const passwordStore = usePasswordStore()
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const canSend = computed(() => passwordStore.canResend() && email.value.trim().length > 0)

function resetForm() {
  email.value = ''
  successMessage.value = ''
  isSending.value = false
}

watch(dialogFormVisible, (visible) => {
  if (!visible) resetForm()
})

const onSubmit = async () => {
  if (!email.value.trim()) {
    ElMessage.warning('Введите email')
    return
  }

  isSending.value = true
  successMessage.value = ''
  try {
    const result = await passwordStore.sendRecovery(email.value)
    successMessage.value = result.message || UI_MESSAGES.recoverySendSuccess
    ElMessage.success(successMessage.value)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : 'Не удалось отправить письмо')
  } finally {
    isSending.value = false
  }
}

const onOpenLogin = () => {
  dialogFormVisible.value = false
  emit('openLogin')
}
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    class="dialog-forgot-password"
    title="Восстановление пароля"
    width="477"
    :fullscreen="isMobile"
    :append-to-body="true"
    :modal-append-to-body="true"
    :z-index="4000"
  >
    <template #header="{ titleId }">
      <div class="dialog-header">
        <div :id="titleId" class="maas-subtitle">Восстановление пароля</div>
      </div>
    </template>

    <div class="body-class">
      <p class="forgot-hint">
        Введите email, указанный при регистрации. Мы отправим ссылку для сброса пароля.
      </p>

      <el-form
        id="dialog-forgot-form"
        class="dialog-forgot-form"
        @submit.prevent="onSubmit"
      >
        <el-form-item>
          <Input
            v-model="email"
            type="email"
            placeholder="Email"
            autocomplete="email"
            :disabled="!!successMessage"
          />
        </el-form-item>
      </el-form>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="buttons">
          <Button
            v-if="!successMessage"
            form="dialog-forgot-form"
            width="fit-content"
            flat
            :loading="isSending"
            :disabled="!canSend"
            @click="onSubmit"
          >
            Отправить ссылку
          </Button>
          <Button width="fit-content" flat @click="onOpenLogin">
            {{ successMessage ? 'Войти' : 'Вернуться ко входу' }}
          </Button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-header {
  margin: 0;
  padding: 0;
}

.forgot-hint {
  margin: 0 0 20px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: var(--gray-footer);
}

.success-message {
  margin: 16px 0 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: var(--gray-footer);
}

.buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.dialog-footer {
  padding: 40px 0 0;
}

.dialog-forgot-form {
  --input-bg: var(--whity);
  --input-radius: 10px;
  --input-font-family: 'Montserrat-Medium';
  --input-text-color: var(--gray-footer);
  --input-font-size: 18px;
  --input-font-weight: 500;
  --input-padding: 14px 16px;
  max-width: 397px;
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
.dialog-forgot-password {
  padding: 40px;
  border-radius: 20px !important;
  background: #fff;
  overflow: hidden;
}
</style>
