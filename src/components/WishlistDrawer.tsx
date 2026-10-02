import React from 'react';
import { X, Trash2, ShoppingBag, Eye, Heart } from 'lucide-react';
import { EyewearProduct } from '../types/optical';
import { FrameGraphic } from './FrameGraphic';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: EyewearProduct[];
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (product: EyewearProduct) => void;
  onOpenVirtualTryOn: (product: EyewearProduct) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onOpenVirtualTryOn,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#e01a76] fill-[#e01a76]" />
              <h2 className="text-sm font-bold font-display text-slate-900">
                Saved Silhouettes ({wishlistItems.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Heart className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">Your wishlist is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Tap the heart icon on any optical frame in the catalog to save it for comparison or home try-on.
                </p>
              </div>
            ) : (
              wishlistItems.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between gap-3"
                >
                  <div className="w-20 h-14 bg-slate-50 rounded-lg flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    {prod.image || prod.colors[0]?.image ? (
                      <img
                        src={prod.image || prod.colors[0]?.image}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <FrameGraphic shape={prod.shape} type={prod.customSvgType} colorHex={prod.colors[0].hex} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                    <p className="text-[11px] text-slate-500">{prod.shapeLabel}</p>
                    <span className="text-xs font-bold text-slate-900 font-display">
                      ₹{prod.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => onRemoveFromWishlist(prod.id)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenVirtualTryOn(prod)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        title="3D Virtual Try-On"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#e01a76]" />
                      </button>
                      <button
                        onClick={() => {
                          onAddToCart(prod);
                          onRemoveFromWishlist(prod.id);
                        }}
                        className="py-1 px-2 bg-[#e01a76] hover:bg-[#b7005d] text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
