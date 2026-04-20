<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import DialogRegistration from './DialogRegistration.vue'
import Button from '../ui/Button.vue'
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
    width="500"
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
      <el-form :model="formData">
        <el-form-item>
          <Input v-model="formData.username" placeholder="Логин" />
        </el-form-item>
        <el-form-item>
          <Input v-model="formData.password" type="password" placeholder="Пароль" />
        </el-form-item>
      </el-form>
      <div class="remember-row">
        <el-checkbox v-model="isRememberMe" class="remember-checkbox">
          Запомнить данные
        </el-checkbox>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div class="buttons">
          <Button width="27%" @click="onSubmit">Войти</Button>
          <Button v-if="true" width="67%" @click="onRegistration"> Регистрация </Button>
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
  justify-content: space-between;
  padding-bottom: 15px;
}
.dialog-header {
  margin: 20px 0;
  padding: 0 30px;
}

.login-error {
  margin-top: 8px;
  color: #f56c6c;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
}
.dialog-footer {
  padding: 5px 30px 0px;
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
  border-radius: 10px;
}
:deep(.el-input__wrapper) {
  padding: 0;
}
.body-class {
  padding: 0 30px;
}

.remember-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.remember-checkbox {
  --el-checkbox-font-size: 14px;
  --el-checkbox-text-color: #000;
}

.remember-checkbox :deep(.el-checkbox__label) {
  padding-left: 10px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.2;
}

.remember-checkbox :deep(.el-checkbox__inner) {
  width: 24px;
  height: 24px;
  border: 2px solid #8f98a3;
  border-radius: 6px;
  background-color: #e9edf1;
}

.remember-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  border-color: #6c7783;
  background-color: #dfe5ea;
}

.remember-checkbox :deep(.el-checkbox__inner::after) {
  border-width: 2px;
  border-color: #000;
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
}

.remember-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: #000;
}
</style>
