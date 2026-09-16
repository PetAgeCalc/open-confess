import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, MapPin, Tag, Trash2 } from 'lucide-react';
import { Confession } from '../types';
import { setReaction, deleteConfession } from '../lib/confessionService';

interface ConfessionCardProps {
  confession: Confession;
  onOpen: () => void;
  onReactionChange?: (postId: string, emoji: string | null) => void;
}

const EMOJI_OPTIONS = [
  { label: 'Love', emoji: '❤️' },
  { label: 'Hug', emoji: '🤗' },
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

  // Firestore fields mapping: body, category, imageUrl
  const author = post.authorName || post.author || 'Anonymous';
  const category = post.category || '';
  const location = [post.city, post.country].filter(Boolean).join(', ') || (post.location ? String(post.location) : '');
  const imageUrl = post.imageUrl || post.image || '';
  const textContent = post.body || post.text || post.content || '';

  const initialLikes = Number(post.likesCount ?? post.likes ?? 0) || 0;
  const initialComments = Number(post.commentsCount ?? post.comments ?? (post.commentsList?.length || 0)) || 0;

  const [likes, setLikes] = useState<number>(initialLikes);
  const [commentsCount, setCommentsCount] = useState<number>(initialComments);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Secret Admin check via URL parameter
  const searchParams = new URLSearchParams(window.location.search);
  const isAdmin = searchParams.get('admin') === 'ashim97';

  // Sync initial state and user's saved reaction
  useEffect(() => {
    setLikes(Number(post.likesCount ?? post.likes ?? 0) || 0);
    setCommentsCount(Number(post.commentsCount ?? post.comments ?? (post.commentsList?.length || 0)) || 0);

    if (postId) {
      try {
        const stored = JSON.parse(localStorage.getItem('openconfess_user_reactions') || '{}');
        if (stored && typeof stored[postId] === 'string') {
          setSelectedEmoji(stored[postId]);
          return;
        }
      } catch (e) {
        // ignore
      }
    }
    setSelectedEmoji(null);
  }, [postId, post.likesCount, post.likes, post.commentsCount, post.comments]);

  // Click outside to close tray safely
  useEffect(() => {
    if (!pickerOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [pickerOpen]);

  function handleMainButtonClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPickerOpen((prev) => !prev);
  }

  async function handleDeletePost(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!postId) return;

    const confirmed = window.confirm("Kya aap sach me is confession ko delete karna chahte hain?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const success = await deleteConfession(postId);
      if (success) {
        window.location.reload();
      } else {
        alert("Delete nahi ho paya!");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete karne me koi error aayi.");
      setIsDeleting(false);
    }
  }

  function handleSelectEmoji(e: React.MouseEvent | React.PointerEvent, emoji: string) {
    e.preventDefault();
    e.stopPropagation();

    if (!postId) return;

    const previousReaction = selectedEmoji;
    let nextCount = likes;
    let nextEmoji: string | null = null;

    if (selectedEmoji === emoji) {
      nextEmoji = null;
      nextCount = Math.max(0, likes - 1);
    } else {
      if (!selectedEmoji) {
        nextCount = likes + 1;
      }
      nextEmoji = emoji;
    }

    setSelectedEmoji(nextEmoji);
    setLikes(nextCount);
    setPickerOpen(false);

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

    if (onReactionChange) {
      onReactionChange(postId, nextEmoji);
    }

    setTimeout(async () => {
      try {
        await setReaction(postId, previousReaction as any, nextEmoji as any);
      } catch (err) {
        console.error('Database sync error:', err);
      }
    }, 0);
  }

  return (
    <article
      onClick={onOpen}
      className="w-full bg-white rounded-3xl border border-stone-200/70 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-visible select-none"
    >
      {/* Header Info */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-3 flex-wrap">
        <span className="font-semibold text-stone-800">{author}</span>
        {Boolean(category) && (
          <>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-medium">
              <Tag className="w-3 h-3 shrink-0" />
              {category}
            </span>
          </>
        )}
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

      {/* Post Image: Facebook/X style adaptive fit (No Cropping) */}
      {Boolean(imageUrl) && (
        <div className="w-full rounded-2xl overflow-hidden bg-stone-100/60 border border-stone-100 mb-4 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Confession"
            loading="lazy"
            className="w-full h-auto max-h-[500px] object-contain block mx-auto rounded-2xl transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).parentElement?.classList.add('hidden');
            }}
          />
        </div>
      )}

      {/* Post Content */}
      <p className="text-stone-800 text-sm sm:text-base leading-relaxed line-clamp-4 mb-4 whitespace-pre-wrap">
        {textContent}
      </p>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs sm:text-sm text-stone-600 relative">
        <div className="flex items-center gap-4">
          {/* Emoji Button & Floating Tray */}
          <div
            ref={pickerRef}
            className="relative z-30"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              onClick={handleMainButtonClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
                selectedEmoji
                  ? 'border-rose-300 bg-rose-50 text-rose-600 font-medium shadow-sm'
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

            {/* Emoji Tray */}
            {pickerOpen && (
              <div
                className="absolute bottom-full left-0 mb-2 flex items-center gap-1 p-2 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-x-auto max-w-[85vw] sm:max-w-none"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {EMOJI_OPTIONS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onPointerDown={(e) => handleSelectEmoji(e, item.emoji)}
                    onClick={(e) => handleSelectEmoji(e, item.emoji)}
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

          {/* Comments Count */}
          <div className="flex items-center gap-1.5 text-stone-500">
            <MessageCircle className="w-4 h-4 text-stone-400" />
            <span>{commentsCount} comments</span>
          </div>
        </div>

        {/* Secret Admin Delete Button */}
        {isAdmin && (
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDeletePost}
            className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-medium rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Delete this confession"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        )}
      </div>
    </article>
  );
}
