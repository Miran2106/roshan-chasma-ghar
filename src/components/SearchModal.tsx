import React, { useState } from 'react';
import { Search, X, ArrowRight, Eye } from 'lucide-react';
import { EyewearProduct } from '../types/optical';
import { FrameGraphic } from './FrameGraphic';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: EyewearProduct[];
  onSelectProduct: (product: EyewearProduct) => void;
  onOpenVirtualTryOn: (product: EyewearProduct) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onOpenVirtualTryOn,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.material.toLowerCase().includes(query.toLowerCase()) ||
          p.shape.toLowerCase().includes(query.toLowerCase()) ||
          p.shapeLabel.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-6 sm:p-4 sm:pt-20 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search shape (round, aviator), material (titanium, acetate), code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-slate-400 hover:text-slate-600">
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
            {query.trim() ? `Search Results (${filtered.length})` : 'Popular Optical Silhouettes'}
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching optical frames found for &quot;{query}&quot;. Try searching &quot;titanium&quot;, &quot;round&quot;, or &quot;blue cut&quot;.
            </div>
          ) : (
            filtered.map((prod) => (
              <div
                key={prod.id}
                className="group p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between transition-all"
              >
                <div
                  onClick={() => {
                    onSelectProduct(prod);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <div className="w-16 h-12 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1 shrink-0">
                    <FrameGraphic shape={prod.shape} type={prod.customSvgType} colorHex={prod.colors[0].hex} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#e01a76] transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {prod.shapeLabel} · {prod.material} · <span className="font-semibold text-slate-800">₹{prod.price}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenVirtualTryOn(prod);
                    }}
                    className="p-2 text-slate-400 hover:text-[#e01a76] hover:bg-pink-50 rounded-lg transition-colors"
                    title="3D Virtual Try-On"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="p-2 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
