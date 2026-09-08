import { useState, useRef, useEffect } from 'react';
import { Heart, MoreVertical } from 'lucide-react';
import RegionFilterBox from './RegionFilterBox';

export type LegalTopic =
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'disclaimer';

interface HeaderProps {
  selectedRegion: string | null;
  onRegionChange: (region: string | null) => void;
  onOpenLegal: (topic: LegalTopic) => void;
}

const MENU_ITEMS: { key: LegalTopic; label: string }[] = [
  { key: 'about', label: 'About Us' },
  { key: 'contact', label: 'Contact Us' },
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'terms', label: 'Terms of Service' },
  { key: 'disclaimer', label: 'Disclaimer & Moderation' },
];

export default function Header({ selectedRegion, onRegionChange, onOpenLegal }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-blush-100">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blush-400 to-plum-500 flex items-center justify-center">
            <Heart className="w-[18px] h-[18px] text-white" fill="white" strokeWidth={0} />
          </div>
          <span className="font-display text-lg sm:text-xl font-semibold bg-gradient-to-r from-blush-600 to-plum-600 bg-clip-text text-transparent whitespace-nowrap">
            Open Confess
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <RegionFilterBox selectedRegion={selectedRegion} onRegionChange={onRegionChange} />
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            aria-label="More options"
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-blush-50 hover:text-blush-600 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 animate-fade-in">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onOpenLegal(item.key);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blush-50 hover:text-blush-700 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
