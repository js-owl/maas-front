<template>
  <section class="advantages-section">
    <el-row :gutter="20">
      <el-col :offset="3" :span="18">
        <div class="advantages-title">НАШИ ПРЕИМУЩЕСТВА</div>
      </el-col>
    </el-row>
    <el-row :gutter="60" class="row-wrap">
      <el-col :offset="3" :span="6" :xs="24">
        <div class="item">
          <div class="item-title">СРОКИ РАБОТЫ</div>
          <p class="item-text">
            Мы работаем максимально быстро и качественно, вы получаете
            результаты точно в назначенные сроки
          </p>
        </div>
      </el-col>
      <el-col :offset="0" :span="6" :xs="24">
        <div class="item">
          <div class="item-title">ДОСТАВКА И УПАКОВКА</div>
          <p class="item-text">
            Вам больше не нужно беспокоиться о логистике – мы сами надежно
            упакуем и доставим вам готовую продукцию
          </p>
        </div>
      </el-col>
      <el-col :offset="0" :span="6" :xs="24">
        <div class="item">
          <div class="item-title">ПРОВЕРЕННЫЕ МАТЕРИАЛЫ И ОБОРУДОВАНИЕ</div>
          <p class="item-text">
            Мы гарантируем качество и работаем только с надежными поставщиками
            материалов и оборудования
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60" class="row-wrap row-gap">
      <el-col :offset="3" :span="6" :xs="24">
        <div class="item">
          <div class="item-title">ДОГОВОР И ГАРАНТИЯ КАЧЕСТВА</div>
          <p class="item-text">
            Работаем по договору и предоставляем гарантию на всю продукцию. А
            также подготовим для вас всю необходимую сертификацию
          </p>
        </div>
      </el-col>
      <el-col :offset="0" :span="6" :xs="24">
        <div class="item">
          <div class="item-title">ГИБКОСТЬ</div>
          <p class="item-text">
            Наши специалисты помогут найти все необходимые решения, учтут ваши
            пожелания и нюансы заказов.
          </p>
        </div>
      </el-col>
      <el-col :offset="0" :span="6" :xs="24">
        <div class="item">
          <div class="item-title">СОТРУДНИЧЕСТВО</div>
          <p class="item-text">
            Мы постоянно в поиске новых решений и развития, и готовы рассмотреть
            ваши предложения по совместному производству
          </p>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<style scoped>
.advantages-section {
  background-color: #fff;
  padding-bottom: 40px;
  min-height: 600px;
}

.advantages-title {
  text-align: left;
  font-size: 60px;
  color: #283d5b;
  padding: 40px 0;
}

.row-wrap {
  margin-right: 10px;
}

.row-gap {
  margin-top: 30px;
}

.item {
  width: 100%;
  height: 300px;
  background-color: #d1e5ff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #283d5b;
  padding: 15px;
  border-radius: 10px;
}

.item-title {
  font-size: 26px;
}

.item-text {
  font-size: 22px;
}

@media (max-width: 767px) {
  .advantages-section {
    min-height: auto;
    padding-bottom: 24px;
  }

  .advantages-title {
    font-size: 28px;
    text-align: center;
    padding: 16px 0;
  }

  .row-wrap {
    margin-right: 0;
  }

  .row-gap {
    margin-top: 12px;
  }

  .item {
    height: auto;
  }

  .item-title {
    font-size: 18px;
  }

  .item-text {
    font-size: 16px;
  }
}
</style>
