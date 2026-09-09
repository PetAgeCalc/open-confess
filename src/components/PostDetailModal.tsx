import React, { useEffect } from 'react';
import { X, Heart, MessageCircle, MapPin, Send } from 'lucide-react';
import { Confession } from '../types';

interface PostDetailModalProps {
  confession: Confession;
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ confession, onClose }) => {
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

  if (!confession) return null;

  const post = confession as Record<string, any>;
  const author = String(post.authorName || post.author || 'Anonymous');
  const location = [post.city, post.country].filter(Boolean).join(', ') || (post.location ? String(post.location) : '');
  const likes = Number(post.likesCount ?? post.likes ?? 0) || 0;
  const comments = Number(post.commentsCount ?? post.comments ?? 0) || 0;
  const imageUrl = post.imageUrl || post.image || '';
  const textContent = String(post.text || post.content || '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Responsive Full-Width Container for Desktop and Mobile */}
      <div className="relative w-full max-w-full md:max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-white shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Confession
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-5">
          
          {/* Post Image: Scales cleanly across desktop widths */}
          {Boolean(imageUrl) && (
            <div className="w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 max-h-[420px]">
              <img 
                src={imageUrl} 
                alt="Confession" 
                className="w-full h-full max-h-[420px] object-cover block"
              />
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 flex-wrap">
            <span className="font-semibold text-stone-800">
              {author}
            </span>
            {Boolean(location) && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {location}
                </span>
              </>
            )}
            <span>•</span>
            <span>Recent</span>
          </div>

          {/* Confession Body */}
          <p className="text-stone-900 text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
            {textContent}
          </p>

          {/* Reactions */}
          <div className="flex items-center gap-6 pt-4 border-t border-stone-100 text-sm text-stone-500">
            <div className="flex items-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer">
              <Heart className="w-5 h-5" />
              <span className="font-medium">{likes}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-stone-800 transition-colors cursor-pointer">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{comments} comments</span>
            </div>
          </div>

          {/* Comment Form */}
          <div className="pt-3 space-y-3">
            <input
              type="text"
              placeholder="Anonymous (leave blank to stay anonymous)"
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-rose-300 text-stone-800 placeholder:text-stone-400"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-rose-300 text-stone-800 placeholder:text-stone-400"
              />
              <button 
                className="p-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors shrink-0 shadow-sm"
                aria-label="Send"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PostDetailModal;
