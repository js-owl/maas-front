import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { req_json_auth } from '../api'

type MaterialOption = {
  value: string
  label: string
}

export const useMaterialStore = defineStore('material', () => {
  const materials = ref<MaterialOption[]>([])
  const selectedMaterialId = useStorage<string | null>('material:selectedId', null)
  const isLoading = ref(false)
  const hasError = ref(false)

  const selectedMaterial = computed(() =>
    materials.value.find(m => m.value === selectedMaterialId.value) ?? null
  )

  const setMaterials = (list: MaterialOption[]) => {
    materials.value = list
  }

  const setSelectedMaterialId = (id: string | null) => {
    selectedMaterialId.value = id
  }

  const transformMaterials = (payload: any): MaterialOption[] => {
    return (payload?.materials ?? []).map((x: any) => ({ value: x.id, label: x.label }))
  }

  const loadMaterials = async (process: string = 'cnc-lathe') => {
    isLoading.value = true
    hasError.value = false
    try {
      const response = await req_json_auth(`/materials?process=${process}`, 'GET')
      if (response?.ok) {
        const backendMaterials = await response.json()
        materials.value = transformMaterials(backendMaterials)
        return true
      }
      hasError.value = true
      return false
    } catch (err) {
      hasError.value = true
      // Fallback to static data on error
      materials.value = [
        { value: 'alum_D16T', label: 'Алюминий Д16Т' },
        { value: 'steel_12X18H10T', label: 'Сталь 12Х18Н10Т' },
      ]
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    materials,
    selectedMaterialId,
    isLoading,
    hasError,
    selectedMaterial,
    setMaterials,
    setSelectedMaterialId,
    loadMaterials,
  }
})


