import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Confession } from '../types';

interface ShareModalProps {
  confession: Confession;
  onClose: () => void;
}

function getShareUrl(id: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/api/og?post=${id}`;
}

function getShareText(confession: Confession): string {
  const snippet = confession.text.length > 100 ? confession.text.slice(0, 100) + '…' : confession.text;
  return `"${snippet}" — a confession shared on Open Confess`;
}

/** Attempts the native Web Share API (mobile). Returns true if it was used. */
export async function tryNativeShare(confession: Confession): Promise<boolean> {
  const imageUrl = (confession as any).imageUrl || (confession as any).image;
  const shareText = getShareText(confession);
  const shareUrl = getShareUrl(confession.id);

  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      if (imageUrl && 'canShare' in navigator) {
        try {
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const ext = blob.type.split('/')[1] || 'jpg';
          const file = new File([blob], `confession.${ext}`, { type: blob.type });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Open Confess',
              text: `${shareText}\n${shareUrl}`,
              files: [file],
            });
            return true;
          }
        } catch {
          // File share fetch fail hone par normal native share trigger hoga
        }
      }

      await navigator.share({
        title: 'Open Confess',
        text: shareText,
        url: shareUrl,
      });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export default function ShareModal({ confession, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const url = getShareUrl(confession.id);
  const text = getShareText(confession);
  const imageUrl = (confession as any).imageUrl || (confession as any).image;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.openconfess.com';

  // Backend se bana banaya ready-to-share payload ya fallback text with photo link
  const readyPayload = (confession as any).sharePayload || `"${confession.text}"\n\n📸 Photo: ${imageUrl || url}\n\n👉 Open Confess: ${origin}`;

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // WhatsApp Share Handler
  async function handleWhatsAppShare(e: React.MouseEvent) {
    e.preventDefault();
    if (imageUrl && typeof navigator !== 'undefined' && 'canShare' in navigator) {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `confession.${ext}`, { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Open Confess',
            text: readyPayload,
            files: [file],
          });
          onClose();
          return;
        }
      } catch (err) {}
    }
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(readyPayload)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  }

  // Telegram Share Handler
  async function handleTelegramShare(e: React.MouseEvent) {
    e.preventDefault();
    if (imageUrl && typeof navigator !== 'undefined' && 'canShare' in navigator) {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `confession.${ext}`, { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Open Confess',
            text: readyPayload,
            files: [file],
          });
          onClose();
          return;
        }
      } catch (err) {}
    }
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(imageUrl || url)}&text=${encodeURIComponent(`"${confession.text}"\n\n👉 Open Confess: ${origin}`)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
    onClose();
  }

  // 7 Popular Social Platforms
  const socialPlatforms = [
    {
      label: 'WhatsApp',
      color: 'bg-[#25D366]',
      iconText: 'WA',
      onClick: handleWhatsAppShare,
    },
    {
      label: 'X (Twitter)',
      color: 'bg-black',
      iconText: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(readyPayload)}`,
    },
    {
      label: 'Facebook',
      color: 'bg-[#1877F2]',
      iconText: 'FB',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl || url)}&quote=${encodeURIComponent(`"${confession.text}"`)}`,
    },
    {
      label: 'Telegram',
      color: 'bg-[#229ED9]',
      iconText: 'TG',
      onClick: handleTelegramShare,
    },
    {
      label: 'LinkedIn',
      color: 'bg-[#0A66C2]',
      iconText: 'IN',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(imageUrl || url)}`,
    },
    {
      label: 'Reddit',
      color: 'bg-[#FF4500]',
      iconText: 'RD',
      href: `https://reddit.com/submit?url=${encodeURIComponent(imageUrl || url)}&title=${encodeURIComponent(confession.text.slice(0, 80))}`,
    },
    {
      label: 'Pinterest',
      color: 'bg-[#E60023]',
      iconText: 'Pin',
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(origin)}&media=${encodeURIComponent(imageUrl || '')}&description=${encodeURIComponent(confession.text)}`,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(readyPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:w-[420px] max-h-[90vh] overflow-y-auto sm:rounded-3xl rounded-t-3xl bg-[#f7f3ee] p-5 sm:p-6 shadow-2xl text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Share Confession</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Card Preview Box */}
        <div className="rounded-2xl overflow-hidden bg-[#ebe4db] border border-stone-300/60 shadow-inner mb-5">
          {imageUrl && !imgError ? (
            <div className="w-full h-40 overflow-hidden relative bg-stone-300">
              <img
                src={imageUrl}
                alt="Post Preview"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-24 bg-stone-300/70 flex items-center justify-center text-xs text-stone-500 font-medium">
              Open Confess Post
            </div>
          )}
          <div className="p-3.5">
            <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed font-serif line-clamp-3">
              "{confession.text}"
            </p>
          </div>
        </div>

        {/* 7 Popular Social Platforms Grid */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 mb-6 justify-items-center">
          {socialPlatforms.map((p) => {
            if (p.onClick) {
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={p.onClick}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <span
                    className={`w-12 h-12 rounded-full ${p.color} flex items-center justify-center text-white text-xs font-bold group-hover:scale-105 transition-transform shadow-md`}
                  >
                    {p.iconText}
                  </span>
                  <span className="text-[11px] text-stone-600 font-medium text-center">{p.label}</span>
                </button>
              );
            }

            return (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <span
                  className={`w-12 h-12 rounded-full ${p.color} flex items-center justify-center text-white text-xs font-bold group-hover:scale-105 transition-transform shadow-md`}
                >
                  {p.iconText}
                </span>
                <span className="text-[11px] text-stone-600 font-medium text-center">{p.label}</span>
              </a>
            );
          })}
        </div>

        {/* Copy Direct Link Button */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 bg-stone-200/90 hover:bg-stone-300 text-stone-800 text-sm font-semibold rounded-xl py-3 transition-colors cursor-pointer shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                Copied to clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-600" />
                Copy Direct Link & Text
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
