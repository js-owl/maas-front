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
  const selectedMaterialId = ref<string | null>(null)
  const allMaterials = useStorage<MaterialOption[]>('material:allMaterials', [])
  const isLoading = ref(false)
  const hasError = ref(false)

  const selectedMaterial = computed(() =>
    materials.value.find(m => m.value === selectedMaterialId.value) ?? null
  )

  const setMaterials = (list: MaterialOption[]) => {
    materials.value = list
  }

  // const setSelectedMaterialId = (id: string | null) => {
  //   selectedMaterialId.value = id
  // }

  const loadMaterialsForProcess = async (process: string): Promise<MaterialOption[]> => {
    try {
      const response = await req_json_auth(`/materials?process=${process}`, 'GET')
      if (response?.ok) {
        const backendMaterials = await response.json()
        return transformMaterials(backendMaterials)
      }
      return []
    } catch (err) {
      // Fallback to static data on error for cnc-lathe
      if (process === 'cnc-lathe') {
        return [
          { value: 'alum_D16T', label: 'Алюминий Д16Т' },
          { value: 'steel_12X18H10T', label: 'Сталь 12Х18Н10Т' },
        ]
      }
      return []
    }
  }

  const setAllMaterials = async () => {
    // Check localStorage first
    if (allMaterials.value.length > 0) {
      // Use materials from localStorage
      materials.value = allMaterials.value
    } else {
      // Load from API if localStorage is empty
      isLoading.value = true
      hasError.value = false
      try {
        // Load materials from both processes
        const [cncMaterials, printingMaterials] = await Promise.all([
          loadMaterialsForProcess('cnc-lathe'),
          loadMaterialsForProcess('printing'),
        ])

        // Combine and remove duplicates by value
        const combinedMaterials = [...cncMaterials, ...printingMaterials]
        const uniqueMaterials = combinedMaterials.filter(
          (material, index, self) => index === self.findIndex(m => m.value === material.value)
        )

        if (uniqueMaterials.length > 0) {
          materials.value = uniqueMaterials
          allMaterials.value = uniqueMaterials
        } else {
          hasError.value = true
        }
      } catch (err) {
        hasError.value = true
      } finally {
        isLoading.value = false
      }
    }
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
    allMaterials,
    isLoading,
    hasError,
    selectedMaterial,
    setMaterials,
    // setSelectedMaterialId,
    setAllMaterials,
    loadMaterials,
  }
})


