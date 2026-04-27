<script lang="ts" setup>
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import Input from './ui/Input.vue'
import ButtonRound from './ui/ButtonRound.vue'
import { useProfileStore, type IProfile } from '../stores/profile.store'
import router from '../router'
import {
  createPhoneNumberValidator,
  formatPhoneDisplay,
  parsePhoneToDigits,
} from '../composables/usePhoneValidation'
import IconArrowLeft from '@/icons/IconArrowLeft.vue'

const profileStore = useProfileStore()
const profileForm = ref<IProfile>()
const formRef = ref<FormInstance>()
const isSaving = ref(false)
const activeTab = ref('individual')

onMounted(async () => {
  if (profileStore.profile) {
    profileForm.value = Object.assign({}, profileStore.profile)
    const profile = profileStore.profile as IProfile
    if (profile && profile.user_type) activeTab.value = profile.user_type
    else if (profileForm.value) (profileForm.value as IProfile).user_type = activeTab.value
  } else {
    await profileStore.getProfile()
    if (profileStore.profile) {
      profileForm.value = Object.assign({}, profileStore.profile)
      const profile = profileStore.profile as IProfile
      if (profile && profile.user_type) activeTab.value = profile.user_type
      else if (profileForm.value) (profileForm.value as IProfile).user_type = activeTab.value
    }
  }
})

watch(activeTab, (newTab) => {
  if (profileForm.value) {
    profileForm.value.user_type = newTab
    if (formRef.value) {
      formRef.value.validateField('last_name')
      formRef.value.validateField('first_name')
      formRef.value.validateField('payment_inn')
      formRef.value.validateField('payment_kpp')
      formRef.value.validateField('payment_bik')
    }
  }
})

const validatePaymentInn = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const normalizedValue = value?.trim() ?? ''

  if (profileForm.value?.user_type === 'legal' && !normalizedValue)
    callback(new Error('Введите ИНН'))
  else if (profileForm.value?.user_type === 'legal' && normalizedValue.length < 10)
    callback(new Error('ИНН должен содержать минимум 10 символов'))
  else callback()
}

const validatePaymentKpp = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const normalizedValue = value?.trim() ?? ''

  if (profileForm.value?.user_type === 'legal' && !normalizedValue)
    callback(new Error('Введите КПП'))
  else if (profileForm.value?.user_type === 'legal' && normalizedValue.length < 9)
    callback(new Error('КПП должен содержать минимум 9 символов'))
  else callback()
}

const validatePaymentBik = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const normalizedValue = value?.trim() ?? ''

  if (profileForm.value?.user_type === 'legal' && !normalizedValue)
    callback(new Error('Введите БИК'))
  else if (profileForm.value?.user_type === 'legal' && normalizedValue.length < 9)
    callback(new Error('БИК должен содержать минимум 9 символов'))
  else callback()
}

const validatePaymentAccount = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const normalizedValue = value?.trim() ?? ''

  if (profileForm.value?.user_type === 'legal' && !normalizedValue)
    callback(new Error('Введите расчетный счет'))
  else if (profileForm.value?.user_type === 'legal' && normalizedValue.length < 10)
    callback(new Error('Расчетный счет должен содержать минимум 10 символов'))
  else callback()
}

const validatePaymentCorAccount = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const normalizedValue = value?.trim() ?? ''

  if (profileForm.value?.user_type === 'legal' && !normalizedValue)
    callback(new Error('Введите корреспондентский счет'))
  else if (profileForm.value?.user_type === 'legal' && normalizedValue.length < 10)
    callback(new Error('Корреспондентский счет должен содержать минимум 10 символов'))
  else callback()
}

const validatePaymentBankName = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const normalizedValue = value?.trim() ?? ''

  if (profileForm.value?.user_type === 'legal' && !normalizedValue)
    callback(new Error('Введите наименование банка'))
  else callback()
}

const phoneValidator = createPhoneNumberValidator({ allowEmpty: false })

const requiredTrimmed =
  (message: string) => (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!(value ?? '').trim()) callback(new Error(message))
    else callback()
  }

const validateLastNameRequired = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const normalizedValue = value?.trim() ?? ''
  if (!normalizedValue) callback(new Error('Введите фамилию'))
  else callback()
}

/** Для физлица имя обязательно; для юр. лица ФИО целиком в last_name, first_name не используется. */
const validateFirstNameRequired = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (profileForm.value?.user_type === 'legal') {
    callback()
    return
  }
  const normalizedValue = value?.trim() ?? ''
  if (!normalizedValue) callback(new Error('Введите имя'))
  else callback()
}

