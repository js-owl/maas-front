<script setup lang="ts">
import SectionModel from "../components/SectionModel.vue";
import SectionAbility from "../components/SectionAbility.vue";
import SectionAdvantages from "../components/SectionAdvantages.vue";
</script>

<template>
  <SectionModel />
  <SectionAbility />

  <!-- Section Milestones -->
  <el-row
    :gutter="0"
    style="
      background-color: var(--left-section-bg);
      padding-top: 30px;
      min-height: 300px;
    "
  >
    <el-col :offset="3" :span="18">
      <div
        style="
          text-align: center;
          font-size: 60px;
          color: white;
          padding-bottom: 40px;
        "
      >
        ЭТАПЫ ПРОЕКТА
      </div>
      <el-steps style="padding-top: 20px" align-center :active="5">
        <el-step title="Загрузите модель или оставьте заявку" />
        <el-step title="Согласование проекта" />
        <el-step title="Изготовление" />
        <el-step title="Сертификация" />
        <el-step title="Доставка" />
      </el-steps>
    </el-col>
  </el-row>

  <!-- Section About -->
  <el-row
    id="about"
    :gutter="20"
    style="background-color: #eee; padding-top: 30px; min-height: 500px"
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
      <el-image src="homePage/about.png" class="item-img" />
    </el-col>
  </el-row>

  <SectionAdvantages />
</template>
<style scoped>
:deep(.el-step__title) {
  font-size: 20px;
}
</style>
