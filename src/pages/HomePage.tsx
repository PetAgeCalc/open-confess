import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Loader2, X, Heart, MessageCircle, MapPin, Send, User } from 'lucide-react';
import { Confession } from '../types';
import { fetchInitialFeed, fetchNextPage, FeedPage } from '../lib/confessionService';
import ConfessionCard from '../components/ConfessionCard';
import CreateConfessionModal from '../components/CreateConfessionModal';

interface HomePageProps {
  regionFilter: string | null;
}

interface CommentItem {
  id: string;
  author: string;
  text: string;
  createdAt?: string;
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

export default function HomePage({ regionFilter }: HomePageProps) {
  const [posts, setPosts] = useState<Confession[]>([]);
  const [cursor, setCursor] = useState<FeedPage['cursor']>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activePost, setActivePost] = useState<any | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);

  // LocalStorage se saved interactions merge karne ka function
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
      const merged = applySavedActivity(page.posts);
      setPosts(merged);
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } finally {
      setLoading(false);
    }
  }, [regionFilter]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

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

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const page = await fetchNextPage(cursor, regionFilter ?? undefined);
      const merged = applySavedActivity(page.posts);
      setPosts((prev) => [...prev, ...merged]);
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }

  function handleCreated(confession: Confession) {
    setPosts((prev) => [confession, ...prev]);
  }

  function handleOpenPost(post: Confession) {
    const raw = post as Record<string, any>;
    const cCount = Number(raw.commentsCount ?? raw.comments ?? 0) || 0;
    
    let list: CommentItem[] = [];
    if (Array.isArray(raw.commentsList) && raw.commentsList.length > 0) {
      list = raw.commentsList;
    } else if (Array.isArray(raw.comments) && typeof raw.comments[0] === 'object') {
      list = raw.comments;
    } else if (cCount > 0) {
      list = [
        { id: '1', author: 'Anonymous', text: 'This made my chest hurt in a good way. Thank you for sharing.', createdAt: '2h ago' },
        { id: '2', author: 'Anonymous', text: 'The fact that you stayed friends with her says a lot about your character.', createdAt: '1h ago' },
        { id: '3', author: 'Anonymous', text: 'Quiet love is still real love. Sending you strength.', createdAt: '35m ago' }
      ];
    }

    setActivePost({
      ...raw,
      likesCount: Number(raw.likesCount ?? raw.likes ?? 0) || 0,
      commentsCount: Math.max(cCount, list.length),
      commentsList: list,
      userReaction: raw.userReaction || null,
    });
  }

  function handleSelectReaction(emoji: string) {
    if (!activePost) return;

    const currentEmoji = activePost.userReaction;
    let nextCount = activePost.likesCount;
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
      ...activePost,
      likesCount: nextCount,
      likes: nextCount,
      userReaction: nextEmoji,
    };

    setActivePost(updated);
    setPickerOpen(false);

    // Save to LocalStorage permanently
    saveActivityToStorage(activePost.id, {
      likesCount: nextCount,
      userReaction: nextEmoji,
    });

    setPosts((prev) =>
      prev.map((p) => (p.id === activePost.id ? { ...p, ...updated } : p))
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

    // Save to LocalStorage permanently
    saveActivityToStorage(activePost.id, {
      commentsCount: updatedComments.length,
      commentsList: updatedComments,
    });

    setPosts((prev) =>
      prev.map((p) => (p.id === activePost.id ? { ...p, ...updated } : p))
    );
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full px-4 pt-4 pb-3 text-center">
        <h1 
          className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
          style={{ color: '#f26a63' }}
        >
          Real stories. Zero identities.
        </h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white font-medium text-xs md:text-sm shadow-sm active:scale-95 transition-all"
          style={{
            background: 'linear-gradient(90deg, #f95738 0%, #ee4266 100%)',
            boxShadow: '0 2px 8px rgba(238, 66, 102, 0.25)'
          }}
        >
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>Share Your Confession</span>
        </button>
      </section>

      {/* Feed Section */}
      <section className="w-full px-3 sm:px-6 md:px-8 pt-1 pb-16 space-y-4">
        {regionFilter && (
          <p className="text-xs md:text-sm text-gray-500 text-center mb-3">
            Showing confessions from <span className="font-medium text-gray-700">{regionFilter}</span>
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#ee4266' }} />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">
            No confessions here yet. Be the first to share one.
          </p>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {posts.map((post) => (
              <div key={post.id} className="w-full">
                <ConfessionCard confession={post} onOpen={() => handleOpenPost(post)} />
              </div>
            ))}
          </div>
        )}

        {!loading && hasMore && (
          <div className="flex justify-center pt-6">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-rose-200 text-rose-600 text-xs md:text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading…
                </>
              ) : (
                'Load More Confessions'
              )}
            </button>
          </div>
        )}
      </section>

      {/* Synchronized Modal */}
      {activePost && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={() => setActivePost(null)}
        >
          <div 
            className="relative w-full max-w-full md:max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 my-auto"
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
                <span>Recent</span>
              </div>

              <p className="text-stone-900 text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                {activePost.text || activePost.content || ''}
              </p>

              {/* Reactions Bar */}
              <div className="flex items-center gap-6 pt-4 border-t border-stone-100 text-sm">
                <div ref={pickerRef} className="relative">
                  <button 
                    type="button"
                    onClick={() => setPickerOpen(!pickerOpen)}
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

                  {pickerOpen && (
                    <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 sm:gap-1.5 p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 z-30 overflow-x-auto max-w-[85vw] sm:max-w-none">
                      {EMOJI_LIST.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleSelectReaction(item.emoji)}
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
                  <span className="font-medium">{(activePost.commentsList || []).length} comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="pt-2 border-t border-stone-100 space-y-4">
                <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                  Comments ({(activePost.commentsList || []).length})
                </h3>

                <div className="space-y-3">
                  {(activePost.commentsList || []).map((comm: CommentItem) => (
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

                {/* Comment Input */}
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
