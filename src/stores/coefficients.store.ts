import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { req_json } from '../api'

type CoefficientItem = {
  value: string
  label: string
}

type CoefficientsData = {
  finish: CoefficientItem[]
  cover: CoefficientItem[]
  tolerance: CoefficientItem[]
}

export const useCoefficientsStore = defineStore('coefficients', () => {
  const coefficients = ref<CoefficientsData>({
    finish: [],
    cover: [],
    tolerance: [],
  })
  const allCoefficients = useStorage<CoefficientsData>('coefficients:allCoefficients', {
    finish: [],
    cover: [],
    tolerance: [],
  })
  const isLoading = ref(false)
  const hasError = ref(false)

  const setCoefficients = (data: CoefficientsData) => {
    coefficients.value = data
  }

  const setAllCoefficients = async () => {
    // Check localStorage first
    if (
      allCoefficients.value.finish.length > 0 ||
      allCoefficients.value.cover.length > 0 ||
      allCoefficients.value.tolerance.length > 0
    ) {
      // Use coefficients from localStorage
      coefficients.value = allCoefficients.value
    } else {
      // Load from API if localStorage is empty
      await loadCoefficients()
    }
  }

  const transformCoefficients = (payload: any): CoefficientsData => {
    return {
      finish: (payload?.finish ?? []).map((x: any) => ({ value: x.id, label: x.label })),
      cover: (payload?.cover ?? []).map((x: any) => ({ value: x.id, label: x.label })),
      tolerance: (payload?.tolerance ?? []).map((x: any) => ({ value: x.id, label: x.label })),
    }
  }

  const loadCoefficients = async () => {
    isLoading.value = true
    hasError.value = false
    try {
      const response = await req_json(`/coefficients`, 'GET')
      if (response?.ok) {
        const backendCoefficients = await response.json()
        const transformedCoefficients = transformCoefficients(backendCoefficients)
        coefficients.value = transformedCoefficients
        allCoefficients.value = transformedCoefficients
        return true
      }
      hasError.value = true
      return false
    } catch (err) {
      hasError.value = true
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    coefficients,
    allCoefficients,
    isLoading,
    hasError,
    setCoefficients,
    setAllCoefficients,
    loadCoefficients,
  }
})
