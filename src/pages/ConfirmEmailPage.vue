<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Button from '../components/ui/Button.vue'
import { useEmailStore } from '../stores/email.store'
import {
  EMAIL_JUST_CONFIRMED_KEY,
  parseTokenFromRoute,
  UI_MESSAGES,
} from '../helpers/email-verification'

type PageState = 'loading' | 'success' | 'error' | 'missingToken'

const route = useRoute()
const router = useRouter()
const emailStore = useEmailStore()

const pageState = ref<PageState>('loading')
const errorMessage = ref<string>(UI_MESSAGES.confirmInvalidLink)
const confirmed = ref(false)

const goHome = () => {
  router.push({ name: 'home' }).catch(() => undefined)
}

const goLogin = () => {
  router.push({ name: 'home', query: { login: '1' } }).catch(() => undefined)
}

onMounted(async () => {
  if (confirmed.value) return

  const token = parseTokenFromRoute(route.query)
  if (!token) {
    pageState.value = 'missingToken'
    errorMessage.value = UI_MESSAGES.confirmMissingToken
    return
  }

  try {
    const result = await emailStore.confirmEmail(token)
    confirmed.value = true
    pageState.value = 'success'
    sessionStorage.setItem(EMAIL_JUST_CONFIRMED_KEY, '1')
    ElMessage.success(result.message)
  } catch (error) {
    pageState.value = 'error'
    errorMessage.value =
      error instanceof Error ? error.message : UI_MESSAGES.confirmInvalidLink
  }
})
</script>

<template>
  <el-row :gutter="0" style="padding: 60px 0 80px; min-height: 50vh; background-color: var(--bgcolor)">
    <el-col :offset="3" :span="18">
      <div class="confirm-email-card">
        <div v-if="pageState === 'loading'" class="confirm-email-state">
          <div class="maas-subtitle">{{ UI_MESSAGES.confirmLoading }}</div>
        </div>

        <div v-else-if="pageState === 'success'" class="confirm-email-state">
          <div class="maas-subtitle">Email подтверждён</div>
          <p class="confirm-email-text">{{ UI_MESSAGES.confirmSuccess }}</p>
          <Button width="fit-content" flat @click="goLogin">Войти</Button>
        </div>

        <div v-else class="confirm-email-state">
          <div class="maas-subtitle">Не удалось подтвердить email</div>
          <p class="confirm-email-text">{{ errorMessage }}</p>
          <Button width="fit-content" flat @click="goHome">На главную</Button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.confirm-email-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
}

.confirm-email-state {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.confirm-email-text {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--gray-footer);
}
</style>
