<template>
  <div class="result-specialist">
    <div class="result-specialist__title">Стоимость</div>
    <p class="result-specialist__message">Запрос требует расчета специалистом</p>
  </div>
</template>

<style scoped>
.result-specialist {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--whity);
}

.result-specialist__title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #000;
}

.result-specialist__message {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-footer);
}

@media (max-width: 767px) {
  .result-specialist__title {
    font-size: 18px;
  }

  .result-specialist__message {
    font-size: 12px;
  }
}
</style>
