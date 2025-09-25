<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { req_json } from "../../api";

const dialogFormVisible = defineModel<boolean>();

interface FormData {
  name: string;
  phone: string;
  product: string;
  time: string;
  additional: string;
  agreement: boolean;
}

const formRef = ref<FormInstance>();
const form = ref<FormData>({
  name: "",
  phone: "",
  product: "",
  time: "",
  additional: "",
  agreement: false,
});

const loading = ref(false);

const validatePhone = (
  _rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  const phoneRegex = /^[\d\s()+.-]{10,}$/;
  if (value && !phoneRegex.test(value)) {
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
  name: [
    { required: true, message: "Пожалуйста, введите имя", trigger: "blur" },
    {
      min: 2,
      message: "Имя должно содержать минимум 2 символа",
      trigger: "blur",
    },
  ],
  phone: [
    { required: true, message: "Пожалуйста, введите номер телефона", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" }
  ],
  time: [
    { required: true, message: "Пожалуйста, выберите удобное время", trigger: "change" },
  ],
  agreement: [{ validator: validateAgreement, trigger: "change" }],
});

const closeDialog = () => {
  dialogFormVisible.value = false;
  // Reset form when closing
  form.value = {
    name: "",
    phone: "",
    product: "",
    time: "",
    additional: "",
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

    // Отправляем данные на бэкенд
    await req_json("/call-request", "POST", form.value);

    ElMessage({
      type: "success",
      message:
        "Заявка на звонок отправлена! Мы свяжемся с вами в ближайшее время.",
    });

    // Close dialog and reset form
    closeDialog();
  } catch (error) {
    console.error("Form submission failed:", error);
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
      <el-form-item label="Имя" prop="name">
        <el-input v-model="form.name" placeholder="Введите имя" />
      </el-form-item>

      <el-form-item label="Телефон" prop="phone">
        <el-input v-model="form.phone" placeholder="+7 (___) ___-__-__" />
      </el-form-item>

      <el-form-item label="Какой продукт вас интересует?" prop="product">
        <el-select
          v-model="form.product"
          placeholder="Выберите продукт"
          style="width: 100%"
        >
          <el-option label="Токарные работы" value="machining" />
          <el-option label="Фрезерные работы" value="milling" />
          <el-option label="Другое" value="other" />
        </el-select>
      </el-form-item>

      <el-form-item label="Когда Вам позвонить?" prop="time">
        <el-select
          v-model="form.time"
          placeholder="Выберите удобное время"
          style="width: 100%"
        >
          <el-option label="9:00 - 10:00" value="09:00-10:00" />
          <el-option label="10:00 - 11:00" value="10:00-11:00" />
          <el-option label="11:00 - 12:00" value="11:00-12:00" />
          <el-option label="12:00 - 13:00" value="12:00-13:00" />
          <el-option label="13:00 - 14:00" value="13:00-14:00" />
          <el-option label="14:00 - 15:00" value="14:00-15:00" />
          <el-option label="15:00 - 16:00" value="15:00-16:00" />
          <el-option label="16:00 - 17:00" value="16:00-17:00" />
          <el-option label="17:00 - 18:00" value="17:00-18:00" />
          <el-option label="18:00 - 19:00" value="18:00-19:00" />
        </el-select>
      </el-form-item>

      <el-form-item label="Дополнительная информация" prop="additional">
        <el-input
          v-model="form.additional"
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
          {{ loading ? "Отправка..." : "Заказать звонок" }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
