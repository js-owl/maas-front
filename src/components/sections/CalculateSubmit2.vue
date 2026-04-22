<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProfileStore, type IProfile } from '../../stores/profile.store'
import { useAuthStore } from '../../stores/auth.store'
import { req_json_auth } from '../../api'
import type {
  IKit,
  IOrderPayload,
  IOrderPostPayload,
  IOrderResponse,
} from '../../interfaces/order.interface'
import DialogLogin from '../dialog/DialogLogin.vue'
import ButtonRound from '../ui/ButtonRound.vue'
import IconArrowLeft from '@/icons/IconArrowLeft.vue'

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
const route = useRoute()

const isNewOrder = computed(() => props.orderId === 0)
const kitId = computed(() => {
  const raw = route.query.kitId
  if (Array.isArray(raw)) return Number(raw[0]) || 0
  return Number(raw) || 0
})

const existingOrderIds = computed<number[]>(() => {
  const raw = route.query.orderIds
  if (!raw) return []

  const toNumbers = (val: string): number[] =>
    val
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((n) => Number.isFinite(n) && n > 0)

  if (Array.isArray(raw)) return raw.flatMap((v) => toNumbers(String(v)))

  return toNumbers(String(raw))
})

const isLoginDialogVisible = ref(false)
const isSubmitting = ref(false)

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

  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
  let targetKitId = kitId.value
  await ensureProfileLoaded()
  if (!isProfileComplete(profileStore.profile)) {
    ElMessage.warning('Заполните профиль перед оформлением заказа')
    router.push({ path: '/personal/profile' })
    return
  }

  // Загружаем original_filename из файла
  const fileId = props.payload.file_id
  let originalFilename = fileId ? await fetchOriginalFilename(fileId) : null

  // Отрезаем расширение (все, что после последней точки)
  if (originalFilename) {
    const lastDotIndex = originalFilename.lastIndexOf('.')
    if (lastDotIndex > 0) {
      originalFilename = originalFilename.substring(0, lastDotIndex)
    }
  }

  if (isNewOrder.value) {
    try {
      const postPayload: IOrderPostPayload = {
        ...props.payload,
        order_name: originalFilename || props.payload.order_name || 'Деталь',
        special_instructions: props.specialInstructions,
        document_ids: props.payload.document_ids,
      }
      const res = await req_json_auth('/orders', 'POST', postPayload)
      const data = (await res?.json()) as IOrderResponse
      emit('updateResult', data)

      if (targetKitId > 0) {
        // Добавляем новый order_id в существующий kit
        const updatedIds = Array.from(new Set([...existingOrderIds.value, data.order_id]))

        try {
          await req_json_auth(`/kits/${targetKitId}`, 'PUT', {
            order_ids: updatedIds,
          })
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error updating existing kit with new order_id', error)
        }
      } else {
        // После успешного создания заказа создаем kit с значениями по умолчанию
        const kitPayload: IKit = {
          kit_name: data.order_name || originalFilename || '',
          order_ids: [data.order_id],
          user_id: data.user_id,
          quantity: 1,
          bitrix_deal_id: 1,
          location: data.total_price_breakdown?.location || '',
          kit_price: 0,
          delivery_price: 0,
          total_kit_price: 0,
        }

        try {
          const kitRes = await req_json_auth('/kits', 'POST', kitPayload)
          const createdKit = (await kitRes?.json()) as IKit | { kit_id?: number }
          targetKitId = Number(createdKit?.kit_id) || 0
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error creating kit', error)
        }
      }
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

  if (targetKitId > 0) {
    router.push({
      path: '/personal/order',
      query: { kitId: targetKitId.toString() },
    })
  } else {
    router.push({
      path: '/personal/order',
      query: { kitId: targetKitId.toString() },
    })
  }
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true
    return
  }
  const targetKitId = kitId.value
  if (targetKitId > 0) {
    router.push({
      path: '/personal/order',
      query: { kitId: targetKitId.toString() },
    })
  } else {
    router.push({ path: '/personal/orders' })
  }
}
</script>

<template>
  <div class="calculate-submit2">
    <ButtonRound width="250px" :disabled="isDisabled" @click="cancel">
      <template #icon-left>
        <IconArrowLeft color="#333" />
      </template>
      Назад
    </ButtonRound>

    <ButtonRound
      width="300px"
      :disabled="isDisabled || isSubmitting"
      :loading="isSubmitting"
      @click="submitOrder"
    >
      {{ isNewOrder ? 'Сохранить изменения' : 'Сохранить изменения' }}
    </ButtonRound>
  </div>

  <DialogLogin v-model="isLoginDialogVisible" />
</template>

<style scoped>
.calculate-submit2 {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
}

@media (max-width: 599px) {
  .calculate-submit2 {
    justify-content: center;
  }
}
</style>
