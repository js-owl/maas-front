<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Edit, Delete } from "@element-plus/icons-vue";
import { req_json_auth } from "../api";
import type { IOrderResponse } from "../interfaces/order.interface";
import CadPreview from "../components/CadPreview.vue";

const router = useRouter();
const orders = ref<IOrderResponse[]>();
const deleteLoading = ref<number | null>(null);

onMounted(async () => {
  const r = await req_json_auth(`/orders/`, "GET");
  orders.value = (await r?.json()) as IOrderResponse[];
});

const formatDate = (_row: any, _column: any, cellValue: string) => {
  return cellValue.split("T")[0];
};

const serviceNames: any = { cnc_lathe: "токарная", cnc_milling: "фрезерная" };
const getServiceName = (service_id: number): string => {
  return serviceNames[service_id] || service_id;
};

const materialNames: Record<string, string> = {
  alum_D16T: "Алюминий Д16Т",
  steel_12X18H10T: "Сталь 12Х18Н10Т",
  // дополнительные соответствия при необходимости
};
const getMaterialName = (materialCode: string): string => {
  if (!materialCode) return "";
  return materialNames[materialCode] || materialCode;
};

const statusTexts: any = {
  pending: "ожидание оплаты",
  processing: "в проиводстве",
};
const getStatusText = (status: string): string => {
  return statusTexts[status] || status;
};

const handleEdit = (row: IOrderResponse): void => {
  switch (row.service_id) {
    case "cnc_lathe":
      router.push({
        path: "/machining",
        query: { orderId: row.id.toString() },
      });
      break;
    case "cnc_milling":
      router.push({
        path: "/milling",
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

const handleDelete = async (row: IOrderResponse): Promise<void> => {
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
    <el-col :offset="3" :span="18">
      <h1>Мои заказы</h1>
    </el-col>
  </el-row>
  <el-row
    :gutter="20"
    style="background-color: #fff; padding-top: 0px; min-height: 500px"
  >
    <el-col :offset="3" :span="18">
      <el-table
        stripe
        :data="orders"
        :default-sort="{ prop: 'id', order: 'descending' }"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
      >
        <el-table-column prop="id" label="№ заказа" width="100" />
        <el-table-column prop="service_id" label="Тип услуги" width="120">
          <template #default="{ row }">
            {{ getServiceName(row.service_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="Дата создания"
          :formatter="formatDate"
          width="150"
        />
        <el-table-column prop="material_id" label="Материал" width="150">
          <template #default="{ row }">
            {{ getMaterialName(row.material_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="Кол-во" width="100" />
        <el-table-column prop="file_id" label="3D модель" width="120">
          <template #default="{ row }">
            <div v-if="row.file_id" class="model-preview">
              <CadPreview :file-id="row.file_id" />
            </div>
            <span v-else class="no-model">Нет модели</span>
          </template>
        </el-table-column>
        <el-table-column prop="document_ids" label="Документы" width="150" />
        <el-table-column prop="status" label="Статус" width="150">
          <template #default="{ row }">
            {{ getStatusText(row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="total_price" label="Цена" width="100" />
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

<style scoped>
.model-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.no-model {
  color: #909399;
  font-style: italic;
  font-size: 12px;
}
</style>
