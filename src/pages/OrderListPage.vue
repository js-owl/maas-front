<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Edit, Delete } from "@element-plus/icons-vue";
import { req_json_auth } from "../api";
import type { IOrder } from "../interfaces/order.interface";

const router = useRouter();
const orders = ref<IOrder[]>();
const deleteLoading = ref<number | null>(null);

onMounted(async () => {
  const r = await req_json_auth(`/orders/`, "GET");
  orders.value = (await r?.json()) as IOrder[];
});

const formatDate = (_row: any, _column: any, cellValue: string) => {
  return cellValue.split("T")[0];
};

const handleEdit = (row: IOrder): void => {
  switch (row.service_id) {
    case 2:
      router.push({ path: "/plastic", query: { orderId: row.id.toString() } });
      break;
    case 4:
      router.push({
        path: "/machining",
        query: { orderId: row.id.toString() },
      });
      break;
    default:
      router.push({
        path: "/machining",
        query: { orderId: row.id.toString() },
      });
      break;
  }
};

const handleDelete = async (row: IOrder): Promise<void> => {
  deleteLoading.value = row.id;
  const r = await req_json_auth(`/admin/orders/${row.id}`, "DELETE");
  if (r?.ok) {
    console.log("deleted successfully");
    if (orders.value) {
      orders.value = orders.value.filter((item) => item.id !== row.id);
    }
  }
  deleteLoading.value = null;
};
</script>

<template>
  <el-row
    :gutter="20"
    style="background-color: #fff; padding: 30px 0 0px 20px; min-height: 100px"
  >
    <el-col :offset="2" :span="20">
      <h1>Мои заказы</h1>
    </el-col>
  </el-row>
  <el-row
    :gutter="20"
    style="background-color: #fff; padding-top: 0px; min-height: 500px"
  >
    <el-col :offset="2" :span="20">
      <el-table
        stripe
        :data="orders"
        :default-sort="{ prop: 'id', order: 'descending' }"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
      >
        <el-table-column prop="id" label="Номер заказа" width="150" />
        <el-table-column prop="service_id" label="ID услуги" width="120" />
        <el-table-column
          prop="created_at"
          label="Дата создания"
          :formatter="formatDate"
          width="150"
        />
        <el-table-column
          prop="material_preference"
          label="Материал"
          width="150"
        />
        <el-table-column prop="quantity" label="Кол-во" width="100" />
        <el-table-column prop="file_id" label="3D модель" width="100" />
        <el-table-column prop="status" label="Статус" width="150" />
        <el-table-column prop="total_price" label="Цена" width="150" />
        <el-table-column fixed="right" label="Операции" min-width="150">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              <el-icon color="blue" class="no-inherit">
                <Edit />
              </el-icon>
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="handleDelete(scope.row)"
              :loading="deleteLoading === scope.row.id"
            >
              <el-icon color="red" class="no-inherit">
                <Delete />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
