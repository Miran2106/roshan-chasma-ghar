import React, { useState } from 'react';
import { X, Check, Star, Shield, ArrowRight, Eye } from 'lucide-react';
import { EyewearProduct, LensOpticalType } from '../types/optical';
import { FrameGraphic } from './FrameGraphic';
import { LENS_OPTIONS } from '../data/products';

interface QuickViewModalProps {
  product: EyewearProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: EyewearProduct, color: string, lens: LensOpticalType) => void;
  onOpenVirtualTryOn: (product: EyewearProduct) => void;
  onViewProductDetail: (product: EyewearProduct) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onOpenVirtualTryOn,
  onViewProductDetail,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedLens, setSelectedLens] = useState<LensOpticalType>('zero-power');

  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.defaultColor);
      setSelectedLens('zero-power');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const activeColorObj = product.colors.find((c) => c.name === selectedColor) || product.colors[0];
  const lensObj = LENS_OPTIONS.find((l) => l.id === selectedLens) || LENS_OPTIONS[0];
  const totalPrice = product.price + lensObj.additionalPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Visual Frame Showcase */}
        <div className="md:w-1/2 bg-[#f6f2fa] p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-200">
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e01a76] bg-pink-100/60 px-2.5 py-1 rounded-full">
              {product.badge || product.series}
            </span>
            <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
          </div>

          <div className="my-8 w-full max-w-xs aspect-[4/3] flex items-center justify-center overflow-hidden">
            {activeColorObj.image || product.image ? (
              <img
                src={activeColorObj.image || product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <FrameGraphic
                shape={product.shape}
                type={product.customSvgType}
                colorHex={activeColorObj.hex}
                className="w-full h-full"
              />
            )}
          </div>

          <div className="w-full space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenVirtualTryOn(product);
              }}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#e01a76]" />
              <span>Launch 3D Virtual Try-On</span>
            </button>
          </div>
        </div>

        {/* Right: Specs & Actions */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex text-amber-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {product.rating} ({product.reviewCount} verified reviews)
              </span>
            </div>

            <h2 className="text-xl font-bold font-display text-slate-900 leading-snug">
              {product.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {product.shapeLabel} · {product.material} · Weight: {product.dimensions.weight}
            </p>

            <div className="flex items-baseline gap-2.5 mt-3 pb-3 border-b border-slate-100">
              <span className="text-2xl font-bold text-slate-900 font-display">
                ₹{totalPrice.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₹{(product.originalPrice + lensObj.additionalPrice).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-[#e01a76] bg-pink-50 px-2 py-0.5 rounded-md">
                SAVE {product.discountPercent}%
              </span>
            </div>

            {/* Colors */}
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                Color Finish: <strong className="text-slate-900">{selectedColor}</strong>
              </span>
              <div className="flex items-center gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                      selectedColor === color.name
                        ? 'ring-2 ring-offset-2 ring-[#e01a76] scale-105'
                        : 'border border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className={`w-3.5 h-3.5 ${color.hex === '#d4af37' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Dimensions */}
            <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Lens Width</span>
                  <span className="font-bold text-slate-800">{product.dimensions.lensWidth} mm</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Bridge</span>
                  <span className="font-bold text-slate-800">{product.dimensions.bridge} mm</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Temple</span>
                  <span className="font-bold text-slate-800">{product.dimensions.temple} mm</span>
                </div>
              </div>
            </div>

            {/* Lens Option selector */}
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-700 block mb-2">Lens Optical Surfacing</span>
              <div className="space-y-1.5">
                {LENS_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setSelectedLens(opt.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-xs ${
                      selectedLens === opt.id
                        ? 'border-[#e01a76] bg-pink-50/40 text-slate-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedLens === opt.id ? 'border-[#e01a76] bg-[#e01a76]' : 'border-slate-300'
                        }`}
                      >
                        {selectedLens === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span>{opt.title}</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {opt.additionalPrice === 0 ? 'Included' : `+₹${opt.additionalPrice}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onAddToCart(product, selectedColor, selectedLens);
                onClose();
              }}
              className="w-full py-3 bg-[#e01a76] hover:bg-[#b7005d] text-white font-semibold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>Add To Optical Bag · ₹{totalPrice.toLocaleString()}</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onViewProductDetail(product);
              }}
              className="w-full py-2 text-center text-xs text-slate-600 hover:text-[#e01a76] font-medium flex items-center justify-center gap-1"
            >
              <span>View Full Technical Specifications & Craft Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
