<script lang="ts" setup>
import { type FormInstance, type FormRules } from "element-plus";
import { onMounted, ref, watch } from "vue";
import { useProfileStore, type IProfile } from "../stores/profile.store";
import router from "../router";

const profileStore = useProfileStore();
const profileForm = ref<IProfile>();
const formRef = ref<FormInstance>();
const activeTab = ref("individual");

onMounted(async () => {
  // Если профиль уже загружен в store, используем его
  if (profileStore.profile) {
    profileForm.value = Object.assign({}, profileStore.profile);
    // Устанавливаем activeTab на основе user_type из профиля
    const profile = profileStore.profile as IProfile;
    if (profile && profile.user_type) {
      activeTab.value = profile.user_type;
    } else {
      // Если user_type не установлен, устанавливаем по умолчанию
      if (profileForm.value) {
        (profileForm.value as IProfile).user_type = activeTab.value;
      }
    }
  } else {
    // Если профиль не загружен, загружаем его
    await profileStore.getProfile();
    if (profileStore.profile) {
      profileForm.value = Object.assign({}, profileStore.profile);
      // Устанавливаем activeTab на основе user_type из профиля
      const profile = profileStore.profile as IProfile;
      if (profile && profile.user_type) {
        activeTab.value = profile.user_type;
      } else {
        // Если user_type не установлен, устанавливаем по умолчанию
        if (profileForm.value) {
          (profileForm.value as IProfile).user_type = activeTab.value;
        }
      }
    }
  }
});

// Синхронизируем activeTab с user_type в профиле
watch(activeTab, (newTab) => {
  if (profileForm.value) {
    profileForm.value.user_type = newTab;
  }
});

const rules = ref<FormRules<IProfile>>({
  username: [{ required: true, message: "Введите имя", trigger: "blur" }],
  email: [
    { required: true, message: "Введите email", trigger: "blur" },
    {
      type: "email",
      message: "Введите корректный email",
      trigger: ["blur", "change"],
    },
  ],
});

// Функция для сборки адреса из отдельных полей
function buildAddressString(): string {
  const profile = profileForm.value;
  if (!profile) return "";

  const addressParts = [
    profile.postal || "",
    profile.region || "",
    profile.city_name || "",
    profile.street || "",
    profile.building || "",
    profile.apartment || "",
  ].filter((part) => part && part.trim()); // Убираем пустые значения

  return addressParts.join(", ");
}

async function onUpdate() {
  if (!formRef.value || !profileForm.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      // Собираем адрес из отдельных полей в поле city
      const profile = profileForm.value;
      if (profile) {
        profile.city = buildAddressString();
        // Убеждаемся, что user_type синхронизирован с activeTab
        profile.user_type = activeTab.value;
        await profileStore.updateProfile(profile as IProfile);
        router.push({ name: "profile" });
      }
    }
  });
}
</script>

