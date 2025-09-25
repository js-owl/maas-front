<template>
  <el-row
    id="about"
    :gutter="20"
    style="background-color: #fff; padding-top: 30px; min-height: 500px"
  >
    <el-col :offset="3" :span="8">
      <div
        style="
          text-align: left;
          font-size: 60px;
          color: #283d5b;
          padding: 0 0 10px;
        "
      >
        О НАС
      </div>
      <p style="font-size: 24px; color: #283d5b">
        ЦКП - это комплекс предприятий полного цикла, идеально подходящие для
        выполнения заказов в области механообработки, изготовления изделий из
        полимерных материалов и много другого:
      </p>
      <p style="font-size: 24px; color: #283d5b">
        <el-icon color="var(--upper-menu-bg)" class="no-inherit">
          <Select />
        </el-icon>
        Изготовление прототипов и серийных изделий
      </p>
      <p style="font-size: 24px; color: #283d5b">
        <el-icon color="var(--upper-menu-bg)" class="no-inherit">
          <Select />
        </el-icon>
        Лакокрасочные покрытия и гальваника
      </p>
      <p style="font-size: 24px; color: #283d5b">
        <el-icon color="var(--upper-menu-bg)" class="no-inherit">
          <Select />
        </el-icon>
        3D-печать
      </p>
      <p style="font-size: 24px; color: #283d5b">
        <el-icon color="var(--upper-menu-bg)" class="no-inherit">
          <Select />
        </el-icon>
        Лабораточные исследования
      </p>
      <p style="font-size: 24px; color: #283d5b">
        <el-icon color="var(--upper-menu-bg)" class="no-inherit">
          <Select />
        </el-icon>
        Изготовление оснастки
      </p>
    </el-col>
    <el-col :offset="1" :span="9">
      <el-image src="homePage/about.webp" class="item-img" />
    </el-col>
  </el-row>
</template>
