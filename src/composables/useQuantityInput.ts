import { computed, type Ref } from 'vue'

/** String view of a numeric quantity for text inputs; invalid input falls back to 1. */
export function useQuantityInput(quantity: Ref<number>) {
  return computed({
    get: () => String(quantity.value),
    set: (value: string) => {
      const parsed = Number(value)
      quantity.value = Number.isFinite(parsed) && parsed > 0 ? parsed : 1
    },
  })
}
