import React from 'react';
import { Home, Glasses, Calendar, ShoppingBag, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartCount: number;
  onOpenBookEyeTest: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenBookEyeTest,
}) => {
  const { user, profile, openAuthModal, openAccountDrawer } = useAuth();

  const handleAccountClick = () => {
    if (user) {
      openAccountDrawer();
    } else {
      openAuthModal('signin');
    }
  };

  const isHome = currentPage === 'home';
  const isCatalog = currentPage === 'catalog' || currentPage === 'product';
  const isCart = currentPage === 'cart';

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121217]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.35)]"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      {/* 1. Home */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
          isHome ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className={`p-1 rounded-full ${isHome ? 'bg-white/10' : ''}`}>
          <Home className="w-4 h-4" />
        </div>
        <span className={`text-[10px] tracking-tight mt-0.5 ${isHome ? 'font-bold text-amber-300' : 'font-medium'}`}>
          Home
        </span>
      </button>

      {/* 2. Catalog */}
      <button
        onClick={() => onNavigate('catalog')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
          isCatalog ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className={`p-1 rounded-full ${isCatalog ? 'bg-white/10' : ''}`}>
          <Glasses className="w-4 h-4" />
        </div>
        <span className={`text-[10px] tracking-tight mt-0.5 ${isCatalog ? 'font-bold text-amber-300' : 'font-medium'}`}>
          Catalog
        </span>
      </button>

      {/* 3. Center Highlight: Book Eye Test */}
      <button
        onClick={onOpenBookEyeTest}
        className="flex-1 flex flex-col items-center justify-center py-0.5 transition-transform active:scale-95 min-h-[44px]"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#e01a76] to-[#ff4081] text-white flex items-center justify-center shadow-md shadow-[#e01a76]/30 border border-white/20 -mt-3">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <span className="text-[10px] font-bold text-pink-300 tracking-tight mt-0.5">
          Book Test
        </span>
      </button>

      {/* 4. Optical Bag */}
      <button
        onClick={() => onNavigate('cart')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative min-h-[44px] ${
          isCart ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className={`relative p-1 rounded-full ${isCart ? 'bg-white/10' : ''}`}>
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 bg-[#e01a76] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className={`text-[10px] tracking-tight mt-0.5 ${isCart ? 'font-bold text-amber-300' : 'font-medium'}`}>
          Bag {cartCount > 0 ? `(${cartCount})` : ''}
        </span>
      </button>

      {/* 5. Account / Vault */}
      <button
        onClick={handleAccountClick}
        className="flex-1 flex flex-col items-center justify-center py-1 transition-colors text-slate-400 hover:text-slate-200 min-h-[44px]"
      >
        <div className="p-1 rounded-full">
          <User className={`w-4 h-4 ${user ? 'text-amber-300' : ''}`} />
        </div>
        <span className={`text-[10px] tracking-tight mt-0.5 ${user ? 'font-bold text-amber-300' : 'font-medium'}`}>
          {user ? (profile?.full_name ? profile.full_name.split(' ')[0] : 'Vault') : 'Account'}
        </span>
      </button>
    </nav>
  );
};
