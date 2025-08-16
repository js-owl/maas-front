<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { API_BASE } from "../api";
import { useAuthStore } from "../stores/auth.store";
import type { IOrder } from "../interfaces/order.interface";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { Edit, Delete } from "@element-plus/icons-vue";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const orders = ref<IOrder[]>();

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (authStore.getToken) {
      headers.append("Authorization", `Bearer ${authStore.getToken}`);
    }

    const response = await fetch(`${API_BASE}/orders`, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = (await response.json()) as IOrder[];
    orders.value = data;
    console.log("orders", { data });
  } catch (error) {
    ElMessage({
      type: "error",
      message: "Failed to load data",
    });
    console.error("fetchData", { error });
  }
};

const deleteLoading = ref<number | null>(null);

const deleteItem = async (id: number): Promise<ApiResponse> => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (authStore.getToken) {
    headers.append("Authorization", `Bearer ${authStore.getToken}`);
  }

  const response = await fetch(`${API_BASE}/orders/${id}`, {
    method: "DELETE",
    headers,
  });

  await fetchData();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const formatDate = (_row: any, _column: any, cellValue: string) => {
  return cellValue.split("T")[0];
};

const handleDelete = async (row: IOrder): Promise<void> => {
  console.log({ row });
  try {
    deleteLoading.value = row.id;

    const response = await deleteItem(row.id);

    if (response.success) {
      if (orders.value) {
        orders.value = orders.value.filter((item) => item.id !== row.id);
      }
    }
  } catch (error) {
  } finally {
    deleteLoading.value = null;
  }
};

const handleEdit = (row: IOrder): void => {
  console.log("Edit order:", { row });
  
  // Navigate to appropriate calculation page based on service_id
  switch (row.service_id) {
    case 2: // 3D Printing
      router.push({ path: "/plastic" });
      break;
    case 4: // Milling
      router.push({ name: "machining" });
      break;
    default:
      // Default to plastic page for unknown service_id
      router.push({ path: "/plastic" });
      break;
  }
};
</script>

<template>
  <el-row
    :gutter="20"
    style="background-color: #fff; padding-top: 30px; min-height: 100px"
  >
    <el-col :offset="2" :span="20">
      <h1>Мои заказы</h1>
    </el-col>
  </el-row>
  <el-row
    :gutter="20"
    style="background-color: #fff; padding-top: 30px; min-height: 500px"
  >
    <el-col :offset="2" :span="20">
      <el-table
        stripe
        :data="orders"
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
