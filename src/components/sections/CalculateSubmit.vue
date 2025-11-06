<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProfileStore, type IProfile } from '../../stores/profile.store'
import { useAuthStore } from '../../stores/auth.store'
import { req_json_auth } from '../../api'
import type { IOrderPayload, IOrderPostPayload, IOrderResponse } from '../../interfaces/order.interface'
import DialogLogin from '../dialog/DialogLogin.vue'

const props = defineProps<{
  orderId: number
  payload: IOrderPayload
  specialInstructions: string
}>()

const emit = defineEmits<{
  (e: 'updateResult', value: IOrderResponse): void
  (e: 'showInfo'): void
}>()

const authStore = useAuthStore()
const profileStore = useProfileStore()
const router = useRouter()

const isNewOrder = computed(() => props.orderId === 0)

const isLoginDialogVisible = ref(false)

const isProfileComplete = (profile?: IProfile): boolean => {
  if (!profile) return false
  const required: Array<keyof IProfile> = [
    'email',
    'full_name',
    'postal',
    'region',
    'city_name',
    'street',
    'building',
  ]
  return required.every((key) => {
    const v = profile[key] as unknown as string | undefined
    return typeof v === 'string' && v.trim().length > 0
  })
}

const ensureProfileLoaded = async () => {
  if (!profileStore.profile) {
    try {
      await profileStore.getProfile()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }
}

const submitOrder = async () => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true
    return
  }

  await ensureProfileLoaded()
  if (!isProfileComplete(profileStore.profile)) {
    ElMessage.warning('Заполните профиль перед оформлением заказа')
    router.push({ path: '/personal/profile' })
    return
  }

  if (isNewOrder.value) {
    try {
      const postPayload: IOrderPostPayload = {
        ...props.payload,
        special_instructions: props.specialInstructions,
        document_ids: props.payload.document_ids,
      }
      const res = await req_json_auth('/orders', 'POST', postPayload)
      const data = (await res?.json()) as IOrderResponse
      emit('updateResult', data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error({ error })
    }
  } else {
    const id = props.orderId
    try {
      const res = await req_json_auth(`/orders/${id}`, 'PUT', {
        ...props.payload,
        special_instructions: props.specialInstructions,
      })
      const data = (await res?.json()) as IOrderResponse
      emit('updateResult', data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error({ error })
    }
  }

  emit('showInfo')
  router.push({ path: '/personal/orders' })
}

const cancel = () => router.push({ path: '/personal/orders' })
</script>

<template>
  <el-row :gutter="5" class="upload-section">
    <el-col :span="12">
      <el-button type="primary" plain class="submit" @click="cancel"> Отменить </el-button>
    </el-col>
    <el-col :span="12">
      <el-button type="primary" plain class="submit" @click="submitOrder">
        {{ isNewOrder ? 'Оформить заказ' : 'Сохранить заказ' }}
      </el-button>
    </el-col>
  </el-row>
  <DialogLogin v-model="isLoginDialogVisible" />
</template>

<style scoped>
.submit {
  background-color: var(--bgcolor);
  border: 1px solid var(--bgcolor);
  color: black;
  font-size: 20px;
  padding: 30px 0;
  width: 100%;
}
</style>


