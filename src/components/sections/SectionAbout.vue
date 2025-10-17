<template>
  <el-row id="about" :gutter="20" class="about-row">
    <el-col :offset="3" :span="8" :xs="{ span: 24, offset: 0 }">
      <div class="about-title">О НАС</div>
      <p class="about-text">
        ЦКП - это комплекс предприятий полного цикла, идеально подходящие для
        выполнения заказов в области механообработки, изготовления изделий из
        полимерных материалов и много другого:
      </p>
      <p class="about-text">
        <el-icon color="var(--upper-menu-bg)" class="no-inherit">
          <Select />
        </el-icon>
        Изготовление прототипов и серийных изделий
      </p>
      <p class="about-text">
        <el-icon color="var(--upper-menu-bg)" class="no-inherit">
          <Select />
        </el-icon>
        Лакокрасочные покрытия и гальваника
      </p>
      <p class="about-text">
        <el-icon color="var(--upper-menu-bg)" class="no-inherit">
          <Select />
        </el-icon>
        3D-печать
      </p>
      <p class="about-text">
        <el-icon color="var(--upper-menu-bg)" class="no-inherit">
          <Select />
        </el-icon>
        Лабораточные исследования
      </p>
      <p class="about-text">
        <el-icon color="var(--upper-menu-bg)" class="no-inherit">
          <Select />
        </el-icon>
        Изготовление оснастки
      </p>
    </el-col>
    <el-col :offset="1" :span="9" :xs="{ span: 24, offset: 0 }">
      <el-image src="homePage/about.webp" class="item-img" />
    </el-col>
  </el-row>
</template>

<style scoped>
.about-row {
  background-color: #fff;
  padding-top: 30px;
  min-height: 500px;
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
  .about-row {
    min-height: auto;
    padding-top: 16px;
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
