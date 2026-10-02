import React, { useState } from 'react';
import { ShieldCheck, Clock, Check, ArrowRight, Glasses } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenBookEyeTest: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBookEyeTest }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 select-none">
      {/* Certified Dispensing Optical Center Trust Ribbon */}
      <div className="bg-[#f6f2fa] border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-[#e01a76] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold font-display text-slate-900 block">
                Certified Dispensing Optical Center
              </span>
              <span className="text-[11px] text-slate-500">
                Authorized Partner for Zeiss Precision &amp; Essilor Varilux Lenses
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold tracking-wider text-slate-700">
                ZEISS PARTNER
              </span>
            </div>
            <div className="px-4 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold tracking-wider text-slate-700">
                ESSILOR EXPERT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo
              size="md"
              variant="light"
              onClick={() => onNavigate('home')}
            />
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Pioneering vision care and optical craftsmanship since 1982. From bespoke acetate silhouettes to computerized zero-error eye testing.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-[#e01a76]" />
              <span>Mon – Sat: 10:00 AM – 9:00 PM (Sundays Open for Urgent Screenings)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 font-display">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#e01a76] transition-colors">
                  Designer Eyeglasses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#e01a76] transition-colors">
                  Polarized Sunglasses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#e01a76] transition-colors">
                  Kids Optical Frames
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('clinic')} className="hover:text-[#e01a76] transition-colors">
                  Computer Vision Testing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('offers')} className="hover:text-[#e01a76] transition-colors">
                  Seasonal Promotions
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
                <button onClick={onOpenBookEyeTest} className="hover:text-[#e01a76] transition-colors">
                  Book Clinic Appointment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('clinic')} className="hover:text-[#e01a76] transition-colors">
                  Prescription Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#e01a76] transition-colors">
                  Lens Replacement Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#e01a76] transition-colors">
                  Warranty &amp; Repairs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#e01a76] transition-colors">
                  Store Locations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-[#e01a76] hover:underline font-bold transition-colors">
                  Store Admin Console
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-display">
              Newsletter
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Receive exclusive private-sale invitations, optical insights, and lens upgrade perks.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#e01a76] focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-2xs"
              >
                {subscribed ? 'Subscribed!' : 'SUBSCRIBE'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 mt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2025 ROSHAN CHASMA GHAR. All rights reserved. Precision Optics &amp; Eyewear Atelier.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Medical Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
