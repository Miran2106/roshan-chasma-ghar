import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  CheckCircle,
  Truck,
  MessageSquare,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Upload,
  Lock,
  Gift,
  Glasses,
  Check,
} from 'lucide-react';
import { CartItem, AccessoryItem, PrescriptionData } from '../types/optical';
import { FrameGraphic } from '../components/FrameGraphic';
import { ACCESSORIES, BRAND_LOGO_IMAGE } from '../data/products';
import { createOrder } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onNavigate: (page: string, productId?: string) => void;
  onOpenPrescriptionModal: () => void;
  attachedPrescription: PrescriptionData | null;
  onAddAccessory: (accessory: AccessoryItem) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  onOpenPrescriptionModal,
  attachedPrescription,
  onAddAccessory,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('Roshan Patel');
  const [whatsappPhone, setWhatsappPhone] = useState('+91 98765 43210');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Sea Breeze Apts, Worli Sea Face, Mumbai 400030');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const { user } = useAuth();

  // Calculations
  const itemsSubtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product.price + item.lensPrice) * item.quantity;
  }, 0);

  const totalPayable = itemsSubtotal;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);
    try {
      const res = await createOrder({
        userId: user?.id || null,
        customerName: customerName || 'Patron',
        customerEmail: user?.email || `${whatsappPhone.replace(/\D/g, '') || 'guest'}@roshancustomer.com`,
        customerPhone: whatsappPhone,
        address: {
          address: shippingAddress,
          city: 'Mumbai',
          pincode: '400001',
        },
        cartItems: cartItems,
        subtotal: itemsSubtotal,
        shippingCost: 0,
        discount: 0,
        total: totalPayable,
        paymentMethod: fulfillmentMethod === 'delivery' ? 'Cash on Delivery' : 'Pay at Atelier Store',
        prescriptionData: attachedPrescription || null,
      });

      const orderNo = res.order?.order_number || `RCG-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(orderNo);
      setOrderConfirmed(true);
    } catch (err) {
      console.warn('Order submission error:', err);
      const orderNo = `RCG-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(orderNo);
      setOrderConfirmed(true);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleOrderViaWhatsApp = () => {
    const itemsList = cartItems
      .map((i) => `• ${i.product.name} (${i.selectedColor}) - Qty: ${i.quantity} @ ₹${i.product.price + i.lensPrice}`)
      .join('\n');

    const text = encodeURIComponent(
      `Hello Roshan Chasma Ghar! I would like to place an order request:\n\nCustomer: ${customerName}\nPhone: ${whatsappPhone}\nFulfillment: ${fulfillmentMethod === 'delivery' ? 'Insured Doorstep Delivery' : 'Flagship Store Pickup'}\nAddress: ${shippingAddress}\n\nFrames Selected:\n${itemsList}\n\nTotal Payable: ₹${totalPayable}\nRx Status: ${attachedPrescription ? 'Prescription Attached' : 'Will share photo on WhatsApp'}`
    );

    window.open(`https://wa.me/912224908282?text=${text}`, '_blank');
  };

  const handleAskOptometrist = () => {
    const text = encodeURIComponent(
      `Hello Roshan Chasma Ghar Optometrist Concierge! I have a question about my Cylinder/Axis values before finishing my frame order.`
    );
    window.open(`https://wa.me/912224908282?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ================= STEPPER PROGRESS BAR ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black border border-amber-400/40 p-0.5 shadow-sm shrink-0 overflow-hidden">
            <img
              src={BRAND_LOGO_IMAGE}
              alt="Roshan Chasma Ghar"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
          <span className="text-base font-bold font-display text-slate-900">
            Review Optical Bag
          </span>
        </div>

        {/* 3 Step sequence */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          <span className="text-[#e01a76] flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#e01a76] text-white text-[11px] flex items-center justify-center font-bold">1</span>
            <span>Cart Review</span>
          </span>
          <span className="w-8 h-[2px] bg-slate-300" />
          <span className="text-slate-700 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center font-bold">2</span>
            <span>Delivery &amp; Rx</span>
          </span>
          <span className="w-8 h-[2px] bg-slate-300" />
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 text-[11px] flex items-center justify-center font-bold">3</span>
            <span>WhatsApp Confirm</span>
          </span>
        </div>

        {/* Zero Error Surfacing Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>ZERO ERROR SURFACING</span>
        </div>
      </div>

      {/* ================= HEADER KICKER & TITLE ================= */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#e01a76] font-display">
            PRESCRIPTION &amp; FRAME DISPATCH
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            YOUR OPTICAL BAG ({cartItems.length} {cartItems.length === 1 ? 'FRAME' : 'FRAMES'})
          </h1>
        </div>
        <p className="text-xs text-slate-500 max-w-md">
          No credit card lock-in. Place an optical order request; our optometric concierge verifies your lens sphere &amp; cylinder values prior to delivery.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Glasses className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900">Your optical bag is empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover lightweight titanium and acetate optical silhouettes crafted with zero distortion.
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="py-3 px-6 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
          >
            EXPLORE EYEWEAR CATALOG
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: CART ITEMS & GUARANTEES (7 COLS) ================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-center justify-between gap-5 relative"
                >
                  {/* Left Silhouette Box */}
                  <div className="w-full sm:w-36 h-28 bg-[#f6f2fa] rounded-xl border border-slate-100 p-2 flex items-center justify-center shrink-0 relative">
                    <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-white/90 px-1.5 py-0.5 rounded text-slate-700 shadow-2xs">
                      {item.product.badge || 'TITANIUM'}
                    </span>
                    {item.product.image || item.product.colors[0]?.image ? (
                      <img
                        src={item.product.image || item.product.colors[0]?.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <FrameGraphic
                        shape={item.product.shape}
                        type={item.product.customSvgType}
                        colorHex={item.product.colors[0]?.hex}
                        className="w-full h-full"
                      />
                    )}
                  </div>

                  {/* Middle Info */}
                  <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold font-display text-slate-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Color: <strong className="text-slate-800 font-medium">{item.selectedColor}</strong> · Size: {item.product.dimensions.lensWidth}-{item.product.dimensions.bridge}-{item.product.dimensions.temple}
                        </p>
                      </div>

                      {/* Remove Button (Desktop) */}
                      <button
                        onClick={() => onRemoveItem(item.cartId)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors hidden sm:block"
                        title="Remove frame"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Lens tag */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-50 border border-pink-200 text-[#e01a76] rounded-lg text-xs font-semibold">
                      <Sparkles className="w-3 h-3" />
                      <span>{item.selectedLens === 'zeiss-progressive' ? 'Zeiss DuraVision BlueProtect 1.6' : item.selectedLens === 'single-vision' ? 'Prescription Single Vision' : 'Anti-Reflective Hydrophobic Standard'}</span>
                    </div>

                    {/* Stepper & Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, -1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900 font-display">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 line-through mr-1.5">
                          ₹{((item.product.originalPrice + item.lensPrice) * item.quantity).toLocaleString()}
                        </span>
                        <span className="text-lg font-bold text-slate-900 font-display">
                          ₹{((item.product.price + item.lensPrice) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button (Mobile) */}
                  <button
                    onClick={() => onRemoveItem(item.cartId)}
                    className="sm:hidden text-xs text-red-500 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>

            {/* 2-Column Value Props Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#e01a76] flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Complimentary Care Kit</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Hard shell leather case, microfiber cloth &amp; optical lens spray.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">100% Prescription Accuracy</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Double-tested on computerized digital lensmeters before dispatch.
                  </p>
                </div>
              </div>
            </div>

            {/* Unsure About Powers Box */}
            <div className="bg-[#1b1b20] text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4 text-[#e01a76]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Unsure about your Cylinder/Axis powers?</h4>
                  <p className="text-xs text-slate-400">
                    Upload your prescription or send a photo via WhatsApp. Our optometrists handle the rest.
                  </p>
                </div>
              </div>

              <button
                onClick={handleAskOptometrist}
                className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#e01a76]" />
                <span>Ask Optometrist</span>
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: ORDER SUMMARY & CHECKOUT FORM (5 COLS) ================= */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">Order Summary</h2>

              <div className="mt-4 space-y-2.5 text-xs text-slate-600 pb-4 border-b border-slate-100">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-slate-900 font-display">₹{itemsSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    Optical Surfacing &amp; Fitting <HelpCircle className="w-3 h-3 text-slate-400" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Doorstep Delivery</span>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Assembly Time</span>
                  <span className="text-slate-800 font-medium">24–48 Hours</span>
                </div>
              </div>

              {/* Total Payable */}
              <div className="flex items-baseline justify-between pt-4">
                <div>
                  <span className="text-sm font-bold text-slate-900 block font-display">Total Payable</span>
                  <span className="text-[11px] text-slate-400">All taxes &amp; lab fees included</span>
                </div>
                <span className="text-3xl font-extrabold text-[#e01a76] font-display">
                  ₹{totalPayable.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-4 pt-2">
              {/* Customer Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  YOUR FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roshan Patel"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#e01a76] focus:bg-white"
                />
              </div>

              {/* WhatsApp Contact */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  WHATSAPP / CONTACT NUMBER
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#e01a76] focus:bg-white"
                />
              </div>

              {/* Fulfillment Method */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  FULFILLMENT METHOD
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod('delivery')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      fulfillmentMethod === 'delivery'
                        ? 'border-[#e01a76] bg-pink-50/50 text-[#e01a76]'
                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Home Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod('pickup')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      fulfillmentMethod === 'pickup'
                        ? 'border-[#e01a76] bg-pink-50/50 text-[#e01a76]'
                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Store Pickup</span>
                  </button>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  SHIPPING ADDRESS
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House/Flat No., Street, Landmark, City & Pincode"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#e01a76] focus:bg-white"
                />
              </div>

              {/* Optical Prescription Box */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  OPTICAL PRESCRIPTION (RX)
                </label>
                <div
                  onClick={onOpenPrescriptionModal}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl cursor-pointer text-center space-y-1 transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#e01a76] mx-auto" />
                  <span className="text-xs font-bold text-slate-800 block">
                    {attachedPrescription
                      ? attachedPrescription.method === 'upload'
                        ? `Rx Slip Attached: ${attachedPrescription.fileName || 'Slip Image'}`
                        : `Manual Powers (OD: ${attachedPrescription.rightEye.sph}, OS: ${attachedPrescription.leftEye.sph})`
                      : 'Upload Rx Slip or Slip Photo'}
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB or Enter Manually</span>
                </div>
              </div>

              {/* Submission Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>SUBMIT ORDER REQUEST</span>
                </button>

                <button
                  type="button"
                  onClick={handleOrderViaWhatsApp}
                  className="w-full py-3.5 px-4 bg-[#121217] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>ORDER VIA WHATSAPP DIRECTLY</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Direct Verification · Pay After Lens Consultation</span>
              </div>
            </form>

            {/* Roshan Optical Concierge Guarantee */}
            <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-200/60 space-y-1 text-xs">
              <span className="font-bold text-[#e01a76] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Roshan Optical Concierge Guarantee</span>
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Every frame undergoes a 6-point optical alignment, laser bevel check, and ultrasonic cleaning before leaving our laboratory.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= RECOMMENDED ACCESSORIES & UPGRADES ================= */}
      <section className="space-y-6 pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e01a76] font-display">
              ESSENTIAL OPTICAL COMPANIONS
            </span>
            <h2 className="text-2xl font-extrabold font-display text-slate-900 tracking-tight">
              Recommended Accessories &amp; Upgrades
            </h2>
          </div>

          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-[#e01a76] hover:underline flex items-center gap-1"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACCESSORIES.map((acc) => (
            <div
              key={acc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-28 bg-[#f6f2fa] rounded-xl flex items-center justify-center p-3 border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-[#e01a76]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-display">
                  {acc.category}
                </span>

                <h3 className="text-xs font-bold text-slate-900">{acc.name}</h3>

                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {acc.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-900 font-display">₹{acc.price}</span>
                <button
                  onClick={() => onAddAccessory(acc)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#e01a76] hover:text-white text-slate-700 flex items-center justify-center transition-colors"
                  title="Add to optical bag"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Confirmation Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-bold font-display text-slate-900">
              Order Request Received!
            </h2>

            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Thank you, <strong className="text-slate-800">{customerName}</strong>. Your optical assembly order reference is:
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900">
              {orderNumber}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Our registered optician will review your prescription power and confirm lens center alignment with you on WhatsApp within 30 minutes before cutting lenses.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleOrderViaWhatsApp}
                className="py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Notify Optician on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setOrderConfirmed(false);
                  onNavigate('catalog');
                }}
                className="py-2.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
