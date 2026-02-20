<script lang="ts" setup></script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">ОБОРУДОВАНИЕ</div>

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
.description-text {
  flex: 1;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.6;
  color: #000;
  text-align: justify;
}

.image-wrapper {
  flex: 0 0 420px;
  display: flex;
  justify-content: flex-end;
}

.lathe-image {
  max-width: 600px;
  /* height: 260px; */
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.technical-requirements {
  margin-top: 40px;
}

.requirements-title {
  font-size: 36px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 40px;
  text-align: left;
}

.requirements-table-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.requirements-table thead {
  background-color: var(--bgcolor);
}
.requirements-table th{
  font-size: 24px;
}

.requirements-table th,
.requirements-table td {
  padding: 16px 20px;
  font-size: 20px;
  font-weight: 500;
  color: #000;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  vertical-align: top;
}

.requirements-table th {
  font-size: 24px;
  font-weight: 600;
}

.requirements-table th:last-child,
.requirements-table td:last-child {
  border-right: none;
}

.requirements-table tr:last-child td {
  border-bottom: none;
}

.materials-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.materials-list li + li {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .description-text {
    font-size: 16px;
    text-align: left;
  }

  .image-wrapper {
    flex: 1;
    justify-content: center;
  }

  .lathe-image {
    max-width: 100%;
    height: auto;
  }

  .requirements-title {
    font-size: 22px;
    text-align: center;
    margin-bottom: 30px;
  }

  .requirements-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>

