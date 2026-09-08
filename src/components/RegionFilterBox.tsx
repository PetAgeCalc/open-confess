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

  const regions = useMemo(() => getAllRegionsWithCounts(), []);
  const totalCount = useMemo(() => getTotalPostCount(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return regions;
    const q = query.toLowerCase();
    return regions.filter((r) => r.region.toLowerCase().includes(q));
  }, [regions, query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className="flex items-center gap-2 bg-blush-50 border border-blush-100 rounded-full px-3.5 py-2 cursor-text"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 text-blush-500 shrink-0" />
        <input
          value={selectedRegion ?? query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedRegion) onRegionChange(null);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search a city or country..."
          className="bg-transparent text-sm w-full outline-none placeholder:text-gray-400 text-gray-800"
        />
        {selectedRegion && (
          <button
            aria-label="Clear region filter"
            onClick={(e) => {
              e.stopPropagation();
              onRegionChange(null);
              setQuery('');
            }}
            className="text-gray-400 hover:text-gray-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <span className="hidden sm:inline text-xs text-gray-400 shrink-0 whitespace-nowrap">
          {totalCount} confessions
        </span>
      </div>

      {open && (
        <div className="absolute left-0 right-0 mt-2 max-h-72 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100 z-40 animate-fade-in">
          <button
            onClick={() => {
              onRegionChange(null);
              setQuery('');
              setOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-blush-50 text-gray-700"
          >
            <span>All regions</span>
            <span className="text-xs text-gray-400">{totalCount}</span>
          </button>
          {filtered.map((r) => (
            <button
              key={r.region}
              onClick={() => {
                onRegionChange(r.region);
                setQuery('');
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-blush-50 text-gray-700"
            >
              <span>{r.region}</span>
              <span className="text-xs text-gray-400">{r.count}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-400">No matching regions</div>
          )}
        </div>
      )}
    </div>
  );
}
