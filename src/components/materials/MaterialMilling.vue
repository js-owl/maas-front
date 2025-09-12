<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { req_json_auth } from "../../api";

const selectedMaterial = defineModel();
const materials = ref<Array<{ value: string; label: string }>>([]);

// Функция для преобразования данных с бекенда в нужный формат
function transformMaterials(backendData: any[]): Array<{ value: string; label: string }> {
  return backendData
    .filter(item => item.forms && item.forms.some((form: any) => form.id === "plate"))
    .map(item => ({
      value: item.id,
      label: item.value
    }));
}

// Загружаем материалы с бекенда
async function loadMaterials() {
  try {
    const response = await req_json_auth("/calculator/materials", "GET");
    if (response?.ok) {
      const backendMaterials = await response.json();
      materials.value = transformMaterials(backendMaterials);
    }
  } catch (error) {
    console.error("Error loading materials:", error);
    // Fallback к статичным данным при ошибке
    materials.value = [
      {
        value: "alum_D16T",
        label: "Алюминий Д16Т",
      },
      {
        value: "steel_12X18H10T",
        label: "Сталь 12Х18Н10Т",
      },
    ];
  }
}

onMounted(() => {
  loadMaterials();
});
</script>

<template>
  <div>
    <p>Материал</p>
    <el-select
      v-model="selectedMaterial"
      value-key="label"
      placeholder="Выбрать"
      size="large"
      style="display: block; width: 800px"
    >
      <el-option
        v-for="item in materials"
        :key="item.value"
        :label="item.label"
        :value="item"
      />
    </el-select>
  </div>
</template>
