<template>
  <div class="galvanic-price">
    <div class="galvanic-price__title">Стоимость</div>
    <p class="galvanic-price__message">Запрос требует расчета специалистом</p>
  </div>
</template>

<style scoped>
.galvanic-price {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--whity);
}

.galvanic-price__title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #000;
}

.galvanic-price__message {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-footer);
}

@media (max-width: 767px) {
  .galvanic-price__title {
    font-size: 18px;
  }

  .galvanic-price__message {
    font-size: 12px;
  }
}
</style>
