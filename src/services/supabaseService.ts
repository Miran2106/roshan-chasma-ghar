import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PRODUCTS } from '../data/products';
import { EyewearProduct, CartItem, PrescriptionData } from '../types/optical';
import { DbOrder, DbOrderItem, DbEyeTestAppointment, DbPrescription, DbReview } from '../types/supabase';

// Local storage keys for graceful fallback when Supabase keys are not set
const STORAGE_KEYS = {
  ORDERS: 'roshan_local_orders',
  APPOINTMENTS: 'roshan_local_appointments',
  PRESCRIPTIONS: 'roshan_local_prescriptions',
  WISHLIST: 'roshan_local_wishlist',
  REVIEWS: 'roshan_local_reviews',
};

// Helper to get local data
const getLocal = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to set local data
const setLocal = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
};

// ============================================================================
// 1. PRODUCTS CRUD
// ============================================================================
export const fetchProducts = async (): Promise<EyewearProduct[]> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('price', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as EyewearProduct[];
      }
    } catch (err) {
      console.warn('Error fetching products from Supabase, falling back to static catalog:', err);
    }
  }
  return PRODUCTS;
};

export const fetchProductById = async (id: string): Promise<EyewearProduct | null> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as EyewearProduct;
      }
    } catch (err) {
      console.warn('Error fetching single product from Supabase:', err);
    }
  }
  return PRODUCTS.find((p) => p.id === id) || null;
};

// ============================================================================
// 2. ORDERS CRUD
// ============================================================================
export interface CreateOrderParams {
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    address: string;
    city: string;
    state?: string;
    pincode: string;
  };
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: string;
  prescriptionData?: PrescriptionData | null;
}

export const createOrder = async (params: CreateOrderParams): Promise<{ success: boolean; order: DbOrder | null; error?: string }> => {
  const orderNumber = `RCG-${Date.now().toString().slice(-6)}`;
  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newOrder: DbOrder = {
    id: orderId,
    order_number: orderNumber,
    user_id: params.userId || null,
    customer_name: params.customerName,
    customer_email: params.customerEmail,
    customer_phone: params.customerPhone,
    shipping_address: params.address,
    subtotal: params.subtotal,
    shipping_cost: params.shippingCost,
    discount: params.discount,
    total: params.total,
    payment_method: params.paymentMethod,
    payment_status: params.paymentMethod === 'cod' ? 'cod' : 'paid',
    order_status: 'crafting',
    prescription_data: params.prescriptionData || null,
    created_at: now,
  };

  const orderItems: DbOrderItem[] = params.cartItems.map((item, idx) => ({
    id: `item-${Date.now()}-${idx}`,
    order_id: orderId,
    product_id: item.product.id,
    product_name: item.product.name,
    product_sku: item.product.sku,
    selected_color: item.selectedColor,
    selected_lens: item.selectedLens,
    lens_price: item.lensPrice,
    item_price: item.product.price + item.lensPrice,
    quantity: item.quantity,
    image_url: item.product.colors[0]?.image || '',
    created_at: now,
  }));

  newOrder.items = orderItems;

  if (isSupabaseConfigured) {
    try {
      // 1. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: params.userId || null,
          customer_name: params.customerName,
          customer_email: params.customerEmail,
          customer_phone: params.customerPhone,
          shipping_address: params.address,
          subtotal: params.subtotal,
          shipping_cost: params.shippingCost,
          discount: params.discount,
          total: params.total,
          payment_method: params.paymentMethod,
          payment_status: newOrder.payment_status,
          order_status: newOrder.order_status,
          prescription_data: params.prescriptionData || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert items
      if (orderData && orderItems.length > 0) {
        const itemsToInsert = orderItems.map((it) => ({
          order_id: orderData.id,
          product_id: it.product_id,
          product_name: it.product_name,
          selected_color: it.selected_color,
          selected_lens: it.selected_lens,
          lens_price: it.lens_price,
          item_price: it.item_price,
          quantity: it.quantity,
          image_url: it.image_url,
        }));

        await supabase.from('order_items').insert(itemsToInsert);
      }

      return { success: true, order: { ...newOrder, id: orderData.id } };
    } catch (err: any) {
      console.warn('Supabase order insert error, using local fallback:', err);
    }
  }

  // Graceful local persistence
  const existingOrders = getLocal<DbOrder[]>(STORAGE_KEYS.ORDERS, []);
  setLocal(STORAGE_KEYS.ORDERS, [newOrder, ...existingOrders]);
  return { success: true, order: newOrder };
};

export const fetchUserOrders = async (userId?: string | null, email?: string): Promise<DbOrder[]> => {
  if (isSupabaseConfigured && (userId || email)) {
    try {
      let query = supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      } else if (email) {
        query = query.eq('customer_email', email);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as DbOrder[];
      }
    } catch (err) {
      console.warn('Error fetching orders from Supabase:', err);
    }
  }

  const localOrders = getLocal<DbOrder[]>(STORAGE_KEYS.ORDERS, []);
  if (userId) {
    return localOrders.filter((o) => o.user_id === userId);
  }
  if (email) {
    return localOrders.filter((o) => o.customer_email.toLowerCase() === email.toLowerCase());
  }
  return localOrders;
};

