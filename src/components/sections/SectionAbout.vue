<template>
  <div class="section-about">
    <div class="about-title">О НАС</div>
    <p class="about-text">
      ЦКП - это комплекс предприятий полного цикла, идеально подходящие для выполнения заказов в
      области механообработки, изготовления изделий из полимерных материалов и много другого
    </p>
    <el-image src="homePage/about.webp" class="item-img" />
  </div>
</template>

<style scoped>
.section-about {
  min-height: 600px;
  background-color: white;
  margin: 30px 0 30px;
  padding: 20px 20px 20px 20px;
  border-radius: 20px;
}

.about-title {
  text-align: left;
  font-size: 60px;
  color: #283d5b;
  padding: 0 0 10px;
}

.about-text {
  font-size: 24px;
  color: #283d5b;
}

@media (max-width: 767px) {
  .section-about {
    min-height: auto;
    padding-top: 0px;
  }

  .about-title {
    font-size: 28px;
    text-align: center;
  }

  .about-text {
    font-size: 16px;
  }
}
</style>
