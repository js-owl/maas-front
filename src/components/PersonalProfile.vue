<script lang="ts" setup>
import { type FormInstance, type FormRules } from 'element-plus'
import { onMounted, ref, watch } from 'vue'
import Input from './ui/Input.vue'
import { useProfileStore, type IProfile } from '../stores/profile.store'
import router from '../router'

const profileStore = useProfileStore()
const profileForm = ref<IProfile>()
const formRef = ref<FormInstance>()
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

const rules = ref<FormRules<IProfile>>({
  username: [{ required: true, message: 'Введите имя', trigger: 'blur' }],
  email: [
    { required: true, message: 'Введите email', trigger: 'blur' },
    { type: 'email', message: 'Введите корректный email', trigger: ['blur', 'change'] },
  ],
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
  if (!formRef.value || !profileForm.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const profile = profileForm.value
      if (profile) {
        profile.city = buildAddressString()
        profile.user_type = activeTab.value
        await profileStore.updateProfile(profile as IProfile)
        router.push({ path: '/personal/profile' })
      }
    }
  })
}
</script>

<template>
  <el-row
    :gutter="20"
    style="
      display: flex;
      align-items: center;
      background-color: #fff;
      padding-top: 10px;
      min-height: 100px;
      padding-left: 20px;
    "
  >
    <el-col :offset="1" :span="4">
      <h1>Профиль</h1>
    </el-col>
    <el-col :span="6">
      <el-button type="primary" @click="onUpdate"> Обновить профиль </el-button>
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
            <div class="section-title">Общая информация</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="Логин" prop="username">
                  <Input v-model="profileForm.username" placeholder="username" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Email" prop="email">
                  <Input v-model="profileForm.email" placeholder="Введите свой email" type="email" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Полное имя" prop="full_name">
                  <Input v-model="profileForm.full_name" placeholder="Введите полное имя" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="section-title">Адрес доставки по умолчанию</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="Индекс" prop="postal">
                  <Input v-model="profileForm.postal" placeholder="Введите индекс" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Регион/Область" prop="region">
                  <Input v-model="profileForm.region" placeholder="Введите регион" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Город" prop="city_name">
                  <Input v-model="profileForm.city_name" placeholder="Введите город" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Улица" prop="street">
                  <Input v-model="profileForm.street" placeholder="Введите улицу" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Дом/Строение" prop="building">
                  <Input v-model="profileForm.building" placeholder="Введите номер дома" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Квартира/Офис" prop="apartment">
                  <Input v-model="profileForm.apartment" placeholder="Введите номер квартиры" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-if="activeTab === 'legal'" class="profile-content">
          <div v-if="profileForm" class="profile-section">
            <div class="section-title">Общая информация</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="Логин" prop="username">
                  <Input v-model="profileForm.username" placeholder="username" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Email" prop="email">
                  <Input v-model="profileForm.email" placeholder="Введите свой email" type="email" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Получатель" prop="payment_company_name">
                  <Input v-model="profileForm.payment_company_name" placeholder="Введите получателя" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Наименование банка" prop="payment_bank_name">
                  <Input v-model="profileForm.payment_bank_name" placeholder="Введите имя банка" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="ИНН" prop="payment_inn">
                  <Input v-model="profileForm.payment_inn" placeholder="Введите ИНН" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="КПП" prop="payment_kpp">
                  <Input v-model="profileForm.payment_kpp" placeholder="Введите КПП" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="БИК" prop="payment_bik">
                  <Input v-model="profileForm.payment_bik" placeholder="Введите БИК" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Корр.счет" prop="payment_cor_account">
                  <Input v-model="profileForm.payment_cor_account" placeholder="Введите корреспондентский счет" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Расчетный счет" prop="payment_account">
                  <Input v-model="profileForm.payment_account" placeholder="Введите расчетный счет" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="profileForm" class="profile-section">
            <div class="section-title">Адрес доставки</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="Индекс" prop="postal">
                  <Input v-model="profileForm.postal" placeholder="Введите индекс" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Регион/Область" prop="region">
                  <Input v-model="profileForm.region" placeholder="Введите регион" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Город" prop="city_name">
                  <Input v-model="profileForm.city_name" placeholder="Введите город" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Улица" prop="street">
                  <Input v-model="profileForm.street" placeholder="Введите улицу" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Дом/Строение" prop="building">
                  <Input v-model="profileForm.building" placeholder="Введите номер дома" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Квартира/Офис" prop="apartment">
                  <Input v-model="profileForm.apartment" placeholder="Введите номер квартиры" />
                </el-form-item>
              </el-col>
            </el-row>
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
  margin-bottom: 24px;
}
</style>


