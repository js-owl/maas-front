<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import IconLogo from '../icons/IconLogo.vue'

const DialogCall = defineAsyncComponent(() => import('./dialog/DialogCall.vue'))

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const isCallDialogVisible = ref(false)

const openCallDialog = () => {
  isCallDialogVisible.value = true
}
</script>

<template>
  <footer class="footer" :class="{ 'footer--mobile': isMobile }">
    <el-row :gutter="0">
      <el-col :offset="isMobile ? 0 : 3" :span="isMobile ? 24 : 18">
        <div class="footer__content">
      <div class="footer__top">
        <nav class="footer__links" aria-label="Юридические документы">
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

        <div class="footer__contacts footer__contacts--desktop">
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
        <div class="footer__bottom-row">
          <router-link to="/" class="footer__brand" aria-label="На главную">
            <IconLogo class="footer__logo" color="currentColor" />
          </router-link>

          <div class="footer__contacts footer__contacts--mobile">
            <a href="mailto:info@aeromax-group.ru" class="footer__link">
              info@aeromax-group.ru
            </a>
            <a href="tel:+74959214242" class="footer__link">
              +7 (495) 921-42-42
            </a>
          </div>
        </div>

        <p class="footer__legal">
          Общество с ограниченной ответственностью «Аэромакс»<span class="footer__legal-year">, 2026</span>
        </p>
      </div>
        </div>
      </el-col>
    </el-row>
  </footer>

  <DialogCall v-model="isCallDialogVisible" />
</template>

<style scoped>
.footer {
  background-color: var(--gray-footer);
  padding: 20px 0;
}

.footer__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.footer__top {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  padding-bottom: 20px;
  border-bottom: 2px solid #7d8083;
}

.footer__links,
.footer__contacts {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.footer__contacts--mobile {
  display: none;
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

.footer__bottom-row {
  display: contents;
}

.footer__brand {
  display: block;
  flex-shrink: 0;
  color: #aeb2b5;
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
  .footer--mobile {
    padding: 16px 10px;
  }

  .footer--mobile .footer__content {
    gap: 16px;
  }

  .footer__top {
    flex-direction: column;
    gap: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .footer__links {
    flex: none;
    gap: 8px;
    width: 100%;
  }

  .footer__contacts--desktop {
    display: none;
  }

  .footer__link {
    font-size: 12px;
    color: var(--button-bg);
  }

  .footer__bottom {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    padding-top: 16px;
    border-top: 1px solid #7d8083;
  }

  .footer__bottom-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
  }

  .footer__contacts--mobile {
    display: flex;
    flex: none;
    gap: 4px;
    align-items: flex-start;
    min-width: 0;
  }

  .footer__contacts--mobile .footer__link {
    font-size: 10px;
    line-height: normal;
    white-space: nowrap;
  }

  .footer__brand {
    color: var(--button-bg);
  }

  .footer__logo {
    width: 128px;
    height: 24px;
  }

  .footer__legal {
    max-width: none;
    font-size: 10px;
    color: var(--button-bg);
  }

  .footer__legal-year {
    display: none;
  }
}
</style>
