<script lang="ts" setup>
import router from "../../router";

let dialogVisible = defineModel<boolean>();

const handleClose = () => {
  console.log("handleClose");
  dialogVisible.value = false;
  router.push({
    name: "personal-orders",
  });
};
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    title="Спасибо за оформление заказа!"
    width="500"
    :before-close="handleClose"
  >
    <p>Платежные документы были отправлены на почту.</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose"> Ясно </el-button>
      </div>
    </template>
  </el-dialog>
</template>
