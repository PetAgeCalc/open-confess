import { useState, MouseEvent } from 'react';
import { MapPin, MessageCircle, Share2 } from 'lucide-react';
import { Confession, ReactionEmoji } from '../types';
import { timeAgo } from '../lib/timeUtils';
import { getVisitorReaction, setVisitorReaction } from '../lib/interactionLimits';
import { setReaction as persistReaction } from '../lib/confessionService';
import ShareModal, { tryNativeShare } from './ShareModal';

interface ConfessionCardProps {
  confession: Confession;
  onOpen: () => void;
}

const REACTIONS: ReactionEmoji[] = ['❤️', '🔥', '😮', '😢', '👏'];

export default function ConfessionCard({ confession, onOpen }: ConfessionCardProps) {
  const [myReaction, setMyReaction] = useState<ReactionEmoji | null>(() =>
    getVisitorReaction(confession.id)
  );
  const [likesCount, setLikesCount] = useState(confession.likesCount);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  async function handleReaction(emoji: ReactionEmoji) {
    const next = myReaction === emoji ? null : emoji; // tapping same reaction toggles it off
    const previous = myReaction;
    setMyReaction(next);
    setLikesCount((c) => c + (next ? 1 : 0) - (previous ? 1 : 0));
    setVisitorReaction(confession.id, next);
    setReactionPickerOpen(false);
    try {
      await persistReaction(confession.id, previous, next);
    } catch {
      // Non-fatal — optimistic UI already reflects the visitor's intent.
    }
  }

  async function handleShareClick(e: MouseEvent) {
    e.stopPropagation();
    const usedNative = await tryNativeShare(confession);
    if (!usedNative) setShareOpen(true);
  }

  return (
    <>
      <article className="w-full bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden animate-slide-up">
        {confession.imageUrl && (
          <button onClick={onOpen} className="block w-full">
            <img
              src={confession.imageUrl}
              alt=""
              loading="lazy"
              className="w-full h-48 sm:h-56 object-cover rounded-t-xl"
            />
          </button>
        )}

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-2 flex-wrap">
            <span className="font-medium text-gray-700">{confession.authorName}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blush-500" />
              {confession.city}, {confession.country}
            </span>
            <span aria-hidden>·</span>
            <span>{timeAgo(confession.createdAt)}</span>
          </div>

          <button onClick={onOpen} className="block text-left w-full">
            <p className="text-gray-950 font-medium text-base leading-7 line-clamp-3">
              {confession.text}
            </p>
          </button>

          <div className="mt-4 flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setReactionPickerOpen((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  myReaction
                    ? 'bg-blush-100 text-blush-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-base leading-none">{myReaction ?? '🤍'}</span>
                <span>{likesCount}</span>
              </button>

              {reactionPickerOpen && (
                <div className="absolute bottom-full left-0 mb-2 flex gap-1 bg-white rounded-full shadow-lg border border-gray-100 px-2 py-1.5 animate-fade-in z-10">
                  {REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className={`text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-blush-50 transition-transform hover:scale-110 ${
                        myReaction === emoji ? 'bg-blush-100' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {confession.comments.length}
            </button>

            <button
              onClick={handleShareClick}
              aria-label="Share this confession"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onOpen}
              className="text-xs sm:text-sm font-medium text-blush-600 hover:text-blush-700"
            >
              Tap to view
            </button>
          </div>
        </div>
      </article>

      {shareOpen && <ShareModal confession={confession} onClose={() => setShareOpen(false)} />}
    </>
  );
}