// ============================================================================
// 3. EYE TEST APPOINTMENTS CRUD
// ============================================================================
export interface BookAppointmentParams {
  userId?: string | null;
  patientName: string;
  phone: string;
  email?: string;
  clinicBranch: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export const bookEyeTest = async (params: BookAppointmentParams): Promise<{ success: boolean; appointment: DbEyeTestAppointment | null; error?: string }> => {
  const appointmentId = `apt-${Date.now()}`;
  const now = new Date().toISOString();

  const appointment: DbEyeTestAppointment = {
    id: appointmentId,
    user_id: params.userId || null,
    patient_name: params.patientName,
    phone: params.phone,
    email: params.email || '',
    clinic_branch: params.clinicBranch,
    service_type: params.serviceType,
    appointment_date: params.appointmentDate,
    appointment_time: params.appointmentTime,
    notes: params.notes || '',
    status: 'confirmed',
    created_at: now,
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('eye_test_appointments')
        .insert({
          user_id: params.userId || null,
          patient_name: params.patientName,
          phone: params.phone,
          email: params.email || '',
          clinic_branch: params.clinicBranch,
          service_type: params.serviceType,
          appointment_date: params.appointmentDate,
          appointment_time: params.appointmentTime,
          notes: params.notes || '',
          status: 'confirmed',
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, appointment: data as DbEyeTestAppointment };
    } catch (err: any) {
      console.warn('Supabase appointment insert error, using local fallback:', err);
    }
  }

  const existing = getLocal<DbEyeTestAppointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
  setLocal(STORAGE_KEYS.APPOINTMENTS, [appointment, ...existing]);
  return { success: true, appointment };
};

export const fetchUserAppointments = async (userId?: string | null, phone?: string): Promise<DbEyeTestAppointment[]> => {
  if (isSupabaseConfigured && (userId || phone)) {
    try {
      let query = supabase.from('eye_test_appointments').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      } else if (phone) {
        query = query.eq('phone', phone);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as DbEyeTestAppointment[];
      }
    } catch (err) {
      console.warn('Error fetching appointments from Supabase:', err);
    }
  }

  const local = getLocal<DbEyeTestAppointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
  if (userId) return local.filter((a) => a.user_id === userId);
  if (phone) return local.filter((a) => a.phone === phone);
  return local;
};

// ============================================================================
// 4. PRESCRIPTIONS CRUD
// ============================================================================
export interface SavePrescriptionParams {
  userId?: string | null;
  patientName: string;
  data: PrescriptionData;
}

export const savePrescription = async (params: SavePrescriptionParams): Promise<{ success: boolean; prescription: DbPrescription | null }> => {
  const id = `rx-${Date.now()}`;
  const now = new Date().toISOString();

  const record: DbPrescription = {
    id,
    user_id: params.userId || null,
    patient_name: params.patientName,
    method: params.data.method,
    file_name: params.data.fileName,
    right_sphere: params.data.rightEye.sph,
    right_cylinder: params.data.rightEye.cyl,
    right_axis: params.data.rightEye.axis,
    right_add: params.data.rightEye.add,
    left_sphere: params.data.leftEye.sph,
    left_cylinder: params.data.leftEye.cyl,
    left_axis: params.data.leftEye.axis,
    left_add: params.data.leftEye.add,
    pupillary_distance: params.data.pd,
    notes: params.data.notes,
    created_at: now,
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .insert({
          user_id: params.userId || null,
          patient_name: params.patientName,
          method: params.data.method,
          file_name: params.data.fileName || null,
          right_sphere: params.data.rightEye.sph,
          right_cylinder: params.data.rightEye.cyl,
          right_axis: params.data.rightEye.axis,
          right_add: params.data.rightEye.add || null,
          left_sphere: params.data.leftEye.sph,
          left_cylinder: params.data.leftEye.cyl,
          left_axis: params.data.leftEye.axis,
          left_add: params.data.leftEye.add || null,
          pupillary_distance: params.data.pd,
          notes: params.data.notes || null,
        })
        .select()
        .single();

      if (!error && data) {
        return { success: true, prescription: data as DbPrescription };
      }
    } catch (err) {
      console.warn('Supabase prescription error, using local fallback:', err);
    }
  }

  const existing = getLocal<DbPrescription[]>(STORAGE_KEYS.PRESCRIPTIONS, []);
  setLocal(STORAGE_KEYS.PRESCRIPTIONS, [record, ...existing]);
  return { success: true, prescription: record };
};

export const fetchUserPrescriptions = async (userId?: string | null): Promise<DbPrescription[]> => {
  if (isSupabaseConfigured && userId) {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as DbPrescription[];
      }
    } catch (err) {
      console.warn('Error fetching prescriptions from Supabase:', err);
    }
  }

  const local = getLocal<DbPrescription[]>(STORAGE_KEYS.PRESCRIPTIONS, []);
  return userId ? local.filter((p) => p.user_id === userId) : local;
};
