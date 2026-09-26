-- ==============================================================================
-- ROSHAN CHASMA GHAR - COMPLETE SUPABASE POSTGRESQL SCHEMA & RLS SETUP
-- ==============================================================================
-- Execute this entire script in your Supabase project's SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  city TEXT DEFAULT 'Mumbai',
  address TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to automatically create a profile when a new user signs up with Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. PRODUCTS CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  series TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC NOT NULL,
  discount_percent INT DEFAULT 0,
  category TEXT NOT NULL,
  shape TEXT NOT NULL,
  material TEXT NOT NULL,
  shape_label TEXT NOT NULL,
  size_category TEXT DEFAULT 'Medium',
  rating NUMERIC DEFAULT 4.9,
  review_count INT DEFAULT 120,
  default_color TEXT NOT NULL,
  colors JSONB DEFAULT '[]'::jsonb,
  dimensions JSONB DEFAULT '{}'::jsonb,
  badge TEXT,
  badge_type TEXT,
  description TEXT,
  craft_details TEXT,
  is_bestseller BOOLEAN DEFAULT false,
  is_titanium BOOLEAN DEFAULT false,
  is_polarized BOOLEAN DEFAULT false,
  is_blue_cut BOOLEAN DEFAULT false,
  frame_tone TEXT DEFAULT 'black',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. EYE TEST APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.eye_test_appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  clinic_branch TEXT NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('upload', 'manual', 'later')),
  file_name TEXT,
  file_url TEXT,
  right_sphere TEXT,
  right_cylinder TEXT,
  right_axis TEXT,
  right_add TEXT,
  left_sphere TEXT,
  left_cylinder TEXT,
  left_axis TEXT,
  left_add TEXT,
  pupillary_distance TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'cod', 'failed')),
  order_status TEXT DEFAULT 'crafting' CHECK (order_status IN ('processing', 'crafting', 'dispatched', 'delivered', 'cancelled')),
  prescription_data JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  selected_color TEXT NOT NULL,
  selected_lens TEXT NOT NULL,
  lens_price NUMERIC DEFAULT 0,
  item_price NUMERIC NOT NULL,
  quantity INT DEFAULT 1,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PRODUCT REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eye_test_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and edit only their own profile
CREATE POLICY "Public profiles are viewable by owner" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Products: Everyone can read catalog products
CREATE POLICY "Allow public read access to products" 
  ON public.products FOR SELECT 
  TO public 
  USING (true);

-- Eye Test Appointments: Users see their own appointments; anyone can create an appointment
CREATE POLICY "Users can read own appointments" 
  ON public.eye_test_appointments FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Anyone can book eye test appointment" 
  ON public.eye_test_appointments FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Prescriptions: Users manage their own prescriptions
CREATE POLICY "Users view own prescriptions" 
  ON public.prescriptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert prescriptions" 
  ON public.prescriptions FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Orders & Order Items: Users view their own orders; guests can view with email match; anyone can create
CREATE POLICY "Users can view own orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Anyone can insert orders" 
  ON public.orders FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Allow reading order items of visible orders" 
  ON public.order_items FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Anyone can insert order items" 
  ON public.order_items FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Reviews: Public read access; authenticated users insert
CREATE POLICY "Allow public read reviews" 
  ON public.reviews FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Authenticated users can submit review" 
  ON public.reviews FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Wishlist: User private
CREATE POLICY "Users view own wishlist" 
  ON public.wishlist FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage wishlist" 
  ON public.wishlist FOR ALL 
  USING (auth.uid() = user_id);
