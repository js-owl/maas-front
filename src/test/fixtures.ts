/**
 * Shared API response fixtures.
 *
 * Imported by both the vitest unit suite and the Playwright e2e suite, so a
 * change in an API contract has to be reflected in exactly one place.
 * Keep this file free of any test-runner imports.
 */

export const mockCoefficients = {
  finish: [
    { id: '1', label: 'Ra 0.8' },
    { id: '2', label: 'Ra 1.6' },
    { id: '3', label: 'Ra 6.3' },
  ],
  cover: [
    { id: '1', label: 'Без покрытия' },
    { id: '2', label: 'Анодирование' },
    { id: '3', label: 'Покраска' },
  ],
  tolerance: [
    { id: '1', label: 'h7' },
    { id: '4', label: 'h12' },
  ],
}

export const mockMaterials = {
  materials: [
    { id: '1', label: 'Алюминий Д16Т', family: 'Алюминий' },
    { id: '2', label: 'Сталь 45', family: 'Сталь' },
  ],
}

export const mockCalculatePrice = {
  order_id: 0,
  user_id: 0,
  service_id: 'cnc-milling',
  document_ids: [],
  file_id: 2,
  quantity: 1,
  length: 120,
  width: 30,
  height: 30,
  material_id: '1',
  material_form: 'sheet',
  tolerance_id: '4',
  finish_id: '3',
  cover_id: ['1'],
  n_dimensions: 55,
  k_otk: '1.0',
  k_cert: ['a', 'f'],
  status: 'CALCULATED',
  mat_volume: 0.1,
  detail_price: 15000,
  detail_price_one: 15000,
  detail_time: 2.5,
  total_price: 15000,
  mat_weight: 0.5,
  mat_price: 3000,
  work_price: 12000,
  k_quantity: 1,
  total_time: 2.5,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  message: '',
  manufacturing_cycle: 5,
  suitable_machines: [],
  calc_ids: [],
}

export const mockLegalProfile = {
  id: 1,
  username: 'legal@example.com',
  email: 'legal@example.com',
  email_verified: true,
  is_admin: false,
  phone_number: '+7',
  personal_phone_number: '+7',
  full_name: '',
  last_name: '',
  first_name: '',
  patronymic: '',
  user_type: 'legal',
  city: '',
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
  company_email: 'a@a.ru',
}

export const mockIndividualProfile = {
  ...mockLegalProfile,
  id: 2,
  username: 'person@example.com',
  email: 'person@example.com',
  user_type: 'individual',
  first_name: 'Иван',
  last_name: 'Иванов',
  patronymic: 'Иванович',
  full_name: 'Иванов Иван Иванович',
  company_email: '',
}

export const mockAuthResponse = {
  access_token: 'test-access-token',
  token_type: 'bearer',
  must_change_password: false,
}

export const mockKit = {
  kit_id: 16,
  kit_name: 'Наименование заказа',
  order_ids: [101],
  user_id: 1,
  quantity: 1,
  status: 'processing',
  status_name: 'processing',
  created_at: '2026-02-07T00:00:00Z',
  updated_at: '2026-02-07T00:00:00Z',
  bitrix_deal_id: 0,
  location: 'location_1',
  kit_price: 10528,
  delivery_price: 0,
  total_kit_price: 10528,
}

export const mockOrder = {
  ...mockCalculatePrice,
  order_id: 101,
  order_code: '3000.012.00.111.001.0000/01',
  order_name: 'Втулка',
  file_id: null,
  document_ids: [],
  quantity: 8,
}

export const mockOtherServices = {
  other_services: [{ id: '101', label: 'Механообработка', service: 'cnc-milling' }],
}
