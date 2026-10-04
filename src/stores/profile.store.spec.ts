import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ElMessage } from 'element-plus'
import { useProfileStore, type IProfile } from '@/stores/profile.store'
import { useAuthStore } from '@/stores/auth.store'
import { mockJson, mockStatus } from '@/test/fetch-mock'

vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  useAuthStore().setToken('tok', false)
  vi.clearAllMocks()
})

const baseProfile = {
  username: 'legal@example.com',
  email: 'legal@example.com',
  full_name: 'Иванов Иван Иванович',
  user_type: 'individual',
  city: '101000, Москва, Тверская, 1, 2',
  postal: '',
  region: '',
  city_name: '',
  street: '',
  building: '',
  office: '',
  payment_bank_name: '',
  payment_inn: '',
  payment_kpp: '',
  payment_bik: '',
  payment_cor_account: '',
  payment_account: '',
  payment_company_name: '',
} satisfies IProfile

describe('getProfile', () => {
  it('enriches address parts and name fields from the API payload', async () => {
    mockJson('/api/v3/profile', {
      ...baseProfile,
      city: '101000, Московская обл, Москва, Тверская, 1, офис 2',
    })
    const store = useProfileStore()
    expect(await store.getProfile()).toBe(true)
    expect(store.profile?.postal).toBe('101000')
    expect(store.profile?.region).toBe('Московская обл')
    expect(store.profile?.city_name).toBe('Москва')
    expect(store.profile?.street).toBe('Тверская')
    expect(store.profile?.last_name).toBe('Иванов')
    expect(store.profile?.first_name).toBe('Иван')
    expect(store.profile?.patronymic).toBe('Иванович')
    expect(localStorage.getItem('profile-store')).toBeTruthy()
  })

  it('keeps legal full_name as a single contact string', async () => {
    mockJson('/api/v3/profile', {
      ...baseProfile,
      user_type: 'legal',
      full_name: 'ООО Ромашка',
      company_email: 'office@roma.ru',
      city: 'Москва',
    })
    const store = useProfileStore()
    await store.getProfile()
    expect(store.profile?.user_type).toBe('legal')
    expect(store.profile?.last_name).toBe('ООО Ромашка')
    expect(store.profile?.first_name).toBe('')
    expect(store.profile?.company_email).toBe('office@roma.ru')
  })

  it('parses a 5-part legacy city string', async () => {
    mockJson('/api/v3/profile', {
      ...baseProfile,
      city: '101000, Москва, Тверская, 1, 5',
    })
    const store = useProfileStore()
    await store.getProfile()
    expect(store.profile?.postal).toBe('101000')
    expect(store.profile?.office).toBe('5')
  })

  it('parses a 4-part city string without postal', async () => {
    mockJson('/api/v3/profile', {
      ...baseProfile,
      city: 'Москва, Тверская, 1, 5',
    })
    const store = useProfileStore()
    await store.getProfile()
    expect(store.profile?.city_name).toBe('Москва')
    expect(store.profile?.building).toBe('1')
  })

  it('parses 2- and 3-part city strings', async () => {
    mockJson('/api/v3/profile', { ...baseProfile, city: 'Москва, Тверская, 1' })
    let store = useProfileStore()
    await store.getProfile()
    expect(store.profile?.city_name).toBe('Москва')
    expect(store.profile?.building).toBe('1')

    mockJson('/api/v3/profile', { ...baseProfile, city: 'Москва, Тверская' })
    store = useProfileStore()
    await store.getProfile()
    expect(store.profile?.street).toBe('Тверская')
  })

  it('returns false when the request fails', async () => {
    mockStatus('/api/v3/profile', 500)
    expect(await useProfileStore().getProfile()).toBe(false)
  })
})

describe('updateProfile / clearProfile', () => {
  it('sends only UserUpdate fields and merges the response', async () => {
    mockJson('/api/v3/profile', { ...baseProfile }, { method: 'PUT' })
    const store = useProfileStore()
    const updated: IProfile = {
      ...baseProfile,
      last_name: 'Петров',
      first_name: 'Пётр',
      patronymic: 'Петрович',
      city: 'Санкт-Петербург',
      street: 'Невский',
      building: '10',
    }
    expect(await store.updateProfile(updated)).toBe(true)
    expect(store.profile?.last_name).toBe('Петров')
    expect(store.profile?.full_name).toBe('Петров Пётр Петрович')
  })

  it('handles 204 with no body', async () => {
    mockStatus('/api/v3/profile', 204, undefined, { method: 'PUT' })
    const store = useProfileStore()
    const updated: IProfile = {
      ...baseProfile,
      last_name: 'Сидоров',
      first_name: 'Сид',
      patronymic: '',
    }
    expect(await store.updateProfile(updated)).toBe(true)
    expect(store.profile?.last_name).toBe('Сидоров')
  })

  it('returns false on 422 validation errors', async () => {
    mockStatus('/api/v3/profile', 422, { detail: 'missing' }, { method: 'PUT' })
    expect(await useProfileStore().updateProfile(baseProfile)).toBe(false)
  })

  it('clears the in-memory profile and storage', async () => {
    mockJson('/api/v3/profile', baseProfile)
    const store = useProfileStore()
    await store.getProfile()
    store.clearProfile()
    expect(store.profile).toBeUndefined()
    expect(localStorage.getItem('profile-store')).toBeNull()
  })

  it('rehydrates a saved profile from localStorage on init', () => {
    localStorage.setItem(
      'profile-store',
      JSON.stringify({
        ...baseProfile,
        full_name: 'Сохранённый Профиль',
        city: 'Казань',
      })
    )
    setActivePinia(createPinia())
    const store = useProfileStore()
    expect(store.profile?.city_name).toBe('Казань')
    expect(store.profile?.last_name).toBe('Сохранённый')
  })

  it('drops a corrupt saved profile', () => {
    localStorage.setItem('profile-store', '{bad')
    setActivePinia(createPinia())
    expect(useProfileStore().profile).toBeUndefined()
    expect(localStorage.getItem('profile-store')).toBeNull()
  })
})
