import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ElMessage } from 'element-plus'
import { useProfileStore, type IProfile } from '@/stores/profile.store'
import { useAuthStore } from '@/stores/auth.store'
import { lastFetchBody, mockJson, mockStatus } from '@/test/fetch-mock'

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

describe('enrichProfile edge cases (via getProfile)', () => {
  async function load(payload: Record<string, unknown>) {
    mockJson('/api/v3/profile', payload)
    const store = useProfileStore()
    expect(await store.getProfile()).toBe(true)
    return store.profile!
  }

  it('adds no address parts for a city made only of separators or missing city', async () => {
    let p = await load({ ...baseProfile, city: ' , ,', city_name: 'kept' })
    expect(p.city_name).toBe('kept')
    expect(p.postal).toBe('')

    p = await load({ ...baseProfile, city: undefined, city_name: 'kept2' })
    expect(p.city_name).toBe('kept2')
  })

  it('takes a single-part city as the city name', async () => {
    const p = await load({ ...baseProfile, city: 'Казань' })
    expect(p.city_name).toBe('Казань')
    expect(p.street).toBe('')
  })

  it('fills missing name parts with empty strings for individuals', async () => {
    let p = await load({ ...baseProfile, full_name: 'Иванов' })
    expect([p.last_name, p.first_name, p.patronymic]).toEqual(['Иванов', '', ''])

    p = await load({ ...baseProfile, full_name: '' })
    expect([p.last_name, p.first_name, p.patronymic]).toEqual(['', '', ''])

    p = await load({ ...baseProfile, full_name: '   ' })
    expect([p.last_name, p.first_name, p.patronymic]).toEqual(['', '', ''])
  })

  it('blanks a non-string legal full_name', async () => {
    const p = await load({ ...baseProfile, user_type: 'legal', full_name: 42 })
    expect(p.last_name).toBe('')
    expect(p.first_name).toBe('')
  })

  it('defaults to legal when user_type is missing and accepts camelCase userType', async () => {
    let p = await load({ ...baseProfile, user_type: undefined })
    expect(p.user_type).toBe('legal')

    p = await load({ ...baseProfile, user_type: undefined, userType: ' Individual ' })
    expect(p.user_type).toBe('individual')
    expect(p).not.toHaveProperty('userType')
  })

  it('derives emails and username from whichever fields are present', async () => {
    let p = await load({ ...baseProfile, email: undefined, username: undefined })
    expect(p.personal_email).toBe('')
    expect(p.email).toBe('')
    expect(p.username).toBe('')

    p = await load({ ...baseProfile, personal_email: '', email: 'e@x.ru', username: 'user1' })
    expect(p.personal_email).toBe('')
    expect(p.email).toBe('e@x.ru')
    expect(p.username).toBe('user1')

    p = await load({ ...baseProfile, personal_email: 'p@x.ru', email: 'e@x.ru' })
    expect(p.email).toBe('p@x.ru')
    expect(p.username).toBe('p@x.ru')
  })

  it('falls back from company_email to email for legal users', async () => {
    let p = await load({ ...baseProfile, user_type: 'legal', email: ' corp@x.ru ' })
    expect(p.company_email).toBe('corp@x.ru')

    p = await load({ ...baseProfile, user_type: 'legal', email: undefined })
    expect(p.company_email).toBe('')

    p = await load({ ...baseProfile, user_type: 'individual', company_email: undefined })
    expect(p.company_email).toBeUndefined()
  })

  it('maps legacy apartment to office and defaults office to empty', async () => {
    let p = await load({ ...baseProfile, city: 'Москва', office: undefined, apartment: 'кв 5' })
    expect(p.office).toBe('кв 5')
    expect(p).not.toHaveProperty('apartment')

    p = await load({ ...baseProfile, city: 'Москва', office: undefined })
    expect(p.office).toBe('')
  })
})

