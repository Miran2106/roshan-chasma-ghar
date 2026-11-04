import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, MapPin } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { getStoreSettings, StoreSettings } from '../types/storeSettings';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenBookEyeTest: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBookEyeTest }) => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(getStoreSettings());

  useEffect(() => {
    const handleUpdate = () => setStoreSettings(getStoreSettings());
    window.addEventListener('store_settings_updated', handleUpdate);
    return () => window.removeEventListener('store_settings_updated', handleUpdate);
  }, []);
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 select-none">
      {/* Certified Dispensing Optical Center Trust Ribbon */}
      <div className="bg-[#fefce8] border-b border-yellow-200/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold font-display text-slate-900 block">
                Certified Dispensing Optical Center
              </span>
              <span className="text-[11px] text-slate-600">
                Authorized Partner for Zeiss Precision &amp; Essilor Varilux Lenses
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 bg-white rounded-lg border border-yellow-300/60 shadow-2xs">
              <span className="text-[11px] font-bold tracking-wider text-slate-800">
                ZEISS PARTNER
              </span>
            </div>
            <div className="px-4 py-1.5 bg-white rounded-lg border border-yellow-300/60 shadow-2xs">
              <span className="text-[11px] font-bold tracking-wider text-slate-800">
                ESSILOR EXPERT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo
              size="md"
              variant="light"
              onClick={() => onNavigate('home')}
            />
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              {storeSettings.tagline}
            </p>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                <span>{storeSettings.shortAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                <span>{storeSettings.workingHours} ({storeSettings.sundayHours})</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 font-display">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-yellow-600 transition-colors">
                  Designer Eyeglasses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-yellow-600 transition-colors">
                  Polarized Sunglasses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-yellow-600 transition-colors">
                  Kids Optical Frames
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('clinic')} className="hover:text-yellow-600 transition-colors">
                  Computer Vision Testing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-yellow-600 transition-colors">
                  Blue-Light Blocking Lenses
                </button>
              </li>
            </ul>
          </div>

          {/* Care & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 font-display">
              Care &amp; Support
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button onClick={onOpenBookEyeTest} className="hover:text-yellow-600 transition-colors">
                  Book Clinic Appointment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('clinic')} className="hover:text-yellow-600 transition-colors">
                  Prescription Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-yellow-600 transition-colors">
                  Lens Replacement Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-yellow-600 transition-colors">
                  Warranty &amp; Repairs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-yellow-600 transition-colors">
                  Store Locations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-yellow-600 hover:underline font-bold transition-colors flex items-center gap-1">
                  <span>Store Admin Console</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded font-normal">Admin Only</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 mt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2025 ROSHAN CHASMA GHAR. All rights reserved. Precision Optics &amp; Eyewear Atelier.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Optical Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
