import React, { useState } from 'react';
import {
  Star,
  Check,
  Heart,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  Maximize2,
  HelpCircle,
  Clock,
  Glasses,
} from 'lucide-react';
import { EyewearProduct, LensOpticalType } from '../types/optical';
import { FrameGraphic } from '../components/FrameGraphic';
import { LENS_OPTIONS, ARTISAN_IMAGE } from '../data/products';

interface ProductDetailPageProps {
  product: EyewearProduct;
  allProducts: EyewearProduct[];
  onNavigate: (page: string, productId?: string) => void;
  onAddToCart: (product: EyewearProduct, color: string, lens: LensOpticalType) => void;
  onOpenVirtualTryOn: (product: EyewearProduct) => void;
  onToggleWishlist: (product: EyewearProduct) => void;
  isWishlisted: boolean;
  onOpenBookEyeTest: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onNavigate,
  onAddToCart,
  onOpenVirtualTryOn,
  onToggleWishlist,
  isWishlisted,
  onOpenBookEyeTest,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(product.defaultColor);
  const [selectedLens, setSelectedLens] = useState<LensOpticalType>('zero-power');
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'lenses' | 'care'>('overview');
  const [activeGalleryView, setActiveGalleryView] = useState<'front' | 'temple' | 'hinge' | 'face'>('front');
  const [showFaceFitModal, setShowFaceFitModal] = useState<boolean>(false);

  const activeColorObj = product.colors.find((c) => c.name === selectedColor) || product.colors[0];
  const lensObj = LENS_OPTIONS.find((l) => l.id === selectedLens) || LENS_OPTIONS[0];
  const finalPrice = product.price + lensObj.additionalPrice;
  const originalTotalPrice = product.originalPrice + lensObj.additionalPrice;

