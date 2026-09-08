import React, { useState } from 'react';
import { MoreVertical, Heart, Search, MapPin, X } from 'lucide-react';

export type LegalTopic = 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';

export interface HeaderProps {
  selectedRegion?: string | null;
  onRegionChange?: (region: string | null) => void;
  onOpenLegal?: (topic: LegalTopic) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRegion,
  onRegionChange,
  onOpenLegal,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  function handleSelectRegion(region: string | null) {
    if (onRegionChange) {
      onRegionChange(region);
    }
    setSearchOpen(false);
    setSearchValue('');
  }

  return (
    <header className="sticky top-0 z-40 bg-[#fff8f5]/95 backdrop-blur-md border-b border-[#f3e3dd] px-3 sm:px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Logo + Name */}
        <div 
          onClick={() => handleSelectRegion(null)}
          className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform shrink-0"
        >
          <div 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-md shrink-0"
            style={{
              background: 'linear-gradient(135deg, #f95738 0%, #ee4266 100%)',
              boxShadow: '0 4px 12px rgba(238, 66, 102, 0.35)'
            }}
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
          </div>

          <span 
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
            style={{ color: '#ee4266' }}
          >
            Open Confess
          </span>
        </div>

        {/* Center: Search City / Region Pill */}
        <div className="relative flex-1 max-w-xs mx-1">
          {selectedRegion ? (
            <div className="flex items-center justify-between gap-1 px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
              <span className="truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                {selectedRegion}
              </span>
              <button 
                onClick={() => handleSelectRegion(null)}
                className="p-0.5 rounded-full hover:bg-rose-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fcedea] text-stone-600 text-xs hover:bg-[#f8e0db] transition-colors border border-rose-100"
            >
              <Search className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate text-stone-500">Search city or region...</span>
            </button>
          )}

          {/* Search Dropdown */}
          {searchOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-stone-50 rounded-xl border border-stone-200">
                <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type city or country..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchValue.trim()) {
                      handleSelectRegion(searchValue.trim());
                    }
                  }}
                  className="w-full bg-transparent text-xs text-stone-800 outline-none placeholder:text-stone-400"
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {searchValue.trim() && (
                <button
                  onClick={() => handleSelectRegion(searchValue.trim())}
                  className="mt-1.5 w-full text-left px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 font-medium"
                >
                  <MapPin className="w-3 h-3" />
                  Filter by "{searchValue.trim()}"
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: 3 Dots Menu Button */}
        <div className="relative shrink-0">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-stone-200/70 text-stone-800 transition-colors"
            aria-label="Menu"
          >
            <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dropdown Menu Items */}
          {menuOpen && (
            <>
              {/* Invisible backdrop to close on outside click */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setMenuOpen(false)} 
              />
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 text-xs sm:text-sm font-medium divide-y divide-stone-100">
                <div className="py-1">
                  <button
                    onClick={() => { onOpenLegal?.('about'); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-stone-800 transition-colors"
                  >
                    About Us
                  </button>
                  <button
                    onClick={() => { onOpenLegal?.('contact'); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-stone-800 transition-colors"
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={() => { onOpenLegal?.('privacy'); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-stone-800 transition-colors"
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={() => { onOpenLegal?.('terms'); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-stone-800 transition-colors"
                  >
                    Terms of Service
                  </button>
                  <button
                    onClick={() => { onOpenLegal?.('disclaimer'); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-stone-800 transition-colors"
                  >
                    Disclaimer & Moderation
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
