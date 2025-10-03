<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { req_json_auth } from "../../api";

const selectedMaterial = defineModel();
const materials = ref<Array<{ value: string; label: string }>>([]);

// Функция для преобразования данных с бекенда в нужный формат
function transformMaterials(
  prop: any
): Array<{ value: string; label: string }> {
  return prop.materials.map((x: any) => ({
    value: x.id,
    label: x.name,
  }));
}

// Загружаем материалы с бекенда
async function loadMaterials() {
  try {
    const response = await req_json_auth(
      "/calculator/materials?service_id=cnc-milling",
      "GET"
    );
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
    <p style="color: #577aad; font-weight: 500">Материал</p>
    <el-select
      v-model="selectedMaterial"
      value-key="label"
      placeholder="Выбрать"
      size="large"
      class="full"
    >
      <el-option
        v-for="item in materials"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<style scoped>
.full {
  width: 100%;
}

.full :deep(.el-select__wrapper) {
  border: 1px solid #577aad;
  border-radius: 5px;
}
</style>
