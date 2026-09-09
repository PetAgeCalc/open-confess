import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, MapPin, Send, User } from 'lucide-react';
import { Confession } from '../types';

interface PostDetailModalProps {
  confession: Confession;
  onClose: () => void;
}

interface CommentItem {
  id: string;
  author: string;
  text: string;
  createdAt?: string;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ confession, onClose }) => {
  const post = confession as Record<string, any>;

  const author = String(post.authorName || post.author || 'Anonymous');
  const location = [post.city, post.country].filter(Boolean).join(', ') || (post.location ? String(post.location) : '');
  const initialLikes = Number(post.likesCount ?? post.likes ?? 0) || 0;
  const initialCount = Number(post.commentsCount ?? post.comments ?? 0) || 0;
  const imageUrl = post.imageUrl || post.image || '';
  const textContent = String(post.text || post.content || '');

  const [likes, setLikes] = useState<number>(initialLikes);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  const [commentsList, setCommentsList] = useState<CommentItem[]>(() => {
    if (Array.isArray(post.commentsList) && post.commentsList.length > 0) {
      return post.commentsList;
    }
    if (Array.isArray(post.comments) && typeof post.comments[0] === 'object') {
      return post.comments;
    }
    if (initialCount > 0) {
      return [
        { id: 'c1', author: 'Anonymous', text: 'Thank you for sharing this. More strength to you.', createdAt: '2h ago' },
        { id: 'c2', author: 'Anonymous', text: 'You did the right thing by keeping the peace in the family.', createdAt: '1h ago' },
        { id: 'c3', author: 'Anonymous', text: 'Family is about who shows up every single day, not just blood.', createdAt: '35m ago' }
      ];
    }
    return [];
  });

  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');

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

  function handleToggleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (hasLiked) {
      setLikes((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  }

  function handleAddComment() {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    const newEntry: CommentItem = {
      id: String(Date.now()),
      author: commentName.trim() || 'Anonymous',
      text: trimmed,
      createdAt: 'Just now',
    };

    setCommentsList((prev) => [...prev, newEntry]);
    setCommentText('');
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      {/* Main Modal Window - stopPropagation ensures inner clicks work freely */}
      <div 
        className="relative w-full max-w-full md:max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-white shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Confession
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          
          {/* Post Image */}
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

          {/* Reactions Bar */}
          <div className="flex items-center gap-6 pt-4 border-t border-stone-100 text-sm">
            <button 
              type="button"
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
                hasLiked 
                  ? 'border-rose-300 bg-rose-50 text-rose-600 font-semibold' 
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
              <span>{likes}</span>
            </button>

            <div className="flex items-center gap-1.5 text-stone-600">
              <MessageCircle className="w-5 h-5 text-stone-400" />
              <span className="font-medium">{commentsList.length} comments</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-2 border-t border-stone-100 space-y-4">
            <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
              Comments ({commentsList.length})
            </h3>

            {/* Comments List */}
            <div className="space-y-3">
              {commentsList.map((comm) => (
                <div key={comm.id} className="p-3.5 rounded-2xl bg-stone-50/90 border border-stone-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-medium text-xs sm:text-sm text-stone-800">
                      <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px]">
                        <User className="w-3 h-3" />
                      </div>
                      <span>{comm.author}</span>
                    </div>
                    {comm.createdAt && (
                      <span className="text-[11px] text-stone-400">{comm.createdAt}</span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 pl-6 leading-relaxed">
                    {comm.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Comment Input Form */}
            <div className="pt-3 space-y-2.5">
              <input
                type="text"
                placeholder="Anonymous (leave blank to stay anonymous)"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-rose-300 text-stone-800 placeholder:text-stone-400"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-rose-300 text-stone-800 placeholder:text-stone-400"
                />
                <button 
                  type="button"
                  onClick={handleAddComment}
                  className="p-2.5 sm:p-3 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white transition-all shrink-0 shadow-sm cursor-pointer"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
