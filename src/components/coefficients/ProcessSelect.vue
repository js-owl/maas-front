<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { req_json } from '../../api'

const selectedMaterial = defineModel<string | null>()

type ProcessItem = {
  label: string
  value: string
}

type OtherService = {
  id: string
  label: string
  service: string
}

type OtherServicesResponse = {
  other_services: OtherService[]
}

const processes = ref<ProcessItem[]>([])
const isLoading = ref(false)

const loadProcesses = async () => {
  isLoading.value = true
  try {
    const res = await req_json('/other_services', 'GET')
    const data = (await res?.json()) as OtherServicesResponse
    console.log({data})

    if (data && Array.isArray(data)) {
      processes.value = data.map((item) => ({
        label: item.label,
        value: item.service,
      }))

      if (!selectedMaterial.value && processes.value.length > 0) {
        selectedMaterial.value = processes.value[0].value
      }
    }
  } catch (error) {
    console.error('Failed to load other services:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProcesses()
})
</script>

<template>
  <div>
    <p class="coefficient-label">Процесс</p>
    <el-select
      v-model="selectedMaterial"
      value-key="label"
      placeholder="Выбрать"
      size="large"
      class="full"
      :loading="isLoading"
      :disabled="isLoading"
    >
      <el-option
        v-for="item in processes"
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

:deep(.el-select__wrapper) {
  background-color: var(--whity);
  border-color: var(--whity);
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  color: black;
  margin-top: -20px;
  /* padding: 10px; */
}
</style>
