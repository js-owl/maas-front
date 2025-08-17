<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { API_BASE } from "../api";
import type { IOrder } from "../interfaces/order.interface";
import { ElMessage } from "element-plus";

import Length from "../components/coefficients/Length.vue";
import Diameter from "../components/coefficients/Diameter.vue";
import CoefficientQuantity from "../components/coefficients/CoefficientQuantity.vue";

import MaterialMachining from "../components/materials/MaterialMachining.vue";

import CoefficientOtk from "../components/coefficients/CoefficientOtk.vue";
import CoefficientCertificate from "../components/coefficients/CoefficientCertificate.vue";
import CoefficientTolerance from "../components/coefficients/CoefficientTolerance.vue";
import CoefficientFinish from "../components/coefficients/CoefficientFinish.vue";
import CoefficientCover from "../components/coefficients/CoefficientCover.vue";
import CoefficientSize from "../components/coefficients/CoefficientSize.vue";

import router from "../router";
import UploadModel from "../components/UploadModel.vue";
import UploadDrawings from "../components/UploadDrawings.vue";
import { useAuthStore } from "../stores/auth.store";
// @ts-ignore
import CadShowById from "../components/CadShowById.vue";

const authStore = useAuthStore();
const route = useRoute();

// Check if we're in edit mode
const isEditMode = ref(route.query.edit === "true");
const orderId = ref(route.query.orderId ? parseInt(route.query.orderId as string) : null);
const orderData = ref<IOrder | null>(route.state?.orderData || null);

// Flag to prevent automatic data sending during form population
const isPopulatingForm = ref(false);

interface FormResponse {
  id: number;
  user_id: number;
  service_id: number;
  file_id: number;
  quantity: number;
  dimensions: string;
  material_preference: string;
  special_instructions: string;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
}

let file_id = ref(1);
let drawing_id = ref(1);

let length = ref(120);
let width = ref(30);
let quantity = ref(1);

let material = ref("Алюминий 1");

const k_complexity = ref(0.75);
let k_tolerance = ref(1);
let k_finish = ref(1);
let k_cover = ref(1);
let k_size = ref(2);

let control_type = ref("1.3");
let sert_type = ref(["a", "f"]);

