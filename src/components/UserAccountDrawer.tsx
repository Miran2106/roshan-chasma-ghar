import React, { useState, useEffect } from 'react';
import { X, User, Package, Calendar, FileText, LogOut, CheckCircle2, Clock, ExternalLink, Database, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders, fetchUserAppointments, fetchUserPrescriptions } from '../services/supabaseService';
import { DbOrder, DbEyeTestAppointment, DbPrescription } from '../types/supabase';

export const UserAccountDrawer: React.FC = () => {
  const { accountDrawerOpen, closeAccountDrawer, user, profile, signOut, isConfigured } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'appointments' | 'prescriptions' | 'supabase'>('orders');
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [appointments, setAppointments] = useState<DbEyeTestAppointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<DbPrescription[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accountDrawerOpen) {
      loadData();
    }
  }, [accountDrawerOpen, user?.id, user?.email]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userOrders, userApts, userRxs] = await Promise.all([
        fetchUserOrders(user?.id, user?.email),
        fetchUserAppointments(user?.id, profile?.phone),
        fetchUserPrescriptions(user?.id),
      ]);
      setOrders(userOrders);
      setAppointments(userApts);
      setPrescriptions(userRxs);
    } catch (err) {
      console.warn('Error loading user account data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!accountDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#121217] text-white shadow-2xl border-l border-white/10 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-[#1b1b22] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e01a76] to-amber-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#121217] rounded-2xl flex items-center justify-center">
                  <User className="w-5 h-5 text-amber-300" />
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Valued Patron'}
                </h3>
                <p className="text-xs text-slate-400">{user?.email || 'Guest Session'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={signOut}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={closeAccountDrawer}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-[#16161c] px-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'orders'
                  ? 'border-[#e01a76] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'appointments'
                  ? 'border-[#e01a76] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Eye Tests ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'prescriptions'
                  ? 'border-[#e01a76] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Prescriptions ({prescriptions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('supabase')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'supabase'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Backend</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="p-8 text-center bg-[#1b1b22] rounded-2xl border border-white/5 space-y-3">
                    <Package className="w-10 h-10 text-slate-500 mx-auto" />
                    <h4 className="text-sm font-semibold text-slate-300">No Orders Placed Yet</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore our handcrafted titanium eyewear catalog and place an order to track it in real-time.
                    </p>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 bg-[#1b1b22] rounded-2xl border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-amber-300">
                            {ord.order_number}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {new Date(ord.created_at).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e01a76]/20 text-[#ff4d9e] border border-[#e01a76]/30">
                          <Clock className="w-3 h-3" />
                          <span>{ord.order_status}</span>
                        </div>
                      </div>

                      {/* Items */}
                      {ord.items && ord.items.length > 0 && (
                        <div className="divide-y divide-white/5 pt-1">
                          {ord.items.map((item) => (
                            <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-semibold text-white">{item.product_name}</span>
                                <span className="text-[11px] text-slate-400 block">
                                  {item.selected_color} · {item.selected_lens} (Qty: {item.quantity})
                                </span>
                              </div>
                              <span className="font-semibold text-slate-200">
                                ₹{(item.item_price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-400">Total Amount:</span>
                        <span className="text-white font-bold text-sm">
                          ₹{Number(ord.total).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="p-8 text-center bg-[#1b1b22] rounded-2xl border border-white/5 space-y-3">
                    <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
                    <h4 className="text-sm font-semibold text-slate-300">No Appointments Scheduled</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Schedule a zero-error German wavefront eye test at our flagship South Mumbai clinic.
                    </p>
                  </div>
                ) : (
                  appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 bg-[#1b1b22] rounded-2xl border border-white/10 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">{apt.service_type}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{apt.status}</span>
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#e01a76]" />
                          <span>{apt.clinic_branch}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            {apt.appointment_date} at {apt.appointment_time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Patient: {apt.patient_name} ({apt.phone})</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-4">
                {prescriptions.length === 0 ? (
                  <div className="p-8 text-center bg-[#1b1b22] rounded-2xl border border-white/5 space-y-3">
                    <FileText className="w-10 h-10 text-slate-500 mx-auto" />
                    <h4 className="text-sm font-semibold text-slate-300">No Prescriptions Stored</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Attach or enter your optical Rx values to have your ophthalmic lenses precision surfaced.
                    </p>
                  </div>
                ) : (
                  prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="p-4 bg-[#1b1b22] rounded-2xl border border-white/10 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">{rx.patient_name}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          PD: {rx.pupillary_distance || '63'}mm
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#121217] p-2.5 rounded-xl border border-white/5">
                        <div>
                          <span className="text-amber-400 block font-bold">Right Eye (OD):</span>
                          <span>SPH: {rx.right_sphere || '0.00'}</span>
                          <span className="ml-2">CYL: {rx.right_cylinder || '0.00'}</span>
                          <span className="ml-2">AXIS: {rx.right_axis || '0'}°</span>
                        </div>
                        <div>
                          <span className="text-[#e01a76] block font-bold">Left Eye (OS):</span>
                          <span>SPH: {rx.left_sphere || '0.00'}</span>
                          <span className="ml-2">CYL: {rx.left_cylinder || '0.00'}</span>
                          <span className="ml-2">AXIS: {rx.left_axis || '0'}°</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Supabase Tab */}
            {activeTab === 'supabase' && (
              <div className="space-y-4">
                <div className="p-5 bg-[#1b1b22] rounded-2xl border border-amber-400/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Supabase Backend Configuration</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This project is fully wired to Supabase with PostgreSQL tables, Row Level Security (RLS), Supabase Auth, and real CRUD operations for orders, prescriptions, and clinic appointments.
                  </p>

                  <div className="p-3 bg-[#121217] rounded-xl border border-white/10 text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Connection Status:</span>
                      <span className={isConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {isConfigured ? 'Live (Connected)' : 'Active (Local Fallback Mode)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Auth Mode:</span>
                      <span className="text-white">Email &amp; Password + RLS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">SQL Schema:</span>
                      <span className="text-[#e01a76]">/supabase/schema.sql</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#1b1b22] rounded-2xl border border-white/10 space-y-2.5 text-xs text-slate-300">
                  <h5 className="font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#e01a76]" />
                    <span>How to connect your live Supabase project:</span>
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                    <li>Create a project at <strong className="text-white">supabase.com</strong>.</li>
                    <li>Copy and run the contents of <strong className="text-amber-300">/supabase/schema.sql</strong> in the Supabase SQL Editor.</li>
                    <li>Add your project URL &amp; Anon Key to your environment variables:
                      <code className="block bg-[#121217] p-2 mt-1 rounded text-slate-200">
                        VITE_SUPABASE_URL=https://your-project.supabase.co<br />
                        VITE_SUPABASE_ANON_KEY=your-anon-key
                      </code>
                    </li>
                    <li>The app will automatically switch from local fallback to live database synchronization!</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
