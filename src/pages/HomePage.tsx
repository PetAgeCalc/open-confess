import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Loader2, X, Heart, MessageCircle, MapPin, Send, User, Share2, Copy, Check } from 'lucide-react';
import { Confession } from '../types';
import { fetchInitialFeed, fetchNextPage, FeedPage } from '../lib/confessionService';
import ConfessionCard from '../components/ConfessionCard';
import CreateConfessionModal from '../components/CreateConfessionModal';
// Simulation Engine Import
import { syncSimulatedActivity, scheduleEngagementForNewPost } from '../lib/activitySimulator';

interface HomePageProps {
  regionFilter: string | null;
}

interface CommentItem {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

const EMOJI_LIST = [
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

const STORAGE_KEY = 'open_confess_user_activity_v1';
const POSTS_PER_PAGE = 8;

function parseTimeToHuman(rawTime: any): string {
  if (!rawTime) return 'Just now';
  if (typeof rawTime === 'string') {
    const s = rawTime.trim();
    if (s.includes('ago') || s.toLowerCase() === 'just now') return s;
    const parsedDate = Date.parse(s);
    if (!isNaN(parsedDate)) {
      rawTime = parsedDate;
    }
  }

  const num = Number(rawTime);
  if (!isNaN(num) && num > 0) {
    const millis = num < 10000000000 ? num * 1000 : num;
    const diffSecs = Math.max(0, Math.floor((Date.now() - millis) / 1000));
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  }
  return 'Just now';
}

function parsePostTimestamp(post: any): number {
  const raw = post.createdAt || post.timestamp || post.date || post.time;
  if (!raw) return 0;
  if (typeof raw === 'number') {
    return raw < 10000000000 ? raw * 1000 : raw;
  }
  if (typeof raw === 'string') {
    const parsed = Date.parse(raw);
    if (!isNaN(parsed)) return parsed;
    // Relative string parse fallback (e.g., "3h ago", "25m ago")
    const match = raw.match(/(\d+)\s*(m|h|d)/i);
    if (match) {
      const amount = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      const now = Date.now();
      if (unit === 'm') return now - amount * 60000;
      if (unit === 'h') return now - amount * 3600000;
      if (unit === 'd') return now - amount * 86400000;
    }
  }
  return 0;
}

// 100% Guaranteed NaN Fix for Comments
function safeCommentCount(post: any): number {
  if (!post) return 0;
  if (Array.isArray(post.commentsList)) return post.commentsList.length;
  if (Array.isArray(post.comments)) return post.comments.length;

  const countVal = post.commentsCount ?? post.comments;
  const num = Number(countVal);
  if (!isNaN(num) && num >= 0) return num;

  return 0;
}

function safeLikesCount(post: any): number {
  if (!post) return 0;
  const countVal = post.likesCount ?? post.likes;
  const num = Number(countVal);
  return !isNaN(num) && num >= 0 ? num : 0;
}

function extractAuthorName(item: any): string {
  if (!item || typeof item !== 'object') return 'Anonymous';
  const possible = item.authorName || item.author || item.name || item.userName || item.user;
  if (!possible) return 'Anonymous';
  const str = String(possible).trim();
  if (/^\d{8,}$/.test(str) || !isNaN(Number(str))) return 'Anonymous';
  return str;
}

function normalizeComment(c: any, index: number): CommentItem {
  if (!c) {
    return { id: String(index), author: 'Anonymous', text: '', createdAt: 'Just now' };
  }
  if (typeof c === 'string') {
    return { id: String(index), author: 'Anonymous', text: c, createdAt: 'Just now' };
  }
  const cleanAuthor = extractAuthorName(c);
  const cleanText = String(c.text || c.content || c.comment || c.message || '');
  let rawTime = c.createdAt || c.timestamp || c.date || c.time;
  if (!rawTime && c.author && !isNaN(Number(c.author))) {
    rawTime = c.author;
  }
  return {
    id: String(c.id || index),
    author: cleanAuthor,
    text: cleanText,
    createdAt: parseTimeToHuman(rawTime),
  };
}

export default function HomePage({ regionFilter }: HomePageProps) {
  const [posts, setPosts] = useState<Confession[]>([]);
  const [cursor, setCursor] = useState<FeedPage['cursor']>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activePost, setActivePost] = useState<any | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Pagination state: Limits items in increments of 8
  const [visibleCount, setVisibleCount] = useState<number>(POSTS_PER_PAGE);

  // Sharing states
  const [sharePopupPost, setSharePopupPost] = useState<Confession | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reaction picker states
  const [modalPickerOpen, setModalPickerOpen] = useState(false);
  const [cardPickerPostId, setCardPickerPostId] = useState<string | null>(null);

  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const modalPickerRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  // Function to ensure freshest/recent posts always remain at the top
  const sortPostsByRecent = (items: Confession[]): Confession[] => {
    return [...items].sort((a, b) => parsePostTimestamp(b) - parsePostTimestamp(a));
  };

  const applySavedActivity = (rawPosts: Confession[]): Confession[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return rawPosts;
      const parsed = JSON.parse(saved);

      return rawPosts.map((post) => {
        const customData = parsed[post.id];
        if (customData) {
          return {
            ...post,
            likesCount: customData.likesCount ?? (post as any).likesCount,
            likes: customData.likesCount ?? (post as any).likes,
            userReaction: customData.userReaction ?? (post as any).userReaction,
            commentsCount: customData.commentsCount ?? (post as any).commentsCount,
            comments: customData.commentsCount ?? (post as any).comments,
            commentsList: customData.commentsList ?? (post as any).commentsList,
          } as Confession;
        }
        return post;
      });
    } catch {
      return rawPosts;
    }
  };

