import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Confession } from '../types';

interface ShareModalProps {
  confession: Confession;
  onClose: () => void;
}

function getShareUrl(id: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}#/confession/${id}`;
}

function getShareText(confession: Confession): string {
  const snippet = confession.text.length > 100 ? confession.text.slice(0, 100) + '…' : confession.text;
  return `"${snippet}" — a confession shared on Open Confess`;
}

/** Attempts the native Web Share API (mobile). Returns true if it was used. */
export async function tryNativeShare(confession: Confession): Promise<boolean> {
  const nav = navigator as Navigator & {
    share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
  };
  if (typeof navigator !== 'undefined' && typeof nav.share === 'function') {
    try {
      await nav.share({
        title: 'Open Confess',
        text: getShareText(confession),
        url: getShareUrl(confession.id),
      });
      return true;
    } catch {
      // User cancelled the native sheet, or share failed — caller should
      // fall back to the popover modal.
      return false;
    }
  }
  return false;
}

export default function ShareModal({ confession, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const url = getShareUrl(confession.id);
  const text = getShareText(confession);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const links = [
    {
      label: 'WhatsApp',
      color: 'bg-[#25D366]',
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    },
    {
      label: 'X (Twitter)',
      color: 'bg-black',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Facebook',
      color: 'bg-[#1877F2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore, button still shows.
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:w-96 sm:rounded-2xl rounded-t-2xl bg-white p-5 pb-8 sm:pb-5 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-gray-900">Share this confession</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <span
                className={`w-12 h-12 rounded-full ${l.color} flex items-center justify-center text-white text-xs font-semibold group-hover:opacity-90 transition-opacity`}
              >
                {l.label.slice(0, 2)}
              </span>
              <span className="text-xs text-gray-600">{l.label}</span>
            </a>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium rounded-xl py-3"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-blush-600" />
              Link copied to clipboard!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy post link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
