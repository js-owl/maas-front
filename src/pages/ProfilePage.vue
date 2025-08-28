<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import { onMounted, ref } from "vue";
import { useProfileStore, type IProfile } from "../stores/profile.store";

const profileStore = useProfileStore();
const profileForm = ref<IProfile>();
const formRef = ref<FormInstance>();

onMounted(async () => {
  profileForm.value = profileStore.profile;
});

const rules = ref<FormRules<IProfile>>({
  username: [{ required: true, message: "Введите имя", trigger: "blur" }],
});

async function onSubmit() {
  if (!formRef.value || !profileForm.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      await profileStore.updateProfile(profileForm.value as IProfile);
    }
  });
}
</script>

<template>
  <el-row
    :gutter="20"
    style="
      background-color: #fff;
      padding-top: 30px;
      min-height: 100px;
      padding-left: 20px;
    "
  >
    <el-col :offset="2" :span="20">
      <h1>Профиль</h1>
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
      <el-row :gutter="20">
        <el-col :offset="2" :span="6">
          <div style="font-size: 24px; padding-bottom: 30px">
            Общая информация
          </div>
          <el-form-item
            v-if="profileForm"
            label="Имя пользователя"
            prop="username"
          >
            <el-input
              v-model="profileForm.username"
              placeholder="username"
              disabled
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">
              Обновить информацию
            </el-button>
          </el-form-item>
        </el-col>

        <el-col :offset="1" :span="6">
          <div style="font-size: 24px; padding-bottom: 30px">
            Адрес доставки
          </div>
          <el-form-item v-if="profileForm" label="Город" prop="city">
            <el-input v-model="profileForm.city" placeholder="Введите город" />
          </el-form-item>
        </el-col>

        <el-col :offset="1" :span="6">
          <div style="font-size: 24px; padding-bottom: 30px">
            Информация о платеже
          </div>
          <el-form-item
            v-if="profileForm"
            label="Банковская карта"
            prop="payment_card_number"
          >
            <el-input
              v-model="profileForm.payment_card_number"
              placeholder="Введите карту"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>

<style scoped></style>