describe('updateProfile payload', () => {
  type SentPayload = Record<string, unknown>

  it('sends the company email for legal users', async () => {
    mockStatus('/api/v3/profile', 204, undefined, { method: 'PUT' })
    await useProfileStore().updateProfile({
      ...baseProfile,
      user_type: 'legal',
      company_email: ' corp@x.ru ',
      last_name: 'ООО Ромашка',
    })
    const body = lastFetchBody<SentPayload>('/profile')!
    expect(body.email).toBe('corp@x.ru')
    expect(body.full_name).toBe('ООО Ромашка')
    expect(body).not.toHaveProperty('username')
    expect(body).not.toHaveProperty('city_name')
  })

  it('omits email when it is empty or missing', async () => {
    mockStatus('/api/v3/profile', 204, undefined, { method: 'PUT' })
    const store = useProfileStore()

    await store.updateProfile({ ...baseProfile, user_type: 'legal' })
    expect(lastFetchBody<SentPayload>('/profile')).not.toHaveProperty('email')

    await store.updateProfile({ ...baseProfile, email: undefined as unknown as string })
    expect(lastFetchBody<SentPayload>('/profile')).not.toHaveProperty('email')

    await store.updateProfile({ ...baseProfile, email: '  ' })
    expect(lastFetchBody<SentPayload>('/profile')).not.toHaveProperty('email')
  })

  it('sends the trimmed personal email for individuals', async () => {
    mockStatus('/api/v3/profile', 204, undefined, { method: 'PUT' })
    await useProfileStore().updateProfile({ ...baseProfile, email: ' me@x.ru ' })
    expect(lastFetchBody<SentPayload>('/profile')!.email).toBe('me@x.ru')
  })

  it('keeps the submitted data when a 200 response has an empty body', async () => {
    mockStatus('/api/v3/profile', 200, undefined, { method: 'PUT' })
    const store = useProfileStore()
    expect(
      await store.updateProfile({ ...baseProfile, last_name: 'Петров', street: 'Невский' })
    ).toBe(true)
    expect(store.profile?.full_name).toBe('Петров')
    expect(store.profile?.first_name).toBe('')
    expect(store.profile?.patronymic).toBe('')
    expect(JSON.parse(localStorage.getItem('profile-store')!).last_name).toBe('Петров')
  })

  it('blanks name parts that were not provided', async () => {
    mockStatus('/api/v3/profile', 204, undefined, { method: 'PUT' })
    const store = useProfileStore()
    await store.updateProfile({ ...baseProfile })
    expect(lastFetchBody<SentPayload>('/profile')!.full_name).toBe('')
    expect(store.profile?.full_name).toBe('')
    expect([store.profile?.last_name, store.profile?.first_name]).toEqual(['', ''])
  })

  it('leaves the stored profile untouched on 422', async () => {
    mockStatus('/api/v3/profile', 422, { detail: 'missing' }, { method: 'PUT' })
    const store = useProfileStore()
    expect(await store.updateProfile(baseProfile)).toBe(false)
    expect(store.profile).toBeUndefined()
    expect(localStorage.getItem('profile-store')).toBeNull()
  })

  it('returns false when the request fails', async () => {
    mockStatus('/api/v3/profile', 500, undefined, { method: 'PUT' })
    const store = useProfileStore()
    expect(await store.updateProfile(baseProfile)).toBe(false)
    expect(store.profile).toBeUndefined()
    expect(localStorage.getItem('profile-store')).toBeNull()
  })
})

describe('storage failures', () => {
  it('keeps the in-memory profile when saving to localStorage throws', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    try {
      mockJson('/api/v3/profile', baseProfile)
      const store = useProfileStore()
      expect(await store.getProfile()).toBe(true)
      expect(store.profile?.last_name).toBe('Иванов')
      expect(error).toHaveBeenCalledWith('Failed to save profile to localStorage:', expect.any(Error))
    } finally {
      setItem.mockRestore()
      error.mockRestore()
    }
  })

  it('still clears the in-memory profile when removing from localStorage throws', async () => {
    mockJson('/api/v3/profile', baseProfile)
    const store = useProfileStore()
    await store.getProfile()

    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('denied')
    })
    try {
      store.clearProfile()
      expect(store.profile).toBeUndefined()
      expect(error).toHaveBeenCalledWith(
        'Failed to clear profile from localStorage:',
        expect.any(Error)
      )
    } finally {
      removeItem.mockRestore()
      error.mockRestore()
    }
  })
})
