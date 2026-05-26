<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { req_json } from '../../api'
import { useWindowSize } from '@vueuse/core'
import {
  createPhoneNumberValidator,
  formatPhoneDisplay,
  isRuPhoneOnlyPrefix,
  parsePhoneToDigits,
} from '../../composables/usePhoneValidation'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import Checkbox from '../ui/Checkbox.vue'

const dialogFormVisible = defineModel<boolean>()

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

interface FormData {
  name: string
  phone: string
  product: string
  additional: string
  agreement: boolean
}

const formRef = ref<FormInstance>()
const form = ref<FormData>({
  name: '',
  phone: '7',
  product: '',
  additional: '',
  agreement: false,
})

const loading = ref(false)

const validateAgreement = (_rule: any, value: boolean, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('Необходимо согласиться с условиями'))
  } else {
    callback()
  }
}

const rules = ref<FormRules<FormData>>({
  name: [
    { required: true, message: 'Пожалуйста, введите имя', trigger: 'blur' },
    {
      min: 2,
      message: 'Имя должно содержать минимум 2 символа',
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: 'Пожалуйста, введите номер телефона', trigger: 'blur' },
    { validator: createPhoneNumberValidator({ allowEmpty: false }), trigger: ['blur', 'change'] },
  ],
  agreement: [{ validator: validateAgreement, trigger: 'change' }],
})

const closeDialog = () => {
  dialogFormVisible.value = false
  form.value = {
    name: '',
    phone: '7',
    product: '',
    additional: '',
    agreement: false,
  }
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const payload = {
      ...form.value,
      phone: isRuPhoneOnlyPrefix(form.value.phone) ? '' : form.value.phone,
    }
    await req_json('/call-request', 'POST', payload)

    ElMessage({
      type: 'success',
      message: 'Заявка на звонок отправлена! Мы свяжемся с вами в ближайшее время.',
    })

    closeDialog()
  } catch (error) {
    console.error('Form submission failed:', error)
    ElMessage({
      type: 'error',
      message: 'Ошибка при отправке заявки. Попробуйте еще раз.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    class="dialog-call"
    width="477"
    :z-index="4000"
    append-to-body
    modal-class="dialog-call-overlay"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :fullscreen="isMobile"
    @close="closeDialog"
  >
    <template #header="{ titleId }">
      <div class="dialog-header">
        <div :id="titleId" class="maas-subtitle">Заказать звонок</div>
      </div>
    </template>
    <div class="body-class">
      <el-form
        ref="formRef"
        class="dialog-call-form"
        :model="form"
        :rules="rules"
        label-width="0"
        label-position="top"
        @submit.prevent="submitForm"
      >
        <div class="form-field-group">
          <el-form-item prop="name">
            <Input v-model="form.name" placeholder="Имя" />
          </el-form-item>

          <el-form-item prop="phone">
            <Input
              v-model="form.phone"
              placeholder="+7 (___) ___-__-__"
              type="tel"
              :formatter="formatPhoneDisplay"
              :parser="parsePhoneToDigits"
            />
          </el-form-item>
        </div>

        <div class="form-field-group">
          <el-form-item prop="product">
            <Input v-model="form.product" placeholder="Интересующая услуга" />
          </el-form-item>

          <el-form-item prop="additional">
            <Input v-model="form.additional" placeholder="Дополнительная информация" />
          </el-form-item>
        </div>

        <el-form-item prop="agreement" class="agreement-row">
          <Checkbox v-model="form.agreement" class="agreement-checkbox">
            Отправляя данную форму, вы соглашаетесь с
            <router-link
              to="/policy"
              target="_blank"
              rel="noopener noreferrer"
              class="agreement-link"
              @click.stop
            >
              политикой конфиденциальности
            </router-link>
            и
            <router-link
              to="/offer-client"
              target="_blank"
              rel="noopener noreferrer"
              class="agreement-link"
              @click.stop
            >
              правилами нашего сайта
            </router-link>
            .
          </Checkbox>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button
          class="dialog-call-submit"
          width="fit-content"
          flat
          :loading="loading"
          :disabled="!form.agreement"
          @click="submitForm"
        >
          {{ loading ? 'Отправка...' : 'Заказать звонок' }}
        </Button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
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

.dialog-call-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.dialog-header {
  margin: 0;
  padding: 0;
}

.body-class {
  padding: 0;
}

.form-field-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dialog-call-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  --input-bg: var(--whity);
  --input-radius: 10px;
  --input-font-family: 'Montserrat-Medium';
  --input-text-color: var(--gray-footer);
  --input-font-size: 18px;
  --input-font-weight: 500;
  --input-padding: 14px 16px;
  max-width: 397px;
}

.dialog-call-form :deep(.el-input__placeholder) {
  color: var(--gray-footer);
}

.dialog-call-form :deep(.el-form-item__error) {
  position: static;
  padding-top: 6px;
  line-height: 1.2;
}

.agreement-row {
  margin-bottom: 0;
}

.agreement-checkbox {
  --checkbox-font-size: 12px;
  --checkbox-text-color: #000;
  --checkbox-label-padding-left: 12px;
  --checkbox-font-family: 'Montserrat-Regular';
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
  --checkbox-check-width: 5px;
  --checkbox-check-height: 10px;
  --checkbox-check-border-width: 2px;
  --checkbox-check-color: #000;
  width: 100%;
}

.agreement-checkbox :deep(.el-checkbox__label) {
  white-space: normal;
}

.agreement-link {
  color: inherit;
  text-decoration: underline;
}

.dialog-footer {
  padding: 0;
}

.dialog-footer :deep(.btn.is-disabled) {
  background: var(--gray-footer) !important;
  color: #fff;
  opacity: 1;
}

@media (max-width: 767px) {
  :deep(.el-dialog__body) {
    padding: 24px 0 0;
  }

  :deep(.el-dialog__footer) {
    padding: 24px 0 0;
  }

  .dialog-call-form {
    max-width: none;
  }
}
</style>

<style>
.dialog-call-overlay {
  z-index: 4000 !important;
}

.dialog-call {
  padding: 40px;
  border-radius: 20px !important;
  background: #fff;
  overflow: hidden;
}

@media (max-width: 767px) {
  .dialog-call {
    padding: 16px;
  }
}
</style>
