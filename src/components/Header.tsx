import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, Glasses, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, productId?: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenBookEyeTest: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenBookEyeTest,
  onOpenSearch,
  onOpenWishlist,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, openAuthModal, openAccountDrawer } = useAuth();

  const handleAccountClick = () => {
    if (user) {
      openAccountDrawer();
    } else {
      openAuthModal('signin');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'catalog', label: 'Eyewear Catalog' },
    { id: 'clinic', label: 'Eye Care & Clinic' },
    { id: 'offers', label: 'Special Offers' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#121217] text-white border-b border-white/10 select-none shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: Brand Wordmark */}
          <BrandLogo
            size="md"
            variant="dark"
            onClick={() => onNavigate('home')}
            className="shrink-0"
          />

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#303035] text-white shadow-inner font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Search, Wishlist, Bag, Profile, Book Eye Test) */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Search Catalog"
              title="Search styles, materials, shapes"
            >
              <Search className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Wishlist"
              title="Saved Silhouettes"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#e01a76] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart / Optical Bag */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Optical Bag"
              title="View Optical Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#e01a76] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Concierge */}
            <button
              onClick={handleAccountClick}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-white/10"
              aria-label="Customer Account"
              title={user ? `Signed in as ${profile?.full_name || user.email}` : "Sign In to Account"}
            >
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-3 h-3 text-amber-300" />
              </div>
              <span className="text-xs font-medium">
                {user ? (profile?.full_name ? profile.full_name.split(' ')[0] : 'Account') : 'Sign In'}
              </span>
            </button>

            {/* Primary Action Button: BOOK EYE TEST (Tablet & Desktop) */}
            <button
              onClick={onOpenBookEyeTest}
              className="hidden sm:inline-flex py-2.5 px-3.5 sm:px-5 bg-[#e01a76] hover:bg-[#b7005d] text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-95"
            >
              BOOK EYE TEST
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-0.5"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1b1b20] border-t border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === link.id
                  ? 'bg-[#303035] text-white font-semibold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                handleAccountClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 border border-white/10"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>{user ? `Account (${profile?.full_name || user.email})` : 'Sign In / Account'}</span>
            </button>
            <button
              onClick={() => {
                onOpenBookEyeTest();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#e01a76] text-white font-semibold text-xs uppercase tracking-wider rounded-lg"
            >
              Schedule Eye Examination
            </button>
            <button
              onClick={() => {
                onNavigate('cart');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-white/10 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Review Optical Bag ({cartCount} frames)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
