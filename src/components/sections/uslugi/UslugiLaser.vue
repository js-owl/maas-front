<script lang="ts" setup></script>

<template>
  <!-- Лазерная резка -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Лазерная резка</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Установка лазерной резки предназначена для изготовления деталей из листовых материалов
          (сталь, алюминиевые сплавы).
          Обеспечивает высокоточную и чистую резку листовых деталей, минимизируя термическое
          искажение материала
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/laser.png" alt="Лазерная резка" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="uslugi-table-title">Технические требования</div>

        <div class="requirements-table-wrapper">
          <table class="requirements-table">
            <colgroup>
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th class="uslugi-table-thead">Оборудование</th>
                <th class="uslugi-table-thead">Габариты</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Установка лазерной резки МАСН 3015<br>
                  Размер стола 1500х3000мм
                </td>
                <td>
                  Толщина обрабатываемых материалов:<br />
                  Сталь до 25мм,<br />
                  Нержавейка до 20 мм,<br />
                  Алюминиевые сплавы до 16 мм,<br />
                  Медные сплавы до 8 мм
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
  margin-top: 40px;
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

.uslugi-table-thead {
  font-size: 18px;
  font-weight: 500;
  padding: 16px 20px;
  color: #000;
  background-color: var(--bgcolor);
  text-align: left;
}

@media (max-width: 767px) {
  .technical-requirements {
    display: none;
  }
}

</style>
