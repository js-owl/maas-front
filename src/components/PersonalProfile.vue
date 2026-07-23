<script lang="ts" setup>
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import Input from './ui/Input.vue'
import ButtonRound from './ui/ButtonRound.vue'
import Button from './ui/Button.vue'
import { useProfileStore, type IProfile } from '../stores/profile.store'
import { useEmailStore } from '../stores/email.store'
import { UI_MESSAGES } from '../helpers/email-verification'
import router from '../router'
import {
  createPhoneNumberValidator,
  ensureRuPhoneModelValue,
  formatPhoneDisplay,
  isRuPhoneOnlyPrefix,
  parsePhoneToDigits,
} from '../composables/usePhoneValidation'
import IconArrowLeft from '@/icons/IconArrowLeft.vue'

const profileStore = useProfileStore()
const emailStore = useEmailStore()
const profileForm = ref<IProfile>()
const formRef = ref<FormInstance>()
const isSaving = ref(false)
const isResendingEmail = ref(false)
const activeTab = ref('legal')

const showEmailVerificationBanner = computed(() => {
  if (profileStore.profile?.is_admin) return false
  return profileStore.profile?.email_verified === false
})

const canResendConfirmation = computed(() => emailStore.canResend())

const onResendConfirmation = async () => {
  const email = profileForm.value?.personal_email?.trim() || ''
  if (!email) {
    ElMessage.warning('Укажите email в профиле')
    return
  }
  isResendingEmail.value = true
  try {
    const result = await emailStore.sendConfirmation(email)
    ElMessage.success(result.message)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : 'Не удалось отправить письмо')
  } finally {
    isResendingEmail.value = false
  }
}

/** При регистрации указывается один телефон — дублируем в оба поля профиля юр. лица. */
const applyPhoneDefaults = (profile: IProfile) => {
  profile.phone_number = ensureRuPhoneModelValue(profile.phone_number)
  profile.personal_phone_number = ensureRuPhoneModelValue(profile.personal_phone_number)

  const hasOrgPhone = !isRuPhoneOnlyPrefix(profile.phone_number)
  const hasPersonalPhone = !isRuPhoneOnlyPrefix(profile.personal_phone_number)

  if (hasOrgPhone && !hasPersonalPhone) {
    profile.personal_phone_number = profile.phone_number
  } else if (hasPersonalPhone && !hasOrgPhone) {
    profile.phone_number = profile.personal_phone_number
  }

  if (profile.user_type === 'legal' && !(profile.company_email ?? '').trim()) {
    profile.company_email = 'a@a.ru'
  }
}

