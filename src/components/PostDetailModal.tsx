import { useEffect } from 'react';
import { X, Heart, MessageCircle, MapPin, Send } from 'lucide-react';
import { Confession } from '../types';

interface PostDetailModalProps {
  confession: Confession;
  onClose: () => void;
}

export default function PostDetailModal({ confession, onClose }: PostDetailModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Type safe access
  const post = confession as unknown as Record<string, any>;
  const author = post.authorName || post.author || 'Anonymous';
  const locationText = [post.city, post.country].filter(Boolean).join(', ') || post.location || '';
  const likes = post.likesCount ?? post.likes ?? 0;
  const comments = post.commentsCount ?? post.comments ?? 0;
  const image = post.imageUrl || post.image || null;
  const contentText = post.text || post.content || '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      {/* Outside click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Symmetrical Modal Card */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 shrink-0 bg-white">
          <h2 className="font-display text-lg font-bold text-stone-900">
            Confession
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Post Image */}
          {image && (
            <div className="w-full rounded-2xl overflow-hidden bg-stone-100 shadow-sm border border-stone-100">
              <img 
                src={image} 
                alt="Confession" 
                className="w-full h-auto max-h-72 object-cover block"
              />
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
            <span className="font-semibold text-stone-800">
              {author}
            </span>
            {locationText && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {locationText}
                </span>
              </>
            )}
            <span>•</span>
            <span>Recent</span>
          </div>

          {/* Confession Text */}
          <p className="text-stone-900 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {contentText}
          </p>

          {/* Reactions */}
          <div className="flex items-center gap-5 pt-3 border-t border-stone-100 text-xs text-stone-500">
            <div className="flex items-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-stone-800 transition-colors cursor-pointer">
              <MessageCircle className="w-4 h-4" />
              <span>{comments} comments</span>
            </div>
          </div>

          {/* Comment Form */}
          <div className="pt-2 space-y-2.5">
            <input
              type="text"
              placeholder="Anonymous (leave blank to stay anonymous)"
              className="w-full px-4 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-rose-300 text-stone-800 placeholder:text-stone-400"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-rose-300 text-stone-800 placeholder:text-stone-400"
              />
              <button 
                className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors shrink-0 shadow-sm"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
