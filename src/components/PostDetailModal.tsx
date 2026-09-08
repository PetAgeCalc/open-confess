import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Send, Share2 } from 'lucide-react';
import { Confession, Comment, ReactionEmoji } from '../types';
import { timeAgo } from '../lib/timeUtils';
import {
  getVisitorReaction,
  setVisitorReaction,
  canVisitorComment,
  incrementVisitorCommentCount,
  getVisitorCommentCount,
  MAX_COMMENTS_PER_POST,
} from '../lib/interactionLimits';
import { setReaction as persistReaction, addComment, fetchComments } from '../lib/confessionService';
import ShareModal, { tryNativeShare } from './ShareModal';

interface PostDetailModalProps {
  confession: Confession;
  onClose: () => void;
}

const REACTIONS: ReactionEmoji[] = ['❤️', '🔥', '😮', '😢', '👏'];

export default function PostDetailModal({ confession, onClose }: PostDetailModalProps) {
  const [myReaction, setMyReaction] = useState<ReactionEmoji | null>(() =>
    getVisitorReaction(confession.id)
  );
  const [likesCount, setLikesCount] = useState(confession.likesCount);
  const [comments, setComments] = useState<Comment[]>(confession.comments);
  const [commentDraft, setCommentDraft] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const commentsLeft = MAX_COMMENTS_PER_POST - getVisitorCommentCount(confession.id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    fetchComments(confession.id)
      .then(setComments)
      .finally(() => setLoadingComments(false));
    return () => {
      document.body.style.overflow = '';
    };
  }, [confession.id]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  async function handleReaction(emoji: ReactionEmoji) {
    const next = myReaction === emoji ? null : emoji;
    const previous = myReaction;
    setMyReaction(next);
    setLikesCount((c) => c + (next ? 1 : 0) - (previous ? 1 : 0));
    setVisitorReaction(confession.id, next);
    try {
      await persistReaction(confession.id, previous, next);
    } catch {
      // Optimistic UI already applied; safe to ignore transient network errors.
    }
  }

  async function handleSubmitComment() {
    const trimmed = commentDraft.trim();
    if (!trimmed || !canVisitorComment(confession.id) || posting) return;

    setPosting(true);
    try {
      const comment = await addComment(confession.id, nameDraft.trim(), trimmed);
      setComments((prev) => [...prev, comment]);
      incrementVisitorCommentCount(confession.id);
      setCommentDraft('');
      setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } finally {
      setPosting(false);
    }
  }

  async function handleShareClick() {
    const usedNative = await tryNativeShare(confession);
    if (!usedNative) setShareOpen(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg h-[92vh] sm:h-[85vh] sm:rounded-2xl rounded-t-2xl bg-white flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 shrink-0">
          <h2 className="font-display text-base font-semibold text-gray-900">Confession</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {confession.imageUrl && (
            <img
              src={confession.imageUrl}
              alt=""
              className="w-full h-56 sm:h-64 object-cover"
            />
          )}

          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3 flex-wrap">
              <span className="font-medium text-gray-700">{confession.authorName}</span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blush-500" />
                {confession.city}, {confession.country}
              </span>
              <span aria-hidden>·</span>
              <span>{timeAgo(confession.createdAt)}</span>
            </div>

            <p className="text-gray-950 font-medium text-base sm:text-lg leading-7 whitespace-pre-line">
              {confession.text}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1 border border-gray-100">
                {REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className={`text-lg w-9 h-9 flex items-center justify-center rounded-full transition-transform hover:scale-110 ${
                      myReaction === emoji ? 'bg-blush-100' : 'hover:bg-white'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">{likesCount} reactions</span>

              <button
                onClick={handleShareClick}
                aria-label="Share this confession"
                className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 px-4 sm:px-5 py-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Comments ({comments.length})
            </h3>

            {loadingComments ? (
              <p className="text-sm text-gray-400">Loading comments…</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-400">Be the first to leave a comment.</p>
            ) : (
              <ul className="space-y-3">
                {comments.map((comment) => (
                  <li key={comment.id} className="bg-gray-50 rounded-xl px-3.5 py-2.5">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-800">{comment.authorName}</span>
                      <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-6">{comment.text}</p>
                  </li>
                ))}
              </ul>
            )}
            <div ref={commentsEndRef} />
          </div>
        </div>

        {/* Comment composer */}
        <div className="border-t border-gray-100 p-3 sm:p-4 shrink-0 bg-white">
          {commentsLeft <= 0 ? (
            <p className="text-center text-sm text-gray-400 py-2">
              Maximum 3 comments reached for this post
            </p>
          ) : (
            <div className="space-y-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="Anonymous (leave blank to stay anonymous)"
                className="w-full text-sm px-3.5 py-2 rounded-full border border-gray-200 outline-none focus:border-blush-300"
              />
              <div className="flex items-center gap-2">
                <input
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                  placeholder={`Add a comment (${commentsLeft} left)`}
                  className="flex-1 text-sm px-3.5 py-2.5 rounded-full border border-gray-200 outline-none focus:border-blush-300"
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentDraft.trim() || posting}
                  aria-label="Post comment"
                  className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-blush-500 to-plum-500 text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {shareOpen && <ShareModal confession={confession} onClose={() => setShareOpen(false)} />}
    </div>
  );
}
