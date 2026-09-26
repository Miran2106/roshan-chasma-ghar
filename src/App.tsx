import React, { useState, useEffect } from 'react';
import { PRODUCTS, LENS_OPTIONS } from './data/products';
import { EyewearProduct, CartItem, PrescriptionData, LensOpticalType, AccessoryItem } from './types/optical';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { ClinicPage } from './pages/ClinicPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OffersPage } from './pages/OffersPage';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { BookEyeTestModal } from './components/BookEyeTestModal';
import { QuickViewModal } from './components/QuickViewModal';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { HomeTryOnModal } from './components/HomeTryOnModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { UserAccountDrawer } from './components/UserAccountDrawer';
import { fetchProducts } from './services/supabaseService';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('aurelia-titanium-round');

  // Initial cart items matching Image 5 (Aurelia Sovereign Round + Kallan Pantoscopic Acetate)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const aurelia = PRODUCTS.find((p) => p.id === 'aurelia-titanium-round') || PRODUCTS[0];
    const kallan = PRODUCTS.find((p) => p.id === 'kallan-pantoscopic-acetate') || PRODUCTS[2];

    return [
      {
        cartId: 'item-init-1',
        product: aurelia,
        selectedColor: 'Champagne Gold',
        selectedLens: 'zeiss-progressive',
        lensPrice: 0, // In Image 5 final price is ₹4,899
        quantity: 1,
      },
      {
        cartId: 'item-init-2',
        product: kallan,
        selectedColor: 'Tokyo Tortoise',
        selectedLens: 'zero-power',
        lensPrice: 0, // In Image 5 final price is ₹3,150
        quantity: 1,
      },
    ];
  });

  // Initial Wishlist matching count '3' in screenshot badge
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'aero-black-pantos',
    'optique-feather-rimless',
    'havana-bold-square',
  ]);

  // Modals state
  const [bookEyeTestOpen, setBookEyeTestOpen] = useState(false);
  const [virtualTryOnProduct, setVirtualTryOnProduct] = useState<EyewearProduct | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<EyewearProduct | null>(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [attachedPrescription, setAttachedPrescription] = useState<PrescriptionData | null>(null);
  const [homeTryOnOpen, setHomeTryOnOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // URL Hash synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash.startsWith('product/')) {
        const prodId = hash.split('/')[1];
        if (prodId) {
          setSelectedProductId(prodId);
          setCurrentPage('product');
        }
      } else if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string, productId?: string) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
      window.location.hash = `#/product/${productId}`;
    } else {
      window.location.hash = `#/${page}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (
    product: EyewearProduct,
    color?: string,
    lensType: LensOpticalType = 'zero-power'
  ) => {
    const lensObj = LENS_OPTIONS.find((l) => l.id === lensType) || LENS_OPTIONS[0];
    const chosenColor = color || product.defaultColor;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === chosenColor &&
          item.selectedLens === lensType
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartId: `cart-${Date.now()}-${Math.random()}`,
            product,
            selectedColor: chosenColor,
            selectedLens: lensType,
            lensPrice: lensObj.additionalPrice,
            quantity: 1,
            customPrescription: attachedPrescription || undefined,
          },
        ];
      }
    });

    showToast(`Added ${product.name} to your Optical Bag`);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    showToast('Frame removed from bag');
  };

  const handleAddAccessory = (acc: AccessoryItem) => {
    // Add accessory as item
    const dummyProduct: EyewearProduct = {
      id: acc.id,
      sku: `ACC-${acc.id.toUpperCase().slice(0, 6)}`,
      name: acc.name,
      subtitle: acc.category,
      series: 'OPTICAL ACCESSORIES',
      price: acc.price,
      originalPrice: acc.price + 150,
      category: 'all',
      shape: 'round',
      material: 'Surgical Stainless Steel',
      shapeLabel: acc.category,
      sizeCategory: 'Regular',
      dimensions: { lensWidth: 0, bridge: 0, temple: 0, weight: '50g' },
      rating: 4.9,
      reviewCount: 42,
      colors: [{ name: 'Standard', hex: '#333333' }],
      defaultColor: 'Standard',
      description: acc.description,
      craftDetails: 'Laboratory grade optical cleaning accessory.',
      frameTone: 'black',
    };

    handleAddToCart(dummyProduct, 'Standard', 'zero-power');
  };

  // Wishlist operations
  const handleToggleWishlist = (product: EyewearProduct) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`Removed from saved frames`);
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast(`Saved ${product.name} to wishlist`);
    }
  };

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const activeProduct =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#fbf8ff] text-[#1b1b20]">
        {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121217] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-white/10 animate-in slide-in-from-bottom-5">
          <div className="w-5 h-5 rounded-full bg-[#e01a76] text-white flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenBookEyeTest={() => setBookEyeTestOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            products={PRODUCTS}
            onNavigate={handleNavigate}
            onOpenBookEyeTest={() => setBookEyeTestOpen(true)}
            onQuickView={(p) => setQuickViewProduct(p)}
            onOpenVirtualTryOn={(p) => setVirtualTryOnProduct(p)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onAddToCart={(p) => handleAddToCart(p)}
          />
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            products={PRODUCTS}
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
            onOpenVirtualTryOn={(p) => setVirtualTryOnProduct(p)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onAddToCart={(p) => handleAddToCart(p)}
            onOpenBookEyeTest={() => setBookEyeTestOpen(true)}
            onOpenHomeTryOn={() => setHomeTryOnOpen(true)}
          />
        )}

        {currentPage === 'product' && (
          <ProductDetailPage
            product={activeProduct}
            allProducts={PRODUCTS}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onOpenVirtualTryOn={(p) => setVirtualTryOnProduct(p)}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(activeProduct.id)}
            onOpenBookEyeTest={() => setBookEyeTestOpen(true)}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            cartItems={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigate={handleNavigate}
            onOpenPrescriptionModal={() => setPrescriptionModalOpen(true)}
            attachedPrescription={attachedPrescription}
            onAddAccessory={handleAddAccessory}
          />
        )}

        {currentPage === 'clinic' && (
          <ClinicPage
            onOpenBookEyeTest={() => setBookEyeTestOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenBookEyeTest={() => setBookEyeTestOpen(true)}
          />
        )}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'offers' && (
          <OffersPage
            onNavigate={handleNavigate}
            onOpenHomeTryOn={() => setHomeTryOnOpen(true)}
            onOpenBookEyeTest={() => setBookEyeTestOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBookEyeTest={() => setBookEyeTestOpen(true)}
      />

      {/* ================= MODALS & DRAWERS ================= */}

      {/* 3D Virtual Try-On Modal */}
      <VirtualTryOnModal
        product={virtualTryOnProduct}
        isOpen={Boolean(virtualTryOnProduct)}
        onClose={() => setVirtualTryOnProduct(null)}
        onAddToCart={(p, color) => {
          handleAddToCart(p, color);
          setVirtualTryOnProduct(null);
        }}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, color, lens) => {
          handleAddToCart(p, color, lens);
          setQuickViewProduct(null);
        }}
        onOpenVirtualTryOn={(p) => {
          setQuickViewProduct(null);
          setVirtualTryOnProduct(p);
        }}
        onViewProductDetail={(p) => {
          setQuickViewProduct(null);
          handleNavigate('product', p.id);
        }}
      />

      {/* Book Eye Test Modal */}
      <BookEyeTestModal
        isOpen={bookEyeTestOpen}
        onClose={() => setBookEyeTestOpen(false)}
      />

      {/* Prescription Upload & Manual Powers Modal */}
      <PrescriptionUploadModal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        onSavePrescription={(rx) => {
          setAttachedPrescription(rx);
          showToast('Optical Prescription successfully attached to order');
        }}
      />

      {/* Home Try-On Modal */}
      <HomeTryOnModal
        isOpen={homeTryOnOpen}
        onClose={() => setHomeTryOnOpen(false)}
        availableProducts={PRODUCTS}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => handleNavigate('product', p.id)}
        onOpenVirtualTryOn={(p) => setVirtualTryOnProduct(p)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistItems={wishlistProducts}
        onRemoveFromWishlist={(id) => {
          setWishlistIds((prev) => prev.filter((item) => item !== id));
        }}
        onAddToCart={(p) => handleAddToCart(p)}
        onOpenVirtualTryOn={(p) => {
          setWishlistOpen(false);
          setVirtualTryOnProduct(p);
        }}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal />

      {/* Supabase User Account & Orders Drawer */}
      <UserAccountDrawer />
      </div>
    </AuthProvider>
  );
}
