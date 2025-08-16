<script lang="ts" setup>
import { ref } from "vue";

interface Props {
  price: string;
  quantity: number;
}
const { price, quantity } = defineProps<Props>();
const pricePerDay = ref("1");
</script>

<template>
  <el-card style="background-color: #ddd">
    <p style="color: #666; font-size: 20px; margin-top: 0px">
      Выбрать вариант изготовления
    </p>
    <el-radio-group v-model="pricePerDay" class="radio-group">
      <el-radio value="1">
        <div>
          <span class="radio-item">{{
            `${Number(price) * quantity} руб (5 дней)`
          }}</span>
          <span>{{ ` ${price} руб/шт` }}</span>
        </div>
      </el-radio>
      <el-radio value="2">
        <div>
          <span class="radio-item">{{
            `${(Number(price) - 50) * quantity} руб (8 дней)`
          }}</span>
          <span>{{ ` ${Number(price) - 50} руб/шт` }}</span>
        </div>
      </el-radio>
      <el-radio value="3">
        <div>
          <span class="radio-item">{{
            `${(Number(price) - 100) * quantity} руб (15 дней)`
          }}</span>
          <span>{{ ` ${Number(price) - 100} руб/шт` }}</span>
        </div>
      </el-radio>
    </el-radio-group>
  </el-card>
</template>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: center;
  align-items: flex-start;
}
.radio-item {
  font-size: 24px;
}
.el-radio {
  padding-bottom: 5px;
}
</style>
