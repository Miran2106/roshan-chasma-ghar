import React, { useState } from 'react';
import {
  ArrowRight,
  Shield,
  Eye,
  Sparkles,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
} from 'lucide-react';
import { EyewearProduct } from '../types/optical';
import { FrameGraphic } from '../components/FrameGraphic';
import {
  HERO_IMAGE,
  PRISM_IMAGE,
  TITANIUM_HERO_IMAGE,
  CLINIC_IMAGE,
  BRAND_LOGO_IMAGE,
  TESTIMONIALS,
} from '../data/products';

interface HomePageProps {
  products: EyewearProduct[];
  onNavigate: (page: string, productId?: string) => void;
  onOpenBookEyeTest: () => void;
  onQuickView: (product: EyewearProduct) => void;
  onOpenVirtualTryOn: (product: EyewearProduct) => void;
  onToggleWishlist: (product: EyewearProduct) => void;
  wishlistIds: string[];
  onAddToCart: (product: EyewearProduct) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onNavigate,
  onOpenBookEyeTest,
  onQuickView,
  onOpenVirtualTryOn,
  onToggleWishlist,
  wishlistIds,
  onAddToCart,
}) => {
  const [activeEdition, setActiveEdition] = useState(0);
  const [callRequestSent, setCallRequestSent] = useState(false);
  const [callForm, setCallForm] = useState({
    name: '',
    phone: '',
    service: 'Comprehensive Eye Test',
    time: 'Tomorrow 4 PM',
  });

  const featuredFrames = products.slice(0, 8);

  const heroEditions = [
    {
      kicker: 'NEW SEASON 2025 · PRECISION OPTICS',
      title: 'WELCOME TO ROSHAN CHASMA GHAR',
      subtitle:
        'Discover lightweight contemporary silhouettes, zero-aberration German optical lenses, and bespoke frame styling handcrafted for your unique facial anatomy.',
      image: HERO_IMAGE,
      badge: 'ZEISS DURAVISION® BlueProtect Coating',
    },
    {
      kicker: 'SABAE HANDMADE · JAPANESE BETA-TITANIUM',
      title: 'AURELIA SOVEREIGN COLLECTION',
      subtitle:
        'Aeronautical grade titanium balanced to an imperceptible 14.2 grams with 24-karat ion-plated temple accents.',
      image: TITANIUM_HERO_IMAGE,
      badge: '100% Skin-Safe & Hypoallergenic',
    },
  ];

  const currentEdition = heroEditions[activeEdition];

  const handleCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCallRequestSent(true);
    setTimeout(() => setCallRequestSent(false), 6000);
    setCallForm({ name: '', phone: '', service: 'Comprehensive Eye Test', time: 'Tomorrow 4 PM' });
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ================= 1. HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-amber-400/40 p-0.5 shadow-sm shrink-0 overflow-hidden">
                <img
                  src={BRAND_LOGO_IMAGE}
                  alt="Roshan Chasma Ghar"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e01a76]">
                <span className="w-2 h-2 rounded-full bg-[#e01a76] animate-pulse" />
                <span>{currentEdition.kicker}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900 leading-[1.12] text-balance">
              WELCOME TO <br />
              <span className="text-slate-900">ROSHAN </span>
              <span className="text-[#e01a76]">CHASMA GHAR</span>
            </h1>

            <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-xl">
              {currentEdition.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('catalog')}
                className="py-3 px-6 bg-[#121217] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 group"
              >
                <span>SHOP EYEWEAR</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenBookEyeTest}
                className="py-3 px-6 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm hover:shadow text-center"
              >
                BOOK EYE TEST
              </button>
            </div>

            {/* Carousel Edition Controls */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setActiveEdition(activeEdition === 0 ? 1 : 0)}
                className="w-8 h-8 rounded-md border border-slate-200 hover:border-slate-400 bg-white flex items-center justify-center text-slate-600 transition-colors"
                aria-label="Previous edition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveEdition(activeEdition === 0 ? 1 : 0)}
                className="w-8 h-8 rounded-md bg-[#e01a76] hover:bg-[#b7005d] flex items-center justify-center text-white transition-colors"
                aria-label="Next edition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-medium text-slate-500">
                0{activeEdition + 1} / 0{heroEditions.length} EDITIONS
              </span>
            </div>
          </div>

          {/* Hero Right Showcase Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f6f2fa] shadow-xl border border-slate-200">
              <img
                src={currentEdition.image}
                alt="Roshan Chasma Ghar Optical Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Zeiss DuraVision Badge Top Right */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-[11px] font-bold tracking-tight text-slate-800">
                  {currentEdition.badge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. ABOUT OUR SHOP SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f6f2fa]/70 rounded-3xl p-6 sm:p-10 border border-slate-200">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black border border-amber-400/40 p-0.5 shadow-sm shrink-0 overflow-hidden">
                <img
                  src={BRAND_LOGO_IMAGE}
                  alt="Roshan Chasma Ghar"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display block">
                  CRAFTSMANSHIP &amp; SCIENCE
                </span>
                <span className="text-[10px] text-amber-600 font-bold tracking-wider uppercase">
                  ESTABLISHED 1982 · MUMBAI
                </span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              <span className="text-[#e01a76] text-5xl inline-block -mr-1">A</span>bout our shop
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Established in 1982 by Master Optician Roshanlal Chaurasia,{' '}
                <strong className="text-slate-900 font-semibold">Roshan Chasma Ghar</strong> has delivered optical
                precision to over three generations of discerning clients. We unite time-honored artisanal lens grinding with computerized corneal wavefront diagnostics.
              </p>
              <p>
                Every pair of spectacles dispensed from our atelier undergoes strict 21-point optical alignment,
                ensuring zero-stress binocular fusion, razor-sharp peripheral clarity, and lightweight ergonomic balance suited for modern digital lifestyles.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="py-2.5 px-5 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
              >
                <span>READ MORE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200">
                <Sparkles className="w-4 h-4 text-[#e01a76]" />
                <span className="text-xs font-bold text-slate-800">42+ YEARS LEGACY</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] w-full max-w-md shadow-lg border border-slate-200 bg-white">
              <img
                src={PRISM_IMAGE}
                alt="Optical Prism Light Spectrum"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. OUR GLASSES (FEATURED PRODUCT GRID) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#121217]" />
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900">
              Our Glasses
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Hand-finished acetate, aero-grade titanium, and everyday flexible memory polymer frames.
          </p>
        </div>

        {/* 8 Product Cards Grid (2 cols on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredFrames.map((prod) => {
            const isWishlisted = wishlistIds.includes(prod.id);
            return (
              <div
                key={prod.id}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
              >
                {/* Top Badge & Heart Wishlist */}
                <div className="p-2.5 sm:p-4 flex items-center justify-between z-10">
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[85px] sm:max-w-none ${
                      prod.badgeType === 'gold'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : prod.badgeType === 'pink'
                        ? 'bg-pink-100 text-[#e01a76]'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {prod.badge || prod.shapeLabel}
                  </span>

                  <button
                    onClick={() => onToggleWishlist(prod)}
                    className="p-1 sm:p-1.5 rounded-full text-slate-400 hover:text-[#e01a76] hover:bg-pink-50 transition-colors"
                    aria-label="Save to wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-[#e01a76] text-[#e01a76]' : ''}`} />
                  </button>
                </div>

                {/* Eyewear Photo or SVG Silhouette Display */}
                <div
                  onClick={() => onQuickView(prod)}
                  className="cursor-pointer px-2 sm:px-4 py-1 sm:py-2 aspect-[4/3] flex items-center justify-center overflow-hidden"
                >
                  {prod.image || prod.colors[0]?.image ? (
                    <img
                      src={prod.image || prod.colors[0]?.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <FrameGraphic
                      shape={prod.shape}
                      type={prod.customSvgType}
                      colorHex={prod.colors[0].hex}
                      className="w-full h-full"
                    />
                  )}
                </div>

                {/* Card Bottom Meta & Actions */}
                <div className="p-2.5 sm:p-4 pt-0 text-center space-y-1.5 sm:space-y-2">
                  <h3
                    onClick={() => onNavigate('product', prod.id)}
                    className="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer hover:text-[#e01a76] transition-colors truncate"
                  >
                    {prod.name}
                  </h3>

                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 font-display">
                      ₹{prod.price.toLocaleString()}
                    </span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                        ₹{prod.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="pt-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
                    <button
                      onClick={() => onOpenVirtualTryOn(prod)}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-[#e01a76]" />
                      <span>Try On</span>
                    </button>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="flex-1 py-1.5 px-2 sm:px-3 bg-[#e01a76] hover:bg-[#b7005d] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors shadow-2xs whitespace-nowrap"
                    >
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SEE MORE Action Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-2 py-3 px-8 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all"
          >
            <span>SEE MORE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ================= 4. THE ROSHAN ASSURANCE: PRECISION OPTOMETRY ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
            THE ROSHAN ASSURANCE
          </span>
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Precision Optometry Meets Curated Style
            </h2>
            <p className="text-xs text-slate-500 max-w-md">
              Unlike online bulk aggregators, our registered optometrists verify lens vertex distances, pupillary tilt, and frame aerodynamics in person.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 hover:border-[#e01a76]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#e01a76] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-display text-slate-900">German Wavefront Lab</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated edging and laser centration down to 0.1mm tolerance for zero optical distortion.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 hover:border-[#e01a76]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-display text-slate-900">14-Point Eye Testing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thorough computerized screening including corneal topography, intraocular pressure, and binocular fusion.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 hover:border-[#e01a76]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-display text-slate-900">Certified Optometrists</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consultations guided by fellowship-trained optometrists specializing in high cylindrical and progressive fits.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 hover:border-[#e01a76]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#e01a76] flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-display text-slate-900">Free Lifetime Care</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complimentary ultrasonic sanitizing, nose-pad upgrades, screw tightenings, and frame alignment whenever you visit.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 5. BEYOND PRESCRIPTION: COMPREHENSIVE DIGITAL EYE CARE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Clinic Photo & Guarantee Card */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-xl border border-slate-200">
              <img
                src={CLINIC_IMAGE}
                alt="Roshan Chasma Ghar Optometry Clinic"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Zero Error Guarantee Floating Card */}
            <div className="absolute -bottom-4 left-6 right-6 sm:right-auto sm:max-w-xs bg-white p-3.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-[#e01a76] flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Zero-Error Guarantee</span>
                <span className="text-[11px] text-slate-500">30-day adaptation promise on progressive lenses.</span>
              </div>
            </div>
          </div>

          {/* Right Clinical Details */}
          <div className="lg:col-span-6 space-y-4 pt-4 lg:pt-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
              THE CLINICAL STANDARD
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight leading-snug">
              Beyond Prescription: Comprehensive Digital Eye Care
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              A correct pair of glasses starts with clinical rigor. Our clinic features the latest automated keratometry and digital phoropter arrays to evaluate your visual acuity in low light, blue light glare, and variable work distances.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Screen Fatigue &amp; Digital Astigmatism</h4>
                  <p className="text-xs text-slate-500">Customized focal depths for developers, designers, and dual-monitor multi-taskers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Seamless Progressive Adaptation</h4>
                  <p className="text-xs text-slate-500">Ultra-wide reading corridors without swim effect or unnatural head tilting.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Kids Pediatric Optical Fitting</h4>
                  <p className="text-xs text-slate-500">Specialized impact-resistant TR90 frames engineered for growing bridges.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('clinic')}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#e01a76] hover:text-[#b7005d] uppercase tracking-wider"
              >
                <span>EXPLORE CLINICAL EQUIPMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. TESTIMONIALS: OUR CUSTOMERS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-extrabold font-display tracking-tight text-slate-900">
            <span className="text-[#e01a76]">O</span>ur Customers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Over 65,000 delighted eyes across four decades of precision vision care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400 text-xs">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-pink-100 text-[#e01a76] font-bold text-xs flex items-center justify-center font-display">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.role} · {t.tenure}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 7. REQUEST A CALL BACK & FLAGSHIP STORE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1b1b20] text-white rounded-3xl p-6 sm:p-10 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Call Back Form */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#e01a76] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#e01a76]" />
                <span>IMMEDIATE OPTOMETRIC SUPPORT</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                Request A Call Back
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                Need lens advice, prescription renewal, or doorstep trial assistance? Share your contact information and our senior optician will assist you within 30 minutes.
              </p>

              {callRequestSent ? (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Request received! Our optometrist will contact you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleCallSubmit} className="space-y-3 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={callForm.name}
                    onChange={(e) => setCallForm({ ...callForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#25252b] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#e01a76]"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={callForm.phone}
                      onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#25252b] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#e01a76]"
                    />

                    <select
                      value={callForm.service}
                      onChange={(e) => setCallForm({ ...callForm, service: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#25252b] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e01a76]"
                    >
                      <option value="Comprehensive Eye Test">Comprehensive Eye Test</option>
                      <option value="Prescription Lens Replacement">Prescription Lens Replacement</option>
                      <option value="Home Try-On Assistance">Home Try-On Assistance</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Preferred Time (e.g. Tomorrow 4 PM)"
                    value={callForm.time}
                    onChange={(e) => setCallForm({ ...callForm, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#25252b] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#e01a76]"
                  />

                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>SEND REQUEST</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Right: Visit Flagship Store */}
            <div className="lg:col-span-5 bg-[#25252b] p-6 rounded-2xl border border-slate-700/80 space-y-4">
              <h3 className="text-sm font-bold font-display text-white">Visit Our Flagship Store</h3>
              <p className="text-xs text-slate-400">
                Experience the complete catalog of 1,200+ designer frames and try on lenses under clinical daylight simulation.
              </p>

              <div className="space-y-3 text-xs text-slate-300 pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Roshan Chasma Ghar Flagship Atelier</strong>
                    <span>Main Market Optical Avenue, Opp. Clock Tower Square, Central Promenade, Landmark Optical Precinct 400001</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">+91 (0) 22 2490 8282</strong>
                    <span className="text-slate-400">Daily 10:00 AM – 9:00 PM (Sundays Open)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Instant WhatsApp Concierge</strong>
                    <span className="text-slate-400">Send photo of prescription for immediate price quote</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/912224908282"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/10"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CHAT WITH OPTICIAN ON WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
