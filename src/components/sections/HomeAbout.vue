<template>
  <div class="section-basic">
    <div class="section-title">О НАС</div>
    <p class="about-text">
      ЦКП - это комплекс предприятий полного цикла, идеально подходящие для выполнения заказов в
      области механообработки, изготовления изделий из полимерных материалов и много другого
    </p>
    <el-image src="homePage/about.webp" class="item-img" />
  </div>
</template>

<style scoped>
.about-text {
  font-size: 24px;
  color: #283d5b;
}

.item-img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}

@media (max-width: 767px) {
  .about-text {
    margin: 0;
    padding-bottom: 10px;
    font-size: 16px;
  }
}
</style>


