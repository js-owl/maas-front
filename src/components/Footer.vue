<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import IconLogo from '../icons/IconLogo.vue'

const DialogCall = defineAsyncComponent(() => import('./dialog/DialogCall.vue'))

const isCallDialogVisible = ref(false)

const openCallDialog = () => {
  isCallDialogVisible.value = true
}
</script>

<template>
  <footer class="footer">
    <div class="footer__content">
      <div class="footer__top">
        <nav class="footer__col footer__col--links" aria-label="Юридические документы">
          <router-link to="/policy" class="footer__link">
            Политика конфиденциальности
          </router-link>
          <router-link to="/license" class="footer__link">
            Договор публичной оферты
          </router-link>
          <router-link to="/offer-client" class="footer__link">
            Пользовательское соглашение
          </router-link>
        </nav>

        <div class="footer__col footer__col--contacts">
          <a href="mailto:info@aeromax-group.ru" class="footer__link">
            info@aeromax-group.ru
          </a>
          <a href="tel:+74959214242" class="footer__link">
            +7 (495) 921-42-42
          </a>
          <button type="button" class="footer__link footer__link--button" @click="openCallDialog">
            Заказать звонок
          </button>
        </div>
      </div>

      <div class="footer__bottom">
        <router-link to="/" class="footer__brand" aria-label="На главную">
          <IconLogo class="footer__logo" color="#AEB2B5" />
        </router-link>
        <p class="footer__legal">
          Общество с ограниченной ответственностью «Аэромакс», 2026
        </p>
      </div>
    </div>
  </footer>

  <DialogCall v-model="isCallDialogVisible" />
</template>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  background-color: var(--gray-footer);
  padding: 20px 0;
}

.footer__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1280px;
  padding: 0 20px;
  box-sizing: border-box;
}

.footer__top {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  padding-bottom: 20px;
  border-bottom: 2px solid #7d8083;
}

.footer__col {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.footer__col--links {
  align-items: flex-start;
}

.footer__col--contacts {
  align-items: flex-start;
}

.footer__link {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  color: #aeb2b5;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
}

.footer__link:hover {
  text-decoration: underline;
}

.footer__link--button {
  font: inherit;
}

.footer__bottom {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.footer__brand {
  display: block;
  flex-shrink: 0;
  line-height: 0;
  text-decoration: none;
}

.footer__logo {
  display: block;
  width: 245px;
  height: 46px;
}

.footer__legal {
  margin: 0;
  max-width: 537px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  color: #aeb2b5;
}

@media (max-width: 767px) {
  .footer {
    padding: 16px 0;
  }

  .footer__content {
    gap: 16px;
    padding: 0 26px;
  }

  .footer__top {
    flex-direction: column;
    gap: 16px;
    padding-bottom: 16px;
  }

  .footer__col {
    gap: 8px;
  }

  .footer__link {
    font-size: 12px;
  }

  .footer__bottom {
    flex-direction: column;
    gap: 10px;
  }

  .footer__logo {
    width: 128px;
    height: 24px;
  }

  .footer__legal {
    max-width: none;
    font-size: 10px;
  }
}
</style>
