<template>
  <section
    style="background-color: #fff; padding-bottom: 40px; min-height: 600px"
  >
    <el-row :gutter="20">
      <el-col :offset="3" :span="18">
        <div
          style="
            text-align: center;
            font-size: 60px;
            color: #283d5b;
            padding: 40px 0;
          "
        >
          НАШИ ВОЗМОЖНОСТИ
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :offset="3" :span="6">
        <div class="item">
          <RouterLink to="/mechanical">
            <el-image src="homePage/ability_mechanical.webp" fit="cover" />
            <div class="overlay">
              <p class="item-text">Механообрабатывающее производство</p>
            </div>
          </RouterLink>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item">
          <el-image src="homePage/ability_composite.webp" fit="contain" />
          <div class="overlay-development">
            <div class="development-text">
              <p class="main-text">Раздел в разработке</p>
            </div>
          </div>
          <div class="overlay">
            <p class="item-text">
              Производство изделий из композитных материалов
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item">
          <el-image src="homePage/ability_painting.webp" fit="cover" />
          <div class="overlay-development">
            <div class="development-text">
              <p class="main-text">Раздел в разработке</p>
            </div>
          </div>
          <div class="overlay">
            <p class="item-text">Нанесение лакокрасочных покрытий</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 15px">
      <el-col :offset="3" :span="6">
        <div class="item">
          <el-image src="homePage/ability_assembly.webp" fit="cover" />
          <div class="overlay-development">
            <div class="development-text">
              <p class="main-text">Раздел в разработке</p>
            </div>
          </div>
          <div class="overlay">
            <p class="item-text">Сборочное производство</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item">
          <el-image src="homePage/ability_thermo.webp" fit="cover" />
          <div class="overlay-development">
            <div class="development-text">
              <p class="main-text">Раздел в разработке</p>
            </div>
          </div>
          <div class="overlay">
            <p class="item-text">Лабораторные исследования</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="item">
          <el-image src="homePage/ability_welding.webp" class="item-img" />
          <div class="overlay-development">
            <div class="development-text">
              <p class="main-text">Раздел в разработке</p>
            </div>
          </div>
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
  background-color: rgba(190, 42, 68, 0.8);
  height: 90px;
  padding: 0 12px 0px 12px;
}
.item-text {
  margin-top: 8px;
  font-size: 28px;
  text-decoration: none;
  color: white;
}
.item-text:hover {
  color: #aaa;
}

.overlay-development {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(40, 61, 91, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.development-text {
  text-align: center;
  color: white;
}

.main-text {
  font-size: 34px;
  font-weight: bold;
  margin: 0 0 20px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  opacity: 0.9;
}

</style>