  const saveActivityToStorage = (postId: string, updatedFields: Record<string, any>) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      parsed[postId] = {
        ...(parsed[postId] || {}),
        ...updatedFields,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const page = await fetchInitialFeed(regionFilter ?? undefined);
      const blended = await syncSimulatedActivity(page.posts);
      const merged = applySavedActivity(blended);
      // Newest First Ordering
      const sorted = sortPostsByRecent(merged);
      setPosts(sorted);
      setCursor(page.cursor);
      setHasMore(page.hasMore);
      setVisibleCount(POSTS_PER_PAGE);
    } finally {
      setLoading(false);
    }
  }, [regionFilter]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    if (!modalPickerOpen && !sharePopupPost && !cardPickerPostId) return;
    const handleOutside = (e: MouseEvent) => {
      if (modalPickerRef.current && !modalPickerRef.current.contains(e.target as Node)) {
        setModalPickerOpen(false);
      }
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setSharePopupPost(null);
      }
      setCardPickerPostId(null);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [modalPickerOpen, sharePopupPost, cardPickerPostId]);

  // Load 8 More Posts
  async function handleLoadMore() {
    if (visibleCount < posts.length) {
      setVisibleCount((prev) => prev + POSTS_PER_PAGE);
      return;
    }

    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const page = await fetchNextPage(cursor, regionFilter ?? undefined);
      const merged = applySavedActivity(page.posts);
      setPosts((prev) => sortPostsByRecent([...prev, ...merged]));
      setCursor(page.cursor);
      setHasMore(page.hasMore);
      setVisibleCount((prev) => prev + POSTS_PER_PAGE);
    } finally {
      setLoadingMore(false);
    }
  }

  // Real user post creation (Always on Top)
  function handleCreated(confession: Confession) {
    const postWithTime = {
      ...confession,
      createdAt: (confession as any).createdAt || Date.now(),
    };
    setPosts((prev) => [postWithTime, ...prev]);

    scheduleEngagementForNewPost(postWithTime, ({ likesCountIncrement, reaction, newComment }) => {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postWithTime.id) return p;
          const currentLikes = safeLikesCount(p);
          const currentList = (p as any).commentsList || [];
          const updatedList = newComment ? [...currentList, newComment] : currentList;
          const updatedLikes = likesCountIncrement ? currentLikes + likesCountIncrement : currentLikes;

          const updatedPost = {
            ...p,
            likesCount: updatedLikes,
            likes: updatedLikes,
            commentsCount: updatedList.length,
            comments: updatedList.length,
            commentsList: updatedList,
            userReaction: reaction || (p as any).userReaction,
          };

          saveActivityToStorage(postWithTime.id, {
            likesCount: updatedLikes,
            commentsCount: updatedList.length,
            commentsList: updatedList,
            userReaction: reaction || (p as any).userReaction,
          });

          return updatedPost as Confession;
        })
      );
    });
  }

  function handleOpenPost(post: Confession) {
    const raw = post as Record<string, any>;
    const rawComments = Array.isArray(raw.commentsList)
      ? raw.commentsList
      : Array.isArray(raw.comments) && typeof raw.comments[0] === 'object'
      ? raw.comments
      : [];

    let list: CommentItem[] = [];

    if (rawComments.length > 0) {
      list = rawComments.map((c: any, index: number) => normalizeComment(c, index));
    } else {
      list = [
        { id: '1', author: 'Anonymous', text: 'Sobbing. This is what real empathy and strength look like.', createdAt: '2h ago' },
        { id: '2', author: 'Anonymous', text: 'Choosing to carry this requires immense courage. Much love.', createdAt: '1h ago' },
        { id: '3', author: 'Anonymous', text: 'Blood means nothing compared to who shows up every single day.', createdAt: '35m ago' }
      ];
    }

    setActivePost({
      ...raw,
      likesCount: safeLikesCount(raw),
      commentsCount: Math.max(safeCommentCount(raw), list.length),
      commentsList: list,
      userReaction: raw.userReaction || null,
      formattedTime: parseTimeToHuman(raw.createdAt || raw.timestamp || raw.time),
    });
  }

  // Reaction Trigger for Card as well as Modal
  function handleSelectReaction(postId: string, emoji: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();

    const targetPost = posts.find((p) => p.id === postId) || activePost;
    if (!targetPost) return;

    const currentEmoji = (targetPost as any).userReaction;
    let nextCount = safeLikesCount(targetPost);
    let nextEmoji: string | null = null;

    if (currentEmoji === emoji) {
      nextEmoji = null;
      nextCount = Math.max(0, nextCount - 1);
    } else {
      if (!currentEmoji) {
        nextCount = nextCount + 1;
      }
      nextEmoji = emoji;
    }

    const updated = {
      ...targetPost,
      likesCount: nextCount,
      likes: nextCount,
      userReaction: nextEmoji,
    };

    if (activePost && activePost.id === postId) {
      setActivePost(updated);
    }

    setModalPickerOpen(false);
    setCardPickerPostId(null);

    saveActivityToStorage(postId, {
      likesCount: nextCount,
      userReaction: nextEmoji,
    });

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updated } : p))
    );
  }

  function handleAddComment() {
    if (!activePost || !commentText.trim()) return;

    const newComment: CommentItem = {
      id: String(Date.now()),
      author: commentName.trim() || 'Anonymous',
      text: commentText.trim(),
      createdAt: 'Just now',
    };

    const updatedComments = [...(activePost.commentsList || []), newComment];
    const updated = {
      ...activePost,
      commentsCount: updatedComments.length,
      comments: updatedComments.length,
      commentsList: updatedComments,
    };

    setActivePost(updated);
    setCommentText('');

    saveActivityToStorage(activePost.id, {
      commentsCount: updatedComments.length,
      commentsList: updatedComments,
    });

    setPosts((prev) =>
      prev.map((p) => (p.id === activePost.id ? { ...p, ...updated } : p))
    );
  }

  // Multi-platform Share Trigger
  const triggerShare = (post: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSharePopupPost(post);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const visiblePosts = posts.slice(0, visibleCount);
  const canLoadMore = visibleCount < posts.length || hasMore;

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#f3e6d8]">
      {/* Hero Section */}
      <section className="w-full px-4 pt-6 pb-4 text-center">
        <h1 
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          style={{ color: '#e15b50' }}
        >
          Real stories. Zero identities.
        </h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="mt-3.5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold text-xs md:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          style={{
            background: 'linear-gradient(90deg, #f95738 0%, #ee4266 100%)',
            boxShadow: '0 4px 14px rgba(238, 66, 102, 0.3)'
          }}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Share Your Confession</span>
        </button>
      </section>

      {/* Feed Section - Single Column Responsive Layout */}
      <section className="w-full max-w-xl md:max-w-2xl mx-auto px-3 sm:px-4 pt-1 pb-20 space-y-6">
        {regionFilter && (
          <p className="text-xs md:text-sm text-stone-600 text-center mb-2">
            Showing confessions from <span className="font-semibold text-stone-800">{regionFilter}</span>
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#ee4266' }} />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-stone-500 py-16 text-sm">
            No confessions here yet. Be the first to share one.
          </p>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {visiblePosts.map((post) => {
              const isCardPickerOpen = cardPickerPostId === post.id;
              const hasReaction = Boolean((post as any).userReaction);

              return (
                <div
                  key={post.id}
                  onClick={() => handleOpenPost(post)}
                  className="w-full rounded-[26px] sm:rounded-[30px] overflow-hidden bg-[#faefe6] shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-[#ebd8c8] cursor-pointer hover:shadow-lg transition-all"
                >
                  {/* Image Banner */}
                  {Boolean((post as any).imageUrl || (post as any).image) && (
                    <div className="w-full h-56 sm:h-64 overflow-hidden bg-stone-200">
                      <img
                        src={(post as any).imageUrl || (post as any).image}
                        alt="Confession story"
                        className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-3">
                      <span>{extractAuthorName(post)}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 text-[#e15b50]">
                        <MapPin className="w-3.5 h-3.5 fill-[#e15b50]/20" />
                        <span>{[(post as any).city, (post as any).country].filter(Boolean).join(', ') || 'Worldwide'}</span>
                      </span>
                      <span>·</span>
                      <span>{parseTimeToHuman((post as any).createdAt || (post as any).timestamp || (post as any).time)}</span>
                    </div>

                    <p className="text-stone-800 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal">
                      {(post as any).text || (post as any).content || ''}
                    </p>

                    <div className="mt-5 flex items-center justify-between pt-1 border-t border-[#ebd8c8]/60">
                      <div className="flex items-center gap-2.5">
                        {/* Interactive Reaction/Like on Card */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardPickerPostId(isCardPickerOpen ? null : post.id);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 cursor-pointer ${
                              hasReaction
                                ? 'border-rose-300 bg-rose-50 text-rose-600'
                                : 'bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6] border-transparent'
                            }`}
                          >
                            {hasReaction ? (
                              <span className="text-sm leading-none">{(post as any).userReaction}</span>
                            ) : (
                              <Heart className="w-3.5 h-3.5 fill-stone-400 text-stone-400" />
                            )}
                            <span>{safeLikesCount(post)}</span>
                          </button>

                          {/* Card Emoji Picker Tray */}
                          {isCardPickerOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute bottom-full left-0 mb-2 z-40 flex items-center gap-1 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 max-w-[80vw] overflow-x-auto"
                            >
                              {EMOJI_LIST.map((item) => (
                                <button
                                  key={item.label}
                                  type="button"
                                  onClick={(e) => handleSelectReaction(post.id, item.emoji, e)}
                                  className={`text-xl p-1.5 rounded-xl hover:scale-125 transition-transform cursor-pointer ${
                                    (post as any).userReaction === item.emoji ? 'bg-rose-100' : 'hover:bg-stone-100'
                                  }`}
                                  title={item.label}
                                >
                                  {item.emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Safe Comments Count (Zero NaN) */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eee0d2] text-stone-700 text-xs font-medium">
                          <MessageCircle className="w-3.5 h-3.5 text-stone-500" />
                          <span>{safeCommentCount(post)}</span>
                        </div>

                        {/* Working Share Button */}
                        <button
                          type="button"
                          onClick={(e) => triggerShare(post, e)}
                          className="p-1.5 rounded-full bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6] active:scale-90 transition-all cursor-pointer"
                          title="Share confession"
                        >
                          <Share2 className="w-3.5 h-3.5 text-stone-600" />
                        </button>
                      </div>

                      {/* Exact Tap to View */}
                      <span className="text-xs font-medium text-[#e15b50] hover:underline cursor-pointer">
                        Tap to view
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More 8 Confessions Button */}
        {!loading && canLoadMore && (
          <div className="flex justify-center pt-6">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#faefe6] border border-[#ebd8c8] text-[#e15b50] text-xs sm:text-sm font-semibold hover:bg-[#f3e6d8] active:scale-95 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#e15b50]" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Load More Confessions</span>
              )}
            </button>
          </div>
        )}
      </section>

      {/* Floating Share Tray */}
      {sharePopupPost && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSharePopupPost(null)}
        >
          <div 
            ref={shareRef}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-semibold text-stone-800 text-sm sm:text-base">Share Confession</h3>
              <button 
                onClick={() => setSharePopupPost(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 pt-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`"${(sharePopupPost as any).text || ''}"\n\nRead more anonymously at: ${window.location.origin}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                  💬
                </div>
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${(sharePopupPost as any).text || ''}" via @OpenConfess`)}&url=${encodeURIComponent(window.location.origin)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold shadow-sm">
                  𝕏
                </div>
                <span>X</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                  f
                </div>
                <span>Facebook</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(`"${(sharePopupPost as any).text || ''}"`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80"
              >
                <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                  ✈️
                </div>
                <span>Telegram</span>
              </a>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Post Modal Detail */}
      {activePost && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={() => setActivePost(null)}
        >
          <div 
            className="relative w-full max-w-full md:max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-white shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                Confession
              </h2>
              <button 
                type="button"
                onClick={() => setActivePost(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
              {Boolean(activePost.imageUrl || activePost.image) && (
                <div className="w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 max-h-[420px]">
                  <img 
                    src={activePost.imageUrl || activePost.image} 
                    alt="Confession" 
                    className="w-full h-full max-h-[420px] object-cover block"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 flex-wrap">
                <span className="font-semibold text-stone-800">
                  {activePost.authorName || activePost.author || 'Anonymous'}
                </span>
                {Boolean(activePost.city || activePost.country) && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                      <MapPin className="w-4 h-4 shrink-0" />
                      {[activePost.city, activePost.country].filter(Boolean).join(', ')}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{activePost.formattedTime}</span>
              </div>

              <p className="text-stone-900 text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                {activePost.text || activePost.content || ''}
              </p>

              {/* Reactions & Social Share Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-sm">
                <div className="flex items-center gap-4">
                  <div ref={modalPickerRef} className="relative">
                    <button 
                      type="button"
                      onClick={() => setModalPickerOpen(!modalPickerOpen)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
                        activePost.userReaction 
                          ? 'border-rose-300 bg-rose-50 text-rose-600 font-medium shadow-sm' 
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {activePost.userReaction ? (
                        <span className="text-xl leading-none">{activePost.userReaction}</span>
                      ) : (
                        <Heart className="w-5 h-5 text-stone-500 hover:text-rose-500 transition-colors" />
                      )}
                      <span>{activePost.likesCount}</span>
                    </button>

                    {modalPickerOpen && (
                      <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 sm:gap-1.5 p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 z-30 overflow-x-auto max-w-[85vw] sm:max-w-none">
                        {EMOJI_LIST.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => handleSelectReaction(activePost.id, item.emoji)}
                            className={`text-2xl p-1.5 sm:p-2 rounded-xl transition-all hover:scale-125 active:scale-90 cursor-pointer shrink-0 ${
                              activePost.userReaction === item.emoji ? 'bg-rose-100 scale-110' : 'hover:bg-stone-100'
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
                    <span className="font-medium">{safeCommentCount(activePost)} comments</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => triggerShare(activePost, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-stone-500" />
                  <span>Share</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="pt-2 border-t border-stone-100 space-y-4">
                <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                  Comments ({safeCommentCount(activePost)})
                </h3>

                <div className="space-y-3">
                  {(activePost.commentsList || []).map((comm: CommentItem) => (
                    <div key={comm.id} className="p-3.5 rounded-2xl bg-stone-50/90 border border-stone-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 font-medium text-xs sm:text-sm text-stone-800">
                          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px]">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span>{comm.author}</span>
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {comm.createdAt}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 pl-8 leading-relaxed">
                        {comm.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Field */}
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
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {createOpen && (
        <CreateConfessionModal onClose={() => setCreateOpen(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}
