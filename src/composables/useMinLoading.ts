import { ref } from 'vue'

/**
 * Loading flag that stays on for at least `minMs`, so the loader does not
 * flash when the request finishes almost instantly. Starts in the loading
 * state because the calculator pages bootstrap on mount.
 */
export function useMinLoading(minMs = 1000) {
  const isLoading = ref(true)
  let startedAt = 0

  const startLoading = () => {
    startedAt = Date.now()
    isLoading.value = true
  }

  const stopLoading = async () => {
    const remaining = Math.max(0, minMs - (Date.now() - startedAt))
    if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining))
    isLoading.value = false
  }

  return { isLoading, startLoading, stopLoading }
}
