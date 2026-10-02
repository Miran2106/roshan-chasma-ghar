import React, { useState, useEffect } from 'react';
import { EyewearProduct, FrameCategory, FrameShape, FrameMaterial } from '../types/optical';
import { FrameGraphic } from '../components/FrameGraphic';
import {
  Package,
  DollarSign,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  RefreshCw,
  ShoppingBag,
  Calendar,
  FileText,
  Sliders,
  Sparkles,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  Tag,
  Eye,
  CheckCircle,
  Clock,
  User,
  Phone,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';

// Boutique asset photo references
import productAviatorNavigator from '../assets/images/sunglasses_aviator_navigator_1790967671340.jpg';
import productAmberTortoise from '../assets/images/amber_tortoise_eyeglasses_1790967684813.jpg';
import productTitaniumNavigator from '../assets/images/navigator_titanium_eyeglasses_1790967697178.jpg';
import productCrystalPantos from '../assets/images/crystal_pantos_sunglasses_1790967711674.jpg';
import productHexagonalCrystalGold from '../assets/images/hexagonal_crystal_gold_1790967723877.jpg';
import productHexagonalBlackGold from '../assets/images/hexagonal_black_gold_1790967739589.jpg';

interface AdminPageProps {
  products: EyewearProduct[];
  onUpdateProduct: (product: EyewearProduct) => void;
  onUpdateAllProductImages?: (newImageUrl: string) => void;
  onAddProduct: (product: EyewearProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onResetFactoryProducts: () => void;
  onNavigate: (page: string, productId?: string) => void;
  onQuickView: (product: EyewearProduct) => void;
}

interface OrderItem {
  id: string;
  customerName: string;
  phone: string;
  productName: string;
  price: number;
  date: string;
  status: 'Pending' | 'In Lab Edging' | 'Dispatched' | 'Delivered';
  paymentMethod: 'COD' | 'UPI/Online';
}

interface AppointmentItem {
  id: string;
  patientName: string;
  phone: string;
  type: 'In-Store Comprehensive Exam' | 'At-Home Trial & Test';
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Completed' | 'Pending';
}

interface PrescriptionRecord {
  id: string;
  patientName: string;
  phone: string;
  odSph: string;
  odCyl: string;
  odAxis: string;
  osSph: string;
  osCyl: string;
  osAxis: string;
  status: 'Verified' | 'Awaiting Optometrist';
  date: string;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  onUpdateProduct,
  onUpdateAllProductImages,
  onAddProduct,
  onDeleteProduct,
  onResetFactoryProducts,
  onNavigate,
  onQuickView,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'appointments' | 'prescriptions' | 'store'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'price' | 'rating'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Bulk and Inline Photo States
  const [bulkImageUrl, setBulkImageUrl] = useState('');
  const [inlineUrls, setInlineUrls] = useState<{ [id: string]: string }>({});
  const [imageLoadError, setImageLoadError] = useState(false);

  // Modal states for Product Editing
  const [photoModalProduct, setPhotoModalProduct] = useState<EyewearProduct | null>(null);
  const [priceModalProduct, setPriceModalProduct] = useState<EyewearProduct | null>(null);
  const [editProductModal, setEditProductModal] = useState<EyewearProduct | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Photo modal temp states (default to 'url' for quick external link paste)
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');
  const [activePhotoTab, setActivePhotoTab] = useState<'upload' | 'preset' | 'url'>('url');

  // Price modal temp states
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempOriginalPrice, setTempOriginalPrice] = useState<number>(0);

  // Feedback banner
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Mock Orders state (persisted locally)
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('roshan_admin_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'RCG-ORD-8801',
        customerName: 'Aarav Mehta',
        phone: '+91 98201 44521',
        productName: 'Roshan Imperial Hexagonal Titanium 01',
        price: 7490,
        date: 'Today, 11:30 AM',
        status: 'In Lab Edging',
        paymentMethod: 'UPI/Online',
      },
      {
        id: 'RCG-ORD-8798',
        customerName: 'Sneha Chaurasia',
        phone: '+91 97652 19844',
        productName: 'Roshan Sovereign Aviator Navigator',
        price: 4990,
        date: 'Today, 09:15 AM',
        status: 'Pending',
        paymentMethod: 'COD',
      },
      {
        id: 'RCG-ORD-8790',
        customerName: 'Vikramaditya Rao',
        phone: '+91 99200 81123',
        productName: 'Havana Heritage Acetate Square',
        price: 3290,
        date: 'Yesterday, 04:45 PM',
        status: 'Dispatched',
        paymentMethod: 'UPI/Online',
      },
      {
        id: 'RCG-ORD-8772',
        customerName: 'Priya Sharma',
        phone: '+91 98450 11992',
        productName: 'Roshan Crown Hexagonal 04',
        price: 3950,
        date: 'Oct 01, 2026',
        status: 'Delivered',
        paymentMethod: 'UPI/Online',
      },
    ];
  });

  // Mock Appointments state
  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    const saved = localStorage.getItem('roshan_admin_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'APT-101',
        patientName: 'Karan Malhotra',
        phone: '+91 98112 33499',
        type: 'In-Store Comprehensive Exam',
        date: 'Tomorrow, Oct 03',
        timeSlot: '02:00 PM - 03:00 PM',
        status: 'Confirmed',
      },
      {
        id: 'APT-102',
        patientName: 'Ananya Deshmukh',
        phone: '+91 99401 22891',
        type: 'At-Home Trial & Test',
        date: 'Tomorrow, Oct 03',
        timeSlot: '05:30 PM - 06:30 PM',
        status: 'Pending',
      },
      {
        id: 'APT-103',
        patientName: 'Farhan Mithawala',
        phone: '+91 98200 55112',
        type: 'In-Store Comprehensive Exam',
        date: 'Oct 04, 2026',
        timeSlot: '11:00 AM - 12:00 PM',
        status: 'Confirmed',
      },
    ];
  });

  // Prescriptions state
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([
    {
      id: 'RX-902',
      patientName: 'Rohan Verma',
      phone: '+91 98711 22345',
      odSph: '-2.25',
      odCyl: '-0.75',
      odAxis: '180°',
      osSph: '-2.00',
      osCyl: '-0.50',
      osAxis: '175°',
      status: 'Awaiting Optometrist',
      date: 'Today, 10:20 AM',
    },
    {
      id: 'RX-899',
      patientName: 'Deepika Iyer',
      phone: '+91 97110 99882',
      odSph: '+1.50',
      odCyl: '0.00',
      odAxis: '0°',
      osSph: '+1.75',
      osCyl: '-0.25',
      osAxis: '90°',
      status: 'Verified',
      date: 'Yesterday, 03:10 PM',
    },
  ]);

  // Persist mock data
  useEffect(() => {
    localStorage.setItem('roshan_admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('roshan_admin_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Boutique Preset Photos
  const presetPhotos = [
    { title: 'Sovereign Aviator Sunglasses', src: productAviatorNavigator },
    { title: 'Hexagonal Black & 18k Gold', src: productHexagonalBlackGold },
    { title: 'Hexagonal Clear Crystal & Gold', src: productHexagonalCrystalGold },
    { title: 'Amber Tortoiseshell Acetate', src: productAmberTortoise },
    { title: 'Dual-Bridge Titanium Navigator', src: productTitaniumNavigator },
    { title: 'Crystal Pantos Sunglasses', src: productCrystalPantos },
  ];

  // Open photo editor
  const handleOpenPhotoModal = (prod: EyewearProduct) => {
    setPhotoModalProduct(prod);
    setTempPhotoUrl(prod.image || '');
  };

  // Save photo for single product
  const handleSavePhoto = () => {
    if (!photoModalProduct) return;
    const finalImage = tempPhotoUrl.trim() || undefined;
    const updated: EyewearProduct = {
      ...photoModalProduct,
      image: finalImage,
      colors: photoModalProduct.colors.map((c) => ({
        ...c,
        image: finalImage || c.image,
      })),
    };
    onUpdateProduct(updated);
    notify(`Photo updated for ${updated.name}`);
    setPhotoModalProduct(null);
  };

  // Apply photo to ALL products in catalog
  const handleApplyPhotoToAll = (urlToApply: string) => {
    const finalUrl = urlToApply.trim();
    if (!finalUrl) {
      alert('Please enter or select a valid image URL first.');
      return;
    }
    if (confirm(`Apply this image to ALL ${products.length} eyewear frames in the store?`)) {
      if (onUpdateAllProductImages) {
        onUpdateAllProductImages(finalUrl);
      } else {
        products.forEach((p) => {
          onUpdateProduct({
            ...p,
            image: finalUrl,
            colors: p.colors.map((c) => ({ ...c, image: finalUrl })),
          });
        });
      }
      notify(`Applied new photo to all ${products.length} frames!`);
      setPhotoModalProduct(null);
    }
  };

  // Quick save from inline row input
  const handleSaveInlinePhoto = (prod: EyewearProduct, url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const updated: EyewearProduct = {
      ...prod,
      image: trimmed,
      colors: prod.colors.map((c) => ({ ...c, image: trimmed })),
    };
    onUpdateProduct(updated);
    notify(`Photo updated for ${prod.name}`);
  };

  // Open price editor
  const handleOpenPriceModal = (prod: EyewearProduct) => {
    setPriceModalProduct(prod);
    setTempPrice(prod.price);
    setTempOriginalPrice(prod.originalPrice || Math.round(prod.price * 1.3));
  };

  // Save price
  const handleSavePrice = () => {
    if (!priceModalProduct) return;
    const discount = tempOriginalPrice > tempPrice 
      ? Math.round(((tempOriginalPrice - tempPrice) / tempOriginalPrice) * 100)
      : undefined;

    const updated: EyewearProduct = {
      ...priceModalProduct,
      price: Number(tempPrice),
      originalPrice: Number(tempOriginalPrice),
      discountPercent: discount,
    };
    onUpdateProduct(updated);
    notify(`Price updated for ${updated.name} (₹${tempPrice.toLocaleString()})`);
    setPriceModalProduct(null);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setTempPhotoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Filter & Sort Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shapeLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      (selectedCategory === 'titanium' && p.isTitanium) ||
      (selectedCategory === 'bestseller' && p.isBestseller);

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortField === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortField === 'price') {
      return sortAsc ? a.price - b.price : b.price - a.price;
    }
    if (sortField === 'rating') {
      return sortAsc ? a.rating - b.rating : b.rating - a.rating;
    }
    return 0;
  });

  // New product initial state
  const [newProduct, setNewProduct] = useState<Partial<EyewearProduct>>({
    name: '',
    sku: `RCG-${Math.floor(1000 + Math.random() * 9000)}`,
    price: 3490,
    originalPrice: 4990,
    category: 'eyeglasses',
    shape: 'square',
    material: 'Handmade Acetate',
    shapeLabel: 'Modern Square',
    sizeCategory: 'Medium',
    badge: 'NEW ARRIVAL',
    badgeType: 'pink',
    frameTone: 'black',
    defaultColor: 'Obsidian Black',
    rating: 5.0,
    reviewCount: 1,
    dimensions: { lensWidth: 51, bridge: 18, temple: 145, weight: '16.5g' },
    colors: [{ name: 'Obsidian Black', hex: '#111111' }],
    description: 'Bespoke hand-crafted frame made with premium optical craftsmanship.',
    craftDetails: 'Hand-finished, hypoallergenic, and fitted for precision ophthalmic lenses.',
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Please provide a name and price for the product.');
      return;
    }

    const discount = newProduct.originalPrice && newProduct.originalPrice > newProduct.price
      ? Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)
      : undefined;

    const created: EyewearProduct = {
      id: `rcg-custom-${Date.now()}`,
      sku: newProduct.sku || `RCG-${Date.now().toString().slice(-4)}`,
      name: newProduct.name,
      subtitle: newProduct.subtitle || 'FLAGSHIP COLLECTION',
      series: 'FLAGSHIP COLLECTION',
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice || newProduct.price),
      discountPercent: discount,
      category: (newProduct.category as FrameCategory) || 'eyeglasses',
      shape: (newProduct.shape as FrameShape) || 'square',
      material: (newProduct.material as FrameMaterial) || 'Handmade Acetate',
      shapeLabel: newProduct.shapeLabel || 'Classic Square',
      sizeCategory: newProduct.sizeCategory || 'Medium',
      dimensions: newProduct.dimensions || { lensWidth: 50, bridge: 19, temple: 145, weight: '16.0g' },
      rating: 5.0,
      reviewCount: 1,
      badge: newProduct.badge || 'NEW ARRIVAL',
      badgeType: newProduct.badgeType || 'pink',
      defaultColor: newProduct.defaultColor || 'Obsidian Black',
      frameTone: newProduct.frameTone || 'black',
      colors: newProduct.colors || [{ name: 'Obsidian Black', hex: '#111111' }],
      description: newProduct.description || 'Exclusive frame from Roshan Chasma Ghar.',
      craftDetails: newProduct.craftDetails || 'Handcrafted optical standard with certified durability.',
      image: newProduct.image,
      customSvgType: 'aurelia-round',
    };

    onAddProduct(created);
    notify(`New frame "${created.name}" created and added to store!`);
    setIsAddProductOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pb-16">
      {/* ================= ADMIN TOP BAR ================= */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#e01a76] to-pink-500 flex items-center justify-center shadow-md shadow-pink-900/30">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-wide font-display">
                  ROSHAN CHASMA GHAR
                </h1>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full font-semibold">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Store Management, Photos &amp; Real-time Pricing</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#e01a76] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* ================= MAIN CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full flex-1 space-y-6">
        {/* KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Frames</span>
              <Package className="w-4 h-4 text-pink-400" />
            </div>
            <p className="text-2xl font-bold font-display text-white mt-1">{products.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Active in live catalog</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Avg Frame Price</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold font-display text-white mt-1">
              ₹{Math.round(products.reduce((a, b) => a + b.price, 0) / (products.length || 1)).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Online selling price</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Recent Orders</span>
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-display text-white mt-1">{orders.length}</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">2 In lab edging</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Eye Test Bookings</span>
              <Calendar className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-bold font-display text-white mt-1">{appointments.length}</p>
            <p className="text-[11px] text-sky-400 mt-0.5">Optometrist schedule</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-[#e01a76] text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product &amp; Price Manager ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-[#e01a76] text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'appointments'
                ? 'bg-[#e01a76] text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Eye Test Bookings ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'prescriptions'
                ? 'bg-[#e01a76] text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Prescriptions ({prescriptions.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: PRODUCT & PRICE MANAGER ================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Action Bar & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/70 p-3.5 rounded-2xl border border-slate-700/80">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, SKU, shape, material..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 text-xs rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Categories</option>
                  <option value="eyeglasses">Eyeglasses</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="blue-light">Blue-Light</option>
                  <option value="rimless">Rimless</option>
                  <option value="titanium">Titanium</option>
                  <option value="bestseller">Bestsellers</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm('Reset catalog to factory default? Any custom items will be restored to original settings.')) {
                      onResetFactoryProducts();
                      notify('Catalog reset to factory default.');
                    }
                  }}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                  title="Reset to initial showroom catalog"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 bg-[#e01a76] hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Frame</span>
                </button>
              </div>
            </div>

            {/* Bulk Change All Images Bar */}
            <div className="bg-gradient-to-r from-pink-950/40 via-slate-800 to-slate-900 border border-pink-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
                    <span>Bulk Image Updater (External URL)</span>
                    <span className="text-[9px] bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded font-mono">ALL FRAMES</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">Paste any image link (e.g. from Google Images, Imgur, CDN) to apply to all {products.length} frames at once.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Paste external image URL (https://...)"
                  value={bulkImageUrl}
                  onChange={(e) => setBulkImageUrl(e.target.value)}
                  className="flex-1 md:w-80 px-3 py-1.5 bg-slate-950 border border-slate-700 text-xs rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
                />
                <button
                  onClick={() => {
                    if (!bulkImageUrl.trim()) {
                      alert('Please paste an image URL first.');
                      return;
                    }
                    handleApplyPhotoToAll(bulkImageUrl);
                  }}
                  className="px-3.5 py-1.5 bg-[#e01a76] hover:bg-pink-600 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-sm transition-all flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Apply to ALL Frames</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-700">
                    <tr>
                      <th className="py-3.5 px-4">Photo / Silhouette</th>
                      <th className="py-3.5 px-4 cursor-pointer" onClick={() => { setSortField('name'); setSortAsc(!sortAsc); }}>
                        <div className="flex items-center gap-1">
                          <span>Frame Details &amp; SKU</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4">Category &amp; Shape</th>
                      <th className="py-3.5 px-4 cursor-pointer" onClick={() => { setSortField('price'); setSortAsc(!sortAsc); }}>
                        <div className="flex items-center gap-1">
                          <span>Current Price (₹)</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="py-3.5 px-4">Original Price (₹)</th>
                      <th className="py-3.5 px-4">Discount</th>
                      <th className="py-3.5 px-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-750/50 transition-colors">
                        {/* Photo Cell */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="relative group w-20 h-14 bg-white rounded-lg p-1 flex items-center justify-center border border-slate-600 shadow-2xs overflow-hidden shrink-0">
                              {prod.image ? (
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <FrameGraphic
                                  shape={prod.shape}
                                  type={prod.customSvgType}
                                  colorHex={prod.colors[0]?.hex || '#111'}
                                  className="w-full h-full"
                                />
                              )}

                              {/* Hover overlay to change photo */}
                              <button
                                onClick={() => handleOpenPhotoModal(prod)}
                                className="absolute inset-0 bg-slate-950/80 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-0.5 transition-opacity"
                                title="Change Photo"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                                <span className="text-[8px] font-bold">CHANGE</span>
                              </button>
                            </div>

                            {/* Direct External URL Quick-Edit */}
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                placeholder="Paste image link..."
                                value={inlineUrls[prod.id] !== undefined ? inlineUrls[prod.id] : (prod.image?.startsWith('http') ? prod.image : '')}
                                onChange={(e) => setInlineUrls({ ...inlineUrls, [prod.id]: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = inlineUrls[prod.id];
                                    if (val) handleSaveInlinePhoto(prod, val);
                                  }
                                }}
                                className="w-24 text-[9px] px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-pink-500 placeholder-slate-600"
                              />
                              <button
                                onClick={() => {
                                  const val = inlineUrls[prod.id];
                                  if (val) handleSaveInlinePhoto(prod, val);
                                }}
                                className="p-1 bg-[#e01a76] hover:bg-pink-600 text-white rounded text-[9px] font-bold transition-colors"
                                title="Save External Image URL"
                              >
                                <Check className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Name & SKU Cell */}
                        <td className="py-3 px-4">
                          <div className="space-y-0.5 max-w-xs">
                            <span className="text-xs font-bold text-white hover:text-pink-400 transition-colors cursor-pointer" onClick={() => onNavigate('product', prod.id)}>
                              {prod.name}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span>SKU: {prod.sku}</span>
                              {prod.badge && (
                                <span className="bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded font-sans text-[9px] font-semibold">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category & Shape */}
                        <td className="py-3 px-4">
                          <div className="text-slate-300">
                            <span className="capitalize font-medium block">{prod.category}</span>
                            <span className="text-[10px] text-slate-400">{prod.shapeLabel}</span>
                          </div>
                        </td>

                        {/* Current Selling Price */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleOpenPriceModal(prod)}
                            className="group flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-pink-500 transition-all"
                            title="Click to edit price"
                          >
                            <span className="text-sm font-bold font-display text-emerald-400">
                              ₹{prod.price.toLocaleString()}
                            </span>
                            <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-pink-400 transition-colors" />
                          </button>
                        </td>

                        {/* Original Price */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleOpenPriceModal(prod)}
                            className="text-xs text-slate-400 line-through hover:text-slate-200 transition-colors"
                            title="Click to edit original price"
                          >
                            ₹{prod.originalPrice.toLocaleString()}
                          </button>
                        </td>

                        {/* Discount */}
                        <td className="py-3 px-4">
                          {prod.discountPercent ? (
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                              {prod.discountPercent}% OFF
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">—</span>
                          )}
                        </td>

                        {/* Quick Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenPhotoModal(prod)}
                              className="p-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-pink-400 rounded-lg border border-slate-700 transition-colors"
                              title="Change Photo"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenPriceModal(prod)}
                              className="p-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 rounded-lg border border-slate-700 transition-colors"
                              title="Edit Price"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onQuickView(prod)}
                              className="p-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                              title="Preview on Store"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Delete frame "${prod.name}" from catalog?`)) {
                                  onDeleteProduct(prod.id);
                                  notify(`Deleted ${prod.name}`);
                                }
                              }}
                              className="p-1.5 bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 transition-colors"
                              title="Delete Frame"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: CUSTOMER ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-display">Recent Customer Orders</h3>
                <p className="text-xs text-slate-400">Manage prescription edging, status &amp; dispatches</p>
              </div>
              <span className="text-xs bg-slate-900 text-slate-300 px-3 py-1 rounded-full font-mono border border-slate-700">
                {orders.length} Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer &amp; Contact</th>
                    <th className="py-3 px-4">Item Ordered</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-750/50">
                      <td className="py-3 px-4 font-mono font-bold text-pink-400">{ord.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{ord.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-200 font-medium">{ord.productName}</td>
                      <td className="py-3 px-4 font-bold font-display text-emerald-400">
                        ₹{ord.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{ord.date}</td>
                      <td className="py-3 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as OrderItem['status'];
                            setOrders(orders.map((o) => (o.id === ord.id ? { ...o, status: newStatus } : o)));
                            notify(`Order ${ord.id} status changed to ${newStatus}`);
                          }}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 bg-slate-900 border focus:outline-none ${
                            ord.status === 'Delivered'
                              ? 'border-emerald-500/50 text-emerald-400'
                              : ord.status === 'Dispatched'
                              ? 'border-sky-500/50 text-sky-400'
                              : ord.status === 'In Lab Edging'
                              ? 'border-amber-500/50 text-amber-400'
                              : 'border-pink-500/50 text-pink-400'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Lab Edging">In Lab Edging</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: EYE TEST BOOKINGS ================= */}
        {activeTab === 'appointments' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-display">Optometrist Eye Exam Appointments</h3>
                <p className="text-xs text-slate-400">Clinic and Home Visit appointments</p>
              </div>
              <span className="text-xs bg-slate-900 text-slate-300 px-3 py-1 rounded-full font-mono border border-slate-700">
                {appointments.length} Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Patient Name &amp; Phone</th>
                    <th className="py-3 px-4">Appointment Type</th>
                    <th className="py-3 px-4">Date &amp; Time Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-750/50">
                      <td className="py-3 px-4 font-mono font-bold text-sky-400">{apt.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{apt.patientName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{apt.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          apt.type.includes('Home') 
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                        }`}>
                          {apt.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        <div className="font-medium">{apt.date}</div>
                        <div className="text-[10px] text-slate-400">{apt.timeSlot}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setAppointments(appointments.map((a) => (a.id === apt.id ? { ...a, status: 'Confirmed' } : a)));
                            notify(`Appointment for ${apt.patientName} confirmed!`);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-colors mr-1"
                        >
                          Confirm
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: PRESCRIPTIONS ================= */}
        {activeTab === 'prescriptions' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-sm font-bold text-white font-display">Customer Prescriptions</h3>
              <p className="text-xs text-slate-400">Doctor refractive values for automated lens surfacing</p>
            </div>

            <div className="divide-y divide-slate-700/60">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-750/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-pink-400">{rx.id}</span>
                      <span className="font-semibold text-sm text-white">{rx.patientName}</span>
                      <span className="text-xs text-slate-400">({rx.phone})</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-700/80">
                      <div>
                        <span className="text-amber-300 font-bold block text-[10px]">RIGHT EYE (OD)</span>
                        <span>SPH: {rx.odSph} | CYL: {rx.odCyl} | AXIS: {rx.odAxis}</span>
                      </div>
                      <div>
                        <span className="text-amber-300 font-bold block text-[10px]">LEFT EYE (OS)</span>
                        <span>SPH: {rx.osSph} | CYL: {rx.osCyl} | AXIS: {rx.osAxis}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      rx.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {rx.status}
                    </span>

                    {rx.status !== 'Verified' && (
                      <button
                        onClick={() => {
                          setPrescriptions(prescriptions.map((r) => (r.id === rx.id ? { ...r, status: 'Verified' } : r)));
                          notify(`Prescription ${rx.id} verified and sent to edging lab!`);
                        }}
                        className="px-3 py-1.5 bg-[#e01a76] hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Verify &amp; Send to Lab
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: CHANGE PHOTO ================= */}
      {photoModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-display">Change Product Photo</h3>
                <p className="text-xs text-slate-400">{photoModalProduct.name}</p>
              </div>
              <button
                onClick={() => setPhotoModalProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Photo Preview */}
            <div className="w-full aspect-[16/9] bg-white rounded-2xl p-4 flex items-center justify-center border border-slate-600 relative overflow-hidden">
              {tempPhotoUrl ? (
                <img
                  src={tempPhotoUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  onError={() => setImageLoadError(true)}
                  onLoad={() => setImageLoadError(false)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <FrameGraphic
                  shape={photoModalProduct.shape}
                  type={photoModalProduct.customSvgType}
                  colorHex={photoModalProduct.colors[0]?.hex || '#111'}
                  className="w-full h-full"
                />
              )}

              <span className="absolute top-2 right-2 text-[9px] bg-slate-900/80 text-white font-bold px-2 py-0.5 rounded-full">
                LIVE PREVIEW
              </span>
            </div>

            {/* Error banner if URL fails to load */}
            {imageLoadError && tempPhotoUrl && (
              <div className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/40 p-2.5 rounded-xl text-center flex items-center gap-2 justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Could not load image preview. Check link permissions or try uploading the image directly.</span>
              </div>
            )}

            {/* Selection Options */}
            <div className="space-y-3">
              <div className="flex border-b border-slate-800 pb-2 text-xs font-semibold gap-3">
                <button
                  onClick={() => { setActivePhotoTab('url'); setImageLoadError(false); }}
                  className={`pb-1 flex items-center gap-1.5 ${activePhotoTab === 'url' ? 'text-pink-400 border-b-2 border-pink-400 font-bold' : 'text-slate-400'}`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Paste External URL</span>
                </button>
                <button
                  onClick={() => { setActivePhotoTab('preset'); setImageLoadError(false); }}
                  className={`pb-1 flex items-center gap-1.5 ${activePhotoTab === 'preset' ? 'text-pink-400 border-b-2 border-pink-400 font-bold' : 'text-slate-400'}`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Showroom Presets</span>
                </button>
                <button
                  onClick={() => { setActivePhotoTab('upload'); setImageLoadError(false); }}
                  className={`pb-1 flex items-center gap-1.5 ${activePhotoTab === 'upload' ? 'text-pink-400 border-b-2 border-pink-400 font-bold' : 'text-slate-400'}`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>
              </div>

              {/* 1. Paste URL */}
              {activePhotoTab === 'url' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">External Image URL (Web Link)</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or https://..."
                    value={tempPhotoUrl}
                    onChange={(e) => {
                      setTempPhotoUrl(e.target.value);
                      setImageLoadError(false);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400">
                    Paste any public image link. It will update this frame instantly across Home, Catalog, and Product Detail.
                  </p>
                </div>
              )}

              {/* 2. Showroom Preset Photos */}
              {activePhotoTab === 'preset' && (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {presetPhotos.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setTempPhotoUrl(preset.src); setImageLoadError(false); }}
                      className={`p-1.5 rounded-xl border bg-white flex flex-col items-center gap-1 transition-all ${
                        tempPhotoUrl === preset.src ? 'border-pink-500 ring-2 ring-pink-500' : 'border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                        <img src={preset.src} alt={preset.title} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-900 truncate w-full text-center">
                        {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 3. File Upload */}
              {activePhotoTab === 'upload' && (
                <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center space-y-2">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-medium">Click below to upload a photo from your computer</p>
                  <label className="inline-block py-2 px-4 bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold rounded-xl cursor-pointer border border-slate-600 transition-colors">
                    <span>Browse Image File</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setTempPhotoUrl('')}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors text-left"
              >
                Clear Photo
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoModalProduct(null)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>

                {tempPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => handleApplyPhotoToAll(tempPhotoUrl)}
                    className="px-3.5 py-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1"
                    title="Set this photo for every frame in the catalog"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Apply to ALL Frames</span>
                  </button>
                )}

                <button
                  onClick={handleSavePhoto}
                  className="px-5 py-2 bg-[#e01a76] hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PRICE ================= */}
      {priceModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-display">Update Frame Price</h3>
                <p className="text-xs text-slate-400">{priceModalProduct.name}</p>
              </div>
              <button
                onClick={() => setPriceModalProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Selling Price (₹) <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-pink-500 font-display"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">This is the final checkout price shown to customers.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Original Strikethrough Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={tempOriginalPrice}
                    onChange={(e) => setTempOriginalPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-base font-medium text-slate-300 focus:outline-none focus:border-pink-500 font-display"
                  />
                </div>
              </div>

              {/* Calculated Discount Preview */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Customer Discount:</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {tempOriginalPrice > tempPrice 
                    ? `${Math.round(((tempOriginalPrice - tempPrice) / tempOriginalPrice) * 100)}% OFF` 
                    : 'No discount'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPriceModalProduct(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrice}
                className="px-5 py-2 bg-[#e01a76] hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Save New Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW FRAME ================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-display">Add New Eyewear Frame</h3>
                <p className="text-xs text-slate-400">Add an optical frame to Roshan Chasma Ghar catalog</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Frame Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roshan Heritage Sovereign Square"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as FrameCategory })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="eyeglasses">Eyeglasses</option>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="blue-light">Blue-Light</option>
                    <option value="rimless">Rimless</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Shape</label>
                  <select
                    value={newProduct.shape}
                    onChange={(e) => setNewProduct({ ...newProduct, shape: e.target.value as FrameShape })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="square">Square</option>
                    <option value="round">Round</option>
                    <option value="geometric">Geometric / Hexagonal</option>
                    <option value="aviator">Aviator / Navigator</option>
                    <option value="cat-eye">Cat-Eye</option>
                    <option value="pantoscopic">Pantoscopic</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Material</label>
                  <select
                    value={newProduct.material}
                    onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value as FrameMaterial })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Pure Feather Titanium">Pure Feather Titanium</option>
                    <option value="Handmade Acetate">Handmade Acetate</option>
                    <option value="Surgical Stainless Steel">Surgical Stainless Steel</option>
                    <option value="Ultem Flexible Memory">Ultem Flexible Memory</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. BESTSELLER, NEW ARRIVAL"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Photo URL or Boutique Photo</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image link or choose below..."
                      value={newProduct.image || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                    {presetPhotos.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setNewProduct({ ...newProduct, image: preset.src })}
                        className={`w-10 h-10 rounded-lg bg-white border p-0.5 shrink-0 ${
                          newProduct.image === preset.src ? 'border-pink-500 ring-2 ring-pink-500' : 'border-slate-700'
                        }`}
                        title={preset.title}
                      >
                        <img src={preset.src} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#e01a76] hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Add Frame to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
