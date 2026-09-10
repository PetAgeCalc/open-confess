import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, MapPin } from 'lucide-react';
import { Confession, ReactionEmoji } from '../types';
import { setReaction } from '../lib/confessionService';

interface ConfessionCardProps {
  confession: Confession;
  onOpen: () => void;
  onReactionChange?: (postId: string, emoji: string | null) => void;
}

const EMOJI_OPTIONS: { label: string; emoji: ReactionEmoji }[] = [
  { label: 'Love', emoji: '❤️' },
  { label: 'Hug', emoji: '🫂' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Support', emoji: '👏' },
  { label: 'Fire', emoji: '🔥' },
  { label: 'Haha', emoji: '😂' },
  { label: 'Wow', emoji: '😮' },
  { label: 'Broken', emoji: '💔' },
  { label: 'Pray', emoji: '🙏' },
  { label: '100', emoji: '💯' },
];

export default function ConfessionCard({ confession, onOpen, onReactionChange }: ConfessionCardProps) {
  const post = confession as Record<string, any>;
  const postId = String(post.id || post._id || '');

  // Base counts
  const initialLikes = Number(post.likesCount ?? post.likes ?? 0) || 0;
  const initialComments = Number(post.commentsCount ?? post.comments ?? (post.commentsList?.length || 0)) || 0;

  const [likes, setLikes] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [userReaction, setUserReaction] = useState<ReactionEmoji | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Sync initial state and user's saved reaction
  useEffect(() => {
    setLikes(Number(post.likesCount ?? post.likes ?? 0) || 0);
    setCommentsCount(Number(post.commentsCount ?? post.comments ?? (post.commentsList?.length || 0)) || 0);

    if (postId) {
      try {
        const stored = JSON.parse(localStorage.getItem('openconfess_user_reactions') || '{}');
        if (stored[postId] && typeof stored[postId] === 'string') {
          setUserReaction(stored[postId] as ReactionEmoji);
          return;
        }
      } catch (e) {
        // ignore error
      }
    }
    setUserReaction(null);
  }, [postId]);

  // Handle direct emoji selection from the tray
  async function handleEmojiSelect(e: React.MouseEvent, emoji: ReactionEmoji) {
    e.preventDefault();
    e.stopPropagation();

    if (!postId) return;

    const previousReaction = userReaction;
    const nextReaction: ReactionEmoji | null = userReaction === emoji ? null : emoji;

    // 1. Instant local visual update
    setUserReaction(nextReaction);
    if (!previousReaction && nextReaction) {
      setLikes((prev) => prev + 1);
    } else if (previousReaction && !nextReaction) {
      setLikes((prev) => Math.max(0, prev - 1));
    }
    setPickerOpen(false);

    // 2. Local storage persistence so it remembers on refresh
    try {
      const stored = JSON.parse(localStorage.getItem('openconfess_user_reactions') || '{}');
      if (nextReaction) {
        stored[postId] = nextReaction;
      } else {
        delete stored[postId];
      }
      localStorage.setItem('openconfess_user_reactions', JSON.stringify(stored));
    } catch (err) {
      console.error('LocalStorage error:', err);
    }

    // 3. Parent notification
    if (onReactionChange) {
      onReactionChange(postId, nextReaction);
    }

    // 4. Send to backend service (Firestore / Local stats)
    try {
      await setReaction(postId, previousReaction, nextReaction);
    } catch (err) {
      console.error('Service setReaction failed:', err);
    }
  }

  // Toggle picker or quick toggle
  function handleMainButtonClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPickerOpen((prev) => !prev);
  }

  const author = post.authorName || post.author || 'Anonymous';
  const location = [post.city, post.country].filter(Boolean).join(', ') || (post.location ? String(post.location) : '');
  const imageUrl = post.imageUrl || post.image || '';
  const textContent = post.text || post.content || '';

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

      {/* Image if available */}
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
        
        {/* Reaction Button & Picker Container */}
        <div 
          className="relative" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            onClick={handleMainButtonClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
              userReaction 
                ? 'border-rose-300 bg-rose-50 text-rose-600 font-medium' 
                : 'border-stone-200 hover:bg-stone-50 text-stone-600'
            }`}
          >
            {userReaction ? (
              <span className="text-base leading-none">{userReaction}</span>
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
                  onClick={(e) => handleEmojiSelect(e, item.emoji)}
                  className={`text-xl p-1.5 rounded-xl hover:scale-125 active:scale-90 transition-all ${
                    userReaction === item.emoji ? 'bg-rose-100 scale-110' : 'hover:bg-stone-100'
                  }`}
                  title={item.label}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Count Display */}
        <div className="flex items-center gap-1.5 text-stone-500">
          <MessageCircle className="w-4 h-4 text-stone-400" />
          <span>{commentsCount} comments</span>
        </div>

      </div>
    </article>
  );
}
