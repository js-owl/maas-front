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

    width="560"

    :fullscreen="isMobile"

    :append-to-body="true"

    :modal-append-to-body="true"

    :z-index="4000"

  >

    <template #header="{ titleId }">

      <div class="dialog-header">

        <div :id="titleId" class="dialog-title">Восстановление пароля</div>

        <p class="dialog-description">

          Введите адрес почты, к которой привязан аккаунт. Мы отправим вам письмо с кодом подтверждения.

        </p>

      </div>

    </template>



    <div class="body-class">

      <el-form

        id="dialog-forgot-form"

        class="dialog-forgot-form"

        @submit.prevent="onSubmit"

      >

        <el-form-item>

          <Input

            v-model="email"

            type="email"

            placeholder="E-mail"

            autocomplete="email"

            font-size="20px"

            :disabled="!!successMessage"

          />

        </el-form-item>

      </el-form>



      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

    </div>



    <template #footer>

      <div class="dialog-footer">

        <Button

          v-if="!successMessage"

          form="dialog-forgot-form"

          width="100%"

          flat

          class="submit-button"

          :loading="isSending"

          :disabled="!canSend"

          @click="onSubmit"

        >

          Сбросить пароль

        </Button>

        <Button

          v-else

          width="100%"

          flat

          class="submit-button"

          @click="onOpenLogin"

        >

          Войти

        </Button>

      </div>

    </template>

  </el-dialog>

</template>



<style scoped>

.dialog-header {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 20px;

  margin: 0;

  padding: 0;

  text-align: center;

  width: 100%;

}



.dialog-title {

  font-family: 'Montserrat-SemiBold', sans-serif;

  font-size: 24px;

  font-weight: 600;

  line-height: normal;

  color: #000;

  width: 100%;

}



.dialog-description {

  margin: 0;

  font-family: 'Montserrat-Medium', sans-serif;

  font-size: 20px;

  font-weight: 500;

  line-height: normal;

  color: #000;

  width: 100%;

}



.body-class {

  padding: 0;

}



.success-message {

  margin: 20px 0 0;

  font-family: 'Montserrat-Medium', sans-serif;

  font-size: 20px;

  line-height: normal;

  color: #000;

  text-align: center;

}



.dialog-footer {

  display: flex;

  flex-direction: column;

  align-items: stretch;

  gap: 20px;

  padding: 0;

}



.dialog-forgot-form {

  --input-bg: var(--whity);

  --input-radius: 10px;

  --input-font-family: 'Montserrat-Medium';

  --input-text-color: var(--gray-footer);

  --input-font-size: 20px;

  --input-font-weight: 500;

  --input-padding: 16px 24px;

  width: 100%;

}



.dialog-forgot-form :deep(.el-form-item) {

  margin-bottom: 0;

}



.dialog-forgot-form :deep(.el-input__placeholder) {

  color: var(--gray-footer);

}



.dialog-footer :deep(.submit-button.btn) {

  padding: 16px 24px;

}



.dialog-footer :deep(.btn.is-disabled) {

  background: var(--gray-footer) !important;

  color: #fff;

  opacity: 1;

}



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



@media (max-width: 767px) {

  :deep(.el-dialog__body) {

    padding: 24px 0 0;

  }



  :deep(.el-dialog__footer) {

    padding: 24px 0 0;

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



@media (max-width: 767px) {

  .dialog-forgot-password {

    padding: 16px;

  }

}

</style>