onMounted(async () => {
  if (profileStore.profile) {
    profileForm.value = Object.assign({}, profileStore.profile)
    if (profileForm.value) applyPhoneDefaults(profileForm.value)
    const profile = profileStore.profile as IProfile
    if (profile && profile.user_type) activeTab.value = profile.user_type
    else if (profileForm.value) (profileForm.value as IProfile).user_type = activeTab.value
  } else {
    await profileStore.getProfile()
    if (profileStore.profile) {
      profileForm.value = Object.assign({}, profileStore.profile)
      if (profileForm.value) applyPhoneDefaults(profileForm.value)
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

const validateCompanyEmail = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const normalizedValue = value?.trim() ?? ''

  if (profileForm.value?.user_type !== 'legal') {
    callback()
    return
  }
  if (!normalizedValue) callback(new Error('Введите email'))
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue))
    callback(new Error('Введите корректный email'))
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
  personal_email: [
    { required: true, message: 'Введите email', trigger: 'blur' },
    { type: 'email', message: 'Введите корректный email', trigger: ['blur', 'change'] },
  ],
  company_email: [{ validator: validateCompanyEmail, trigger: ['blur', 'change'] }],
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
      if (profileForm.value) applyPhoneDefaults(profileForm.value)
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
    :gutter="0"
    class="profile-header personal-profile-page"
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
      <el-col :span="24" class="profile-content">
        <el-alert
          v-if="showEmailVerificationBanner"
          type="warning"
          :closable="false"
          show-icon
          class="email-verification-alert"
          :title="UI_MESSAGES.profileEmailNotVerified"
        >
          <Button
            width="fit-content"
            flat
            :loading="isResendingEmail"
            :disabled="!canResendConfirmation"
            @click="onResendConfirmation"
          >
            Отправить письмо повторно
          </Button>
        </el-alert>
        <div v-if="activeTab === 'individual'">
          <div v-if="profileForm" class="profile-card profile-card--individual">
            <div class="profile-section profile-section--profile">
              <el-row :gutter="20">
                <div class="maas-title profile-page-title profile-page-title--individual">Профиль</div>
              </el-row>
              <el-row :gutter="20" class="profile-fields">
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
                <el-col :span="8">
                  <el-form-item prop="username">
                    <Input v-model="profileForm.username" placeholder="Логин" disabled fontSize="20px" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="personal_email">
                    <Input
                      v-model="profileForm.personal_email"
                      placeholder="E-mail"
                      type="email"
                      disabled
                      fontSize="20px"
                    />
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

            <div class="profile-section profile-section--address">
              <div class="maas-subtitle profile-section-title">Адрес доставки</div>
              <el-row :gutter="20" class="profile-fields">
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
        </div>
        <!-- Юридическое лицо -->
        <div v-if="activeTab === 'legal'" class="profile-legal">
          <div v-if="profileForm" class="profile-section profile-section--title">
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="maas-title profile-page-title profile-page-title--legal">Профиль</div>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-card profile-card--primary">
            <div class="profile-section profile-section--org">
              <div class="maas-subtitle profile-section-title">Данные организации</div>
              <el-row :gutter="20" class="profile-fields">
                <el-col :span="24">
                  <el-form-item prop="payment_company_name">
                    <Input v-model="profileForm.payment_company_name" placeholder="Наименование организации / ИП" fontSize="20px" />
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
                  <el-form-item prop="company_email">
                    <Input v-model="profileForm.company_email" placeholder="E-mail" type="email" fontSize="20px" />
                  </el-form-item>
                </el-col>
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
              </el-row>
            </div>

            <div class="profile-section profile-section--contact">
              <div class="maas-subtitle profile-section-title">Контактное лицо</div>
              <el-row :gutter="20" class="profile-fields">
                <el-col :span="24">
                  <el-form-item prop="last_name">
                    <Input v-model="contactFio" placeholder="ФИО" fontSize="20px" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="personal_phone_number">
                    <Input
                      v-model="profileForm.personal_phone_number"
                      placeholder="Телефон" fontSize="20px"
                      type="tel"
                      :formatter="formatPhoneDisplay"
                      :parser="parsePhoneToDigits"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <Input
                      v-model="profileForm.personal_email"
                      placeholder="E-mail"
                      type="email"
                      disabled
                      fontSize="20px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>

          <div v-if="profileForm" class="profile-card profile-card--secondary">
            <div class="profile-section profile-section--bank">
              <div class="maas-subtitle profile-section-title">Банковские реквизиты</div>
              <el-row :gutter="20" class="profile-fields profile-fields--bank">
                <el-col :span="12" class="profile-field profile-field--cor-account">
                  <el-form-item prop="payment_cor_account">
                    <Input v-model="profileForm.payment_cor_account" placeholder="Корреспондентский счет" fontSize="20px" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="profile-field profile-field--account">
                  <el-form-item prop="payment_account">
                    <Input v-model="profileForm.payment_account" placeholder="Расчетный счет" fontSize="20px" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="profile-field profile-field--bank-name">
                  <el-form-item prop="payment_bank_name">
                    <Input v-model="profileForm.payment_bank_name" placeholder="Наименование банка" fontSize="20px" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="profile-field profile-field--bik">
                  <el-form-item prop="payment_bik">
                    <Input v-model="profileForm.payment_bik" placeholder="БИК" fontSize="20px" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="profile-section profile-section--address">
              <div class="maas-subtitle profile-section-title">Адрес доставки</div>
              <el-row :gutter="20" class="profile-fields">
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
        </div>

        <div class="profile-footer profile-footer--desktop">
          <div class="profile-footer-left">
            <ButtonRound width="280px" class="profile-back-button" @click="goToMain">
              <template #icon-left>
                 <IconArrowLeft color="#333" />
              </template>
              К главной странице
            </ButtonRound>
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

        <div class="profile-footer-mobile">
          <button type="button" class="profile-footer-mobile__orders" @click="goToOrders">
            Заказы и расчеты
          </button>
          <button
            type="button"
            class="profile-footer-mobile__save"
            :disabled="isSaving"
            @click="onUpdate"
          >
            <span v-if="isSaving" class="profile-footer-mobile__spinner" aria-hidden="true" />
            Сохранить
          </button>
        </div>
      </el-col>
    </el-form>
  </el-row>
</template>

<style scoped>
.profile-page-title--individual {
  margin: 0 0 30px 5px;
}

.profile-page-title--legal {
  margin: 0 0 30px;
}

.profile-section-title {
  margin-bottom: 20px;
}

.profile-card {
  display: contents;
}

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
.profile-footer-right {
  display: flex;
  align-items: center;
}

.profile-footer-left {
  gap: 16px;
  flex-wrap: wrap;
}

.profile-footer-mobile {
  display: none;
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

.email-verification-alert {
  margin-bottom: 24px;
}

.email-verification-alert :deep(.el-alert__content) {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

@media (max-width: 1300px) and (min-width: 768px) {
  .profile-page-title,
  .profile-section--title {
    display: none;
  }

  .profile-header {
    padding: 40px;
    border-radius: 40px;
    box-shadow: 0 6px 15px rgba(224, 227, 237, 0.5);
    min-height: auto;
  }

  .profile-content {
    display: flex;
    flex-direction: column;
  }

  .profile-legal,
  .profile-card--individual {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .profile-section {
    margin-bottom: 0;
  }

  .profile-section-title {
    margin-bottom: 10px;
    font-size: 20px;
    line-height: normal;
  }

  .profile-section--contact {
    order: 1;
  }

  .profile-section--org {
    order: 2;
  }

  .profile-section--bank {
    order: 3;
  }

  .profile-section--address {
    order: 4;
  }

  .profile-fields {
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;
    margin-left: -5px !important;
    margin-right: -5px !important;
  }

  .profile-fields :deep(.el-col) {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  .profile-fields :deep(.el-form-item) {
    margin-bottom: 0;
  }

  .profile-section--contact .profile-fields {
    flex-direction: column;
    gap: 10px;
    row-gap: 10px;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .profile-section--contact .profile-fields :deep(.el-col) {
    flex: 0 0 50%;
    width: 50% !important;
    max-width: 50%;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .profile-fields :deep(.input-wrapper) {
    --input-bg: #f2f3f7;
    --input-radius: 10px;
    --input-padding: 14px 16px;
    --input-text-color: #596269;
  }

  .profile-fields :deep(.input .el-input__wrapper) {
    min-height: auto;
    height: auto;
    padding: 14px 16px;
    border-radius: 10px;
    background-color: #f2f3f7;
    box-shadow: none;
    border: none;
    box-sizing: border-box;
  }

  .profile-fields :deep(.input .el-input__inner) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 18px !important;
    font-weight: 500;
    line-height: 1.4;
    color: #596269;
    height: auto;
  }

  .profile-section--contact .profile-fields :deep(.input .el-input__inner) {
    font-size: 16px !important;
    line-height: normal;
  }

  .profile-fields :deep(.input .el-input__inner::placeholder) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: inherit;
    font-weight: 500;
    line-height: inherit;
    color: #596269;
    opacity: 1;
  }

  .profile-footer--desktop {
    margin-top: 80px;
    padding-bottom: 0;
  }

  .profile-back-button {
    display: none;
  }

  .profile-orders-button :deep(.btn),
  .profile-update-button :deep(.btn) {
    --button-bg: #cbd1d5;
    background: #cbd1d5;
    width: auto !important;
    height: 44px;
    max-height: 44px;
    padding: 12px 24px;
    border-radius: 10px;
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 16px;
    font-weight: 500;
    box-shadow: none;
  }

  .profile-orders-button :deep(.btn::before),
  .profile-update-button :deep(.btn::before) {
    display: none;
  }

  .profile-orders-button :deep(.btn:hover:not(.is-disabled)),
  .profile-update-button :deep(.btn:hover:not(.is-disabled)) {
    transform: none;
    box-shadow: none;
    animation: none;
  }

  .email-verification-alert {
    margin-bottom: 40px;
  }
}

@media (max-width: 767px) {
  .profile-page-title {
    display: none;
  }

  .profile-section--title {
    display: none;
  }

  .profile-header {
    background-color: transparent;
    padding: 0;
    min-height: auto;
    border-radius: 0;
    width: 100%;
  }

  .profile-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .profile-legal {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .profile-card--individual {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .profile-card {
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: #fff;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 0 5px #c8cfe3;
    box-sizing: border-box;
    width: 100%;
  }

  .profile-section {
    margin-bottom: 0;
  }

  .profile-section-title {
    margin-bottom: 8px;
    font-size: 14px;
    line-height: normal;
  }

  .profile-fields {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .profile-fields :deep(.el-col) {
    flex: 0 0 auto;
    width: 100%;
    max-width: 100%;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .profile-fields :deep(.el-form-item) {
    margin-bottom: 0;
  }

  .profile-fields :deep(.input-wrapper) {
    --input-bg: #f2f3f7;
    --input-radius: 8px;
    --input-padding: 12px 16px;
    --input-text-color: #55585b;
  }

  .profile-fields :deep(.input .el-input__wrapper) {
    min-height: auto;
    height: auto;
    padding: 12px 16px;
    border-radius: 8px;
    background-color: #f2f3f7;
    box-shadow: none;
    border: none;
    box-sizing: border-box;
  }

  .profile-fields :deep(.input .el-input__inner) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px !important;
    font-weight: 500;
    line-height: normal;
    color: #55585b;
    height: auto;
  }

  .profile-fields :deep(.input .el-input__inner::placeholder) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #55585b;
    opacity: 1;
  }

  .profile-fields--bank {
    display: flex;
    flex-direction: column;
  }

  .profile-field--cor-account {
    order: 1;
  }

  .profile-field--bank-name {
    order: 2;
  }

  .profile-field--account {
    order: 3;
  }

  .profile-field--bik {
    order: 4;
  }

  .profile-section--contact {
    order: 1;
  }

  .profile-section--org {
    order: 2;
  }

  .email-verification-alert {
    margin-bottom: 0;
    border-radius: 16px;
  }

  .profile-footer--desktop {
    display: none;
  }

  .profile-footer-mobile {
    display: flex;
    gap: 8px;
    align-items: stretch;
    justify-content: center;
    width: 100%;
  }

  .profile-footer-mobile__orders {
    flex: 1 1 0;
    min-width: 0;
    height: 40px;
    padding: 0 16px;
    border: none;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 0 5px #c8cfe3;
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
    color: #000;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .profile-footer-mobile__save {
    flex-shrink: 0;
    height: 40px;
    padding: 0 16px;
    border: none;
    border-radius: 8px;
    background: #e84261;
    box-shadow: 0 0 5px #c8cfe3;
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .profile-footer-mobile__save:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .profile-footer-mobile__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: profile-save-spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes profile-save-spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>