const rules = ref<FormRules<IProfile>>({
  username: [{ required: true, message: 'Введите имя', trigger: 'blur' }],
  email: [
    { required: true, message: 'Введите email', trigger: 'blur' },
    { type: 'email', message: 'Введите корректный email', trigger: ['blur', 'change'] },
  ],
  phone_number: [
    { required: true, message: 'Введите телефон', trigger: 'blur' },
    { validator: phoneValidator, trigger: ['blur', 'change'] },
  ],
  personal_phone_number: [
    { required: true, message: 'Введите телефон', trigger: 'blur' },
    { validator: phoneValidator, trigger: ['blur', 'change'] },
  ],
  last_name: [{ validator: validateLastNameRequired, trigger: ['blur', 'change'] }],
  first_name: [{ validator: validateFirstNameRequired, trigger: ['blur', 'change'] }],
  patronymic: [{ required: false, message: 'Введите отчество', trigger: 'blur' }],
  payment_inn: [{ validator: validatePaymentInn, trigger: ['blur', 'change'] }],
  payment_kpp: [{ validator: validatePaymentKpp, trigger: ['blur', 'change'] }],
  payment_bik: [{ validator: validatePaymentBik, trigger: ['blur', 'change'] }],
  payment_account: [{ validator: validatePaymentAccount, trigger: ['blur', 'change'] }],
  payment_cor_account: [{ validator: validatePaymentCorAccount, trigger: ['blur', 'change'] }],
  payment_bank_name: [{ validator: validatePaymentBankName, trigger: ['blur', 'change'] }],
  postal: [{ validator: requiredTrimmed('Введите индекс'), trigger: ['blur', 'change'] }],
  region: [{ validator: requiredTrimmed('Введите регион или область'), trigger: ['blur', 'change'] }],
  city_name: [{ validator: requiredTrimmed('Введите город'), trigger: ['blur', 'change'] }],
  street: [{ validator: requiredTrimmed('Введите улицу'), trigger: ['blur', 'change'] }],
  building: [{ validator: requiredTrimmed('Введите строение'), trigger: ['blur', 'change'] }],
  office: [{ validator: requiredTrimmed('Введите офис или помещение'), trigger: ['blur', 'change'] }],
})

function buildAddressString(): string {
  const profile = profileForm.value
  if (!profile) return ''
  return (profile.city_name || '').trim()
}

async function onUpdate() {
  if (!formRef.value || !profileForm.value || isSaving.value) return

  isSaving.value = true
  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    const profile = profileForm.value
    profile.city = buildAddressString()
    profile.user_type = activeTab.value

    const isUpdated = await profileStore.updateProfile(profile as IProfile)

    if (isUpdated && profileStore.profile) {
      profileForm.value = { ...profileStore.profile }
      router.push({ path: '/personal/profile' })
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    ElMessage.warning('Необходимо заполнить поля')
  } finally {
    isSaving.value = false
  }
}

const goToMain = () => {
  router.push({ path: '/' })
}

const goToOrders = () => {
  router.push({ path: '/personal/orders' })
}

/** Юр. лицо: одно поле ФИО — храним строку целиком в last_name, чтобы не терять пробелы внутри части ФИО. */
const contactFio = computed({
  get: () => {
    if (!profileForm.value) return ''
    return [profileForm.value.last_name, profileForm.value.first_name, profileForm.value.patronymic]
      .filter(Boolean)
      .join(' ')
  },
  set: (v: string) => {
    if (!profileForm.value) return
    profileForm.value.last_name = v ?? ''
    profileForm.value.first_name = ''
    profileForm.value.patronymic = ''
  },
})
</script>

