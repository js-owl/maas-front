<script setup lang="ts">
import { onMounted, ref } from "vue";
import VersionInfo from "./VersionInfo.vue";

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
  <el-row :gutter="0" class="footer-row">
    <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
      <div class="footer-container">
        <div class="left-section">
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
          </el-menu>

          <div class="vertical-links">
            <router-link to="/license" class="vertical-link">
              Политика обработки персональных данных
            </router-link>
            <router-link to="/offer-client" class="vertical-link">
              Публичная оферта для клиентов
            </router-link>
          </div>
        </div>

        <div class="right-section">
          <div class="calculator-links">
            <router-link to="/machining2" class="vertical-link">
              Калькулятор стоимости токарной обработки
            </router-link>
            <router-link to="/milling2" class="vertical-link">
              Калькулятор стоимости фрезерной обработки
            </router-link>
          </div>
          
          <div class="version-section">
            <VersionInfo />
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.footer-row {
  display: flex;
  align-items: center;
  background-color: var(--upper-menu-bg);
  min-height: 160px;
  padding: 20px 0;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.left-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 40px;
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.vertical-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vertical-link {
  color: #fff;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 4px;
  text-align: left;
}

.vertical-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: underline;
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.el-menu-item {
  font-size: 20px;
}

.el-menu-item.is-active {
  border-bottom: none !important;
}

:deep(.el-header) {
  padding-left: 0px;
}

:deep(.el-sub-menu__title) {
  font-size: 20px;
}

:deep(.el-sub-menu) {
  font-size: 20px;
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

.calculator-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.version-section {
  display: flex;
  align-items: center;
}

@media (max-width: 1200px) {
  .footer-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .right-section {
    align-items: flex-start;
    width: 100%;
  }

  .left-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .vertical-link {
    text-align: left;
  }
}

@media (max-width: 767px) {
  .footer-row {
    min-height: auto;
    padding: 12px 0;
  }

  .footer-container {
    gap: 16px;
  }

  .left-section {
    gap: 12px;
  }

  /* hide top footer menu on mobile */
  .el-menu.el-menu--horizontal {
    display: none;
  }

  .vertical-links,
  .calculator-links {
    gap: 8px;
  }

  .vertical-link {
    font-size: 14px;
    padding: 6px 8px;
  }

  .first-element {
    font-size: 22px;
    margin-right: 0 !important;
  }
}
</style>
