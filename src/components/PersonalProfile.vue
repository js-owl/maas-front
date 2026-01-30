<script lang="ts" setup>
import { type FormInstance, type FormRules } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import Input from './ui/Input.vue'
import Button from './ui/Button.vue'
import { useProfileStore, type IProfile } from '../stores/profile.store'
import router from '../router'
import {
  createPhoneNumberValidator,
  formatPhoneDisplay,
  parsePhoneToDigits,
} from '../composables/usePhoneValidation'

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
      formRef.value.validateField('payment_inn')
      formRef.value.validateField('payment_kpp')
      formRef.value.validateField('payment_bik')
    }
  }
})

const validatePaymentInn = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) callback()
  else if (profileForm.value?.user_type === 'legal' && value.length < 10)
    callback(new Error('ИНН должен содержать минимум 10 символов для юридических лиц'))
  else callback()
}

const validatePaymentKpp = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) callback()
  else if (profileForm.value?.user_type === 'legal' && value.length < 9)
    callback(new Error('КПП должен содержать минимум 9 символов для юридических лиц'))
  else callback()
}

const validatePaymentBik = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) callback()
  else if (profileForm.value?.user_type === 'legal' && value.length < 9)
    callback(new Error('БИК должен содержать минимум 9 символов для юридических лиц'))
  else callback()
}

const phoneValidator = createPhoneNumberValidator({ allowEmpty: false })

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
  last_name: [{ required: false, message: 'Введите фамилию', trigger: 'blur' }],
  first_name: [{ required: false, message: 'Введите имя', trigger: 'blur' }],
  patronymic: [{ required: false, message: 'Введите отчество', trigger: 'blur' }],
  payment_inn: [{ validator: validatePaymentInn, trigger: ['blur', 'change'] }],
  payment_kpp: [{ validator: validatePaymentKpp, trigger: ['blur', 'change'] }],
  payment_bik: [{ validator: validatePaymentBik, trigger: ['blur', 'change'] }],
})

function buildAddressString(): string {
  const profile = profileForm.value
  if (!profile) return ''
  const addressParts = [
    profile.postal || '',
    profile.region || '',
    profile.city_name || '',
    profile.street || '',
    profile.building || '',
    profile.apartment || '',
  ].filter((part) => part && part.trim())
  return addressParts.join(', ')
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

    await profileStore.updateProfile(profile as IProfile)
    router.push({ path: '/personal/profile' })
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

const contactFio = computed({
  get: () => {
    if (!profileForm.value) return ''
    return [profileForm.value.last_name, profileForm.value.first_name, profileForm.value.patronymic]
      .filter(Boolean)
      .join(' ')
  },
  set: (v: string) => {
    if (!profileForm.value) return
    const parts = (v || '').split(/\s+/).map((s) => s.trim()).filter(Boolean)
    profileForm.value.last_name = parts[0] ?? ''
    profileForm.value.first_name = parts[1] ?? ''
    profileForm.value.patronymic = parts[2] ?? ''
  },
})
</script>

<template>
  <el-row :gutter="20" class="profile-header">
    <el-col :offset="1" :span="4">
      <h1>Профиль</h1>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="background-color: #fff; padding-top: 30px; min-height: 500px; padding-left: 20px">
    <el-form
      ref="formRef"
      :model="profileForm"
      :rules="rules"
      label-width="0"
      label-position="top"
      style="width: 100%"
    >
      <el-col :offset="1" :span="22">
        <div v-if="activeTab === 'individual'" class="profile-content">
          <div v-if="profileForm" class="profile-section">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="last_name">
                  <Input v-model="profileForm.last_name" placeholder="Фамилия" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="first_name">
                  <Input v-model="profileForm.first_name" placeholder="Имя" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="patronymic">
                  <Input v-model="profileForm.patronymic" placeholder="Отчество" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="username">
                  <Input v-model="profileForm.username" placeholder="Логин" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="email">
                  <Input v-model="profileForm.email" placeholder="E-mail" type="email" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="phone_number">
                  <Input
                    v-model="profileForm.phone_number"
                    placeholder="+7 (___) ___-__-__"
                    type="tel"
                    :formatter="formatPhoneDisplay"
                    :parser="parsePhoneToDigits"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="section-title">Адрес доставки</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="postal">
                  <Input v-model="profileForm.postal" placeholder="Индекс" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="region">
                  <Input v-model="profileForm.region" placeholder="Регион/Область" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="city_name">
                  <Input v-model="profileForm.city_name" placeholder="Город" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="street">
                  <Input v-model="profileForm.street" placeholder="Улица" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="building">
                  <Input v-model="profileForm.building" placeholder="Строение" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="apartment">
                  <Input v-model="profileForm.apartment" placeholder="Офис/Помещение" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-if="activeTab === 'legal'" class="profile-content">
          <div v-if="profileForm" class="profile-section">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item prop="payment_company_name">
                  <Input v-model="profileForm.payment_company_name" placeholder="Полное название компании" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="phone_number">
                  <Input
                    v-model="profileForm.phone_number"
                    placeholder="+7 (___) ___-__-__"
                    type="tel"
                    :formatter="formatPhoneDisplay"
                    :parser="parsePhoneToDigits"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="email">
                  <Input v-model="profileForm.email" placeholder="E-mail" type="email" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="section-title">Контактное лицо</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="last_name">
                  <Input v-model="contactFio" placeholder="ФИО" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="personal_phone_number">
                  <Input
                    v-model="profileForm.personal_phone_number"
                    placeholder="+7 (___) ___-__-__"
                    type="tel"
                    :formatter="formatPhoneDisplay"
                    :parser="parsePhoneToDigits"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="section-title">Банковские реквизиты</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="payment_inn">
                  <Input v-model="profileForm.payment_inn" placeholder="ИНН" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="payment_kpp">
                  <Input v-model="profileForm.payment_kpp" placeholder="КПП" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="payment_account">
                  <Input v-model="profileForm.payment_account" placeholder="Расчетный счет" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="payment_bank_name">
                  <Input v-model="profileForm.payment_bank_name" placeholder="Наименование банка" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="payment_bik">
                  <Input v-model="profileForm.payment_bik" placeholder="БИК" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="payment_cor_account">
                  <Input v-model="profileForm.payment_cor_account" placeholder="Корреспондентский счет" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="section-title">Адрес доставки</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="postal">
                  <Input v-model="profileForm.postal" placeholder="Индекс" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="region">
                  <Input v-model="profileForm.region" placeholder="Регион/Область" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="city_name">
                  <Input v-model="profileForm.city_name" placeholder="Город" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="street">
                  <Input v-model="profileForm.street" placeholder="Улица" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="building">
                  <Input v-model="profileForm.building" placeholder="Строение" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="apartment">
                  <Input v-model="profileForm.apartment" placeholder="Офис/Помещение" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="profile-footer">
          <div class="profile-footer-left">
            <Button width="220px" class="profile-back-button" @click="goToMain">
              &lt; К главной странице
            </Button>
          </div>
          <!-- <div v-if="activeTab === 'legal'" class="profile-footer-center">
            <Button width="220px" class="profile-orders-button" @click="goToOrders">
              Заказы и расчеты
            </Button>
          </div> -->
          <div class="profile-footer-right">
            <Button width="220px" class="profile-update-button" :loading="isSaving" @click="onUpdate">
              Сохранить изменения
            </Button>
          </div>
        </div>
      </el-col>
    </el-form>
  </el-row>
</template>

<style scoped>
.profile-content {
  margin-top: 20px;
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
  padding: 10px 20px 0;
  min-height: 100px;
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


