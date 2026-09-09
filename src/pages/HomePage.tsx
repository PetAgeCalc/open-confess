import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MapPin, X, Send, Plus, Smile } from 'lucide-react';

export interface CommentItem {
  id: string;
  author: string;
  text: string;
  timeAgo: string;
}

export interface Confession {
  id: string;
  authorName: string;
  location: string;
  timeAgo: string;
  text: string;
  imageUrl: string;
  likes: number;
  reactions: Record<string, number>;
  commentsList: CommentItem[];
}

const LOCAL_STORAGE_POSTS_KEY = 'oc_posts_with_full_emojis_v6';
const LOCAL_STORAGE_USER_LIKES_KEY = 'oc_user_likes_v6';
const LOCAL_STORAGE_USER_EMOJIS_KEY = 'oc_user_emojis_v6';

// Broad palette of emotional/relatable reactions
const ALL_EMOJI_OPTIONS = ['❤️', '🫂', '🥺', '😂', '🔥', '👏', '💔', '✨', '😭', '🙏', '🤐', '🤯'];

const INITIAL_POSTS: Confession[] = [
  {
    id: 'post-1',
    authorName: 'Anonymous',
    location: 'Los Angeles, USA',
    timeAgo: '3h ago',
    text: "I found out at 34 that the man I call Dad isn't my biological father. My mother told me on her deathbed, not to hurt him, but because she felt I deserved the truth before she left this world.",
    imageUrl: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=1200&auto=format&fit=crop&q=80',
    likes: 843,
    reactions: { '🫂': 124, '🥺': 98, '💔': 42 },
    commentsList: [
      { id: 'c1', author: 'KindStranger', text: 'Blood doesn’t make a father, love and presence do. He is still your real dad.', timeAgo: '2h ago' },
      { id: 'c2', author: 'SilentListener', text: 'Sending you so much strength. That is an enormous burden to carry.', timeAgo: '1h ago' },
      { id: 'c3', author: 'Rohit_M', text: 'Stay strong brother. Respect him even more now.', timeAgo: '30m ago' }
    ],
  },
  {
    id: 'post-2',
    authorName: 'Anonymous',
    location: 'Zurich, Switzerland',
    timeAgo: '5h ago',
    text: "I booked a solo cabin in the Alps and told my colleagues I was on a high-stakes business tour. I spent 4 days staring at the clouds and eating cheese in total silence.",
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    likes: 512,
    reactions: { '😂': 89, '🔥': 110, '✨': 65 },
    commentsList: [
      { id: 'c4', author: 'MountainBreeze', text: 'Honestly, this is peak self-care. Zero regrets!', timeAgo: '4h ago' },
      { id: 'c5', author: 'Workaholic', text: 'I wish I had the guts to do this. You earned that peace.', timeAgo: '3h ago' }
    ],
  },
  {
    id: 'post-3',
    authorName: 'Anonymous',
    location: 'Tokyo, Japan',
    timeAgo: '8h ago',
    text: "Every Friday, I leave an extra prepaid bento box with the local convenience store clerk for whoever comes in looking like they haven't eaten all day.",
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
    likes: 1204,
    reactions: { '👏': 340, '🫂': 210, '✨': 180 },
    commentsList: [
      { id: 'c6', author: 'KarmaIsReal', text: 'The world needs more souls like you.', timeAgo: '7h ago' },
      { id: 'c7', author: 'Sakura_99', text: 'Such a subtle and respectful way to help someone in need.', timeAgo: '5h ago' }
    ],
  },
  {
    id: 'post-4',
    authorName: 'Anonymous',
    location: 'Mumbai, India',
    timeAgo: '11h ago',
    text: "I still drive past your lane every Friday evening pretending it's on my regular route home from work.",
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&auto=format&fit=crop&q=80',
    likes: 928,
    reactions: { '🥺': 240, '💔': 130, '🫂': 88 },
    commentsList: [
      { id: 'c8', author: 'DilSe', text: 'Purani yaadein kabhi peecha nahi chhodti...', timeAgo: '9h ago' },
      { id: 'c9', author: 'Aniket_K', text: 'Ek baar baat kar ke dekh lo, regret se accha hai.', timeAgo: '6h ago' }
    ],
  },
];

