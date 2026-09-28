import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useProfileStore } from '../stores/profile.store'

const readAccessTokenRole = (token?: string): string => {
  if (!token) return ''
  const segment = token.split('.')[1]
  if (!segment) return ''

  try {
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    const payload = JSON.parse(atob(padded)) as { role?: unknown }
    return typeof payload.role === 'string' ? payload.role.trim().toLowerCase() : ''
  } catch {
    return ''
  }
}

export function useIsManager() {
  const authStore = useAuthStore()
  const profileStore = useProfileStore()

  return computed(() => {
    const profileRole = profileStore.profile?.role
    const role =
      readAccessTokenRole(authStore.getToken) ||
      (typeof profileRole === 'string' ? profileRole.trim().toLowerCase() : '')
    return role === 'manager'
  })
}
