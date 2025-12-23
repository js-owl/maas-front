<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProfileStore, type IProfile } from '../../stores/profile.store'
import { useAuthStore } from '../../stores/auth.store'
import { req_json_auth } from '../../api'
import type {
  IOrderPayload,
  IOrderPostPayload,
  IOrderResponse,
} from '../../interfaces/order.interface'
import DialogLogin from '../dialog/DialogLogin.vue'
import Button from '../ui/Button.vue'

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

const isDisabled = computed(() => !authStore.getToken)

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

const fetchOriginalFilename = async (fileId: number): Promise<string | null> => {
  if (!fileId) return null
  try {
    const response = await req_json_auth(`/files/${fileId}`, 'GET')
    if (response?.ok) {
      const fileInfo = (await response.json()) as { original_filename?: string; filename?: string }
      return fileInfo.original_filename || fileInfo.filename || null
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching filename for file ${fileId}:`, error)
  }
  return null
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

  // Загружаем original_filename из файла
  const fileId = props.payload.file_id
  const originalFilename = fileId ? await fetchOriginalFilename(fileId) : null

  if (isNewOrder.value) {
    try {
      const postPayload: IOrderPostPayload = {
        ...props.payload,
        order_name: originalFilename || props.payload.order_name || '',
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
        // при обновлении оставляем имя заказа таким, как оно передано в payload
        order_name: props.payload.order_name || '',
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

const cancel = () => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true
    return
  }
  router.push({ path: '/personal/orders' })
}
</script>

<template>
  <div style="display: flex; justify-content: space-between; align-self: flex-start">
    <Button :disabled="isDisabled" @click="cancel"> Отменить </Button>

    <Button :disabled="isDisabled" @click="submitOrder">
      {{ isNewOrder ? 'Оформить заказ' : 'Сохранить заказ' }}
    </Button>
  </div>

  <DialogLogin v-model="isLoginDialogVisible" />
</template>

<style scoped>
.submit {
  background-color: var(--bgcolor);
  border: 1px solid var(--bgcolor);
  color: black;
  font-size: 20px;
  padding: 10px 20px;
  /* width: 100%; */
}
.submit.is-disabled {
  background-color: var(--bgcolor) !important;
  opacity: 0.6;
  cursor: default;
  color: black;
}
/* keep appearance unchanged on hover/focus/active */
.submit:hover,
.submit:focus,
.submit:active {
  background-color: var(--bgcolor) !important;
  border-color: var(--bgcolor) !important;
  color: black !important;
  box-shadow: none !important;
}
</style>
