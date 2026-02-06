<script setup lang="ts">
import VersionInfo from "./VersionInfo.vue";
</script>

<template>
  <el-row :gutter="0" class="footer-row">
    <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
      <div class="footer-container">
        <div class="footer-logo-column">
          <div class="footer-logo">
            <span class="footer-logo-badge">АЭРОМАКС</span>
          </div>

          <div class="footer-links-list">
            <router-link to="/license" class="footer-link">
              Политика конфиденциальности
            </router-link>
            <router-link to="/license#cookies" class="footer-link">
              Политика использования cookies и метрических программ
            </router-link>
            <router-link to="/offer-client#agreement" class="footer-link">
              Пользовательское соглашение
            </router-link>
          </div>
        </div>

        <div class="footer-columns">
          <div class="footer-column">
            <div class="footer-column-title">Услуги</div>
            <router-link to="/mechanical" class="footer-link">
              Механообработка
            </router-link>
            <router-link to="/other" class="footer-link">
              Листовая обработка
            </router-link>
            <router-link to="/print" class="footer-link">
              3D-печать
            </router-link>
          </div>

          <div class="footer-column">
            <div class="footer-column-title">Библиотека знаний</div>
            <router-link to="/" class="footer-link">
              Клиентам
            </router-link>
            <router-link to="/" class="footer-link">
              FAQ
            </router-link>
          </div>

          <div class="footer-column footer-column-contacts">
            <div class="footer-column-title">Контакты</div>
            <a href="mailto:Maas.mail@aeromax.ru" class="footer-link">
              Maas.mail@aeromax.ru
            </a>
            <a href="tel:88005353535" class="footer-link">
              8 800 535 35 35
            </a>

            <div class="version-section">
              <VersionInfo />
            </div>
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
  background-color: var(--gray-footer);
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

/* New footer layout matching design */
.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 60px;
}

.footer-logo-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 260px;
}

.footer-logo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 32px;
  border-radius: 8px;
  background-color: #70767b;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #fff;
}

.footer-links-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-columns {
  flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
}

.footer-column-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #fff;
}

.footer-link {
  color: #fff;
  font-size: 16px;
  text-decoration: none;
  line-height: 1.5;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
}

.footer-link:hover {
  text-decoration: underline;
}

.version-section {
  margin-top: 12px;
  display: flex;
  align-items: center;
}

@media (max-width: 1200px) {
  .footer-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
  }

  .footer-columns {
    width: 100%;
    justify-content: flex-start;
    gap: 40px;
    flex-wrap: wrap;
  }
}

@media (max-width: 767px) {
  .footer-container {
    gap: 24px;
  }

  .footer-columns {
    flex-direction: column;
    gap: 16px;
  }

  .footer-logo-column {
    min-width: 0;
  }

  .footer-link {
    font-size: 14px;
  }

  .footer-logo-badge {
    font-size: 20px;
    padding-inline: 24px;
  }
}
</style>
