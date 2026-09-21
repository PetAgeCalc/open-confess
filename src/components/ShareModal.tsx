import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Confession } from '../types';

interface ShareModalProps {
  confession: Confession;
  onClose: () => void;
}

export default function ShareModal({ confession, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

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

  // 3. Social Intent Links (sab 100% working URL-intent links, koi login/API key nahi chahiye)
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${cleanSnippet}\n\n${shareTargetUrl}`)}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(cleanSnippet)}&url=${encodeURIComponent(shareTargetUrl)}&hashtags=OpenConfess`;
  // quote param add kiya taaki Facebook composer pehle se text ke saath khule aur
  // "Please add something and try again" error na aaye, jo pehle link card ko drop kar deta tha
  const fbClassicUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareTargetUrl)}&quote=${encodeURIComponent(cleanSnippet)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareTargetUrl)}&text=${encodeURIComponent(cleanSnippet)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareTargetUrl)}`;
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shareTargetUrl)}&title=${encodeURIComponent(cleanSnippet)}`;
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareTargetUrl)}&description=${encodeURIComponent(cleanSnippet)}${imageUrl ? `&media=${encodeURIComponent(imageUrl)}` : ''}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent('A confession on Open Confess')}&body=${encodeURIComponent(`${cleanSnippet}\n\n${shareTargetUrl}`)}`;

  // 4. Copy to clipboard (untouched — pehle se hi perfect kaam kar raha hai)
  const handleCopy = () => {
    const textToCopy = `${cleanSnippet}\n\n${shareTargetUrl}`;
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

  const SOCIAL_PLATFORMS = [
    { label: 'WhatsApp', href: whatsappUrl, bg: 'bg-emerald-500', icon: '💬' },
    { label: 'X', href: xShareUrl, bg: 'bg-black', icon: '𝕏' },
    { label: 'Facebook', href: fbClassicUrl, bg: 'bg-blue-600', icon: 'f' },
    { label: 'Telegram', href: telegramUrl, bg: 'bg-sky-500', icon: '✈️' },
    { label: 'LinkedIn', href: linkedinUrl, bg: 'bg-[#0A66C2]', icon: 'in' },
    { label: 'Reddit', href: redditUrl, bg: 'bg-[#FF4500]', icon: '👽' },
    { label: 'Pinterest', href: pinterestUrl, bg: 'bg-[#E60023]', icon: 'P' },
    { label: 'Email', href: emailUrl, bg: 'bg-stone-600', icon: '✉️' },
  ];

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

        {/* Card Preview — jaisa pehle tha, waisa hi rakha gaya hai */}
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

        {/* Social Platforms — 8 icons, 2 rows */}
        <div className="grid grid-cols-4 gap-3 pt-1">
          {SOCIAL_PLATFORMS.map((platform) => (
            <a
              key={platform.label}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80 transition-opacity"
            >
              <div className={`w-12 h-12 rounded-full ${platform.bg} text-white flex items-center justify-center text-lg font-bold shadow-sm`}>
                {platform.icon}
              </div>
              <span>{platform.label}</span>
            </a>
          ))}
        </div>

        {/* Direct Link Copy — bilkul waisa hi, isse touch nahi kiya */}
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
