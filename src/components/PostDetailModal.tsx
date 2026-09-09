import React, { useState, useEffect, useRef } from 'react';
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

const EMOJI_OPTIONS = [
  { label: 'Love', emoji: '❤️' },
  { label: 'Hug', emoji: '🫂' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Support', emoji: '👏' },
  { label: 'Fire', emoji: '🔥' },
  { label: 'Haha', emoji: '😂' },
  { label: 'Wow', emoji: '😮' },
  { label: 'Heartbroken', emoji: '💔' },
  { label: 'Pray', emoji: '🙏' },
  { label: '100', emoji: '💯' },
];

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ confession, onClose }) => {
  const post = confession as Record<string, any>;

  const author = String(post.authorName || post.author || 'Anonymous');
  const location = [post.city, post.country].filter(Boolean).join(', ') || (post.location ? String(post.location) : '');
  const initialLikes = Number(post.likesCount ?? post.likes ?? 0) || 0;
  const imageUrl = post.imageUrl || post.image || '';
  const textContent = String(post.text || post.content || '');

  // Emoji Reaction State
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [reactionCount, setReactionCount] = useState<number>(initialLikes);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const formatTime = (timeVal: any): string => {
    if (!timeVal) return '';
    const num = Number(timeVal);
    if (!isNaN(num) && num > 1000000000) {
      const diffMins = Math.floor((Date.now() - num) / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    }
    return String(timeVal);
  };

  const getCleanAuthor = (val: any): string => {
    if (!val) return 'Anonymous';
    const str = String(val).trim();
    if (/^\d{10,}$/.test(str)) return 'Anonymous';
    return str;
  };

  const [commentsList, setCommentsList] = useState<CommentItem[]>(() => {
    const rawList = Array.isArray(post.commentsList) 
      ? post.commentsList 
      : Array.isArray(post.comments) 
      ? post.comments 
      : [];

    if (rawList.length > 0) {
      return rawList.map((c: any, index: number) => ({
        id: String(c.id || index),
        author: getCleanAuthor(c.authorName || c.author || c.userName),
        text: String(c.text || c.content || c.comment || ''),
        createdAt: formatTime(c.createdAt || c.timestamp || c.date || (typeof c.author === 'number' ? c.author : null))
      }));
    }

    return [
      { id: '1', author: 'Anonymous', text: 'This made my chest hurt in a good way. Thank you for sharing.', createdAt: '2h ago' },
      { id: '2', author: 'Anonymous', text: 'The fact that you stayed friends with her says a lot about your character.', createdAt: '1h ago' },
      { id: '3', author: 'Anonymous', text: 'Quiet love is still real love. Sending you strength.', createdAt: '35m ago' }
    ];
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

  useEffect(() => {
    if (!pickerOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [pickerOpen]);

  function handleSelectReaction(emoji: string) {
    if (selectedEmoji === emoji) {
      setSelectedEmoji(null);
      setReactionCount((prev) => Math.max(0, prev - 1));
    } else {
      if (!selectedEmoji) {
        setReactionCount((prev) => prev + 1);
      }
      setSelectedEmoji(emoji);
    }
    setPickerOpen(false);
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
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
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

          {/* Reactions Bar with Full Emoji Palette */}
          <div className="flex items-center gap-6 pt-4 border-t border-stone-100 text-sm">
            <div ref={pickerRef} className="relative">
              <button 
                type="button"
                onClick={() => setPickerOpen(!pickerOpen)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
                  selectedEmoji 
                    ? 'border-rose-300 bg-rose-50 text-rose-600 font-medium shadow-sm' 
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {selectedEmoji ? (
                  <span className="text-xl leading-none">{selectedEmoji}</span>
                ) : (
                  <Heart className="w-5 h-5 text-stone-500 hover:text-rose-500 transition-colors" />
                )}
                <span>{reactionCount}</span>
              </button>

              {/* Multi-Emoji Reaction Drawer */}
              {pickerOpen && (
                <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 sm:gap-1.5 p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 z-30 overflow-x-auto max-w-[85vw] sm:max-w-none animate-in fade-in zoom-in-95 duration-100">
                  {EMOJI_OPTIONS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSelectReaction(item.emoji)}
                      className={`text-2xl p-1.5 sm:p-2 rounded-xl transition-all hover:scale-125 active:scale-90 cursor-pointer shrink-0 ${
                        selectedEmoji === item.emoji ? 'bg-rose-100 scale-110' : 'hover:bg-stone-100'
                      }`}
                      title={item.label}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span>{comm.author}</span>
                    </div>
                    {comm.createdAt && (
                      <span className="text-[11px] text-stone-400">{comm.createdAt}</span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 pl-7 leading-relaxed">
                    {comm.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
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
