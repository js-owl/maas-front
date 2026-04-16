<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import DialogRegistration from './DialogRegistration.vue'
import Button from '../ui/Button.vue'
import { useWindowSize } from '@vueuse/core'
import { ElMessage } from 'element-plus'
// import { useRouter } from 'vue-router'

let dialogFormVisible = defineModel<boolean>()

const formData = reactive({
  username: '',
  password: '',
})

const isRegistrationVisible = ref(false)

const authStore = useAuthStore()
// const router = useRouter()

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const onSubmit = async () => {
  console.log('onSubmit', { formData })
  if (!formData.username || !formData.password) return
  try {
    await authStore.login(formData)
    console.log('Dialog-login: token', authStore.getToken)

    formData.username = ''
    formData.password = ''
    dialogFormVisible.value = false
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ошибка входа'
    console.log({ message })
    ElMessage.error('Неправильное имя пользователя или пароль')
  }
}

const onRegistration = async () => {
  console.log('onRegistration')
  dialogFormVisible.value = false
  isRegistrationVisible.value = true
}

const onRestore = async () => {
  console.log('onRestore')
  dialogFormVisible.value = false
}
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
        <h3 :id="titleId" class="titleClass">Вход в аккаунт</h3>
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
      <div><el-checkbox label="Запомнить данные" value="remember_me" /></div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div class="buttons">
          <Button width="27%" @click="onSubmit">Войти</Button>
          <Button v-if="true" width="67%" @click="onRegistration">
            Регистрация
          </Button>
        </div>
        <div class="restore" @click="onRestore">Восстановить пароль</div>
      </div>
    </template>
  </el-dialog>
  <DialogRegistration v-model="isRegistrationVisible" />
</template>

<style scoped>
.buttons {
  display: flex;
  justify-content: space-between;
}
.dialog-header {
  text-align: center;
  padding: 15px;
}
/* :deep(.el-dialog__body) {
  padding: 30px;
} */
.dialog-footer {
  padding: 5px 30px 0px;
}
.restore {
  margin: 20px 0 50px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}
:deep(.el-dialog) {
  border-radius: 10px;
  /* padding: 20px 30px 40px; */
}
:deep(.el-input__wrapper) {
  padding: 0;
}
/* :deep(.el-dialog__body) {
  padding: 50px;
} */
/* :deep(.el-input__inner) {
  background-color: var(--bgcolor);
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  color: black;
  padding: 20px;
} */
.titleClass {
  font-size: 24px;
  font-weight: 600;
}
.body-class {
  /* background-color: blue; */
  padding: 0 30px;
}
</style>
