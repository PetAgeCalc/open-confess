import React, { useState } from 'react';
import { MoreVertical, Heart } from 'lucide-react';

export type LegalTopic = 'privacy' | 'terms' | 'rules' | 'about';

export interface HeaderProps {
  selectedRegion?: string | null;
  onRegionChange?: (region: string | null) => void;
  onOpenLegal?: (topic: LegalTopic) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRegionChange,
  onOpenLegal,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fff8f5]/95 backdrop-blur-md border-b border-[#f3e3dd] px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Left: Bada Heart Box + Bada Pure Red Open Confess */}
        <div 
          onClick={() => onRegionChange && onRegionChange(null)}
          className="flex items-center gap-2.5 cursor-pointer select-none active:scale-95 transition-transform"
        >
          {/* Bada Heart Logo */}
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md"
            style={{
              background: 'linear-gradient(135deg, #f95738 0%, #ee4266 100%)',
              boxShadow: '0 4px 12px rgba(238, 66, 102, 0.35)'
            }}
          >
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>

          {/* Bada Title - Poora Red/Coral Color */}
          <span 
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: '#ee4266' }}
          >
            Open Confess
          </span>
        </div>

        {/* Right: Three Dots Menu */}
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-stone-200/60 text-stone-700 transition-colors"
            aria-label="Menu"
          >
            <MoreVertical className="w-6 h-6" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 text-sm font-medium">
              <button
                onClick={() => { onOpenLegal && onOpenLegal('about'); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-stone-50 text-stone-700"
              >
                About
              </button>
              <button
                onClick={() => { onOpenLegal && onOpenLegal('rules'); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-stone-50 text-stone-700"
              >
                Community Rules
              </button>
              <button
                onClick={() => { onOpenLegal && onOpenLegal('terms'); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-stone-50 text-stone-700"
              >
                Terms of Service
              </button>
              <button
                onClick={() => { onOpenLegal && onOpenLegal('privacy'); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-stone-50 text-stone-700"
              >
                Privacy Policy
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
