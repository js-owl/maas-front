<template>
  <section
    style="background-color: #fff; padding-bottom: 40px; min-height: 600px"
  >
    <el-row :gutter="20">
      <el-col :offset="3" :span="18">
        <div
          style="
            text-align: left;
            font-size: 60px;
            color: #283d5b;
            padding: 40px 0;
          "
        >
          НАШИ ПРЕИМУЩЕСТВА
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60" style="margin-right: 10px">
      <el-col :offset="3" :span="6">
        <div class="item">
          <div style="font-size: 26px">СРОКИ РАБОТЫ</div>
          <p style="font-size: 22px">
            Мы работаем максимально быстро и качественно, вы получаете
            результаты точно в назначенные сроки
          </p>
        </div>
      </el-col>
      <el-col :offset="0" :span="6">
        <div class="item">
          <div style="font-size: 26px">ДОСТАВКА И УПАКОВКА</div>
          <p style="font-size: 22px">
            Вам больше не нужно беспокоиться о логистике – мы сами надежно
            упакуем и доставим вам готовую продукцию
          </p>
        </div>
      </el-col>
      <el-col :offset="0" :span="6">
        <div class="item">
          <div style="font-size: 26px">
            ПРОВЕРЕННЫЕ МАТЕРИАЛЫ И ОБОРУДОВАНИЕ
          </div>
          <p style="font-size: 22px">
            Мы гарантируем качество и работаем только с надежными поставщиками
            материалов и оборудования
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60" style="margin-top: 30px; margin-right: 10px">
      <el-col :offset="3" :span="6">
        <div class="item">
          <div style="font-size: 26px">ДОГОВОР И ГАРАНТИЯ КАЧЕСТВА</div>
          <p style="font-size: 22px">
            Работаем по договору и предоставляем гарантию на всю продукцию. А
            также подготовим для вас всю необходимую сертификацию
          </p>
        </div>
      </el-col>
      <el-col :offset="0" :span="6">
        <div class="item">
          <div style="font-size: 26px">ГИБКОСТЬ</div>
          <p style="font-size: 22px">
            Наши специалисты помогут найти все необходимые решения, учтут ваши
            пожелания и нюансы заказов.
          </p>
        </div>
      </el-col>
      <el-col :offset="0" :span="6">
        <div class="item">
          <div style="font-size: 26px">СОТРУДНИЧЕСТВО</div>
          <p style="font-size: 22px">
            Мы постоянно в поиске новых решений и развития, и готовы рассмотреть
            ваши предложения по совместному производству
          </p>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<style scoped>
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
</style>
