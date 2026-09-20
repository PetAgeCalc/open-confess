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

  const post = confession as Record<string, any>;
  const postId = String(post.id || post._id || '');

  // 1. Post ka Real Text Content
  const rawText = String(post.text || post.content || post.body || '').trim();
  const cleanSnippet = rawText.length > 140 ? rawText.slice(0, 140) + '...' : rawText;

  // 2. Exact Post Link (Website + Post ID)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://open-confess.vercel.app';
  const postUrl = postId ? `${baseUrl}/?post=${encodeURIComponent(postId)}` : baseUrl;

  // 3. Image URL
  const imageUrl = String(post.imageUrl || post.image || '').trim();

  // 4. Clean Payload Messages (No broken encoded symbols)
  const fullShareText = `"${cleanSnippet}"\n\n👉 Read on Open Confess:\n${postUrl}`;

  // Social Links
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${cleanSnippet}"`)}&url=${encodeURIComponent(postUrl)}&hashtags=OpenConfess`;
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(`"${cleanSnippet}"`)}`;

  // Copy Direct Link & Text
  const handleCopy = () => {
    const textToCopy = fullShareText;
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

  // Mobile Native Share (Photo + Text direct app me transfer)
  const handleNativeShare = async () => {
    setSharingNative(true);
    try {
      if (navigator.share) {
        const shareData: ShareData = {
          title: 'Open Confess',
          text: fullShareText,
          url: postUrl,
        };

        // Agar post me photo hai toh as File share karein
        if (imageUrl && navigator.canShare) {
          try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            const file = new File([blob], 'confession.jpg', { type: blob.type || 'image/jpeg' });
            if (navigator.canShare({ files: [file] })) {
              shareData.files = [file];
            }
          } catch {
            // Blob share fallback
          }
        }

        await navigator.share(shareData);
        onClose();
      } else {
        handleCopy();
      }
    } catch {
      // User cancelled
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

        {/* Post Preview Card */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-left space-y-2">
          {Boolean(imageUrl) && (
            <div className="w-full h-28 rounded-xl overflow-hidden bg-stone-200">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <p className="text-xs text-stone-600 italic line-clamp-2 font-serif">
            "{cleanSnippet}"
          </p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-4 gap-3 pt-1">
          {/* WhatsApp */}
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

          {/* X */}
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

          {/* Facebook */}
          <a
            href={fbShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              f
            </div>
            <span>Facebook</span>
          </a>

          {/* Telegram */}
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

        {/* Share Image Card (All Apps) Button */}
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

        {/* Copy Direct Post Link */}
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Direct Post Link Copied!' : 'Copy Direct Link'}</span>
        </button>
      </div>
    </div>
  );
}
