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
        <el-menu-item
          index="/"
          :route="{ path: '/' }"
          class="first-element"
        >
          ЦКП
        </el-menu-item>

        <!-- Кнопки калькуляторов -->
        <div class="calculator-buttons">
          <el-button
            class="calculator-button"
            @click="$router.push('/machining2')"
          >
            Калькулятор стоимости токарной обработки
          </el-button>
          <el-button
            class="calculator-button"
            @click="$router.push('/milling2')"
          >
            Калькулятор стоимости фрезерной обработки
          </el-button>
        </div>
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

.calculator-buttons {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: 0px;
  height: 100%;
}

.calculator-button {
  background-color: transparent !important;
  border: 1px solid #d3d4d6 !important;
  color: #d3d4d6 !important;
  padding: 12px 24px !important;
  font-size: 16px !important;
  border-radius: 4px !important;
  transition: all 0.3s ease !important;
}

.calculator-button:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: #ffffff !important;
  color: #ffffff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.calculator-button:focus {
  background-color: transparent !important;
  border-color: #d3d4d6 !important;
  color: #d3d4d6 !important;
}
</style>
