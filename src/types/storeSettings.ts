export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  shortAddress: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  workingHours: string;
  sundayHours: string;
  googleMapsEmbedUrl?: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'ROSHAN CHASMA GHAR',
  tagline: 'Certified Dispensing Optical Center & Precision Eyewear Atelier (Est. 1982)',
  address: 'Roshan Chasma Ghar Flagship Atelier, 42 Heritage Optical Promenade, Near Clock Tower Circle, South Mumbai, Maharashtra 400001',
  shortAddress: '42 Heritage Optical Promenade, Near Clock Tower Circle, Mumbai 400001',
  landmark: 'Opposite Historic Clock Tower Square, Central Promenade Precinct',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  phone: '+91 98200 12345',
  whatsapp: '+91 98200 12345',
  email: 'miran.mithawala99@gmail.com',
  workingHours: 'Mon – Sat: 10:00 AM – 9:00 PM',
  sundayHours: 'Sundays: 11:00 AM – 6:00 PM (Clinical Urgent Screenings)',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.842749539304!2d72.8291417!3d18.9329737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1e70498b959%3A0xe98b61c925d576a8!2sFlora%20Fountain%2C%20Hutatma%20Chowk%2C%20Fort%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
};

const STORAGE_KEY = 'roshan_store_settings_v2';

export const getStoreSettings = (): StoreSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed reading store settings from localStorage', e);
  }
  return DEFAULT_STORE_SETTINGS;
};

export const saveStoreSettings = (settings: StoreSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('store_settings_updated'));
  } catch (e) {
    console.error('Failed saving store settings to localStorage', e);
  }
};
