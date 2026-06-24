<script lang="ts" setup>
const applicationRows = [
  ['Авиация', 'Дизайн', 'Спорт', 'Машиностроение', 'Строительство', 'Транспорт', 'Медицина', 'Урбанистика', 'Электроника'],
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="pkm-applications">
      <h2 class="pkm-applications__title">Применение</h2>

      <div class="pkm-applications__tags">
        <div v-for="(row, rowIndex) in applicationRows" :key="rowIndex" class="pkm-applications__row">
          <span v-for="application in row" :key="application" class="pkm-applications__tag">
            {{ application }}
          </span>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.pkm-applications {
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 15px 0 var(--button-bg);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  padding: 40px;
  width: 100%;
}

.pkm-applications__title {
  color: #000;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 29px;
  margin: 0;
}

.pkm-applications__tags {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.pkm-applications__row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  min-height: 49px;
}

.pkm-applications__tag {
  align-items: center;
  background-color: var(--bgcolor);
  border-radius: 40px;
  box-sizing: border-box;
  color: #7d8083;
  display: inline-flex;
  flex-shrink: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  height: 49px;
  line-height: 29px;
  padding: 10px 20px;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .pkm-applications {
    padding: 20px;
  }

  .pkm-applications__row {
    min-height: 0;
  }

  .pkm-applications__tag {
    font-size: 20px;
    height: auto;
    line-height: normal;
    min-height: 49px;
  }
}
</style>
