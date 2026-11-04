export interface StoreAdvertisement {
  enabled: boolean;
  announcementText: string;
  promoCode: string;
  discountPercent: number;
  heroHeadline: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  bannerTag: string;
  bannerTheme: 'gold-onyx' | 'amber-gold' | 'emerald-luxury' | 'royal-indigo';
  bgImageUrl?: string;
  updatedAt: string;
}

export const DEFAULT_ADVERTISEMENT: StoreAdvertisement = {
  enabled: true,
  announcementText: '✨ ZEISS PRECISION OPTICS & BESPOKE TITANIUM ATELIER — DISCOVER NEW SEASON 2025',
  promoCode: '',
  discountPercent: 0,
  heroHeadline: 'ROSHAN CHASMA GHAR BESPOKE ATELIER',
  heroSubtitle: 'Discover lightweight Japanese beta-titanium, zero-aberration German precision optics, and bespoke frame styling handcrafted for your unique facial anatomy.',
  heroCtaText: 'Explore Eyewear Vitrine',
  heroCtaLink: 'catalog',
  bannerTag: 'ATELIER SPOTLIGHT',
  bannerTheme: 'gold-onyx',
  bgImageUrl: '',
  updatedAt: new Date().toISOString(),
};
