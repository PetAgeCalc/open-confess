import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { getAllRegionsWithCounts, getTotalPostCount } from '../lib/confessionService';

interface RegionFilterBoxProps {
  selectedRegion: string | null;
  onRegionChange: (region: string | null) => void;
}

export default function RegionFilterBox({ selectedRegion, onRegionChange }: RegionFilterBoxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const rawRegions = useMemo(() => {
    try {
      return getAllRegionsWithCounts() || [];
    } catch {
      return [];
    }
  }, []);

  const totalCount = useMemo(() => {
    try {
      return getTotalPostCount() || 0;
    } catch {
      return 0;
    }
  }, []);

  // Countries extraction & list
  const countries = useMemo(() => {
    const countryMap = new Map<string, number>();

    rawRegions.forEach((item) => {
      if (!item || !item.region) return;
      const parts = item.region.split(',').map((p) => p.trim());
      const countryName = parts[parts.length - 1];

      if (countryName) {
        countryMap.set(countryName, (countryMap.get(countryName) ?? 0) + (item.count || 1));
      }
    });

    const fallbackList = [
      'India',
      'United States',
      'United Kingdom',
      'Canada',
      'Australia',
      'Germany',
      'Bangladesh',
      'Pakistan',
      'Nepal',
      'United Arab Emirates',
    ];
    fallbackList.forEach((c) => {
      if (!countryMap.has(c)) countryMap.set(c, 0);
    });

    return Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, [rawRegions]);

  const filteredCountries = useMemo(() => {
    if (!query.trim()) return countries;
    const q = query.toLowerCase().trim();
    return countries.filter((c) => c.country.toLowerCase().includes(q));
  }, [countries, query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    // Sirf 'click' listener use hoga taaki button ke onPointerDown se pehle close na ho
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Instant direct trigger for both Desktop & Mobile
  const handleSelectCountry = (country: string | null) => {
    onRegionChange(country);
    setQuery(country || '');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        const found = countries.find((c) => c.country.toLowerCase() === trimmed.toLowerCase());
        handleSelectCountry(found ? found.country : trimmed);
      } else {
        handleSelectCountry(null);
      }
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className="flex items-center gap-2 bg-[#faefe6] border border-[#ebd8c8] rounded-full px-3.5 py-1.5 sm:py-2 cursor-text"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 text-rose-500 shrink-0" />
        <input
          value={open ? query : (selectedRegion ?? query)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            if (selectedRegion && !query) setQuery(selectedRegion);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search country (e.g. Australia)..."
          className="bg-transparent text-xs sm:text-sm w-full outline-none placeholder:text-stone-400 text-stone-800"
        />
        {Boolean(selectedRegion || query) && (
          <button
            type="button"
            aria-label="Clear region filter"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSelectCountry(null);
              setQuery('');
            }}
            className="text-stone-400 hover:text-stone-600 shrink-0 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div
          className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-stone-200 z-[9999] p-1.5 animate-in fade-in zoom-in-95"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* All Worldwide Button */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSelectCountry(null);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-xl hover:bg-rose-50 text-stone-700 cursor-pointer transition-colors"
          >
            <span className="font-semibold text-rose-600">All Worldwide (Global)</span>
            <span className="text-xs text-stone-400">{totalCount}</span>
          </button>

          {/* Filtered Country Items */}
          {filteredCountries.map((c) => (
            <button
              key={c.country}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelectCountry(c.country);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs sm:text-sm rounded-xl hover:bg-rose-50 text-stone-800 font-medium cursor-pointer transition-colors active:bg-rose-100"
            >
              <span>{c.country}</span>
              {c.count > 0 && <span className="text-xs text-stone-400">{c.count}</span>}
            </button>
          ))}

          {filteredCountries.length === 0 && (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelectCountry(query.trim());
              }}
              className="w-full px-3 py-2.5 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer text-center font-medium"
            >
              Search "{query.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
