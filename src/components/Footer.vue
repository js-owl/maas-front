<script setup lang="ts">
import { ref } from "vue";
import IconLogo from "../icons/IconLogo.vue";
import DialogCall from "./dialog/DialogCall.vue";
import VersionInfo from "./VersionInfo.vue";

const isCallDialogVisible = ref(false);

const openCallDialog = () => {
  isCallDialogVisible.value = true;
};
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
              <!-- <div class="footer-column-title">Контакты</div> -->
              <a href="mailto:info@aeromax-group.ru" class="footer-link">
                info@aeromax-group.ru
              </a>
              <a href="tel:+74959214242" class="footer-link">
                +7 (495) 921-42-42
              </a>
              <a href="#" class="footer-link" @click.prevent="openCallDialog">
                Заказать звонок
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
  <DialogCall v-model="isCallDialogVisible" />
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
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
}

.footer-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 150px;
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
  align-items: start;
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
  font-size: 16px;
  color: #aeb2b5;
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
  .footer-row {
    min-height: auto;
    padding: 12px 16px;
  }

  .footer-container {
    gap: 24px;
  }

  .footer-columns {
    flex-direction: column;
    gap: 16px;
  }

  .footer-link {
    font-size: 14px;
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
