<script setup lang="ts">
import IconLogo from "../icons/IconLogo.vue";
import VersionInfo from "./VersionInfo.vue";
</script>

<template>
  <el-row :gutter="0" class="footer-row">
    <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
      <div class="footer-container footer-container--layout">
        <div class="footer-top">
          <div class="footer-top-left">
            <div class="footer-links-list footer-links-list--top">
              <router-link to="/policy" class="footer-link">
                Политика конфиденциальности
              </router-link>
              <router-link to="/license" class="footer-link">
              Договор публичной оферты
              </router-link>
              <router-link to="/offer-client" class="footer-link">
                Пользовательское соглашение
              </router-link>
            </div>
          </div>

          <div class="footer-columns">
            <div class="footer-column">
              <div class="footer-column-title">Контакты</div>
              <a href="mailto:info@aeromax-group.ru" class="footer-link">
                info@aeromax-group.ru
              </a>
              <a href="tel:+74959214242" class="footer-link">
                +7 (495) 921-42-42
              </a>
            </div>
          </div>
        </div>

        <div class="footer-divider" role="presentation" />

        <div class="footer-bottom">
          <div class="footer-brand">
            <IconLogo class="footer-logo-icon footer-logo-icon--bottom" />
          </div>

          <div class="footer-legal">
            Общество с ограниченной ответственностью «Аэромакс», 2026
          </div>

          <div class="footer-meta">
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
.footer-container--layout {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 18px;
}

.footer-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 150px;
}

.footer-top-left {
  /* flex: 1;
  min-width: 0; */
}

.footer-top-right {
  flex: 0 0 auto;
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

.footer-logo-icon {
  display: block;
  width: 200px;
  height: auto;
}

.footer-links-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-links-list--top {
  gap: 10px;
}

.footer-divider {
  height: 2px;
  background: rgba(255, 255, 255, 0.25);
  width: 100%;
}

.footer-bottom {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
}

.footer-brand {
  display: flex;
  align-items: center;
}

.footer-logo-icon--bottom {
  width: 160px;
  opacity: 0.9;
}

.footer-legal {
  font-family: "Montserrat-Medium", sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
}

.footer-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #fff;
}

.footer-column--contacts {
  min-width: 260px;
}

.footer-link {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  text-decoration: none;
  line-height: 1.5;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
  color: #fff;
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

  .footer-bottom {
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: flex-start;
  }

  .footer-meta {
    justify-content: flex-start;
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

  .footer-top {
    flex-direction: column;
    gap: 18px;
  }

  .footer-logo-icon--bottom {
    width: 140px;
  }
}
</style>
