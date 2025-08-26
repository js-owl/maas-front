<script setup lang="ts">
import { ref } from "vue";

// const store = useUserStore();

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<template>
  <el-row
    :gutter="0"
    style="
      display: flex;
      align-items: center;
      background-color: #be2a44;
      height: 120px;
    "
  >
    <el-col :offset="2" :span="19">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#be2a44"
        text-color="#fff"
        active-text-color="black"
        :router="true"
      >
        <el-menu-item index="6" class="first-element"> ЦКП </el-menu-item>
        <el-menu-item index="7" style="font-size: 24px">
          Калькулятор стоимости изделия
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
.el-menu.el-menu--horizontal.is-active {
  color: white !important;
  border-bottom: none !important;
}
.first-element {
  margin: 0 40px 0 0px;
  font-size: 30px;
  color: white;
  text-decoration: none;
  font-weight: 700;
}
</style>
