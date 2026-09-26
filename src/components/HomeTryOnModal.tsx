import React, { useState } from 'react';
import { X, Check, Truck, ShieldCheck, HelpCircle, Package, ArrowRight, Sparkles } from 'lucide-react';
import { EyewearProduct } from '../types/optical';
import { FrameGraphic } from './FrameGraphic';

interface HomeTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableProducts: EyewearProduct[];
}

export const HomeTryOnModal: React.FC<HomeTryOnModalProps> = ({
  isOpen,
  onClose,
  availableProducts,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'aurelia-titanium-round',
    'aero-black-pantos',
    'havana-bold-square',
    'roshan-geometry-04',
  ]);

  const [step, setStep] = useState<'select' | 'address' | 'confirmed'>('select');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    pincode: '400001',
    address: '',
  });

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedProducts = availableProducts.filter((p) => selectedIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#121217] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#e01a76] uppercase tracking-wider mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>Home Try-On Experience</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Try 4 Frames At Home Free — Zero Deposit
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Pick 4 silhouettes. We dispatch your boutique try-on case with a complimentary PD measurement ruler.
          </p>
        </div>

        {/* Content based on step */}
        {step === 'select' && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">
                Selected: <span className="text-[#e01a76]">{selectedIds.length} of 4 Frames</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Tap a frame to add or swap
              </span>
            </div>

            {/* Selected preview bar */}
            <div className="grid grid-cols-4 gap-2 py-1">
              {[0, 1, 2, 3].map((slotIdx) => {
                const prod = selectedProducts[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className={`h-24 rounded-xl border flex flex-col items-center justify-center p-2 relative ${
                      prod ? 'bg-pink-50/30 border-[#e01a76]' : 'border-dashed border-slate-200 bg-slate-50'
                    }`}
                  >
                    {prod ? (
                      <>
                        <button
                          onClick={() => toggleSelect(prod.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-200 hover:bg-red-500 hover:text-white text-slate-600 text-[10px] flex items-center justify-center transition-colors"
                        >
                          ✕
                        </button>
                        <div className="w-full h-12 flex items-center justify-center">
                          <FrameGraphic shape={prod.shape} type={prod.customSvgType} colorHex={prod.colors[0].hex} />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-800 truncate w-full text-center mt-1">
                          {prod.name.split(' ')[0]}
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Slot #{slotIdx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* List to choose from */}
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-700 block mb-2">Available For Home Dispatch</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {availableProducts.slice(0, 10).map((prod) => {
                  const isSelected = selectedIds.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => toggleSelect(prod.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#e01a76] bg-pink-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-10 h-8 flex items-center justify-center bg-slate-50 rounded shrink-0">
                          <FrameGraphic shape={prod.shape} type={prod.customSvgType} colorHex={prod.colors[0].hex} />
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-semibold text-slate-900 block truncate">{prod.name}</span>
                          <span className="text-[10px] text-slate-500">{prod.shapeLabel} · ₹{prod.price}</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-2 ${
                          isSelected ? 'bg-[#e01a76] text-white' : 'border border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3">
              <button
                disabled={selectedIds.length === 0}
                onClick={() => setStep('address')}
                className="w-full py-3.5 bg-[#e01a76] hover:bg-[#b7005d] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue To Shipping Address ({selectedIds.length}/4)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'address' && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900">Doorstep Delivery Details</h3>
            <p className="text-xs text-slate-500">
              No credit card required. Our courier will drop off your 4-frame case and return in 3 days for pickup.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roshan Patel"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Complete Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Flat/House No., Street, Landmark, City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep('select')}
                className="py-3 px-4 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => setStep('confirmed')}
                className="flex-1 py-3 px-4 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-semibold rounded-xl shadow-md"
              >
                Confirm Dispatch & Order Free Kit
              </button>
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900">
              Home Try-On Kit Dispatched!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your 4 frames and complimentary PD ruler are being packaged in our optical laboratory. Estimated delivery is within 24-48 hours.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-sm mx-auto text-xs text-slate-600">
              <span>Includes 3-day home trial, sanitized frames, and video optician consultation if needed.</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
