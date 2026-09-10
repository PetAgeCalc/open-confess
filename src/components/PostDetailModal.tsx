import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, MapPin } from 'lucide-react';
import { Confession } from '../types';
import { setReaction } from '../lib/confessionService';

interface ConfessionCardProps {
  confession: Confession;
  onOpen: () => void;
  onReactionChange?: (postId: string, emoji: string | null) => void;
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

export default function ConfessionCard({ confession, onOpen, onReactionChange }: ConfessionCardProps) {
  const post = confession as Record<string, any>;
  const postId = String(post.id || post._id || '');

  const author = post.authorName || post.author || 'Anonymous';
  const location = [post.city, post.country].filter(Boolean).join(', ') || (post.location ? String(post.location) : '');
  const imageUrl = post.imageUrl || post.image || '';
  const textContent = post.text || post.content || '';

  const initialLikes = Number(post.likesCount ?? post.likes ?? 0) || 0;
  const initialComments = Number(post.commentsCount ?? post.comments ?? (post.commentsList?.length || 0)) || 0;

  const [likes, setLikes] = useState<number>(initialLikes);
  const [commentsCount, setCommentsCount] = useState<number>(initialComments);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sync props and load persistent user reaction
  useEffect(() => {
    setLikes(Number(post.likesCount ?? post.likes ?? 0) || 0);
    setCommentsCount(Number(post.commentsCount ?? post.comments ?? (post.commentsList?.length || 0)) || 0);

    if (postId) {
      try {
        const stored = JSON.parse(localStorage.getItem('openconfess_user_reactions') || '{}');
        if (stored[postId]) {
          setSelectedEmoji(stored[postId]);
          return;
        }
      } catch (e) {
        // ignore
      }
    }
    setSelectedEmoji(null);
  }, [postId, post.likesCount, post.likes, post.commentsCount]);

  // Click outside to close emoji tray without opening post
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

  // Modal jaisa same instant reaction calculation
  async function handleSelectReaction(e: React.MouseEvent, emoji: string) {
    e.preventDefault();
    e.stopPropagation();

    let nextCount = likes;
    let nextEmoji: string | null = null;
    const prevEmoji = selectedEmoji;

    if (selectedEmoji === emoji) {
      // Deselect (cancel reaction)
      nextEmoji = null;
      nextCount = Math.max(0, likes - 1);
    } else {
      // First time reaction or swap
      if (!selectedEmoji) {
        nextCount = likes + 1;
      }
      nextEmoji = emoji;
    }

    // 1. Instant local screen update
    setSelectedEmoji(nextEmoji);
    setLikes(nextCount);
    setPickerOpen(false);

    // 2. Local storage persistence
    try {
      const stored = JSON.parse(localStorage.getItem('openconfess_user_reactions') || '{}');
      if (nextEmoji) {
        stored[postId] = nextEmoji;
      } else {
        delete stored[postId];
      }
      localStorage.setItem('openconfess_user_reactions', JSON.stringify(stored));
    } catch (err) {
      console.error(err);
    }

    // 3. Inform parent feed
    if (onReactionChange) {
      onReactionChange(postId, nextEmoji);
    }

    // 4. Update Database
    if (postId) {
      try {
        await setReaction(postId, prevEmoji as any, nextEmoji as any);
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <article 
      onClick={onOpen}
      className="w-full bg-white rounded-3xl border border-stone-200/70 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-visible select-none"
    >
      {/* Header Info */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-3 flex-wrap">
        <span className="font-semibold text-stone-800">{author}</span>
        {Boolean(location) && (
          <>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {location}
            </span>
          </>
        )}
        <span>•</span>
        <span>Recent</span>
      </div>

      {/* Post Image */}
      {Boolean(imageUrl) && (
        <div className="w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 mb-4 max-h-72 sm:max-h-96">
          <img 
            src={imageUrl} 
            alt="Confession" 
            className="w-full h-full object-cover block"
            onError={(e) => {
              (e.target as HTMLElement).parentElement?.classList.add('hidden');
            }}
          />
        </div>
      )}

      {/* Content */}
      <p className="text-stone-800 text-sm sm:text-base leading-relaxed line-clamp-4 mb-4 whitespace-pre-wrap">
        {textContent}
      </p>

      {/* Footer Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-stone-100 text-xs sm:text-sm text-stone-600 relative">
        
        {/* Emoji Button & Picker */}
        <div 
          ref={pickerRef}
          className="relative z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPickerOpen(!pickerOpen);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
              selectedEmoji 
                ? 'border-rose-300 bg-rose-50 text-rose-600 font-medium' 
                : 'border-stone-200 hover:bg-stone-50 text-stone-600'
            }`}
          >
            {selectedEmoji ? (
              <span className="text-base leading-none">{selectedEmoji}</span>
            ) : (
              <Heart className="w-4 h-4 text-stone-400 hover:text-rose-500" />
            )}
            <span className="font-semibold">{likes}</span>
          </button>

          {/* Reaction Tray */}
          {pickerOpen && (
            <div 
              className="absolute bottom-full left-0 mb-2 flex items-center gap-1 p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 z-50 overflow-x-auto max-w-[85vw] sm:max-w-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {EMOJI_OPTIONS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={(e) => handleSelectReaction(e, item.emoji)}
                  className={`text-xl p-1.5 rounded-xl hover:scale-125 active:scale-90 transition-all cursor-pointer ${
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

        {/* Comment Count */}
        <div className="flex items-center gap-1.5 text-stone-500">
          <MessageCircle className="w-4 h-4 text-stone-400" />
          <span>{commentsCount} comments</span>
        </div>

      </div>
    </article>
  );
}