// Function to populate form with order data
const populateFormWithOrderData = (order: IOrder) => {
  console.log("Populating form with order data:", order);
  
  // Set flag to prevent automatic data sending
  isPopulatingForm.value = true;
  
  // Parse dimensions if available
  if (order.dimensions) {
    try {
      const dims = JSON.parse(order.dimensions);
      if (dims.length) {
        length.value = dims[0];
        payload.length = dims[0];
      }
      if (dims.width) {
        width.value = dims.width;
        payload.width = dims.width;
      }
    } catch (e) {
      console.warn("Could not parse dimensions:", order.dimensions);
    }
  }
  
  // Set basic fields
  if (order.quantity) {
    console.log("Setting quantity from order:", order.quantity);
    quantity.value = order.quantity;
    payload.quantity = order.quantity; // Also update payload
    console.log("After setting - quantity.value:", quantity.value, "payload.quantity:", payload.quantity);
  }
  if (order.material_preference) {
    material.value = order.material_preference;
    payload.material_preference = order.material_preference;
  }
  if (order.file_id) {
    file_id.value = order.file_id;
    payload.file_id = order.file_id;
  }
  
  // Set special instructions if available
  if (order.special_instructions) {
    try {
      const instructionsData = JSON.parse(order.special_instructions);
      if (instructionsData.text) {
        payload.special_instructions = instructionsData.text;
      } else {
        payload.special_instructions = order.special_instructions;
      }
    } catch (e) {
      // If not JSON, use as plain text
      payload.special_instructions = order.special_instructions;
    }
  }
  
  // Parse additional fields from special_instructions or other sources
  // This assumes that additional parameters might be stored in special_instructions as JSON
  if (order.special_instructions) {
    try {
      const additionalParams = JSON.parse(order.special_instructions);
      
             // Set machining-specific parameters
       if (additionalParams.k_complexity) {
         k_complexity.value = additionalParams.k_complexity;
         payload.k_complexity = additionalParams.k_complexity;
       }
       if (additionalParams.k_tolerance) {
         k_tolerance.value = additionalParams.k_tolerance;
         payload.k_tolerance = additionalParams.k_tolerance;
       }
       if (additionalParams.k_finish) {
         k_finish.value = additionalParams.k_finish;
         payload.k_finish = additionalParams.k_finish;
       }
       if (additionalParams.k_cover) {
         k_cover.value = additionalParams.k_cover;
         payload.k_cover = additionalParams.k_cover;
       }
       if (additionalParams.k_size) {
         k_size.value = additionalParams.k_size;
         payload.k_size = additionalParams.k_size;
       }
       if (additionalParams.control_type) {
         control_type.value = additionalParams.control_type;
         payload.control_type = additionalParams.control_type;
       }
       if (additionalParams.sert_type) {
         sert_type.value = additionalParams.sert_type;
         payload.sert_type = additionalParams.sert_type;
       }
    } catch (e) {
      // If special_instructions is not JSON, treat it as plain text
      console.log("special_instructions is not JSON, treating as plain text");
    }
  }
  
  // Also try to parse from dimensions if it contains additional data
  if (order.dimensions) {
    try {
      const dimsData = JSON.parse(order.dimensions);
      
             // Check if dimensions contains additional parameters
       if (dimsData.k_complexity) {
         k_complexity.value = dimsData.k_complexity;
         payload.k_complexity = dimsData.k_complexity;
       }
       if (dimsData.k_tolerance) {
         k_tolerance.value = dimsData.k_tolerance;
         payload.k_tolerance = dimsData.k_tolerance;
       }
       if (dimsData.k_finish) {
         k_finish.value = dimsData.k_finish;
         payload.k_finish = dimsData.k_finish;
       }
       if (dimsData.k_cover) {
         k_cover.value = dimsData.k_cover;
         payload.k_cover = dimsData.k_cover;
       }
       if (dimsData.k_size) {
         k_size.value = dimsData.k_size;
         payload.k_size = dimsData.k_size;
       }
       if (dimsData.control_type) {
         control_type.value = dimsData.control_type;
         payload.control_type = dimsData.control_type;
       }
       if (dimsData.sert_type) {
         sert_type.value = dimsData.sert_type;
         payload.sert_type = dimsData.sert_type;
       }
         } catch (e) {
       // Dimensions is not JSON or doesn't contain additional data
     }
   }
   
   // Reset flag after form population is complete
   setTimeout(() => {
     isPopulatingForm.value = false;
     console.log("Form population complete. Final values:");
     console.log("quantity.value:", quantity.value);
     console.log("payload.quantity:", payload.quantity);
     console.log("length.value:", length.value);
     console.log("payload.length:", payload.length);
     console.log("material.value:", material.value);
     console.log("payload.material_preference:", payload.material_preference);
   }, 100);
 };

// TODO: добавить length,  width
const payload = reactive({
  service_id: 4,
  file_id: file_id.value,
  quantity: quantity.value,
  length: length.value,
  width: width.value,
  height: width.value,
  material_preference: material.value,
  k_complexity: k_complexity.value,
  k_tolerance: k_tolerance.value,
  k_finish: k_finish.value,
  k_cover: k_cover.value,
  k_size: k_size.value,
  control_type: control_type.value,
  sert_type: sert_type.value,
  special_instructions: "aaa",
});

let result = ref({ total_price: 0, quantity: 1 });

// Отправляем запрос на сервер при любом изменении данных
watch(payload, sendData, { deep: true });

// Sync refs with payload
watch(quantity, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.quantity = newValue;
  }
});

watch(length, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.length = newValue;
  }
});

watch(width, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.width = newValue;
    payload.height = newValue;
  }
});

watch(material, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.material_preference = newValue;
  }
});

watch(k_complexity, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.k_complexity = newValue;
  }
});

watch(k_tolerance, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.k_tolerance = newValue;
  }
});

watch(k_finish, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.k_finish = newValue;
  }
});

watch(k_cover, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.k_cover = newValue;
  }
});

watch(k_size, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.k_size = newValue;
  }
});

watch(control_type, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.control_type = newValue;
  }
});

watch(sert_type, (newValue) => {
  if (!isPopulatingForm.value) {
    payload.sert_type = newValue;
  }
});

