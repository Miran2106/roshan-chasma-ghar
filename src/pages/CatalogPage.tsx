import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Heart,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { EyewearProduct, FrameCategory, FrameShape, FrameMaterial } from '../types/optical';
import { FrameGraphic } from '../components/FrameGraphic';
import { TITANIUM_HERO_IMAGE, LENS_COATINGS } from '../data/products';

interface CatalogPageProps {
  products: EyewearProduct[];
  onNavigate: (page: string, productId?: string) => void;
  onQuickView: (product: EyewearProduct) => void;
  onOpenVirtualTryOn: (product: EyewearProduct) => void;
  onToggleWishlist: (product: EyewearProduct) => void;
  wishlistIds: string[];
  onAddToCart: (product: EyewearProduct) => void;
  onOpenBookEyeTest: () => void;
  onOpenHomeTryOn: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  onNavigate,
  onQuickView,
  onOpenVirtualTryOn,
  onToggleWishlist,
  wishlistIds,
  onAddToCart,
  onOpenBookEyeTest,
  onOpenHomeTryOn,
}) => {
  // Category tab
  const [selectedCategory, setSelectedCategory] = useState<FrameCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Sidebar Filter states
  const [selectedShapes, setSelectedShapes] = useState<FrameShape[]>(['round']);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['Handmade Acetate']);
  const [maxPrice, setMaxPrice] = useState<number>(18000);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [selectedLensReco, setSelectedLensReco] = useState<string[]>(['Single Vision (D/N)']);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const categories: { id: FrameCategory; label: string }[] = [
    { id: 'all', label: 'All Glasses' },
    { id: 'eyeglasses', label: 'Eyeglasses' },
    { id: 'sunglasses', label: 'Sunglasses' },
    { id: 'blue-light', label: 'Computer Blue-Light' },
    { id: 'kids', label: 'Kids Eyewear' },
    { id: 'rimless', label: 'Rimless Titanium' },
  ];

  const shapesList: { id: FrameShape; label: string; count: number }[] = [
    { id: 'round', label: 'Round', count: 48 },
    { id: 'square', label: 'Square', count: 54 },
    { id: 'aviator', label: 'Aviator', count: 26 },
    { id: 'cat-eye', label: 'Cat-Eye', count: 32 },
    { id: 'pantoscopic', label: 'Pantoscopic', count: 14 },
    { id: 'geometric', label: 'Geometric', count: 10 },
  ];

  const materialsList: { id: FrameMaterial; count: number }[] = [
    { id: 'Handmade Acetate', count: 82 },
    { id: 'Pure Feather Titanium', count: 41 },
    { id: 'Surgical Stainless Steel', count: 37 },
    { id: 'Ultem Flexible Memory', count: 24 },
  ];

  const frameTones = [
    { id: 'black', hex: '#111111', title: 'Onyx Black' },
    { id: 'brown', hex: '#6d4c41', title: 'Tortoise / Brown' },
    { id: 'gold', hex: '#d4af37', title: 'Champagne Gold' },
    { id: 'silver', hex: '#b0bec5', title: 'Titanium Frost' },
    { id: 'blue', hex: '#1e3a8a', title: 'Deep Marine' },
    { id: 'crystal', hex: '#f0f4f8', title: 'Clear Crystal' },
  ];

  const toggleShape = (shape: FrameShape) => {
    setSelectedShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
    );
  };

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedShapes([]);
    setSelectedMaterials([]);
    setMaxPrice(18000);
    setSelectedTone(null);
    setSelectedLensReco([]);
    setSearchQuery('');
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'rimless' && !p.isTitanium && p.category !== 'rimless') return false;
        if (selectedCategory === 'blue-light' && !p.isBlueCut && p.category !== 'blue-light') return false;
        if (selectedCategory === 'sunglasses' && !p.isPolarized && p.category !== 'sunglasses') return false;
        if (selectedCategory === 'eyeglasses' && p.category === 'sunglasses') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.shape.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Shape
      if (selectedShapes.length > 0 && !selectedShapes.includes(p.shape)) {
        return false;
      }

      // Material
      if (selectedMaterials.length > 0 && !selectedMaterials.includes(p.material)) {
        return false;
      }

      // Price
      if (p.price > maxPrice) return false;

      // Tone
      if (selectedTone && p.frameTone !== selectedTone) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [products, selectedCategory, searchQuery, selectedShapes, selectedMaterials, maxPrice, selectedTone, sortBy]);

  const spotlightProduct = products.find((p) => p.id === 'roshan-imperial-titanium-01') || products[0];

  return (
    <div className="space-y-12">
      {/* ================= HEADER & CATEGORY TABS ================= */}
      <section className="bg-[#f0ecf4]/60 py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full border border-slate-200 text-[#e01a76] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATELIER OPTICAL COLLECTION 2025</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
            Our Eyewear Collection
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore handcrafted lightweight optical frames, designer sunglasses, and computerized blue-cut lenses crafted for pure visual clarity.
          </p>

          {/* Category Tabs (Smooth Horizontal Scroll on Mobile) */}
          <div className="flex items-center gap-2 pt-4 overflow-x-auto no-scrollbar flex-nowrap px-1 sm:justify-center">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`py-2 px-3.5 sm:px-4 text-xs font-semibold rounded-full transition-all shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#e01a76] text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ================= SPOTLIGHT HERO CARD (ROSHAN IMPERIAL TITANIUM) ================= */}
        <section className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Photo */}
            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[380px] bg-slate-900 overflow-hidden">
              <img
                src={TITANIUM_HERO_IMAGE}
                alt="Roshan Imperial Titanium 01"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1 bg-black/40 backdrop-blur-xs p-4 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#f5c242]">
                  MASTERCRAFT SERIES
                </span>
                <h3 className="text-lg font-bold font-display">Roshan Imperial Titanium 01</h3>
                <p className="text-xs text-slate-300">
                  Japanese aeronautical titanium with 18k electro-gold temple insets, precision-balanced at only 11.4 grams.
                </p>
              </div>
            </div>

            {/* Right Curated Box */}
            <div className="lg:col-span-5 p-8 flex flex-col justify-between bg-white space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#e01a76] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OPTICIAN CURATED CHOICE</span>
                </div>

                <h3 className="text-2xl font-bold font-display text-slate-900">
                  Zero Weight, Unbroken Precision
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Built for daily comfort with our proprietary anti-slip micro-bridge and surgical-grade hypoallergenic temple tips. Paired with certified Zeiss or Essilor anti-glare lenses.
                </p>

                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl font-extrabold text-slate-900 font-display">
                    ₹7,490
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ₹11,500
                  </span>
                  <span className="text-xs font-bold text-[#e01a76] bg-pink-50 px-2 py-0.5 rounded-md">
                    SAVE 35%
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onAddToCart(spotlightProduct)}
                  className="flex-1 py-3 px-4 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>SELECT LENSES &amp; BUY</span>
                </button>

                <button
                  onClick={() => onOpenVirtualTryOn(spotlightProduct)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-[#e01a76]" />
                  <span>3D TRY-ON</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SEARCH & SORT TOOLBAR ================= */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 font-display">
              {filteredProducts.length} Styles Available
            </span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
              Online &amp; In-Store
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-[#e01a76]" />
              <span>Filters</span>
            </button>

            {/* Search Input */}
            <div className="relative flex-1 md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search shape, material, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#e01a76] focus:bg-white"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#e01a76]"
            >
              <option value="featured">Sort: Featured Picks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* ================= MAIN CATALOG WITH LEFT FILTERS SIDEBAR ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
                  Filters
                </span>
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-bold text-[#e01a76] hover:underline"
                >
                  RESET ALL
                </button>
              </div>

              {/* Frame Shape Checkboxes */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  FRAME SHAPE
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {shapesList.map((shape) => {
                    const checked = selectedShapes.includes(shape.id);
                    return (
                      <label
                        key={shape.id}
                        className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleShape(shape.id)}
                          className="accent-[#e01a76] w-3.5 h-3.5 rounded"
                        />
                        <span>{shape.label} ({shape.count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Material Checkboxes */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  MATERIAL
                </span>
                <div className="space-y-2 text-xs">
                  {materialsList.map((mat) => {
                    const checked = selectedMaterials.includes(mat.id);
                    return (
                      <label
                        key={mat.id}
                        className="flex items-center justify-between cursor-pointer text-slate-700 hover:text-slate-900"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleMaterial(mat.id)}
                            className="accent-[#e01a76] w-3.5 h-3.5 rounded"
                          />
                          <span>{mat.id}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">{mat.count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                  <span className="text-slate-500 uppercase tracking-wider">PRICE RANGE</span>
                  <span className="text-[#e01a76]">₹1,500 – ₹{maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="18000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#e01a76] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹1.5k</span>
                  <span>₹10k</span>
                  <span>₹18k+</span>
                </div>
              </div>

              {/* Frame Tone Swatches */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  FRAME TONE
                </span>
                <div className="flex items-center gap-2">
                  {frameTones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(selectedTone === tone.id ? null : tone.id)}
                      className={`w-6 h-6 rounded-full transition-transform border ${
                        selectedTone === tone.id
                          ? 'ring-2 ring-offset-2 ring-[#e01a76] scale-110'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: tone.hex }}
                      title={tone.title}
                    />
                  ))}
                </div>
              </div>

              {/* Lens Recommendation Checkboxes */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  LENS RECOMMENDATION
                </span>
                <div className="space-y-2 text-xs">
                  {['Single Vision (D/N)', 'Zeiss Progressive Corridor', 'Zero-Glare BlueShield'].map((lens) => (
                    <label key={lens} className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedLensReco.includes(lens)}
                        onChange={() =>
                          setSelectedLensReco((prev) =>
                            prev.includes(lens) ? prev.filter((l) => l !== lens) : [...prev, lens]
                          )
                        }
                        className="accent-[#e01a76] w-3.5 h-3.5 rounded"
                      />
                      <span>{lens}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Doctor's Tip Card in Sidebar */}
            <div className="bg-pink-50/70 p-5 rounded-2xl border border-pink-200/60 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#e01a76]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Doctor&apos;s Tip</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Need help deciphering cylinder, axis, or addition values? Book our senior certified optometrist.
              </p>
              <button
                onClick={onOpenBookEyeTest}
                className="text-xs font-bold text-[#e01a76] hover:underline flex items-center gap-1 pt-1"
              >
                <span>BOOK EYE TEST ONLINE</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </aside>

          {/* Product Grid (9 cols) */}
          <div className="lg:col-span-9 space-y-8">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <p className="text-sm font-semibold text-slate-800">No frames match your current filter settings.</p>
                <p className="text-xs text-slate-500">Try expanding your price range or clearing shape filters.</p>
                <button
                  onClick={resetFilters}
                  className="py-2 px-4 bg-[#e01a76] text-white text-xs font-semibold rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.slice(0, visibleCount).map((prod) => {
                  const isWishlisted = wishlistIds.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                    >
                      {/* Badge & Heart */}
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
                          aria-label="Save frame"
                        >
                          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-[#e01a76] text-[#e01a76]' : ''}`} />
                        </button>
                      </div>

                      {/* Optical Photo or SVG Display */}
                      <div
                        onClick={() => onQuickView(prod)}
                        className="cursor-pointer px-2 sm:px-4 py-2 sm:py-4 aspect-[4/3] flex items-center justify-center bg-slate-50/50 group-hover:bg-slate-50 transition-colors overflow-hidden"
                      >
                        {prod.image || prod.colors[0]?.image ? (
                          <img
                            src={prod.image || prod.colors[0]?.image}
                            alt={prod.name}
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

                      {/* Meta & Buttons */}
                      <div className="p-2.5 sm:p-5 text-center space-y-1 sm:space-y-2">
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-display">
                          {prod.shapeLabel}
                        </span>

                        <h3
                          onClick={() => onNavigate('product', prod.id)}
                          className="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer hover:text-[#e01a76] transition-colors truncate"
                        >
                          {prod.name}
                        </h3>

                        <p className="text-[10px] sm:text-[11px] text-slate-500">
                          {prod.sizeCategory} · {prod.dimensions.lensWidth}-{prod.dimensions.bridge}
                        </p>

                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-0.5">
                          <span className="text-xs sm:text-base font-bold text-slate-900 font-display">
                            ₹{prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice > prod.price && (
                            <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                              ₹{prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
                          <button
                            onClick={() => onQuickView(prod)}
                            className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] sm:text-xs font-semibold rounded-lg transition-colors"
                          >
                            QUICK VIEW
                          </button>
                          <button
                            onClick={() => onAddToCart(prod)}
                            className="flex-1 py-1.5 px-2 sm:px-3 bg-[#e01a76] hover:bg-[#b7005d] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-2xs whitespace-nowrap"
                          >
                            BUY NOW
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination / Load More Footer */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} frames
              </span>

              {visibleCount < filteredProducts.length && (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="py-2.5 px-6 bg-[#e01a76] hover:bg-[#b7005d] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-2xs"
                >
                  LOAD MORE FRAMES
                </button>
              )}

              <div className="flex items-center gap-1.5 text-xs">
                <button className="w-8 h-8 rounded-md bg-[#121217] text-white font-bold">1</button>
                <button className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-700">2</button>
                <button className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-700">3</button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-700">31</button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TRY 4 FRAMES AT HOME FREE BANNER ================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e01a76] uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5" />
                <span>HOME TRY-ON EXPERIENCE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                Try 4 Frames At Home Free — Zero Deposit.
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Pick your four favorite silhouettes online. We ship them right to your doorstep for 3 days of hassle-free fitting with your family before deciding. Return courier is complimentary.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenHomeTryOn}
                  className="py-3 px-6 bg-[#121217] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <span>ORDER HOME TRY-ON KIT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onOpenHomeTryOn}
                  className="text-xs font-bold text-slate-700 hover:text-[#e01a76] uppercase tracking-wider flex items-center gap-1"
                >
                  <span>HOW IT WORKS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right 4 Grid Value Props */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                <Truck className="w-5 h-5 text-[#e01a76] mx-auto" />
                <h4 className="text-xs font-bold text-slate-900">100% Free</h4>
                <p className="text-[11px] text-slate-500">Both-Way Delivery</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#e01a76] mx-auto" />
                <h4 className="text-xs font-bold text-slate-900">No Card Hold</h4>
                <p className="text-[11px] text-slate-500">Zero Hidden Fees</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                <Sparkles className="w-5 h-5 text-[#e01a76] mx-auto" />
                <h4 className="text-xs font-bold text-slate-900">Free PD Ruler</h4>
                <p className="text-[11px] text-slate-500">Pupillary Tool</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                <RotateCcw className="w-5 h-5 text-[#e01a76] mx-auto" />
                <h4 className="text-xs font-bold text-slate-900">Optician Call</h4>
                <p className="text-[11px] text-slate-500">Video Verification</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ROSHAN PRECISION LENS COATINGS ================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#e01a76] font-display">
                MEDICAL GRADE OPTOMETRY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                Roshan Precision Lens Coatings
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Every pair is laser-etched and surface-treated in our certified laboratory to eliminate digital fatigue and reflections.
              </p>
            </div>

            <button
              onClick={() => onNavigate('clinic')}
              className="text-xs font-bold text-[#e01a76] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>EXPLORE CLINICAL EYE CARE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LENS_COATINGS.map((coating, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {coating.tag}
                  </span>
                  <h3 className="text-base font-bold font-display text-slate-900">
                    {coating.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {coating.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#e01a76]">
                  <Check className="w-3.5 h-3.5" />
                  <span>{coating.feature}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Filter Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-sm font-bold font-display text-slate-900">Filter Eyewear</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Shape */}
            <div>
              <span className="text-xs font-bold text-slate-600 uppercase block mb-2">Shape</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {shapesList.map((shape) => (
                  <label key={shape.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedShapes.includes(shape.id)}
                      onChange={() => toggleShape(shape.id)}
                      className="accent-[#e01a76]"
                    />
                    <span>{shape.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <span className="text-xs font-bold text-slate-600 uppercase block mb-2">
                Max Price: ₹{maxPrice}
              </span>
              <input
                type="range"
                min="1500"
                max="18000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#e01a76]"
              />
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#e01a76] text-white rounded-lg text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
