<script lang="ts" setup>
import { ref } from "vue";
import { useRegStore } from "../../stores/reg.store";
import type { FormInstance, FormRules } from "element-plus";

let dialogFormVisible = defineModel<boolean>();

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  company: string;
  agreement: boolean;
}

const formRef = ref<FormInstance>();
const form = ref<FormData>({
  firstName: "aaa",
  lastName: "bbb",
  email: "a@a.ru",
  phone: "1-111-111-11-11",
  service: "",
  company: "",
  agreement: false,
});

const regStore = useRegStore();

const validateEmail = (
  _rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    callback(new Error("Пожалуйста, введите email"));
  } else if (!emailRegex.test(value)) {
    callback(new Error("Пожалуйста, введите корректный email"));
  } else {
    callback();
  }
};

const validatePhone = (
  _rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  const phoneRegex = /^[\d\s()+.-]{10,}$/;
  if (!value) {
    callback(new Error("Пожалуйста, введите номер телефона"));
  } else if (!phoneRegex.test(value)) {
    callback(new Error("Пожалуйста, введите корректный номер телефона"));
  } else {
    callback();
  }
};

const validateAgreement = (
  _rule: any,
  value: boolean,
  callback: (error?: Error) => void
) => {
  if (!value) {
    callback(new Error("Необходимо согласиться с условиями"));
  } else {
    callback();
  }
};

const rules = ref<FormRules<FormData>>({
  firstName: [
    { required: true, message: "Пожалуйста, введите имя", trigger: "blur" },
    {
      min: 2,
      message: "Имя должно содержать минимум 2 символа",
      trigger: "blur",
    },
  ],
  lastName: [
    { required: true, message: "Пожалуйста, введите фамилию", trigger: "blur" },
    {
      min: 2,
      message: "Фамилия должна содержать минимум 2 символа",
      trigger: "blur",
    },
  ],
  email: [{ validator: validateEmail, trigger: "blur" }],
  phone: [{ validator: validatePhone, trigger: "blur" }],
  agreement: [{ validator: validateAgreement, trigger: "change" }],
});

const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    console.log("Form submitted:", form.value);
    await regStore.register(form);
  } catch (error) {
    console.error("Form validation failed:", error);
  }
};
</script>

<template>
  <el-dialog v-model="dialogFormVisible" title="Регистрация" width="500">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="0"
      label-position="top"
      @submit.prevent="submitForm"
    >
      <el-form-item label="Имя*" prop="firstName">
        <el-input v-model="form.firstName" placeholder="Введите имя" />
      </el-form-item>

      <el-form-item label="Фамилия*" prop="lastName">
        <el-input v-model="form.lastName" placeholder="Введите фамилию" />
      </el-form-item>

      <el-form-item label="E-mail*" prop="email">
        <el-input v-model="form.email" placeholder="Введите почту" />
      </el-form-item>

      <el-form-item label="Моб. телефон*" prop="phone">
        <el-input v-model="form.phone" placeholder="Номер телефона" />
      </el-form-item>

      <el-form-item label="Какая услуга вас интересует?" prop="service">
        <el-select
          v-model="form.service"
          placeholder="Выберите услугу"
          style="width: 100%"
        >
          <el-option label="Расчет" value="price" />
        </el-select>
      </el-form-item>

      <el-form-item label="Название компании" prop="company">
        <el-input
          v-model="form.company"
          placeholder="Введите название компании"
        />
      </el-form-item>

      <el-form-item prop="agreement">
        <el-checkbox v-model="form.agreement">
          Я согласен с «Пользовательскими соглашениями ЦКП»
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          style="width: 100%"
          :disabled="!form.agreement"
        >
          Регистрация
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