onMounted(() => {
  // If in edit mode and we have order data, populate the form
  if (isEditMode.value && orderData.value) {
    populateFormWithOrderData(orderData.value);
  } else {
    // Only send data if not in edit mode
    sendData(payload);
  }
});

type sendType = typeof payload;

async function sendData(payload: sendType) {
  // Don't send data while populating form
  if (isPopulatingForm.value) {
    console.log("Skipping sendData during form population");
    return;
  }
  
     console.log("token", authStore.getToken);
   console.log("payload", payload);
   console.log("quantity.value:", quantity.value);
   console.log("payload.quantity:", payload.quantity);
   console.log("isEditMode", isEditMode.value);
   console.log("orderId", orderId.value);
  
  try {
    const headers = new Headers();
    
    // Use JSON format for PUT requests, form-urlencoded for POST
    if (isEditMode.value && orderId.value) {
      headers.append("Content-Type", "application/json");
    } else {
      headers.append("Content-Type", "application/x-www-form-urlencoded");
    }
    
    if (authStore.getToken) {
      headers.append("Authorization", `Bearer ${authStore.getToken}`);
    }

    const toUrlEncoded = (o: any) => {
      return Object.keys(o)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(o[key])}`
        )
        .join("&");
    };

    // Use PUT method for editing existing order, POST for creating new one
    const method = isEditMode.value && orderId.value ? "PUT" : "POST";
    const url = isEditMode.value && orderId.value 
      ? `${API_BASE}/orders/${orderId.value}` 
      : `${API_BASE}/orders`;

    // Prepare request body
    let body: string;
    if (isEditMode.value && orderId.value) {
             // For PUT requests, send JSON with only the fields that can be updated
       console.log("Creating updateData with quantity:", payload.quantity);
       const updateData = {
         service_id: payload.service_id,
         file_id: payload.file_id,
         quantity: payload.quantity,
         dimensions: JSON.stringify([payload.length, payload.width, payload.height]),
         material_preference: payload.material_preference,
        special_instructions: JSON.stringify({
          k_complexity: payload.k_complexity,
          k_tolerance: payload.k_tolerance,
          k_finish: payload.k_finish,
          k_cover: payload.k_cover,
          k_size: payload.k_size,
          control_type: payload.control_type,
          sert_type: payload.sert_type,
          // Include any additional text instructions
          text: payload.special_instructions
        }),
                 // Include other specific fields for machining
         k_complexity: payload.k_complexity,
         k_tolerance: payload.k_tolerance,
         k_finish: payload.k_finish,
         k_cover: payload.k_cover,
         k_size: payload.k_size,
         control_type: payload.control_type,
         sert_type: payload.sert_type
       };
       console.log("Final updateData:", updateData);
       body = JSON.stringify(updateData);
    } else {
      // For POST requests, use form-urlencoded
      body = toUrlEncoded(payload);
    }

    console.log("Request details:", { method, url, body, headers: Object.fromEntries(headers.entries()) });

    const res = await fetch(url, {
      method: method,
      headers: headers,
      body: body,
    });
    
    console.log("Response status:", res.status);
    console.log("Response headers:", Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Response error:", errorText);
      
      // Show user-friendly error message
      ElMessage({
        type: "error",
        message: `Ошибка ${res.status}: ${errorText || 'Не удалось обновить заказ'}`,
        duration: 5000
      });
      
      throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
    }
    
    const data = (await res.json()) as FormResponse;
    result.value = data;
    console.log("Response data:", data);
    
    // Show success message for edit mode
    if (isEditMode.value && orderId.value) {
      ElMessage({
        type: "success",
        message: "Заказ успешно обновлен",
        duration: 3000
      });
    }
  } catch (error) {
    console.error("sendData error:", error);
  }
}

const submitOrder = () => {
  console.log("|-submitOrder");
  
  if (isEditMode.value && orderId.value) {
    // For edit mode, show success message and redirect
    ElMessage({
      type: "success",
      message: "Заказ успешно обновлен! Перенаправление на список заказов...",
      duration: 2000
    });
    
    // Redirect after a short delay to show the message
    setTimeout(() => {
      router.push({ name: "order-list" });
    }, 1000);
  } else {
    // For new orders, redirect immediately
    router.push({ name: "order-list" });
  }
};
</script>

<template>
  <el-row :gutter="5" style="min-height: 500px">
    <!-- 1. Левая часть -->
    <el-col
      :span="9"
      style="background-color: #283d5b; padding: 30px 50px 30px 100px"
    >
      <div style="color: white; font-size: 38px; padding-bottom: 40px">
        {{ isEditMode ? 'Редактирование заказа' : 'Токарная обработка' }}
      </div>
      <el-row
        :gutter="20"
        style="background-color: #283d5b; padding-bottom: 30px"
      >
        <el-col
          :span="24"
          style="padding-bottom: 10px; font-size: 30px; color: #577aad"
        >
          Загрузите файлы для расчета
        </el-col>
        <el-col :span="12">
          <UploadModel v-model="file_id" color="#fff" />
        </el-col>
        <el-col :span="12">
          <UploadDrawings v-model="drawing_id" color="#fff" />
        </el-col>
        <el-col :span="24" style="font-size: 20px; color: #577aad">
          Максимальный размер 100Мб
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        style="background-color: #283d5b; padding-bottom: 30px"
      >
        <el-col :offset="0" :span="24" style="color: #577aad">
          <CadShowById v-model="file_id" />
        </el-col>
      </el-row>
      <div style="color: white; font-size: 42px">1,5 ч</div>
      <div style="color: white; font-size: 20px; padding-bottom: 40px">
        Трудоемкость изготовления 1 ед.
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          padding-bottom: 40px;
        "
      >
        <div>
          <div style="color: white; font-size: 40px">1 000 руб</div>
          <div style="color: white; font-size: 20px">
            Стоимость изготовления 1 ед.
          </div>
        </div>
        <div>
          <div style="color: white; font-size: 40px">
            {{ result.total_price }} руб
          </div>
          <div style="color: white; font-size: 20px">
            Стоимость {{ result.quantity }} ед.*
          </div>
        </div>
      </div>
      <div style="color: #577aad; font-size: 20px; padding-bottom: 40px">
        *При увеличении количества единиц в заказе стоимость одного изделия
        становится выгоднее.
      </div>
      <div style="display: flex; justify-content: center">
        <el-button type="primary" plain class="submit" @click="submitOrder">
          {{ isEditMode ? 'Обновить заказ' : 'Перейти к оформлению >' }}
        </el-button>
      </div>
    </el-col>

    <!-- 2. Правая часть -->
    <el-col :span="15" style="background-color: #e5e5e5; padding-top: 30px">
      <el-row :gutter="5">
        <el-col :offset="2" :span="6">
          <Length v-model="length" />
        </el-col>
        <el-col :offset="1" :span="6">
          <Diameter v-model="width" />
        </el-col>
        <el-col :offset="1" :span="6">
          <CoefficientQuantity v-model="quantity" />
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :offset="2" :span="6">
          <CoefficientFinish v-model="k_finish" />
        </el-col>
        <el-col :offset="1" :span="6">
          <CoefficientCover v-model="k_cover" />
        </el-col>
        <el-col :offset="1" :span="6">
          <CoefficientTolerance v-model="k_tolerance" />
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :offset="2" :span="13">
          <MaterialMachining v-model="material" />
        </el-col>
        <el-col :offset="1" :span="6">
          <CoefficientSize v-model="k_size"
        /></el-col>
      </el-row>

      <el-row :gutter="5" style="padding-top: 30px">
        <el-col :offset="2" :span="20">
          <CoefficientOtk v-model="control_type" />
        </el-col>
      </el-row>

             <el-row :gutter="5" style="padding: 30px 0">
         <el-col :offset="2" :span="20">
           <CoefficientCertificate v-model="sert_type" />
         </el-col>
       </el-row>
       
       <el-row :gutter="5" style="padding: 30px 0">
         <el-col :offset="2" :span="20">
           <el-form-item label="Специальные инструкции">
             <el-input
               v-model="payload.special_instructions"
               type="textarea"
               :rows="3"
               placeholder="Введите дополнительные инструкции для заказа..."
             />
           </el-form-item>
         </el-col>
       </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 10px;
  background-color: #283d5b;
}

.custom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.submit {
  background-color: #bc2b55;
  border: 1px solid white;
  color: white;
  font-size: 26px;
  padding: 30px 90px;
}
</style>
