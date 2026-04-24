<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import DialogRegistration from './DialogRegistration.vue'
import Button from '../ui/Button.vue'
import Checkbox from '../ui/Checkbox.vue'
import { useWindowSize } from '@vueuse/core'
// import { useRouter } from 'vue-router'

let dialogFormVisible = defineModel<boolean>()

const formData = reactive({
  username: '',
  password: '',
})

const isRememberMe = ref(false)
const loginError = ref('')

const isRegistrationVisible = ref(false)

const authStore = useAuthStore()
// const router = useRouter()

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const onSubmit = async () => {
  console.log('onSubmit', { formData })
  if (!formData.username || !formData.password) return
  loginError.value = ''
  try {
    await authStore.login(formData, isRememberMe.value)
    console.log('Dialog-login: token', authStore.getToken)

    formData.username = ''
    formData.password = ''
    loginError.value = ''
    dialogFormVisible.value = false
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ошибка входа'
    console.log({ message })
    loginError.value = 'Неправильное имя пользователя или пароль'
  }
}

const onRegistration = async () => {
  console.log('onRegistration')
  dialogFormVisible.value = false
  isRegistrationVisible.value = true
}

const onOpenLogin = () => {
  isRegistrationVisible.value = false
  loginError.value = ''
  dialogFormVisible.value = true
}

// const onRestore = async () => {
//   console.log('onRestore')
//   dialogFormVisible.value = false
// }
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="Вход в аккаунт"
    width="477"
    :fullscreen="isMobile"
    :append-to-body="true"
    :modal-append-to-body="true"
    :z-index="4000"
  >
    <template #header="{ titleId }">
      <div class="dialog-header">
        <div :id="titleId" class="maas-subtitle">Вход в аккаунт</div>
        <div v-if="loginError" class="login-error">{{ loginError }}</div>
      </div>
    </template>
    <div class="body-class">
      <el-form class="dialog-login-form" :model="formData">
        <el-form-item>
          <Input v-model="formData.username" placeholder="Логин" />
        </el-form-item>
        <el-form-item>
          <Input v-model="formData.password" type="password" placeholder="Пароль" />
        </el-form-item>
      </el-form>
      <div class="remember-row">
        <Checkbox v-model="isRememberMe" class="remember-checkbox">
          Запомнить данные
        </Checkbox>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div class="buttons">
          <Button width="fit-content" flat @click="onSubmit">Войти</Button>
          <Button v-if="true" width="fit-content" flat @click="onRegistration"> Регистрация </Button>
        </div>
        <!-- <div class="restore" @click="onRestore">Восстановить пароль</div> -->
      </div>
    </template>
  </el-dialog>
  <DialogRegistration v-model="isRegistrationVisible" @open-login="onOpenLogin" />
</template>

<style scoped>
.buttons {
  display: flex;
  gap: 12px;
  padding-bottom: 0;
  flex-wrap: wrap;
}
.dialog-header {
  margin: 0;
  padding: 0;
}

.login-error {
  margin-top: 10px;
  color: #f56c6c;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
}
.dialog-footer {
  padding: 40px 0 0;
}
.restore {
  margin: 20px 0 50px;
  cursor: pointer;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
}
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

.body-class {
  padding: 0;
}

.dialog-login-form {
  --input-bg: var(--whity);
  --input-radius: 10px;
  --input-font-family: 'Montserrat-Medium';
  --input-text-color: var(--gray-footer);
  --input-font-size: 18px;
  --input-font-weight: 500;
  --input-padding: 14px 16px;
  max-width: 397px;
}

.dialog-login-form :deep(.el-form-item) {
  margin-bottom: 10px;
}

.dialog-login-form :deep(.el-input__placeholder) {
  color: var(--gray-footer);
}

.dialog-login-form :deep(.el-form-item__error) {
  position: static;
  padding-top: 6px;
  line-height: 1.2;
}

.remember-row {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.remember-checkbox {
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
  --checkbox-check-left: 8px;
  --checkbox-check-top: 4px;
  --checkbox-check-width: 5px;
  --checkbox-check-height: 10px;
  --checkbox-check-border-width: 2px;
  --checkbox-check-color: #000;
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
