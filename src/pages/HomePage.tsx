import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Loader2, X, Heart, MessageCircle, MapPin, Send, User, Share2, Copy, Check, Hash, Trash2 } from 'lucide-react';
import { Confession } from '../types';
import { fetchInitialFeed, fetchNextPage, FeedPage, setReaction, addComment, fetchComments, deleteConfession } from '../lib/confessionService';
import CreateConfessionModal from '../components/CreateConfessionModal';
import { getRealisticEngagement } from '../lib/realisticEngagement';

interface HomePageProps {
  regionFilter: string | null;
  activeTab?: 'fresh' | 'trending';
}

interface CommentItem {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

const EMOJI_LIST = [
  { label: 'Love', emoji: '❤️' },
  { label: 'Hug', emoji: '🤗' },
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
const FEED_CACHE_KEY = 'open_confess_feed_cache_instant_v1';
const POSTS_PER_PAGE = 8;
const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&h=420&q=80';

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
  }
  return 0;
}

function safeCommentCount(post: any): number {
  if (!post) return 0;
  if (Array.isArray(post.commentsList)) return post.commentsList.length;
  if (Array.isArray(post.comments)) return post.comments.length;
  const countVal = post.commentsCount ?? post.comments;
  const num = Number(countVal);
  return !isNaN(num) && num >= 0 ? num : 0;
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

// Robust Country Matching Function
function matchesSelectedCountry(post: any, countryFilter: string | null): boolean {
  if (!countryFilter || !countryFilter.trim()) return true;
  const target = countryFilter.trim().toLowerCase();

  // 1. Direct country property
  const postCountry = String(post.country || '').trim().toLowerCase();
  if (postCountry && (postCountry === target || postCountry.includes(target) || target.includes(postCountry))) {
    return true;
  }

  // 2. Region property (e.g. "Jaipur, India", "Sydney, Australia")
  const postRegion = String(post.region || '').trim().toLowerCase();
  if (postRegion) {
    const parts = postRegion.split(',').map((p) => p.trim().toLowerCase());
    if (parts.includes(target) || postRegion.includes(target)) {
      return true;
    }
  }

  // 3. Location / City property
  const postLocation = String(post.location || '').trim().toLowerCase();
  const postCity = String(post.city || '').trim().toLowerCase();
  if (postLocation.includes(target) || postCity.includes(target)) {
    return true;
  }

  // 4. Fallback search inside body/text
  const postText = String(post.text || post.content || post.body || '').toLowerCase();
  if (postText.includes(target)) {
    return true;
  }

  return false;
}

export default function HomePage({ regionFilter, activeTab = 'fresh' }: HomePageProps) {
  const [posts, setPosts] = useState<Confession[]>(() => {
    try {
      const cached = localStorage.getItem(FEED_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });

  const [cursor, setCursor] = useState<FeedPage['cursor']>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState<boolean>(() => posts.length === 0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activePost, setActivePost] = useState<any | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(POSTS_PER_PAGE);
  const [sharePopupPost, setSharePopupPost] = useState<Confession | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [modalPickerOpen, setModalPickerOpen] = useState(false);
  const [cardPickerPostId, setCardPickerPostId] = useState<string | null>(null);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [activeHashtagFilter, setActiveHashtagFilter] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Secret Admin check via URL query param: ?admin=ashim97
  const searchParams = new URLSearchParams(window.location.search);
  const isAdmin = searchParams.get('admin') === 'ashim97';

  const modalPickerRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  const sortPosts = (items: Confession[], tab: 'fresh' | 'trending'): Confession[] => {
    if (tab === 'trending') {
      return [...items].sort((a, b) => {
        const scoreA = safeLikesCount(a) * 2 + safeCommentCount(a) * 3;
        const scoreB = safeLikesCount(b) * 2 + safeCommentCount(b) * 3;
        return scoreB - scoreA;
      });
    }
    return [...items].sort((a, b) => parsePostTimestamp(b) - parsePostTimestamp(a));
  };

  const applySavedActivity = (rawPosts: Confession[]): Confession[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};

      return rawPosts.map((post) => {
        const customData = parsed[post.id];
        const realistic = getRealisticEngagement(post);

        const customCommentsList: CommentItem[] = customData?.commentsList || [];
        const mergedComments: CommentItem[] = [
          ...customCommentsList,
          ...realistic.commentsList
        ];

        const uniqueComments = Array.from(new Map(mergedComments.map((c) => [c.text, c])).values());
        const effectiveLikes = customData?.likesCount ?? Math.max(safeLikesCount(post), realistic.likesCount);
        const effectiveCommentsCount = Math.max(uniqueComments.length, safeCommentCount(post), realistic.commentsCount);

        return {
          ...post,
          likesCount: effectiveLikes,
          likes: effectiveLikes,
          userReaction: (customData?.userReaction && typeof customData.userReaction === 'string') ? customData.userReaction : null,
          commentsCount: effectiveCommentsCount,
          comments: effectiveCommentsCount,
          commentsList: uniqueComments,
        } as Confession;
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
      console.error('Failed to save activity', e);
    }
  };

  const loadInitial = useCallback(async () => {
    try {
      const page = await fetchInitialFeed(undefined);
      const merged = applySavedActivity(page.posts);

      setPosts((prev) => {
        const serverMap = new Map(merged.map((p) => [String(p.id), p]));
        const recentLocalPosts = prev.filter((p) => {
          const isRecent = Date.now() - parsePostTimestamp(p) < 600000; // 10 minutes window
          return isRecent && !serverMap.has(String(p.id));
        });

        const combined = [...recentLocalPosts, ...merged];
        const sorted = sortPosts(combined, activeTab);

        try {
          localStorage.setItem(FEED_CACHE_KEY, JSON.stringify(sorted.slice(0, 16)));
        } catch {}
        return sorted;
      });

      setCursor(page.cursor);
      setHasMore(page.hasMore);
      setVisibleCount(POSTS_PER_PAGE);
    } catch (err) {
      console.error('Error in loadInitial:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial, regionFilter]);

  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [regionFilter]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadInitial();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
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
      const target = e.target as HTMLElement;
      if (!target.closest('.card-reaction-container')) {
        setCardPickerPostId(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [modalPickerOpen, sharePopupPost, cardPickerPostId]);

  async function handleDeletePost(postId: string, e?: React.MouseEvent) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const confirmed = window.confirm("Kya aap sach me is confession ko delete karna chahte hain?");
    if (!confirmed) return;

    try {
      setDeletingId(postId);
      const success = await deleteConfession(postId);

      if (success) {
        setPosts((prev) => {
          const updated = prev.filter((p) => String(p.id) !== String(postId));
          try {
            localStorage.setItem(FEED_CACHE_KEY, JSON.stringify(updated.slice(0, 16)));
          } catch {}
          return updated;
        });

        if (activePost && String(activePost.id) === String(postId)) {
          setActivePost(null);
        }
      } else {
        alert("Delete nahi ho paya.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete karne me error aayi.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatInteractiveText(text: string) {
    if (!text) return null;
    const parts = text.split(/([#@][\w\u0980-\u09FF\u0900-\u097F]+)/g);

    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setActiveHashtagFilter(part);
              if (activePost) setActivePost(null);
            }}
            className="text-[#e15b50] font-semibold hover:underline cursor-pointer transition-colors px-0.5 inline-block"
          >
            {part}
          </span>
        );
      }

      if (part.startsWith('@')) {
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              alert('All identities are 100% anonymous on OpenConfess!');
            }}
            className="text-sky-600 font-semibold hover:underline cursor-pointer transition-colors px-0.5 inline-block"
          >
            {part}
          </span>
        );
      }

      return part;
    });
  }

  // Filter by Selected Country first, then by Hashtag
  const filteredPosts = useMemo(() => {
    let result = posts;

    if (regionFilter) {
      result = result.filter((p) => matchesSelectedCountry(p, regionFilter));
    }

    if (activeHashtagFilter) {
      result = result.filter((p: any) => {
        const text = (p.text || p.content || '').toLowerCase();
        return text.includes(activeHashtagFilter.toLowerCase());
      });
    }

    return result;
  }, [posts, regionFilter, activeHashtagFilter]);

  async function handleLoadMore() {
    if (visibleCount < filteredPosts.length) {
      setVisibleCount((prev) => prev + POSTS_PER_PAGE);
      return;
    }

    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const page = await fetchNextPage(cursor, undefined);
      const merged = applySavedActivity(page.posts);
      setPosts((prev) => sortPosts([...prev, ...merged], activeTab));
      setCursor(page.cursor);
      setHasMore(page.hasMore);
      setVisibleCount((prev) => prev + POSTS_PER_PAGE);
    } catch (err) {
      console.error('Load more failed:', err);
    } finally {
      setLoadingMore(false);
    }
  }

  function handleCreated(confession: Confession) {
    const postTimestamp = (confession as any).createdAt || Date.now();

    const postWithTime = {
      ...confession,
      createdAt: postTimestamp,
      timestamp: postTimestamp,
      userReaction: null,
      commentsCount: 0,
      comments: 0,
      likesCount: 0,
      likes: 0,
      commentsList: [],
    };

    setPosts((prev) => {
      const filtered = prev.filter((p) => String(p.id) !== String(confession.id));
      const updated = [postWithTime, ...filtered];
      try {
        localStorage.setItem(FEED_CACHE_KEY, JSON.stringify(updated.slice(0, 16)));
      } catch {}
      return updated;
    });
  }

  async function handleOpenPost(post: Confession) {
    const raw = post as Record<string, any>;
    const realistic = getRealisticEngagement(raw);

    const initialCombined = [...(raw.commentsList || []), ...realistic.commentsList];
    const initialUnique = Array.from(new Map(initialCombined.map((c: any) => [c.text, c])).values());

    setActivePost({
      ...raw,
      likesCount: raw.likesCount ?? realistic.likesCount,
      commentsCount: Math.max(initialUnique.length, realistic.commentsCount),
      commentsList: initialUnique,
      userReaction: raw.userReaction || null,
      formattedTime: parseTimeToHuman(raw.createdAt || raw.timestamp || raw.time),
    });

    setLoadingComments(true);
    try {
      const fetched = await fetchComments(raw.id);
      const mappedComments: CommentItem[] = fetched.map((c) => ({
        id: c.id,
        author: c.authorName || 'Anonymous',
        text: c.text,
        createdAt: parseTimeToHuman(c.createdAt),
      }));

      const finalList = mappedComments.length > 0
        ? Array.from(new Map([...mappedComments, ...realistic.commentsList].map((c) => [c.text, c])).values())
        : initialUnique;

      setActivePost((prev: any) => {
        if (!prev || prev.id !== raw.id) return prev;
        return {
          ...prev,
          commentsCount: finalList.length,
          commentsList: finalList,
        };
      });

      setPosts((prev) =>
        prev.map((p) => (p.id === raw.id ? { ...p, commentsCount: finalList.length, commentsList: finalList } : p))
      );
    } catch (err) {
      console.error('Failed to fetch real comments:', err);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleSelectReaction(postId: string, emoji: string, e?: React.MouseEvent | React.PointerEvent) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const targetPost = posts.find((p) => String(p.id) === String(postId)) || (activePost && String(activePost.id) === String(postId) ? activePost : null);
    if (!targetPost) return;

    const currentEmoji = (targetPost as any).userReaction || null;
    const currentLikes = safeLikesCount(targetPost);
    let nextCount = currentLikes;
    let nextEmoji: string | null = null;

    if (currentEmoji === emoji) {
      nextEmoji = null;
      nextCount = Math.max(0, currentLikes - 1);
    } else {
      if (!currentEmoji) {
        nextCount = currentLikes + 1;
      }
      nextEmoji = emoji;
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (String(p.id) === String(postId)) {
          return {
            ...p,
            likesCount: nextCount,
            likes: nextCount,
            userReaction: nextEmoji,
          };
        }
        return p;
      })
    );

    if (activePost && String(activePost.id) === String(postId)) {
      setActivePost((prev: any) => ({
        ...prev,
        likesCount: nextCount,
        likes: nextCount,
        userReaction: nextEmoji,
      }));
    }

    setModalPickerOpen(false);
    setCardPickerPostId(null);

    saveActivityToStorage(String(postId), {
      likesCount: nextCount,
      userReaction: nextEmoji,
    });

    try {
      await setReaction(String(postId), currentEmoji as any, nextEmoji as any);
    } catch (err) {
      console.error('Firebase reaction error:', err);
    }
  }

  async function handleAddComment() {
    if (!activePost || !commentText.trim()) return;

    const author = commentName.trim() || 'Anonymous';
    const text = commentText.trim();

    const newComment: CommentItem = {
      id: String(Date.now()),
      author,
      text,
      createdAt: 'Just now',
    };

    const currentList = activePost.commentsList || [];
    const updatedComments = [newComment, ...currentList];

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

    try {
      await addComment(activePost.id, author, text);
    } catch (err) {
      console.error('Failed to save comment:', err);
    }
  }

  const triggerShare = (post: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSharePopupPost(post);
  };

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredPosts.length || hasMore;

  return (
    <div className="w-full min-h-screen bg-[#f3e6d8]">
      {/* pt-28 (112px) taaki fixed header cards ko cover na kare */}
      <section className="w-full px-3 sm:px-6 md:px-8 pt-28 pb-20 space-y-6">
        {activeHashtagFilter && (
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#e15b50] bg-[#faefe6] px-4 py-1.5 rounded-full border border-[#ebd8c8] shadow-sm">
              <Hash className="w-3.5 h-3.5 text-[#e15b50]" />
              <span>Posts tagged with {activeHashtagFilter}</span>
            </span>
            <button
              onClick={() => setActiveHashtagFilter(null)}
              className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer transition-colors"
            >
              Clear Filter
            </button>
          </div>
        )}

        {regionFilter && !activeHashtagFilter && (
          <p className="text-xs md:text-sm text-stone-600 text-center mb-2">
            Showing confessions from <span className="font-semibold text-stone-800">{regionFilter}</span>
          </p>
        )}

        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#ee4266' }} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-stone-500 text-sm">
              {activeHashtagFilter
                ? `No confessions found with ${activeHashtagFilter}`
                : regionFilter
                ? `No confessions found from ${regionFilter} yet.`
                : 'No confessions here yet. Be the first to share one.'}
            </p>
            {activeHashtagFilter && (
              <button
                onClick={() => setActiveHashtagFilter(null)}
                className="text-xs text-rose-500 font-semibold underline cursor-pointer"
              >
                Show all confessions
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {visiblePosts.map((post) => {
              const isCardPickerOpen = cardPickerPostId === post.id;
              const hasReaction = Boolean((post as any).userReaction);
              const isCurrentDeleting = deletingId === post.id;

              return (
                <div
                  key={post.id}
                  onClick={() => handleOpenPost(post)}
                  className="w-full rounded-[26px] sm:rounded-[30px] overflow-hidden bg-[#faefe6] shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-[#ebd8c8] cursor-pointer hover:shadow-lg transition-all"
                >
                  {/* Image Banner */}
                  {Boolean((post as any).imageUrl || (post as any).image) && (
                    <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-stone-200">
                      <img
                        src={(post as any).imageUrl || (post as any).image}
                        alt="Confession story"
                        className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== FALLBACK_IMAGE_URL) {
                            target.src = FALLBACK_IMAGE_URL;
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-5 sm:p-7">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500 font-medium mb-3">
                      <span>{extractAuthorName(post)}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 text-[#e15b50]">
                        <MapPin className="w-3.5 h-3.5 fill-[#e15b50]/20" />
                        <span>{[(post as any).city, (post as any).country].filter(Boolean).join(', ') || 'Worldwide'}</span>
                      </span>
                      <span>·</span>
                      <span>{parseTimeToHuman((post as any).createdAt || (post as any).timestamp || (post as any).time)}</span>
                    </div>

                    <p className="text-stone-800 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-4 font-normal whitespace-pre-wrap">
                      {formatInteractiveText((post as any).text || (post as any).content || '')}
                    </p>

                    <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#ebd8c8]/60">
                      <div className="flex items-center gap-2.5">
                        
                        {/* Interactive Reaction/Like on Card */}
                        <div 
                          className="relative card-reaction-container" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardPickerPostId(isCardPickerOpen ? null : post.id);
                            }}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all active:scale-95 cursor-pointer ${
                              hasReaction
                                ? 'border-rose-300 bg-rose-50 text-rose-600 font-semibold'
                                : 'bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6] border-transparent'
                            }`}
                          >
                            {hasReaction ? (
                              <span className="text-base leading-none">{(post as any).userReaction}</span>
                            ) : (
                              <Heart className="w-4 h-4 text-stone-500 hover:text-rose-500" />
                            )}
                            <span>{safeLikesCount(post)}</span>
                          </button>

                          {/* Card Emoji Picker Tray */}
                          {isCardPickerOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute bottom-full left-0 mb-2 z-50 flex items-center gap-1 p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200 max-w-[85vw] sm:max-w-none overflow-x-auto"
                            >
                              {EMOJI_LIST.map((item) => (
                                <button
                                  key={item.label}
                                  type="button"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    handleSelectReaction(post.id, item.emoji, e);
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectReaction(post.id, item.emoji, e);
                                  }}
                                  className={`text-2xl p-1.5 rounded-xl hover:scale-125 active:scale-95 transition-transform cursor-pointer shrink-0 ${
                                    (post as any).userReaction === item.emoji ? 'bg-rose-100 scale-110' : 'hover:bg-stone-100'
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
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#eee0d2] text-stone-700 text-xs sm:text-sm font-medium">
                          <MessageCircle className="w-4 h-4 text-stone-500" />
                          <span>{safeCommentCount(post)}</span>
                        </div>

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={(e) => triggerShare(post, e)}
                          className="p-2 rounded-full bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6] active:scale-90 transition-all cursor-pointer"
                          title="Share confession"
                        >
                          <Share2 className="w-4 h-4 text-stone-600" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Secret Admin Delete Button on Card */}
                        {isAdmin && (
                          <button
                            type="button"
                            disabled={isCurrentDeleting}
                            onClick={(e) => handleDeletePost(post.id, e)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 border border-red-300 text-red-700 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                            title="Delete this confession"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isCurrentDeleting ? '...' : 'Delete'}</span>
                          </button>
                        )}

                        {/* Tap to View */}
                        <span className="text-xs sm:text-sm font-medium text-[#e15b50] hover:underline cursor-pointer">
                          Tap to view
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {!loading && canLoadMore && (
          <div className="flex justify-center pt-6">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#faefe6] border border-[#ebd8c8] text-[#e15b50] text-xs sm:text-sm font-semibold hover:bg-[#f3e6d8] active:scale-95 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
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

      {/* Share Popup */}
      {sharePopupPost && (() => {
        const postText = (sharePopupPost as any).text || (sharePopupPost as any).content || (sharePopupPost as any).body || '';
        const cleanSnippet = postText.length > 140 ? postText.slice(0, 140) + '...' : postText;
        const postUrl = `${window.location.origin}/?post=${encodeURIComponent(sharePopupPost.id)}`;
        const shareMessage = `"${cleanSnippet}"\n\nRead more anonymously on OpenConfess: ${postUrl}`;

        const handleNativeShare = async () => {
          if (navigator.share) {
            try {
              await navigator.share({
                title: 'Open Confess',
                text: `"${cleanSnippet}"\n\nRead more anonymously:`,
                url: postUrl,
              });
              setSharePopupPost(null);
            } catch (err) {}
          } else {
            handleCopyPostLink(postUrl);
          }
        };

        const handleCopyPostLink = (urlToCopy: string) => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(urlToCopy).then(() => {
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            });
          } else {
            const tempInput = document.createElement('input');
            tempInput.value = urlToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
          }
        };

        return (
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
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl shadow-sm">
                    💬
                  </div>
                  <span>WhatsApp</span>
                </a>

                {/* X (Twitter) */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${cleanSnippet}"`)}&url=${encodeURIComponent(postUrl)}&hashtags=OpenConfess,Anonymous`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold shadow-sm">
                    𝕏
                  </div>
                  <span>X</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(`"${cleanSnippet}"`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                    f
                  </div>
                  <span>Facebook</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(`"${cleanSnippet}"\n\nRead anonymously on OpenConfess:`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 text-xs text-stone-700 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center text-xl shadow-sm">
                    ✈️
                  </div>
                  <span>Telegram</span>
                </a>
              </div>

              {/* Native Mobile Share Button */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share via Other Apps</span>
                </button>
              )}

              {/* Copy Direct Post Link */}
              <button
                onClick={() => handleCopyPostLink(postUrl)}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Direct Post Link Copied!' : 'Copy Post Link'}</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Post Modal Detail with Fallback */}
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
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== FALLBACK_IMAGE_URL) {
                        target.src = FALLBACK_IMAGE_URL;
                      }
                    }}
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
                {formatInteractiveText(activePost.text || activePost.content || '')}
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
                      <span>{safeLikesCount(activePost)}</span>
                    </button>

                    {modalPickerOpen && (
                      <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 sm:gap-1.5 p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 z-30 overflow-x-auto max-w-[85vw] sm:max-w-none">
                        {EMOJI_LIST.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={(e) => handleSelectReaction(activePost.id, item.emoji, e)}
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

                <div className="flex items-center gap-2">
                  {/* Secret Admin Delete Button inside Modal */}
                  {isAdmin && (
                    <button
                      type="button"
                      disabled={deletingId === activePost.id}
                      onClick={(e) => handleDeletePost(activePost.id, e)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 border border-red-300 text-red-700 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      title="Delete confession"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingId === activePost.id ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => triggerShare(activePost, e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-stone-500" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="pt-2 border-t border-stone-100 space-y-4">
                <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                  Comments ({safeCommentCount(activePost)})
                </h3>

                {loadingComments ? (
                  <div className="flex items-center justify-center py-6 text-stone-400 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                    <span className="text-xs">Loading comments...</span>
                  </div>
                ) : (activePost.commentsList || []).length === 0 ? (
                  <p className="text-xs sm:text-sm text-stone-400 py-3 italic">
                    No comments yet. Be the first to reply.
                  </p>
                ) : (
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
                )}

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
