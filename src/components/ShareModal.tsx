import React, { useState } from 'react';
import { X, Copy, Check, Share2, Loader2 } from 'lucide-react';
import { Confession } from '../types';

interface ShareModalProps {
  confession: Confession;
  onClose: () => void;
}

export default function ShareModal({ confession, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [sharingNative, setSharingNative] = useState(false);
  const [fbNotice, setFbNotice] = useState(false);

  const post = confession as Record<string, any>;
  const postId = String(post.id || post._id || '').trim();

  // 1. Text snippet cleanup
  const rawText = String(post.text || post.content || post.body || '').trim();
  const cleanSnippet = rawText.length > 120 ? `${rawText.slice(0, 120)}...` : rawText;

  // 2. Dynamic Base URL (Vercel ya custom domain auto-detect)
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://open-confess.vercel.app';

  // Social preview link points directly to /api/og
  const shareTargetUrl = postId ? `${origin}/api/og?post=${postId}` : origin;
  const imageUrl = String(post.imageUrl || post.image || '').trim();

  // 3. Social Intent Links
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${cleanSnippet}\n\n${shareTargetUrl}`)}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(cleanSnippet)}&url=${encodeURIComponent(shareTargetUrl)}&hashtags=OpenConfess`;
  const fbClassicUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareTargetUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareTargetUrl)}&text=${encodeURIComponent(cleanSnippet)}`;

  // 4. Copy to clipboard
  const handleCopy = (customText?: string) => {
    const textToCopy = customText || `${cleanSnippet}\n\n${shareTargetUrl}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const input = document.createElement('textarea');
      input.value = textToCopy;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFacebookClick = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareTargetUrl);
      }
    } catch {}
    setFbNotice(true);
    setTimeout(() => setFbNotice(false), 3000);
  };

  // 5. Native Mobile Share API
  const handleNativeShare = async () => {
    setSharingNative(true);
    try {
      if (navigator.share) {
        const shareData: ShareData = {
          title: 'Open Confess',
          text: `${cleanSnippet}\n\nRead more:`,
          url: shareTargetUrl,
        };

        if (imageUrl && navigator.canShare) {
          try {
            const res = await fetch(imageUrl, { mode: 'cors' });
            const blob = await res.blob();
            const file = new File([blob], 'confession.jpg', { type: blob.type || 'image/jpeg' });
            if (navigator.canShare({ files: [file] })) {
              shareData.files = [file];
            }
          } catch {}
        }

        await navigator.share(shareData);
        onClose();
      } else {
        handleCopy();
      }
    } catch {
      // Dismissed
    } finally {
      setSharingNative(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 space-y-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="font-semibold text-stone-800 text-sm sm:text-base">Share Confession</h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-left space-y-2">
          {Boolean(imageUrl) && (
            <div className="w-full h-28 rounded-xl overflow-hidden bg-stone-200">
              <img src={imageUrl} alt="Card preview" className="w-full h-full object-cover" />
            </div>
          )}
          <p className="text-xs text-stone-600 italic line-clamp-2 font-serif">
            "{cleanSnippet}"
          </p>
        </div>

        {fbNotice && (
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs animate-pulse">
            Link copied! If Facebook post box is empty, simply long press and paste.
          </div>
        )}

        {/* Social Platforms */}
        <div className="grid grid-cols-4 gap-3 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl shadow-sm">
              💬
            </div>
            <span>WhatsApp</span>
          </a>

          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold shadow-sm">
              𝕏
            </div>
            <span>X</span>
          </a>

          <a
            href={fbClassicUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleFacebookClick}
            className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              f
            </div>
            <span>Facebook</span>
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center text-xl shadow-sm">
              ✈️
            </div>
            <span>Telegram</span>
          </a>
        </div>

        {/* Native Mobile Sheet */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            disabled={sharingNative}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {sharingNative ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            <span>{sharingNative ? 'Preparing Card...' : 'Share Image Card (All Apps)'}</span>
          </button>
        )}

        {/* Direct Link Copy */}
        <button
          type="button"
          onClick={() => handleCopy()}
          className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Direct Post Link Copied!' : 'Copy Direct Link'}</span>
        </button>
      </div>
    </div>
  );
}
