<script setup lang="ts">
// import { defineAsyncComponent, ref } from "vue";
import IconLogo from "../icons/IconLogo.vue";
import VersionInfo from "./VersionInfo.vue";

// const DialogCall = defineAsyncComponent(() => import('./dialog/DialogCall.vue'))

// const isCallDialogVisible = ref(false);

// const openCallDialog = () => {
//   isCallDialogVisible.value = true;
// };
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

          <div class="footer-columns footer-columns--desktop">
            <div class="footer-column">
              <!-- <div class="footer-column-title">Контакты</div> -->
              <a href="mailto:info@aeromax-group.ru" class="footer-link">
                info@aeromax-group.ru
              </a>
              <a href="tel:+74959214242" class="footer-link">
                +7 (495) 921-42-42
              </a>
              <!-- <a href="#" class="footer-link" @click.prevent="openCallDialog">
                Заказать звонок
              </a> -->
            </div>
          </div>
        </div>

        <div class="footer-divider" role="presentation" />

        <div class="footer-bottom">
          <div class="footer-bottom-row">
            <div class="footer-brand">
              <IconLogo class="footer-logo-icon footer-logo-icon--bottom" />
            </div>

            <div class="footer-columns footer-columns--mobile">
              <div class="footer-column">
                <a href="mailto:info@aeromax-group.ru" class="footer-link">
                  info@aeromax-group.ru
                </a>
                <a href="tel:+74959214242" class="footer-link">
                  +7 (495) 921-42-42
                </a>
              </div>
            </div>
          </div>

          <div class="footer-legal">
            Общество с ограниченной ответственностью «Аэромакс»<span class="footer-legal-year">, 2026</span>
          </div>

          <div class="footer-meta">
            <VersionInfo />
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <!-- <DialogCall v-model="isCallDialogVisible" /> -->
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

.footer-bottom-row {
  display: contents;
}

.footer-columns--mobile {
  display: none;
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
  color: #e2e6ea;
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

  .footer-columns--desktop {
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
    padding: 16px 26px;
  }

  .footer-container {
    gap: 16px;
  }

  .footer-columns--desktop {
    display: none;
  }

  .footer-columns--mobile {
    display: flex;
    flex: 0 0 auto;
    width: auto;
    justify-content: flex-end;
  }

  .footer-columns--mobile .footer-column {
    gap: 4px;
    min-width: auto;
    align-items: flex-start;
  }

  .footer-link {
    font-size: 12px;
    color: #aeb2b5;
  }

  .footer-columns--mobile .footer-link {
    font-size: 10px;
    line-height: normal;
    white-space: nowrap;
  }

  .footer-top {
    flex-direction: column;
    gap: 0;
  }

  .footer-links-list--top {
    gap: 8px;
  }

  .footer-divider {
    display: none;
  }

  .footer-bottom {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-top: 1px solid #7d8083;
    padding-top: 16px;
  }

  .footer-bottom-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    gap: 12px;
  }

  .footer-brand {
    flex-shrink: 0;
  }

  .footer-logo-icon--bottom {
    display: block;
    width: 128px;
    height: 24px;
    opacity: 1;
  }

  .footer-legal {
    font-size: 10px;
    color: #aeb2b5;
  }

  .footer-legal-year {
    display: none;
  }

  .footer-meta {
    display: none;
  }
}
</style>
