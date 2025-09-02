<script lang="ts" setup>
import { ref } from "vue";
import { useRegStore } from "../../stores/reg.store";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";

const dialogFormVisible = defineModel<boolean>();

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const formRef = ref<FormInstance>();
const form = ref<FormData>({
  username: "",
  password: "",
  confirmPassword: "",
});

const regStore = useRegStore();
const loading = ref(false);

const validateLogin = (
  _rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  if (!value) {
    callback(new Error("Пожалуйста, введите логин"));
  } else if (value.length < 4) {
    callback(new Error("Логин должен содержать минимум 4 символа"));
  } else {
    callback();
  }
};

const validatePassword = (
  _rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  if (!value) {
    callback(new Error("Пожалуйста, введите пароль"));
  } else if (value.length < 6) {
    callback(new Error("Пароль должен содержать минимум 6 символов"));
  } else {
    callback();
  }
};

const validateConfirmPassword = (
  _rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  if (!value) {
    callback(new Error("Пожалуйста, подтвердите пароль"));
  } else if (value !== form.value.password) {
    callback(new Error("Пароли не совпадают"));
  } else {
    callback();
  }
};

const rules = ref<FormRules<FormData>>({
  username: [{ validator: validateLogin, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
});

const closeDialog = () => {
  dialogFormVisible.value = false;
  // Reset form when closing
  form.value = {
    username: "",
    password: "",
    confirmPassword: "",
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

    console.log("Form submitted:", form.value);
    await regStore.register(form);

    ElMessage({
      type: "success",
      message: "Регистрация успешно завершена!",
    });

    // Close dialog and reset form
    closeDialog();
  } catch (error) {
    console.error("Form validation failed:", error);
    ElMessage({
      type: "error",
      message:
        error instanceof Error ? error.message : "Ошибка при регистрации",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="Регистрация"
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
      <el-form-item label="Username*" prop="username">
        <el-input v-model="form.username" placeholder="Введите username" />
      </el-form-item>

      <el-form-item label="Пароль*" prop="password">
        <el-input
          v-model="form.password"
          placeholder="Введите пароль"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item label="Подтвердите пароль*" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          placeholder="Подтвердите пароль"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          style="width: 100%"
          :loading="loading"
        >
          {{ loading ? "Регистрация..." : "Регистрация" }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
