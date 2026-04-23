<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Оборудование</div>

      <div class="technical-requirements">
        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <thead>
              <tr>
                <th>Оборудование</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ul class="materials-list">
                    <li>Камера соляного тумана и влаги</li>
                    <li>Камера статической и динамической пыли и песка</li>
                    <li>Климатические камеры</li>
                    <li>Камеры тепла и холода</li>
                    <li>Электродинамические вибрационные установки</li>
                    <li>Система управления виброиспытаниями</li>
                    <li>Оборудование для электроиспытаний</li>
                    <li>Стенд имитации транспортирования</li>
                    <li>Ударный стенд</li>
                    <li>Автоматизированный измерительно-вычислительный комплекс с БЭК</li>
                    <li>Спектрорадиометр</li>
                    <li>Спектрофотометр</li>
                    <li>
                      Установка для измерения фотометрических и колориметрических величин
                    </li>
                    <li>Измеритель яркости, освещенности и пульсаций</li>
                    <li>Образцовый излучатель «абсолютно черное тело»</li>
                    <li>Оптический стол в комплекте с адаптерами и держателями</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.technical-requirements {
  margin-top: 20px;
}

.uslugi-wrapper {
  box-shadow: 0 10px 15px var(--button-bg);
}

.uslugi-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 28px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.requirements-table-wrapper {
  margin-top: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid var(--button-bg);
  background-color: #ffffff;
}

.requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.requirements-table th {
  padding: 12px 20px;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  background-color: var(--bgcolor);
  text-align: left;
  border-bottom: 2px solid var(--button-bg);
  vertical-align: top;
}

.requirements-table td {
  padding: 12px 20px;
  border-top: 0;
  background-color: var(--whity);
}

.materials-list {
  margin: 0;
  padding-left: 16px;
  list-style-type: disc;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.2;
  color: #000000;
}

.materials-list li + li {
  margin-top: 2px;
}

@media (max-width: 768px) {
  .uslugi-title {
    font-size: 24px;
  }

  .requirements-table th {
    font-size: 20px;
  }

  .materials-list {
    font-size: 16px;
  }
}

@media (max-width: 767px) {
  .technical-requirements {
    display: none;
  }
}
</style>

