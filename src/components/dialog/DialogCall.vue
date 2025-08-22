<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";

const dialogFormVisible = defineModel<boolean>();

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  service: string;
  company: string;
  message: string;
  agreement: boolean;
}

const formRef = ref<FormInstance>();
const form = ref<FormData>({
  firstName: "",
  lastName: "",
  phone: "",
  service: "",
  company: "",
  message: "",
  agreement: false,
});

const loading = ref(false);

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
  phone: [{ validator: validatePhone, trigger: "blur" }],
  agreement: [{ validator: validateAgreement, trigger: "change" }],
});

const closeDialog = () => {
  dialogFormVisible.value = false;
  // Reset form when closing
  form.value = {
    firstName: "",
    lastName: "",
    phone: "",
    service: "",
    company: "",
    message: "",
    agreement: false,
  };
  // Clear validation errors
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;
    
    console.log("Call request submitted:", form.value);
    
    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    ElMessage({
      type: "success",
      message: "Заявка на звонок отправлена! Мы свяжемся с вами в ближайшее время.",
    });
    
    // Close dialog and reset form
    closeDialog();
    
  } catch (error) {
    console.error("Form validation failed:", error);
    ElMessage({
      type: "error",
      message: "Ошибка при отправке заявки. Попробуйте еще раз.",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <el-dialog 
    v-model="dialogFormVisible" 
    title="Заказать звонок" 
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    @close="closeDialog"
  >
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

      <el-form-item label="Телефон*" prop="phone">
        <el-input v-model="form.phone" placeholder="+7 (___) ___-__-__" />
      </el-form-item>

      <el-form-item label="Какая услуга вас интересует?" prop="service">
        <el-select
          v-model="form.service"
          placeholder="Выберите услугу"
          style="width: 100%"
        >
          <el-option label="Токарные работы" value="machining" />
          <el-option label="Фрезерные работы" value="milling" />
          <el-option label="Производство из композитных материалов" value="plastic" />
          <el-option label="Лакокрасочные покрытия" value="paint" />
          <el-option label="Другое" value="other" />
        </el-select>
      </el-form-item>

      <el-form-item label="Название компании" prop="company">
        <el-input
          v-model="form.company"
          placeholder="Введите название компании"
        />
      </el-form-item>

      <el-form-item label="Дополнительная информация" prop="message">
        <el-input
          v-model="form.message"
          type="textarea"
          :rows="3"
          placeholder="Опишите ваш запрос или оставьте комментарий"
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
          :loading="loading"
          :disabled="!form.agreement"
        >
          {{ loading ? 'Отправка...' : 'Заказать звонок' }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
