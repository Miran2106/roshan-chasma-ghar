import React from 'react';
import { Eye, ShieldCheck, Sparkles, CheckCircle, Clock, Calendar, ArrowRight } from 'lucide-react';
import { CLINIC_IMAGE } from '../data/products';

interface ClinicPageProps {
  onOpenBookEyeTest: () => void;
  onNavigate: (page: string) => void;
}

export const ClinicPage: React.FC<ClinicPageProps> = ({ onOpenBookEyeTest, onNavigate }) => {
  const testingSteps = [
    { num: '01', title: 'Computerized Autorefraction', desc: 'Sub-diopter automated refractive power measurement.' },
    { num: '02', title: 'Wavefront Aberrometry', desc: 'Higher-order optical aberrations and night glare mapping.' },
    { num: '03', title: 'Non-Contact Tonometry', desc: 'Painless intraocular fluid pressure check for glaucoma safety.' },
    { num: '04', title: 'Corneal Topography', desc: 'Precision 3D mapping of the anterior corneal curvature.' },
    { num: '05', title: 'Digital Phoropter Refinement', desc: 'Subjective dial-in of axis, cylinder, and sphere comfort.' },
    { num: '06', title: 'Binocular Fusion & Stereopsis', desc: 'Verifying that both eyes focus collaboratively without strain.' },
    { num: '07', title: 'Digital Astigmatism Screening', desc: 'Customized focal depths for developers & screen multi-taskers.' },
    { num: '08', title: 'Pupillary Height & Vertex Tilt', desc: 'Microscopic distance alignment for progressive corridor lenses.' },
  ];

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Clinic Hero */}
      <section className="bg-[#f0ecf4]/60 rounded-3xl p-8 sm:p-12 border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e01a76] font-display">
              THE CLINICAL STANDARD · GERMAN WAVEFRONT LAB
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-tight">
              Clinical Optometry Without Guesswork.
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              Precision eyewear requires medical-grade diagnostics. At Roshan Chasma Ghar, your lenses are crafted against exact ocular anatomical data, not rushed 2-minute chart tests.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenBookEyeTest}
                className="py-3 px-6 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                SCHEDULE EYE EXAMINATION
              </button>
              <button
                onClick={() => onNavigate('catalog')}
                className="py-3 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                BROWSE FRAMES
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg border border-slate-200">
              <img
                src={CLINIC_IMAGE}
                alt="Roshan Chasma Ghar Optometry Clinic"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 14-Point Eye Testing Breakdown */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#e01a76] font-display">
            COMPREHENSIVE PROTOCOL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
            Our 14-Point Digital Eye Examination
          </h2>
          <p className="text-xs text-slate-500">
            Every test is conducted by certified optometrists using authorized Carl Zeiss and Essilor diagnostic instrumentation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testingSteps.map((step) => (
            <div
              key={step.num}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-[#e01a76]/40 transition-colors"
            >
              <span className="text-xs font-mono font-bold text-[#e01a76]">{step.num}</span>
              <h3 className="text-xs font-bold text-slate-900">{step.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Progressive Adaptation Guarantee */}
      <section className="bg-[#121217] text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#e01a76] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>30-DAY ZERO-RISK ADAPTATION GUARANTEE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Afraid Progressive Lenses Will Cause Headaches or Swim Effect?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              We guarantee 100% effortless adaptation. If you experience dizziness or difficulty reading within 30 days of dispensing, our chief optometrist will remeasure and replace your lenses at zero extra charge.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <button
              onClick={onOpenBookEyeTest}
              className="py-3.5 px-6 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              BOOK CLINICAL CONSULTATION
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
