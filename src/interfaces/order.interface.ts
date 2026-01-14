export interface IKit {
  kit_id?: number
  kit_name: string
  order_ids: number[]
  user_id: number
  quantity: number
  status: string
  created_at?: string
  updated_at?: string
  bitrix_deal_id: number
  location: string
  kit_price: number
  delivery_price: number
  total_kit_price: number
}

export interface IOrderBase {
  service_id: string
  order_name?: string
  file_id: number
  quantity: number
  length: number
  width: number
  height: number
  material_id: string
  material_form: string
  tolerance_id?: string
  finish_id?: string
  cover_id: string[]
  procces_id?: string
  n_dimensions?: number
  k_otk: string
  k_cert: string[]
  special_instructions?: string
  total_price_breakdown?: {
    location?: string
    mat_price?: number
    administrative_expenses?: number
    cost?: number
    dop_mat_price?: number
    dop_salary?: number
    insurance_price?: number
    mat_price_full?: number
    net_cost?: number
    overhead_expenses?: number
    price_of_hour?: number
    price_of_hour_with_others?: number
    price_per_kg?: number
    price_special_equipment_to_quantity?: number
    profit?: number
    sum_costs_labor?: number
    total_time?: number
    work_price?: number
    [key: string]: any
  }
}

export interface IOrderPayload extends IOrderBase {
  document_ids: number[]
}

export interface IOrderPostPayload extends IOrderBase {
  document_ids: number[]
}

export interface IOrderResponse extends IOrderBase {
  order_id: number
  user_id: number
  document_ids: number[]
  composite_rig: string
  status: string
  mat_volume: number
  detail_price: number
  detail_price_one: number
  detail_time: number
  total_price: number
  mat_weight: number
  mat_price: number
  work_price: number
  k_quantity: number
  total_time: number
  created_at: string
  updated_at: string
  message: string
  manufacturing_cycle: number
  suitable_machines: []
  calc_ids: number[]
}
