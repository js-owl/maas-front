<script setup lang="ts">
import { onMounted, ref } from "vue";

// const store = useUserStore();

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
let color = ref("");
onMounted(() => {
  const rootStyles = getComputedStyle(document.documentElement);
  color.value = rootStyles.getPropertyValue("--upper-menu-bg").trim();
});
</script>

<template>
  <el-row
    :gutter="0"
    style="
      display: flex;
      align-items: center;
      background-color: var(--upper-menu-bg);
      height: 120px;
    "
  >
    <el-col :offset="3" :span="18">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        :background-color="color"
        text-color="#fff"
        active-text-color="#fff"
        :router="true"
        @select="handleSelect"
      >
        <el-menu-item index="/" :route="{ path: '/' }" class="first-element">
          ЦКП
        </el-menu-item>
        <el-menu-item
          index="/machining"
          :route="{ path: '/machining' }"
          style="font-size: 24px"
        >
          Калькулятор стоимости изделия
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-menu.el-menu--horizontal {
  border-bottom: none;
  /* margin-right: 100px; */
}
.el-menu-item {
  font-size: 20px;
}
:deep(.el-header) {
  padding-left: 0px;
}
:deep(.el-sub-menu__title) {
  font-size: 20px;
  /* padding: 5px; */
}
:deep(.el-sub-menu) {
  font-size: 20px;
  /* padding: 5px; */
}
.first-element {
  font-size: 30px;
  color: white !important;
  text-decoration: none;
  font-weight: 700;
  margin-right: 50px !important;
}
.first-element.is-active {
  color: white !important;
  border-bottom: none !important;
}
</style>
