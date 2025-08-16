<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../stores/user.store";

const store = useUserStore();

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<template>
  <el-row
    :gutter="20"
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
        <el-menu-item index="6" style="font-size: 24px">
          Связаться с нами
        </el-menu-item>
        <el-menu-item index="7" style="font-size: 24px">FAQ</el-menu-item>
        <el-menu-item
          index="/cad"
          :route="{ path: '/cad' }"
          style="font-size: 24px"
        >
          Центр поддержки
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="store.user.name"
      placement="top-start"
    >
      <el-col :offset="1" :span="2">
        <span style="font-size: 30px; color: white"></span>
      </el-col>
    </el-tooltip>
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
</style>