export default function HomePage() {
  const [posts, setPosts] = useState<Confession[]>([]);
  const [userLikedPosts, setUserLikedPosts] = useState<string[]>([]);
  const [userEmojiMap, setUserEmojiMap] = useState<Record<string, string[]>>({});
  const [openEmojiPickerPostId, setOpenEmojiPickerPostId] = useState<string | null>(null);

  const [activePost, setActivePost] = useState<Confession | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  // Share form states
  const [newText, setNewText] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        setPosts(INITIAL_POSTS);
        localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(INITIAL_POSTS));
      }

      const storedLikes = localStorage.getItem(LOCAL_STORAGE_USER_LIKES_KEY);
      if (storedLikes) {
        setUserLikedPosts(JSON.parse(storedLikes));
      }

      const storedEmojis = localStorage.getItem(LOCAL_STORAGE_USER_EMOJIS_KEY);
      if (storedEmojis) {
        setUserEmojiMap(JSON.parse(storedEmojis));
      }
    } catch {
      setPosts(INITIAL_POSTS);
    }
  }, []);

  const savePostsState = (updatedPosts: Confession[]) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(updatedPosts));
    } catch (e) {
      console.error(e);
    }
  };

  // Dedicated Love Reaction Toggle
  const handleToggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isLiked = userLikedPosts.includes(postId);
    const updatedLikes = isLiked
      ? userLikedPosts.filter((id) => id !== postId)
      : [...userLikedPosts, postId];

    setUserLikedPosts(updatedLikes);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_LIKES_KEY, JSON.stringify(updatedLikes));
    } catch (err) {
      console.error(err);
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const newCount = isLiked ? Math.max(0, post.likes - 1) : post.likes + 1;
        const updated = { ...post, likes: newCount };
        if (activePost && activePost.id === postId) {
          setActivePost(updated);
        }
        return updated;
      }
      return post;
    });

    savePostsState(updatedPosts);
  };

  // Broad Emoji Reaction Toggle
  const handleToggleEmoji = (postId: string, emoji: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const currentEmojisForPost = userEmojiMap[postId] || [];
    const hasReacted = currentEmojisForPost.includes(emoji);

    const updatedList = hasReacted
      ? currentEmojisForPost.filter((item) => item !== emoji)
      : [...currentEmojisForPost, emoji];

    const newMap = { ...userEmojiMap, [postId]: updatedList };
    setUserEmojiMap(newMap);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_EMOJIS_KEY, JSON.stringify(newMap));
    } catch (err) {
      console.error(err);
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const reactionsObj = { ...(post.reactions || {}) };
        const currentCount = reactionsObj[emoji] || 0;
        const newCount = hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1;

        if (newCount === 0) {
          delete reactionsObj[emoji];
        } else {
          reactionsObj[emoji] = newCount;
        }

        const updated = { ...post, reactions: reactionsObj };
        if (activePost && activePost.id === postId) {
          setActivePost(updated);
        }
        return updated;
      }
      return post;
    });

    savePostsState(updatedPosts);
    setOpenEmojiPickerPostId(null);
  };

  // Comment submission
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !commentInput.trim()) return;

    const newComment: CommentItem = {
      id: 'comm-' + Date.now(),
      author: 'Anonymous',
      text: commentInput.trim(),
      timeAgo: 'Just now',
    };

    const updatedPosts = posts.map((post) => {
      if (post.id === activePost.id) {
        const updated = { ...post, commentsList: [newComment, ...post.commentsList] };
        setActivePost(updated);
        return updated;
      }
      return post;
    });

    savePostsState(updatedPosts);
    setCommentInput('');
  };

  // Confession Creation
  const handleCreateConfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newConfession: Confession = {
      id: 'post-' + Date.now(),
      authorName: 'Anonymous',
      location: newLocation.trim() || 'Earth',
      timeAgo: 'Just now',
      text: newText.trim(),
      imageUrl:
        newImageUrl.trim() ||
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&auto=format&fit=crop&q=80',
      likes: 1,
      reactions: { '❤️': 1 },
      commentsList: [],
    };

    const updated = [newConfession, ...posts];
    savePostsState(updated);
    setNewText('');
    setNewLocation('');
    setNewImageUrl('');
    setIsShareModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#f3e6d8] pb-28 font-sans text-stone-900 selection:bg-rose-200">
      {/* Title & Share Button */}
      <div className="pt-6 pb-6 px-4 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#e15b50] tracking-tight">
          Real stories. Zero identities.
        </h1>

        <div className="mt-4">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#e85342] to-[#ec5b53] hover:opacity-95 text-white text-xs sm:text-base font-semibold px-7 py-3 rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Share Your Confession</span>
          </button>
        </div>
      </div>

      {/* Main Single Column Feed */}
      <main className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-4 space-y-7">
        {posts.map((post) => {
          const isLiked = userLikedPosts.includes(post.id);
          const reactedEmojis = userEmojiMap[post.id] || [];
          const isPickerOpen = openEmojiPickerPostId === post.id;

          return (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="relative w-full rounded-[26px] sm:rounded-[32px] overflow-hidden bg-[#faefe6] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#ebd8c8] cursor-pointer hover:shadow-xl transition-all duration-200"
            >
              {/* Image Banner */}
              <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 overflow-hidden bg-stone-200">
                <img
                  src={post.imageUrl}
                  alt="Confession"
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-7">
                {/* Meta details */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 font-medium mb-3">
                  <span>{post.authorName}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-[#e15b50]">
                    <MapPin className="w-3.5 h-3.5 fill-[#e15b50]/20" />
                    <span>{post.location}</span>
                  </span>
                  <span>·</span>
                  <span>{post.timeAgo}</span>
                </div>

                {/* Excerpt text */}
                <p className="text-stone-800 text-sm sm:text-lg leading-relaxed font-normal line-clamp-4">
                  {post.text}
                </p>

                {/* Multi-Reaction, Like & Comment Controls */}
                <div className="mt-5 pt-3 border-t border-[#ebd8c8]/70 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {/* 1. Dedicated Love Reaction Button */}
                    <button
                      onClick={(e) => handleToggleLike(post.id, e)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-90 ${
                        isLiked
                          ? 'bg-[#e15b50] text-white shadow-sm'
                          : 'bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-white' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    {/* 2. Existing active emoji pills */}
                    {Object.entries(post.reactions || {}).map(([emoji, count]) => {
                      if (count <= 0) return null;
                      const hasUserVoted = reactedEmojis.includes(emoji);
                      return (
                        <button
                          key={emoji}
                          onClick={(e) => handleToggleEmoji(post.id, emoji, e)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-90 ${
                            hasUserVoted
                              ? 'bg-rose-200 border border-rose-400 text-stone-900'
                              : 'bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6]'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="text-[11px] sm:text-xs font-semibold text-stone-700">
                            {count}
                          </span>
                        </button>
                      );
                    })}

                    {/* 3. Add Emoji Picker Button */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenEmojiPickerPostId(isPickerOpen ? null : post.id);
                        }}
                        title="Add reaction"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eee0d2] hover:bg-[#e6d6c6] text-stone-600 text-xs sm:text-sm font-medium transition-all active:scale-90"
                      >
                        <Smile className="w-3.5 h-3.5 text-stone-600" />
                        <span className="text-xs">+</span>
                      </button>

                      {/* Emoji Dropdown Tray */}
                      {isPickerOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute left-0 bottom-full mb-2 z-30 bg-white border border-[#ebd8c8] shadow-xl rounded-2xl p-2 flex items-center gap-1.5 animate-in fade-in zoom-in-95 max-w-[280px] sm:max-w-none flex-wrap"
                        >
                          {ALL_EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={(e) => handleToggleEmoji(post.id, emoji, e)}
                              className="text-lg hover:scale-125 transition-transform p-1 rounded-lg hover:bg-stone-100"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments, Share & Tap to View */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eee0d2] text-stone-700 text-xs sm:text-sm font-medium">
                      <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500" />
                      <span>{post.commentsList.length}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (navigator.share) {
                          navigator.share({
                            title: 'Open Confess',
                            text: post.text,
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied to clipboard!');
                        }
                      }}
                      className="p-1.5 sm:p-2 rounded-full bg-[#eee0d2] text-stone-700 text-xs hover:bg-[#e6d6c6] active:scale-90 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-600" />
                    </button>

                    <span className="text-xs sm:text-sm font-semibold text-[#e15b50] hover:underline pl-1">
                      Tap to view
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* FULL POST DETAIL MODAL (Desktop + Mobile Full responsive) */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-[#faefe6] w-full max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[94vh] rounded-[24px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-[#ebd8c8] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#ebd8c8] bg-[#f3e6d8]">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium">
                <span>{activePost.authorName}</span>
                <span>·</span>
                <span className="text-[#e15b50] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {activePost.location}
                </span>
                <span>·</span>
                <span>{activePost.timeAgo}</span>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
              {/* Banner Image */}
              <div className="w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={activePost.imageUrl}
                  alt="Post banner"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Full Story */}
              <p className="text-stone-900 text-base sm:text-xl leading-relaxed whitespace-pre-wrap font-serif">
                "{activePost.text}"
              </p>

              {/* Modal Reaction Center */}
              <div className="pt-3 border-t border-[#ebd8c8]">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2.5">
                  Reactions & Thoughts
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Love button in modal */}
                  <button
                    onClick={() => handleToggleLike(activePost.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                      userLikedPosts.includes(activePost.id)
                        ? 'bg-[#e15b50] text-white shadow-sm'
                        : 'bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6]'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        userLikedPosts.includes(activePost.id) ? 'fill-white' : ''
                      }`}
                    />
                    <span>{activePost.likes} Love</span>
                  </button>

                  {/* All emoji toggles */}
                  {ALL_EMOJI_OPTIONS.map((emoji) => {
                    const count = activePost.reactions?.[emoji] || 0;
                    const hasVoted = (userEmojiMap[activePost.id] || []).includes(emoji);

                    return (
                      <button
                        key={emoji}
                        onClick={() => handleToggleEmoji(activePost.id, emoji)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                          hasVoted
                            ? 'bg-rose-200 border border-rose-400 text-stone-900'
                            : 'bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6]'
                        }`}
                      >
                        <span>{emoji}</span>
                        {count > 0 && <span className="text-xs font-semibold">{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-600">
                  Comments ({activePost.commentsList.length})
                </h4>

                {activePost.commentsList.length === 0 ? (
                  <p className="text-xs sm:text-sm text-stone-400 italic py-4 text-center">
                    No comments yet. Be the first to share an anonymous thought.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {activePost.commentsList.map((c) => (
                      <div
                        key={c.id}
                        className="bg-[#f3e6d8] p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm space-y-1 border border-[#e4d4c4]"
                      >
                        <div className="flex items-center justify-between text-stone-500 font-semibold text-[11px] sm:text-xs">
                          <span>{c.author}</span>
                          <span className="font-normal">{c.timeAgo}</span>
                        </div>
                        <p className="text-stone-800 leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comment Form */}
            <form
              onSubmit={handleAddComment}
              className="p-3.5 sm:p-4 border-t border-[#ebd8c8] bg-[#f3e6d8] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Leave an anonymous, empathetic reply..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-white border border-[#ebd8c8] rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#e15b50]"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="bg-[#e15b50] hover:bg-[#d04b40] disabled:opacity-40 text-white p-2.5 sm:p-3 rounded-full transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHARE YOUR CONFESSION MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#faefe6] w-full max-w-lg rounded-[28px] shadow-2xl overflow-hidden border border-[#ebd8c8] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebd8c8] bg-[#f3e6d8]">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
                Share Anonymous Confession
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateConfession} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Your Confession *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Spill your thoughts freely... 100% anonymous."
                  className="w-full bg-white text-xs sm:text-sm p-3.5 border border-[#ebd8c8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e15b50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Location (City / Country)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Siliguri, India or Tokyo, Japan"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-white text-xs p-3 border border-[#ebd8c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e15b50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-white text-xs p-3 border border-[#ebd8c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e15b50]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#e85342] to-[#ec5b53] hover:opacity-95 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Post Confession Anonymously</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