<template>
  <el-row
    :gutter="20"
    class="profile-header"
  >
    <el-form
      ref="formRef"
      :model="profileForm"
      :rules="rules"
      label-width="0"
      label-position="top"
      style="width: 100%"
      @submit.prevent
    >
      <el-col :span="24">
        <div v-if="activeTab === 'individual'">
          <div v-if="profileForm" class="profile-section">
            <el-row :gutter="20">
              <div class="maas-title" style="margin: 0 0 30px 5px;">Профиль</div>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="last_name">
                  <Input v-model="profileForm.last_name" placeholder="Фамилия" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="first_name">
                  <Input v-model="profileForm.first_name" placeholder="Имя" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="patronymic">
                  <Input v-model="profileForm.patronymic" placeholder="Отчество" fontSize="20px" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="username">
                  <Input v-model="profileForm.username" placeholder="Логин" disabled fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="email">
                  <Input v-model="profileForm.email" placeholder="E-mail" type="email" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="phone_number">
                  <Input
                    v-model="profileForm.phone_number"
                    placeholder="+7 (___) ___-__-__" fontSize="20px"
                    type="tel"
                    :formatter="formatPhoneDisplay"
                    :parser="parsePhoneToDigits"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="maas-subtitle" style="margin-bottom: 20px;">Адрес доставки</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="postal">
                  <Input v-model="profileForm.postal" placeholder="Индекс" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="region">
                  <Input v-model="profileForm.region" placeholder="Регион/Область" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="city_name">
                  <Input v-model="profileForm.city_name" placeholder="Город" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="street">
                  <Input v-model="profileForm.street" placeholder="Улица" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="building">
                  <Input v-model="profileForm.building" placeholder="Строение" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="office">
                  <Input v-model="profileForm.office" placeholder="Офис/Помещение" fontSize="20px" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- Юридическое лицо -->
        <div v-if="activeTab === 'legal'">
          <div v-if="profileForm" class="profile-section">
            <el-row :gutter="20">
              <div class="maas-title" style="margin: 0 0 30px 12px;">Профиль</div>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="payment_company_name">
                  <Input v-model="profileForm.payment_company_name" placeholder="Наименование организации / ИП" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="username">
                  <Input v-model="profileForm.username" placeholder="Отображаемое название" fontSize="20px" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="maas-subtitle" style="margin-bottom: 20px;">Данные компании</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="payment_inn">
                  <Input v-model="profileForm.payment_inn" placeholder="ИНН" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="payment_kpp">
                  <Input v-model="profileForm.payment_kpp" placeholder="ОГРН / ОГРНИП" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="phone_number">
                  <Input
                    v-model="profileForm.phone_number"
                    placeholder="Телефон" fontSize="20px"
                    type="tel"
                    :formatter="formatPhoneDisplay"
                    :parser="parsePhoneToDigits"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="email">
                  <Input v-model="profileForm.email" placeholder="E-mail" type="email" fontSize="20px" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="maas-subtitle" style="margin-bottom: 20px;">Контактное лицо</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="last_name">
                  <Input v-model="contactFio" placeholder="ФИО" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="personal_phone_number">
                  <Input
                    v-model="profileForm.personal_phone_number"
                    placeholder="+7 (___) ___-__-__" fontSize="20px"  
                    type="tel"
                    :formatter="formatPhoneDisplay"
                    :parser="parsePhoneToDigits"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="maas-subtitle" style="margin-bottom: 20px;">Банковские реквизиты</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="payment_cor_account">
                  <Input v-model="profileForm.payment_cor_account" placeholder="Корреспондентский счет" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="payment_account">
                  <Input v-model="profileForm.payment_account" placeholder="Расчетный счет" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="payment_bank_name">
                  <Input v-model="profileForm.payment_bank_name" placeholder="Наименование банка" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="payment_bik">
                  <Input v-model="profileForm.payment_bik" placeholder="БИК" fontSize="20px" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="maas-subtitle" style="margin-bottom: 20px;">Адрес доставки</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="postal">
                  <Input v-model="profileForm.postal" placeholder="Индекс" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="region">
                  <Input v-model="profileForm.region" placeholder="Регион/Область" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="city_name">
                  <Input v-model="profileForm.city_name" placeholder="Город" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="street">
                  <Input v-model="profileForm.street" placeholder="Улица" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="building">
                  <Input v-model="profileForm.building" placeholder="Строение" fontSize="20px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="office">
                  <Input v-model="profileForm.office" placeholder="Офис/Помещение" fontSize="20px" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="profile-footer">
          <div class="profile-footer-left">
            <ButtonRound width="280px" class="profile-back-button" @click="goToMain">
              <template #icon-left>
                 <IconArrowLeft color="#333" />
              </template>
              К главной странице
            </ButtonRound>
          </div>
          <div class="profile-footer-center">
            <ButtonRound width="250px" class="profile-orders-button" @click="goToOrders">
              Заказы и расчеты
            </ButtonRound>
          </div>
          <div class="profile-footer-right">
            <ButtonRound width="300px" class="profile-update-button" :loading="isSaving" @click="onUpdate">
              Сохранить изменения
            </ButtonRound>
          </div>
        </div>
      </el-col>
    </el-form>
  </el-row>
</template>

<style scoped>
.profile-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.profile-header {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 40px;
  min-height: 100px;
  border-radius: 20px;
  width: 100%;
}

.profile-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.profile-footer-left,
.profile-footer-center,
.profile-footer-right {
  display: flex;
  align-items: center;
}

.profile-back-button :deep(.btn),
.profile-orders-button :deep(.btn) {
  --bgcolor: #e0e0e0;
  border-radius: 24px;
  font-weight: 500;
}

.profile-update-button :deep(.btn) {
  --bgcolor: #d0d4da;
  border-radius: 24px;
  font-weight: 500;
}
</style>


