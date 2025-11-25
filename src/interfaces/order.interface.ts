export interface IOrderBase {
  service_id: string
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
  n_dimensions?: number
  k_otk: string
  k_cert: string[]
  special_instructions?: string
  total_price_breakdown?: {
    mat_price_full?: number
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
}
