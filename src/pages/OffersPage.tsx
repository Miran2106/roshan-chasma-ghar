import React from 'react';
import { Tag, Sparkles, Check, ArrowRight, Truck, Gift } from 'lucide-react';

interface OffersPageProps {
  onNavigate: (page: string) => void;
  onOpenHomeTryOn: () => void;
  onOpenBookEyeTest: () => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  onNavigate,
  onOpenHomeTryOn,
  onOpenBookEyeTest,
}) => {
  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#e01a76] font-display">
          ATELIER PROMOTIONS &amp; PERKS
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
          Special Optical Privileges
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Experience premium Zeiss precision lenses and Japanese beta-titanium with curated atelier privileges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Offer 1: Free Home Try-On */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e01a76] bg-pink-50 px-2.5 py-1 rounded-full">
              POPULAR COMPLIMENTARY TRIAL
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Try 4 Frames At Home Free — Zero Deposit
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Order your curated tray of 4 frames. Try them with your outfits and family members over 3 days. Return courier is 100% complimentary with no credit card hold.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">100% Free Doorstep Delivery</span>
            <button
              onClick={onOpenHomeTryOn}
              className="py-2.5 px-4 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-2xs"
            >
              Order Try-On Kit
            </button>
          </div>
        </div>

        {/* Offer 2: Second Pair 40% Off */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              BUNDLE PRIVILEGE
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              40% Off Any Second Frame or Polarized Sunglasses
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pair your everyday clear computer glasses with a second dedicated prescription sunglasses frame or reading backup pair at 40% off the second frame value.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Applies Automatically in Bag</span>
            <button
              onClick={() => onNavigate('catalog')}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Shop Catalog
            </button>
          </div>
        </div>

        {/* Offer 3: Complimentary Eye Exam */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              HEALTH FIRST
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Complimentary 14-Point Digital Eye Exam
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Book a full computerized corneal topography and wavefront aberrometry exam at our flagship clinic with zero consultation charge when purchasing any frame.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Value ₹850 · Complimentary</span>
            <button
              onClick={onOpenBookEyeTest}
              className="py-2.5 px-4 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-2xs"
            >
              Book Examination
            </button>
          </div>
        </div>

        {/* Offer 4: Zeiss BlueProtect Surfacing Upgrade */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
              ZEISS LAB PARTNER
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Free Hydrophobic Oleophobic Coating Upgrade
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get an automatic upgrade to 9-layer vacuum-deposited hydrophobic and oleophobic anti-smudge barrier with every progressive or high-index 1.67 lens order.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Lifetime Smudge Warranty</span>
            <button
              onClick={() => onNavigate('catalog')}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              View Lenses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