<template>
  <el-row
    :gutter="20"
    style="
      display: flex;
      align-items: center;
      background-color: #fff;
      padding-top: 30px;
      min-height: 100px;
      padding-left: 20px;
    "
  >
    <el-col :offset="3" :span="4">
      <h1>Профиль</h1>
    </el-col>
    <el-col :span="6">
      <el-button type="primary" @click="onUpdate"> Обновить профиль </el-button>
    </el-col>
  </el-row>
  <el-row
    :gutter="20"
    style="
      background-color: #fff;
      padding-top: 30px;
      min-height: 500px;
      padding-left: 20px;
    "
  >
    <el-form
      ref="formRef"
      :model="profileForm"
      :rules="rules"
      label-width="0"
      label-position="top"
      style="width: 100%"
    >
      <!-- Контент профиля в зависимости от user_type -->
      <el-col :offset="3" :span="18">
        <!-- Частное лицо -->
        <div v-if="activeTab === 'individual'" class="profile-content">
            <el-row :gutter="20">
              <el-col :span="11">
                <div style="font-size: 24px; padding-bottom: 30px">
                  Общая информация
                </div>
                <div v-if="profileForm">
                  <el-form-item label="Логин" prop="username">
                    <el-input
                      v-model="profileForm.username"
                      placeholder="username"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="Email" prop="email">
                    <el-input
                      v-model="profileForm.email"
                      placeholder="Введите свой email"
                      type="email"
                    />
                  </el-form-item>
                  <el-form-item label="Полное имя" prop="full_name">
                    <el-input
                      v-model="profileForm.full_name"
                      placeholder="Введите полное имя"
                    />
                  </el-form-item>
                </div>
              </el-col>
              <el-col :offset="2" :span="11">
                <div style="font-size: 24px; padding-bottom: 30px">
                  Адрес доставки
                </div>
                <div v-if="profileForm">
                  <el-form-item label="Индекс" prop="postal">
                    <el-input
                      v-model="profileForm.postal"
                      placeholder="Введите индекс"
                    />
                  </el-form-item>
                  <el-form-item label="Регион/Область" prop="region">
                    <el-input
                      v-model="profileForm.region"
                      placeholder="Введите регион"
                    />
                  </el-form-item>
                  <el-form-item label="Город" prop="city_name">
                    <el-input
                      v-model="profileForm.city_name"
                      placeholder="Введите город"
                    />
                  </el-form-item>
                  <el-form-item label="Улица" prop="street">
                    <el-input
                      v-model="profileForm.street"
                      placeholder="Введите улицу"
                    />
                  </el-form-item>
                  <el-form-item label="Дом/Строение" prop="building">
                    <el-input
                      v-model="profileForm.building"
                      placeholder="Введите номер дома"
                    />
                  </el-form-item>
                  <el-form-item label="Квартира/Офис" prop="apartment">
                    <el-input
                      v-model="profileForm.apartment"
                      placeholder="Введите номер квартиры"
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
        </div>

        <!-- Компания -->
        <div v-if="activeTab === 'legal'" class="profile-content">
            <el-row :gutter="20">
              <el-col :span="11">
                <div style="font-size: 24px; padding-bottom: 30px">
                  Общая информация
                </div>
                <div v-if="profileForm">
                  <el-form-item label="Логин" prop="username">
                    <el-input
                      v-model="profileForm.username"
                      placeholder="username"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="Email" prop="email">
                    <el-input
                      v-model="profileForm.email"
                      placeholder="Введите свой email"
                      type="email"
                    />
                  </el-form-item>
                  <el-form-item label="Получатель" prop="payment_company_name">
                    <el-input
                      v-model="profileForm.payment_company_name"
                      placeholder="Введите получателя"
                    />
                  </el-form-item>

                  <el-form-item
                    label="Наименование банка"
                    prop="payment_bank_name"
                  >
                    <el-input
                      v-model="profileForm.payment_bank_name"
                      placeholder="Введите имя банка"
                    />
                  </el-form-item>
                  <el-form-item label="ИНН" prop="payment_inn">
                    <el-input
                      v-model="profileForm.payment_inn"
                      placeholder="Введите ИНН"
                    />
                  </el-form-item>
                  <el-form-item label="КПП" prop="payment_kpp">
                    <el-input
                      v-model="profileForm.payment_kpp"
                      placeholder="Введите КПП"
                    />
                  </el-form-item>
                  <el-form-item label="БИК" prop="payment_bik">
                    <el-input
                      v-model="profileForm.payment_bik"
                      placeholder="Введите БИК"
                    />
                  </el-form-item>
                  <el-form-item label="Корр.счет" prop="payment_cor_account">
                    <el-input
                      v-model="profileForm.payment_cor_account"
                      placeholder="Введите корреспондентский счет"
                    />
                  </el-form-item>
                  <el-form-item label="Расчетный счет" prop="payment_account">
                    <el-input
                      v-model="profileForm.payment_account"
                      placeholder="Введите расчетный счет"
                    />
                  </el-form-item>
                </div>
              </el-col>
              <el-col :offset="2" :span="11">
                <div style="font-size: 24px; padding-bottom: 30px">
                  Адрес доставки
                </div>
                <div v-if="profileForm">
                  <el-form-item label="Индекс" prop="postal">
                    <el-input
                      v-model="profileForm.postal"
                      placeholder="Введите индекс"
                    />
                  </el-form-item>
                  <el-form-item label="Регион/Область" prop="region">
                    <el-input
                      v-model="profileForm.region"
                      placeholder="Введите регион"
                    />
                  </el-form-item>
                  <el-form-item label="Город" prop="city_name">
                    <el-input
                      v-model="profileForm.city_name"
                      placeholder="Введите город"
                    />
                  </el-form-item>
                  <el-form-item label="Улица" prop="street">
                    <el-input
                      v-model="profileForm.street"
                      placeholder="Введите улицу"
                    />
                  </el-form-item>
                  <el-form-item label="Дом/Строение" prop="building">
                    <el-input
                      v-model="profileForm.building"
                      placeholder="Введите номер дома"
                    />
                  </el-form-item>
                  <el-form-item label="Квартира/Офис" prop="apartment">
                    <el-input
                      v-model="profileForm.apartment"
                      placeholder="Введите номер квартиры"
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
        </div>
      </el-col>
    </el-form>
  </el-row>
</template>

<style scoped>
.profile-content {
  margin-top: 20px;
}
</style>
