import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Confession } from '../types';

interface ShareModalProps {
  confession: Confession;
  onClose: () => void;
}

// Social crawlers aur share previews ke liye dynamic OG URL
function getShareUrl(id: string): string {
  const origin = window.location.origin;
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
          // File share fetch fail hua to normal native share try karega
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
  const url = getShareUrl(confession.id);
  const text = getShareText(confession);
  const imageUrl = (confession as any).imageUrl || (confession as any).image;

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Mobile par image file attach karega, fallback me preview link
  async function handleWhatsAppShare(e: React.MouseEvent) {
    e.preventDefault();
    const fullText = `${text}\n\nRead more at: ${url}`;

    if (imageUrl && typeof navigator !== 'undefined' && 'canShare' in navigator) {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `confession.${ext}`, { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Open Confess',
            text: fullText,
            files: [file],
          });
          onClose();
          return;
        }
      } catch (err) {
        console.log('Native image share fallback:', err);
      }
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  }

  // Telegram direct share
  async function handleTelegramShare(e: React.MouseEvent) {
    e.preventDefault();
    const fullText = `${text}\n\nRead more at: ${url}`;

    if (imageUrl && typeof navigator !== 'undefined' && 'canShare' in navigator) {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `confession.${ext}`, { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Open Confess',
            text: fullText,
            files: [file],
          });
          onClose();
          return;
        }
      } catch (err) {
        console.log('Telegram share fallback:', err);
      }
    }

    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
    onClose();
  }

  // Popular social media links list
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
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Facebook',
      color: 'bg-[#1877F2]',
      iconText: 'FB',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
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
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Reddit',
      color: 'bg-[#FF4500]',
      iconText: 'RD',
      href: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore
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
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Popular Social Media Icons Grid */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-2 mb-5">
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
                    className={`w-12 h-12 rounded-full ${p.color} flex items-center justify-center text-white text-sm font-bold group-hover:opacity-90 transition-opacity shadow-sm`}
                  >
                    {p.iconText}
                  </span>
                  <span className="text-xs text-gray-600 font-medium">{p.label}</span>
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
                  className={`w-12 h-12 rounded-full ${p.color} flex items-center justify-center text-white text-sm font-bold group-hover:opacity-90 transition-opacity shadow-sm`}
                >
                  {p.iconText}
                </span>
                <span className="text-xs text-gray-600 font-medium">{p.label}</span>
              </a>
            );
          })}
        </div>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium rounded-xl py-3 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
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
