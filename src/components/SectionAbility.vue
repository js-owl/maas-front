<template>
  <section
    style="background-color: #fff; padding-bottom: 40px; min-height: 600px"
  >
    <el-row :gutter="20">
      <el-col :offset="2" :span="20">
        <h1 style="font-size: 32px">Наши возможности</h1>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :offset="2" :span="7">
        <div class="item">
          <RouterLink to="/mechanical">
            <el-image src="homePage/ability_mechanical.webp" fit="cover" />
            <div class="overlay">
              <p class="item-text">Механообрабатывающее производство</p>
            </div>
          </RouterLink>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="item">
          <RouterLink to="/composite">
            <el-image src="homePage/ability_composite.webp" fit="contain" />
            <div class="overlay">
              <p class="item-text">
                Производство изделий из композитных материалов
              </p>
            </div>
          </RouterLink>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="item">
          <RouterLink to="/painting">
            <el-image src="homePage/ability_painting.webp" fit="cover" />
            <div class="overlay">
              <p class="item-text">Нанесение лакокрасочных покрытий</p>
            </div>
          </RouterLink>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 15px">
      <el-col :offset="2" :span="7">
        <div class="item">
          <el-image src="homePage/ability_assembly.webp" fit="cover" />
          <div class="overlay">
            <p class="item-text">Сборочное производство</p>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="item">
          <el-image src="homePage/ability_thermo.webp" fit="cover" />
          <div class="overlay">
            <p class="item-text">Термическая обработка материалов</p>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="item">
          <el-image src="homePage/ability_welding.webp" class="item-img" />
          <div class="overlay">
            <p class="item-text">Сварочное производство</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<style scoped>
.item {
  position: relative;
  width: 100%;
}
.item-img {
  width: 100%;
}
.overlay {
  position: absolute;
  bottom: 3px;
  left: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.6);
  height: 85px;

  padding: 0 12px 0px 12px;
}
.item-text {
  margin-top: 8px;
  font-size: 24px;
  text-decoration: none;
  color: white;
}
.item-text:hover {
  font-size: 25px;
}
</style>
