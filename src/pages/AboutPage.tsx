import React from 'react';
import { ARTISAN_IMAGE, PRISM_IMAGE } from '../data/products';
import { Sparkles, Check, ArrowRight, Shield, Award } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  onOpenBookEyeTest: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenBookEyeTest }) => {
  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <section className="bg-[#f6f2fa] rounded-3xl p-8 sm:p-14 border border-slate-200">
        <div className="max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-4">
            <BrandLogo size="md" variant="light" />
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold text-[#e01a76] uppercase tracking-wider border border-slate-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ESTABLISHED 1982 · MUMBAI, INDIA</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-tight">
            Four Decades of Optical Honor &amp; Uncompromising Precision.
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            In 1982, Master Optician Roshanlal Chaurasia opened a modest workshop with a simple creed:
            &ldquo;An optical prescription is not a retail product; it is an intimate medical instrument that dictates how a human experiences the world.&rdquo;
          </p>
        </div>
      </section>

      {/* Story Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
            TIME-HONORED BENCHWORK
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 leading-snug">
            Where Japanese Beta-Titanium Meets Old-School Optical Calipers.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            While contemporary fast-fashion brands assemble cheap injection-molded plastics with loose tolerances, we continue to hand-inspect every hinge barrel, temple bend, and lens bevel.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our titanium is cold-rolled in Sabae, Japan; our organic cellulose acetate is cured in Castiglione Olona, Italy; and our ophthalmic lenses are edged in our certified cleanroom facility with computerized wavefront centration.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
              <Award className="w-5 h-5 text-[#e01a76]" />
              <h4 className="text-xs font-bold text-slate-900">42+ Years</h4>
              <p className="text-[11px] text-slate-500">Unbroken family optical legacy</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
              <Shield className="w-5 h-5 text-[#e01a76]" />
              <h4 className="text-xs font-bold text-slate-900">65,000+ Eyes</h4>
              <p className="text-[11px] text-slate-500">Corrected without distortion</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-md border border-slate-200">
            <img
              src={ARTISAN_IMAGE}
              alt="Roshan Chasma Ghar Workshop"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Prism Optics & Science */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#f6f2fa] border border-slate-200">
              <img
                src={PRISM_IMAGE}
                alt="Prism Light Spectrum Optics"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e01a76] font-display">
              AUTHORIZED LENS PARTNERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              Authorized Carl Zeiss &amp; Essilor Varilux Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We are an authorized dispensing partner for Carl Zeiss Precision Lenses and Essilor Varilux. We utilize proprietary computerized video centration to measure your individual pantoscopic tilt, corneal vertex distance, and frame wrap down to 0.1mm.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenBookEyeTest}
                className="py-3 px-6 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                BOOK YOUR CONSULTATION
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