  // Frequently paired recommendation products
  const frequentlyPaired = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `Hello Roshan Chasma Ghar! I am interested in the ${product.name} (SKU: ${product.sku}) in ${selectedColor} finish with ${lensObj.title} lenses at ₹${finalPrice}. Can you assist with my prescription fitting?`
    );
    window.open(`https://wa.me/912224908282?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* ================= BREADCRUMBS & TOP BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => onNavigate('home')} className="hover:text-slate-900">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('catalog')} className="hover:text-slate-900">
            Eyewear
          </button>
          <span>/</span>
          <span className="text-slate-700">{product.series}</span>
          <span>/</span>
          <span className="font-semibold text-slate-900 truncate max-w-xs">{product.name}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            CERTIFIED ZEISS DISPENSING LAB
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">SKU: {product.sku}</span>
        </div>
      </div>

      {/* ================= MAIN PDP GRID (GALLERY LEFT, PURCHASE MODULE RIGHT) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-[#f6f2fa] rounded-3xl border border-slate-200 p-8 flex flex-col items-center justify-between min-h-[380px] sm:min-h-[440px] shadow-xs">
            {/* Top Badge */}
            <div className="w-full flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
                {product.badge || 'HANDCRAFTED BETA-TITANIUM'}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                Ultra-light {product.dimensions.weight}
              </span>
            </div>

            {/* Central Graphic / Perspective */}
            <div className="w-full max-w-md my-auto aspect-[16/9] flex items-center justify-center p-2">
              <FrameGraphic
                shape={product.shape}
                type={product.customSvgType}
                colorHex={activeColorObj.hex}
                className="w-full h-full filter drop-shadow-md"
              />
            </div>

            {/* 3D Virtual Try-On trigger inside photo viewport */}
            <div className="w-full flex items-center justify-between pt-4">
              <button
                onClick={() => onOpenVirtualTryOn(product)}
                className="py-2 px-4 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 transition-all hover:scale-102"
              >
                <Eye className="w-4 h-4 text-[#e01a76]" />
                <span>3D VIRTUAL TRY-ON</span>
              </button>

              <button
                onClick={() => onOpenVirtualTryOn(product)}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-sm"
                title="Expand Zoom"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 'front', label: 'FRONT' },
              { id: 'temple', label: 'TEMPLE' },
              { id: 'hinge', label: 'HINGE 5X' },
              { id: 'face', label: 'FACE FIT' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGalleryView(tab.id as any)}
                className={`p-3 rounded-xl border text-center transition-all bg-white flex flex-col items-center justify-center gap-1 ${
                  activeGalleryView === tab.id
                    ? 'border-[#e01a76] ring-1 ring-[#e01a76] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Glasses className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 font-display">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Precision Lab Banner */}
          <div className="bg-[#f0ecf4] p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e01a76] shrink-0" />
              <span>Precision robotic edging &amp; digital pupil alignment verified at our flagship clinic.</span>
            </div>
            <button
              onClick={() => onNavigate('clinic')}
              className="text-[11px] font-bold text-[#e01a76] uppercase tracking-wider hover:underline shrink-0 ml-2"
            >
              CLINIC STANDARDS
            </button>
          </div>
        </div>

        {/* Right Contiguous Purchase Module (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            {/* Kicker & Title */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#e01a76] font-display">
                  {product.series}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  JAPANESE ALLOY
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-800">{product.rating}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{product.reviewCount} Clinical Reviews</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 py-2 border-y border-slate-100">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                ₹{finalPrice.toLocaleString()}
              </span>
              <span className="text-sm text-slate-400 line-through">
                ₹{originalTotalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-[#e01a76] bg-pink-50 px-2.5 py-1 rounded-md">
                25% OFF LIMITED
              </span>
            </div>

            {/* Finish Selector */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider">
                  FINISH: <strong className="text-slate-900">{selectedColor}</strong>
                </span>
                <span className="text-slate-400 text-[11px]">Ion Plated (Anti-Corrosive)</span>
              </div>

              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                      selectedColor === color.name
                        ? 'ring-2 ring-offset-2 ring-[#e01a76] scale-110'
                        : 'border border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className={`w-4 h-4 ${color.hex === '#d4af37' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Proportions Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-800">FRAME PROPORTIONS</span>
                <button
                  onClick={() => setShowFaceFitModal(true)}
                  className="text-[11px] font-bold text-[#e01a76] hover:underline flex items-center gap-1"
                >
                  <Glasses className="w-3.5 h-3.5" />
                  <span>FACE FIT GUIDE</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">LENS WIDTH</span>
                  <span className="text-sm font-bold text-slate-900 font-display">{product.dimensions.lensWidth} mm</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">BRIDGE</span>
                  <span className="text-sm font-bold text-slate-900 font-display">{product.dimensions.bridge} mm</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">TEMPLE</span>
                  <span className="text-sm font-bold text-slate-900 font-display">{product.dimensions.temple} mm</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                Recommended for Medium &amp; Narrow facial geometries. Fitted with hypoallergenic silicone memory pads.
              </p>
            </div>

            {/* Lens Optical Selection Toggles */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2 font-display">
                LENS OPTICAL SELECTION
              </span>
              <div className="grid grid-cols-3 gap-2">
                {LENS_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedLens(opt.id)}
                    className={`p-3 text-center rounded-xl border text-xs font-semibold transition-all ${
                      selectedLens === opt.id
                        ? 'bg-[#e01a76] text-white border-[#e01a76] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt.id === 'zero-power' ? 'Zero-Power / Anti-Glare' : opt.id === 'single-vision' ? 'Prescription Single' : 'Zeiss Progressive'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart(product, selectedColor, selectedLens)}
                className="flex-1 py-3.5 px-4 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>ADD TO CART · ₹{finalPrice.toLocaleString()}</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'border-[#e01a76] bg-pink-50 text-[#e01a76]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#e01a76]' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleWhatsAppEnquiry}
              className="w-full py-3 px-4 bg-[#121217] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>ENQUIRE ON WHATSAPP</span>
            </button>

            {/* 3 Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-slate-600">
              <div className="space-y-0.5">
                <ShieldCheck className="w-4 h-4 text-[#e01a76] mx-auto" />
                <span className="text-[10px] font-bold text-slate-900 block">2-YEAR WARRANTY</span>
                <span className="text-[9px] text-slate-400">On frame &amp; hinge</span>
              </div>
              <div className="space-y-0.5">
                <RotateCcw className="w-4 h-4 text-[#e01a76] mx-auto" />
                <span className="text-[10px] font-bold text-slate-900 block">14-DAY EXCHANGE</span>
                <span className="text-[9px] text-slate-400">Doorstep pickup</span>
              </div>
              <div className="space-y-0.5">
                <Sparkles className="w-4 h-4 text-[#e01a76] mx-auto" />
                <span className="text-[10px] font-bold text-slate-900 block">FREE ULTRASONIC</span>
                <span className="text-[9px] text-slate-400">Lifetime clinic care</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABS: OVERVIEW & CRAFT, SPECS, LENS COMPATIBILITY ================= */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="flex border-b border-slate-200 gap-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'OVERVIEW & CRAFT' },
            { id: 'specs', label: 'TECHNICAL SPECIFICATIONS' },
            { id: 'lenses', label: 'LENS COMPATIBILITY' },
            { id: 'care', label: 'CARE & ULTRASONIC SPA' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 font-display ${
                activeTab === tab.id
                  ? 'border-[#e01a76] text-[#e01a76]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                SOVEREIGN ARCHITECTURE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 leading-snug">
                Engineered for weightless presence and all-day visual poise.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.craftDetails}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">Zero Nickel</strong>
                    <span className="text-[11px] text-slate-500">100% skin-safe &amp; hypoallergenic.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">50/50 Balance</strong>
                    <span className="text-[11px] text-slate-500">Even mass displacement along ear canal.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-md border border-slate-200">
                <img
                  src={ARTISAN_IMAGE}
                  alt="Roshan Chasma Ghar Master Optician"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl text-white text-xs flex items-center justify-between border border-white/10">
                <span>CERTIFIED DISPENSER CRAFT</span>
                <span className="text-[#f5c242] text-[11px]">Hand-calibrated at Roshan Chasma Ghar</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-2xl space-y-3 text-xs">
            <div className="grid grid-cols-2 py-2.5 border-b border-slate-100">
              <span className="text-slate-500">Frame Material:</span>
              <span className="font-semibold text-slate-900">{product.material}</span>
            </div>
            <div className="grid grid-cols-2 py-2.5 border-b border-slate-100">
              <span className="text-slate-500">Hinge Construction:</span>
              <span className="font-semibold text-slate-900">Custom 5-Barrel Monoblock German Silver</span>
            </div>
            <div className="grid grid-cols-2 py-2.5 border-b border-slate-100">
              <span className="text-slate-500">Nose Pad Grade:</span>
              <span className="font-semibold text-slate-900">Medical-Grade Hypoallergenic Silicone with Titanium Inset</span>
            </div>
            <div className="grid grid-cols-2 py-2.5 border-b border-slate-100">
              <span className="text-slate-500">Weight:</span>
              <span className="font-semibold text-slate-900">{product.dimensions.weight}</span>
            </div>
            <div className="grid grid-cols-2 py-2.5 border-b border-slate-100">
              <span className="text-slate-500">Origin Atelier:</span>
              <span className="font-semibold text-slate-900">Sabae Prefecture, Japan / Hand-calibrated in Mumbai</span>
            </div>
          </div>
        )}

        {activeTab === 'lenses' && (
          <div className="space-y-4 text-xs text-slate-600">
            <p>
              This silhouette accommodates all optical lens indexes from 1.50 to 1.74 Ultra-Thin, including high spherical cylinder prescriptions up to -10.00 Diopters and +6.00 Diopters.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">Single Vision</strong>
                <span>Optimized for reading or distance. Edged with 0.1mm optical center tolerance.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">Zeiss Progressive</strong>
                <span>Precision corridor mapping for multi-distance comfort without visual swim.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">PhotoFusion / Transition</strong>
                <span>Instantly darkens to Category 3 tint under direct UV sunlight.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-3 text-xs text-slate-600 max-w-2xl leading-relaxed">
            <p>
              Every pair of glasses purchased includes complimentary lifetime care at our optical clinic.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Free ultrasonic sonic-bath cleaning to remove dust and skin sebum.</li>
              <li>Free replacement of silicone nose pads and hinge screw retightening.</li>
              <li>Anatomical readjustment if your frame tilts or slides down the bridge.</li>
            </ul>
          </div>
        )}
      </section>

      {/* ================= FREQUENTLY PAIRED: OUR SIGNATURE GLASSES ================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e01a76] font-display">
              FREQUENTLY PAIRED
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Our Signature Glasses
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore curated complementary silhouettes from our contemporary optical vitrine, crafted with identical zero-tolerance precision.
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-[#e01a76] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>SEE MORE GLASSES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {frequentlyPaired.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {prod.badge || prod.shapeLabel}
                </span>
                <span className="text-[10px] text-slate-400">₹{prod.price}</span>
              </div>

              <div
                onClick={() => onNavigate('product', prod.id)}
                className="cursor-pointer aspect-[4/3] flex items-center justify-center p-2"
              >
                <FrameGraphic shape={prod.shape} type={prod.customSvgType} colorHex={prod.colors[0].hex} />
              </div>

              <div>
                <h4
                  onClick={() => onNavigate('product', prod.id)}
                  className="text-xs font-bold text-slate-900 hover:text-[#e01a76] cursor-pointer truncate"
                >
                  {prod.name}
                </h4>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-slate-900 font-display">₹{prod.price}</span>
                  <button
                    onClick={() => onNavigate('product', prod.id)}
                    className="py-1 px-3 bg-slate-900 hover:bg-[#e01a76] text-white text-[10px] font-bold rounded-lg transition-colors"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Face Fit Modal */}
      {showFaceFitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold font-display text-slate-900">
              Understanding Optical Frame Dimensions
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eyewear proportions are written as 3 numbers (e.g. <strong>49-20-145</strong>):
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li><strong>49 mm (Lens Width)</strong>: Horizontal diameter of each lens at its widest point.</li>
              <li><strong>20 mm (Bridge Width)</strong>: Distance between the two lenses across your nasal crest.</li>
              <li><strong>145 mm (Temple Length)</strong>: Length of the arm from hinge to behind the ear bend.</li>
            </ul>
            <p className="text-[11px] text-slate-400">
              You can check the inner left temple of your existing well-fitting glasses to verify your measurements.
            </p>
            <button
              onClick={() => setShowFaceFitModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
