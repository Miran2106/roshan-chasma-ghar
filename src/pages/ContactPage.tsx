import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Clock, Mail, Send, CheckCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 6000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#e01a76] font-display">
          OPTICAL CONCIERGE &amp; LOCATIONS
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
          Visit Our Atelier or Chat With Us
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Whether you need a bespoke frame styling appointment or have questions regarding cylinder powers, our optical staff is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Opening Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <h2 className="text-lg font-bold font-display text-slate-900">
              Flagship Atelier Location
            </h2>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">Roshan Chasma Ghar Flagship Atelier</strong>
                  <span className="leading-relaxed block mt-0.5">
                    Main Market Optical Avenue, Opp. Clock Tower Square, Central Promenade, Landmark Optical Precinct 400001
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">Telephone</strong>
                  <span>+91 (0) 22 2490 8282 / +91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">Atelier Hours</strong>
                  <span>Mon – Sat: 10:00 AM – 9:00 PM</span>
                  <span className="text-slate-400 block text-[11px]">Sundays open 11:00 AM – 6:00 PM for urgent eye tests</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#e01a76] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs">Email Concierge</strong>
                  <span>concierge@roshanchasmeghar.com</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/912224908282"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Concierge (+91 22 2490 8282)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-900">
            Send an Optical Inquiry
          </h2>
          <p className="text-xs text-slate-500">
            Have questions about frame dimensions, Zeiss blue-cut lenses, or insurance reimbursement receipts?
          </p>

          {formSent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has reached our dispensing desk. We will respond promptly.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roshan Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#e01a76] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#e01a76] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#e01a76] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your frame questions or prescription requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#e01a76] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND MESSAGE</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
