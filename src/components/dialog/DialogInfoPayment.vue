<script lang="ts" setup>
import { computed } from 'vue'
import router from '../../router'
import { useWindowSize } from '@vueuse/core'

let dialogVisible = defineModel<boolean>()

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const handleClose = () => {
  console.log('handleClose')
  dialogVisible.value = false
  router.push({
    name: 'personal-orders',
  })
}
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    title="Спасибо за оформление заказа!"
    width="500"
    :before-close="handleClose"
    :fullscreen="isMobile"
  >
    <p>Платежные документы были отправлены на почту.</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose"> Ясно </el-button>
      </div>
    </template>
  </el-dialog>
</template>
