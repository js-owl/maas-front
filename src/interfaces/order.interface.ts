export interface IOrder {
  id: number;
  user_id: number;
  service_id: number;
  file_id: number;
  quantity: number;
  dimensions: string;
  material_preference: string;
  special_instructions: string;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  service: {
    id: number;
    name: string;
    technology: string;
    description: string;
    base_price: number;
    price_per_unit: number;
    min_quantity: number;
    max_quantity: number;
    supported_materials: string;
    capabilities: string;
    is_active: true;
    created_at: string;
    updated_at: string;
  };
  file: {
    id: number;
    filename: string;
    original_filename: string;
    file_size: number;
    file_type: string;
    uploaded_by: number;
    uploaded_at: string;
    file_metadata: string;
  };
}
