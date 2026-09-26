import { EyewearProduct, LensOpticalType, PrescriptionData } from './optical';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  city?: string;
  address?: string;
  created_at: string;
}

export interface DbOrder {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    address: string;
    city: string;
    state?: string;
    pincode: string;
  };
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_status: 'paid' | 'pending' | 'cod';
  order_status: 'processing' | 'crafting' | 'dispatched' | 'delivered';
  prescription_data?: PrescriptionData | null;
  notes?: string;
  created_at: string;
  items?: DbOrderItem[];
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku?: string;
  selected_color: string;
  selected_lens: LensOpticalType;
  lens_price: number;
  item_price: number;
  quantity: number;
  image_url?: string;
  created_at: string;
}

export interface DbEyeTestAppointment {
  id: string;
  user_id?: string | null;
  patient_name: string;
  phone: string;
  email?: string;
  clinic_branch: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface DbPrescription {
  id: string;
  user_id?: string | null;
  patient_name: string;
  method: 'upload' | 'manual' | 'later';
  file_name?: string;
  file_url?: string;
  right_sphere: string;
  right_cylinder: string;
  right_axis: string;
  right_add?: string;
  left_sphere: string;
  left_cylinder: string;
  left_axis: string;
  left_add?: string;
  pupillary_distance: string;
  notes?: string;
  created_at: string;
}

export interface DbReview {
  id: string;
  product_id: string;
  user_id?: string | null;
  user_name: string;
  rating: number;
  title?: string;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}
