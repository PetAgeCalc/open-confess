import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Heart, Search, MapPin, X, RotateCw, Flame, Plus } from 'lucide-react';
import RegionFilterBox from './RegionFilterBox';

export type LegalTopic = 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';

export interface HeaderProps {
  selectedRegion?: string | null;
  onRegionChange?: (region: string | null) => void;
  onOpenLegal?: (topic: LegalTopic) => void;
  activeTab?: 'fresh' | 'trending';
  refreshing?: boolean;
  onFreshClick?: () => void;
  onTabChange?: (tab: 'fresh' | 'trending') => void;
  onOpenCreate?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRegion,
  onRegionChange,
  onOpenLegal,
  activeTab = 'fresh',
  refreshing = false,
  onFreshClick,
  onTabChange,
  onOpenCreate,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (menuOpen && menuContainerRef.current && !menuContainerRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (searchOpen && searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [menuOpen, searchOpen]);

  function handleSelectRegion(region: string | null) {
    if (onRegionChange) {
      onRegionChange(region);
    }
    setSearchOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#f3e6d8]/95 backdrop-blur-md border-b border-[#ebd8c8] shadow-sm">
      {/* Top Row: Logo + Search + Menu (Gap bilkul zero) */}
      <div className="px-3 sm:px-4 pt-2 pb-1.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          
          {/* Logo */}
          <div 
            onClick={() => handleSelectRegion(null)}
            className="flex items-center gap-1.5 cursor-pointer select-none shrink-0"
          >
            <div 
              className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md shrink-0"
              style={{
                background: 'linear-gradient(135deg, #f95738 0%, #ee4266 100%)',
                boxShadow: '0 3px 10px rgba(238, 66, 102, 0.35)'
              }}
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span 
              className="text-lg sm:text-xl font-extrabold tracking-tight"
              style={{ color: '#ee4266' }}
            >
              Open Confess
            </span>
          </div>

          {/* Search Box */}
          <div ref={searchContainerRef} className="relative shrink min-w-0 max-w-[130px] sm:max-w-xs">
            {selectedRegion ? (
              <div className="flex items-center justify-between gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
                <span className="truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  {selectedRegion}
                </span>
                <button 
                  type="button"
                  onClick={() => handleSelectRegion(null)}
                  className="p-0.5 rounded-full hover:bg-rose-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-full flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#faefe6] text-stone-600 text-xs hover:bg-[#f3e6d8] transition-colors border border-[#ebd8c8]"
              >
                <Search className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate text-stone-500">Search</span>
              </button>
            )}

            {searchOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-[99]">
                <RegionFilterBox 
                  selectedRegion={selectedRegion}
                  onSelectRegion={(reg: string | null) => handleSelectRegion(reg)}
                  onClose={() => setSearchOpen(false)}
                />
              </div>
            )}
          </div>

          {/* 3-Dots Menu */}
          <div ref={menuContainerRef} className="relative shrink-0">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-full hover:bg-stone-200/70 text-stone-700 transition-colors"
              aria-label="Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2.5 z-[99] divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-100">
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => { onOpenLegal?.('about'); setMenuOpen(false); }}
                    style={{ fontSize: '16.5px', fontWeight: 600 }}
                    className="w-full text-left px-5 py-3 hover:bg-rose-50 text-stone-800 transition-colors block"
                  >
                    About Us
                  </button>
                  <button
                    type="button"
                    onClick={() => { onOpenLegal?.('contact'); setMenuOpen(false); }}
                    style={{ fontSize: '16.5px', fontWeight: 600 }}
                    className="w-full text-left px-5 py-3 hover:bg-rose-50 text-stone-800 transition-colors block"
                  >
                    Contact Us
                  </button>
                  <button
                    type="button"
                    onClick={() => { onOpenLegal?.('privacy'); setMenuOpen(false); }}
                    style={{ fontSize: '16.5px', fontWeight: 600 }}
                    className="w-full text-left px-5 py-3 hover:bg-rose-50 text-stone-800 transition-colors block"
                  >
                    Privacy Policy
                  </button>
                  <button
                    type="button"
                    onClick={() => { onOpenLegal?.('terms'); setMenuOpen(false); }}
                    style={{ fontSize: '16.5px', fontWeight: 600 }}
                    className="w-full text-left px-5 py-3 hover:bg-rose-50 text-stone-800 transition-colors block"
                  >
                    Terms of Service
                  </button>
                  <button
                    type="button"
                    onClick={() => { onOpenLegal?.('disclaimer'); setMenuOpen(false); }}
                    style={{ fontSize: '16.5px', fontWeight: 600 }}
                    className="w-full text-left px-5 py-3 hover:bg-rose-50 text-stone-800 transition-colors block"
                  >
                    Disclaimer & Moderation
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Buttons Row - Green line ki jagah seamless touch */}
      <div className="w-full px-4 pb-2 pt-0.5">
        <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
          <div className="inline-flex items-center p-1 rounded-full bg-[#faefe6] border border-[#ebd8c8] shadow-sm">
            <button
              type="button"
              onClick={() => {
                if (onFreshClick) onFreshClick();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                activeTab === 'fresh'
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <RotateCw 
                className={`w-3.5 h-3.5 text-[#10b981] ${refreshing ? 'animate-spin' : ''}`} 
              />
              <span>Fresh</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onTabChange) onTabChange('trending');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                activeTab === 'trending'
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenCreate) onOpenCreate();
            }}
            className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-full text-white font-semibold text-xs md:text-sm shadow-md active:scale-95 transition-all cursor-pointer select-none shrink-0"
            style={{
              background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="leading-none tracking-normal">Confess</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
