export type FrameShape = 'round' | 'square' | 'aviator' | 'cat-eye' | 'pantoscopic' | 'geometric';

export type FrameMaterial = 
  | 'Handmade Acetate' 
  | 'Pure Feather Titanium' 
  | 'Surgical Stainless Steel' 
  | 'Ultem Flexible Memory';

export type FrameCategory = 
  | 'all' 
  | 'eyeglasses' 
  | 'sunglasses' 
  | 'blue-light' 
  | 'kids' 
  | 'rimless';

export type LensOpticalType = 
  | 'zero-power' 
  | 'single-vision' 
  | 'zeiss-progressive';

export interface ProductDimensions {
  lensWidth: number;
  bridge: number;
  temple: number;
  weight: string;
}

export interface FrameColorway {
  name: string;
  hex: string;
  image?: string;
}

export interface EyewearProduct {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  series: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  category: FrameCategory;
  shape: FrameShape;
  material: FrameMaterial;
  shapeLabel: string;
  sizeCategory: 'Narrow' | 'Medium' | 'Regular' | 'Wide' | 'Petite';
  dimensions: ProductDimensions;
  rating: number;
  reviewCount: number;
  colors: FrameColorway[];
  defaultColor: string;
  badge?: string;
  badgeType?: 'gold' | 'pink' | 'dark' | 'lavender';
  description: string;
  craftDetails: string;
  isBestseller?: boolean;
  isTitanium?: boolean;
  isPolarized?: boolean;
  isBlueCut?: boolean;
  frameTone: 'black' | 'brown' | 'gold' | 'silver' | 'blue' | 'crystal';
  customSvgType?: string;
}

export interface LensOption {
  id: LensOpticalType;
  title: string;
  subtitle: string;
  additionalPrice: number;
  badge?: string;
}

export interface CartItem {
  cartId: string;
  product: EyewearProduct;
  selectedColor: string;
  selectedLens: LensOpticalType;
  lensPrice: number;
  quantity: number;
  customPrescription?: PrescriptionData;
}

export interface PrescriptionData {
  method: 'upload' | 'manual' | 'later';
  fileName?: string;
  rightEye: {
    sph: string;
    cyl: string;
    axis: string;
    add?: string;
  };
  leftEye: {
    sph: string;
    cyl: string;
    axis: string;
    add?: string;
  };
  pd: string; // Pupillary distance e.g. 63
  notes?: string;
}

export interface ClinicAppointment {
  fullName: string;
  phoneNumber: string;
  clinicBranch: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageIcon: string;
  description: string;
}
