import React, { useState, useEffect } from 'react';
import { MessageCircle, Share2, MapPin, X, Send, Plus } from 'lucide-react';

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
  totalReactions: number;
  commentsList: CommentItem[];
}

const LOCAL_STORAGE_POSTS_KEY = 'oc_posts_fb_style_v7';
const LOCAL_STORAGE_USER_REACTION_KEY = 'oc_user_single_reaction_v7';

// Facebook style reactions palette
const FB_REACTIONS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '🫂', label: 'Care' },
  { emoji: '🥺', label: 'Sad' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '💔', label: 'Heartbroken' },
];

const INITIAL_POSTS: Confession[] = [
  {
    id: 'post-1',
    authorName: 'Anonymous',
    location: 'Los Angeles, USA',
    timeAgo: '3h ago',
    text: "I found out at 34 that the man I call Dad isn't my biological father. My mother told me on her deathbed, not to hurt him, but because she felt I deserved the truth before she left this world.",
    imageUrl: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=1400&auto=format&fit=crop&q=80',
    totalReactions: 843,
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
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1400&auto=format&fit=crop&q=80',
    totalReactions: 512,
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
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1400&auto=format&fit=crop&q=80',
    totalReactions: 1204,
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
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1400&auto=format&fit=crop&q=80',
    totalReactions: 928,
    commentsList: [
      { id: 'c8', author: 'DilSe', text: 'Purani yaadein kabhi peecha nahi chhodti...', timeAgo: '9h ago' },
      { id: 'c9', author: 'Aniket_K', text: 'Ek baar baat kar ke dekh lo, regret se accha hai.', timeAgo: '6h ago' }
    ],
  },
];

export default function HomePage() {
  const [posts, setPosts] = useState<Confession[]>([]);
  const [userReactions, setUserReactions] = useState<Record<string, string>>({}); // { postId: emoji }
  const [activeReactionPickerPostId, setActiveReactionPickerPostId] = useState<string | null>(null);

  const [activePost, setActivePost] = useState<Confession | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  // Share Modal inputs
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

      const storedUserReactions = localStorage.getItem(LOCAL_STORAGE_USER_REACTION_KEY);
      if (storedUserReactions) {
        setUserReactions(JSON.parse(storedUserReactions));
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

  // Facebook Style Single Reaction Selection (1 user = 1 reaction)
  const handleSelectReaction = (postId: string, selectedEmoji: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const previousReaction = userReactions[postId];
    const isSameReaction = previousReaction === selectedEmoji;

    let updatedReactionsMap = { ...userReactions };
    let countDifference = 0;

    if (isSameReaction) {
      // User tapped the same reaction again -> Remove it
      delete updatedReactionsMap[postId];
      countDifference = -1;
    } else {
      // User picked a reaction
      updatedReactionsMap[postId] = selectedEmoji;
      countDifference = previousReaction ? 0 : 1; // if already reacted before, count remains same; if new reaction, +1
    }

    setUserReactions(updatedReactionsMap);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_REACTION_KEY, JSON.stringify(updatedReactionsMap));
    } catch (err) {
      console.error(err);
    }

    const updatedPosts = posts.map((p) => {
      if (p.id === postId) {
        const updated = {
          ...p,
          totalReactions: Math.max(0, p.totalReactions + countDifference),
        };
        if (activePost && activePost.id === postId) {
          setActivePost(updated);
        }
        return updated;
      }
      return p;
    });

    savePostsState(updatedPosts);
    setActiveReactionPickerPostId(null);
  };

  // Default Quick Tap on Reaction Button (Defaults to ❤️ Love)
  const handleQuickReactionTap = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = userReactions[postId];
    if (current) {
      handleSelectReaction(postId, current, e);
    } else {
      handleSelectReaction(postId, '❤️', e);
    }
  };

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

  const handleCreateConfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newConfession: Confession = {
      id: 'post-' + Date.now(),
      authorName: 'Anonymous',
      location: newLocation.trim() || 'Worldwide',
      timeAgo: 'Just now',
      text: newText.trim(),
      imageUrl:
        newImageUrl.trim() ||
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1400&auto=format&fit=crop&q=80',
      totalReactions: 1,
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
      <div className="pt-8 pb-6 px-4 text-center max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#e15b50] tracking-tight">
          Real stories. Zero identities.
        </h1>

        <div className="mt-5">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e85342] to-[#ec5b53] hover:opacity-95 text-white text-sm sm:text-base font-semibold px-8 py-3.5 rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Share Your Confession</span>
          </button>
        </div>
      </div>

      {/* Main Desktop Full Column Feed */}
      <main className="w-full max-w-3xl md:max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {posts.map((post) => {
          const userSelectedEmoji = userReactions[post.id];
          const isPickerOpen = activeReactionPickerPostId === post.id;

          return (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="w-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#faefe6] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#ebd8c8] cursor-pointer hover:shadow-xl transition-all duration-200"
            >
              {/* Desktop Full Height Banner */}
              <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[420px] overflow-hidden bg-stone-200">
                <img
                  src={post.imageUrl}
                  alt="Confession banner"
                  className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8">
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
                <p className="text-stone-800 text-sm sm:text-lg md:text-xl leading-relaxed font-normal">
                  {post.text}
                </p>

                {/* Facebook 2-Button Action Bar */}
                <div className="mt-6 pt-4 border-t border-[#ebd8c8] flex items-center justify-between relative">
                  <div className="flex items-center gap-3">
                    {/* BUTTON 1: Reaction Button (FB Style with Emoji Picker) */}
                    <div
                      className="relative"
                      onMouseEnter={() => setActiveReactionPickerPostId(post.id)}
                    >
                      <button
                        onClick={(e) => handleQuickReactionTap(post.id, e)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                          userSelectedEmoji
                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                            : 'bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6]'
                        }`}
                      >
                        <span className="text-base sm:text-lg">
                          {userSelectedEmoji || '❤️'}
                        </span>
                        <span>{post.totalReactions}</span>
                      </button>

                      {/* Floating FB-Style Reaction Bar Drawer */}
                      {isPickerOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseLeave={() => setActiveReactionPickerPostId(null)}
                          className="absolute left-0 bottom-full mb-3 z-30 bg-white/95 backdrop-blur-md border border-[#ebd8c8] shadow-2xl rounded-full px-3 py-1.5 flex items-center gap-2 animate-in fade-in zoom-in-90"
                        >
                          {FB_REACTIONS.map((item) => (
                            <button
                              key={item.label}
                              title={item.label}
                              onClick={(e) => handleSelectReaction(post.id, item.emoji, e)}
                              className="text-xl sm:text-2xl hover:scale-135 active:scale-95 transition-transform p-1 rounded-full hover:bg-stone-100"
                            >
                              {item.emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* BUTTON 2: Comment Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePost(post);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6] text-xs sm:text-sm font-semibold transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 text-stone-600" />
                      <span>{post.commentsList.length} Comments</span>
                    </button>

                    {/* Share icon */}
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
                          alert('Confession link copied!');
                        }
                      }}
                      className="p-2.5 rounded-full bg-[#eee0d2] text-stone-700 text-xs hover:bg-[#e6d6c6] active:scale-95 transition-all"
                    >
                      <Share2 className="w-4 h-4 text-stone-600" />
                    </button>
                  </div>

                  <span className="text-xs sm:text-sm font-semibold text-[#e15b50] hover:underline">
                    Tap to view
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* FULL POST DETAIL MODAL (Spacious Desktop + Mobile Full View) */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#faefe6] w-full max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[92vh] rounded-[28px] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden border border-[#ebd8c8] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-[#ebd8c8] bg-[#f3e6d8]">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium">
                <span>{activePost.authorName}</span>
                <span>·</span>
                <span className="text-[#e15b50] flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {activePost.location}
                </span>
                <span>·</span>
                <span>{activePost.timeAgo}</span>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
              <div className="w-full h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner">
                <img
                  src={activePost.imageUrl}
                  alt="Post banner"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-stone-900 text-base sm:text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-serif">
                "{activePost.text}"
              </p>

              {/* FB Style 2 Buttons inside Modal */}
              <div className="pt-4 border-t border-[#ebd8c8] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Reaction Tray inside modal */}
                  <div className="flex items-center gap-1.5 p-1.5 bg-[#ebd8c8]/50 rounded-full border border-[#dfccbc]">
                    {FB_REACTIONS.map((item) => {
                      const isChosen = userReactions[activePost.id] === item.emoji;
                      return (
                        <button
                          key={item.label}
                          title={item.label}
                          onClick={() => handleSelectReaction(activePost.id, item.emoji)}
                          className={`text-xl sm:text-2xl p-1.5 rounded-full transition-all active:scale-90 ${
                            isChosen
                              ? 'bg-white shadow-md scale-125'
                              : 'hover:scale-115 opacity-70 hover:opacity-100'
                          }`}
                        >
                          {item.emoji}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-stone-600">
                    {activePost.totalReactions} Reactions
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-semibold text-stone-500">
                  {activePost.commentsList.length} Comments
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-600">
                  Comments ({activePost.commentsList.length})
                </h4>

                {activePost.commentsList.length === 0 ? (
                  <p className="text-xs sm:text-sm text-stone-400 italic py-6 text-center">
                    No comments yet. Be the first to reply empathetically.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {activePost.commentsList.map((c) => (
                      <div
                        key={c.id}
                        className="bg-[#f3e6d8] p-4 rounded-2xl text-xs sm:text-sm space-y-1 border border-[#e4d4c4]"
                      >
                        <div className="flex items-center justify-between text-stone-500 font-semibold text-xs">
                          <span>{c.author}</span>
                          <span className="font-normal text-[11px]">{c.timeAgo}</span>
                        </div>
                        <p className="text-stone-800 leading-relaxed text-sm sm:text-base">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comment Form */}
            <form
              onSubmit={handleAddComment}
              className="p-4 sm:p-5 border-t border-[#ebd8c8] bg-[#f3e6d8] flex items-center gap-3"
            >
              <input
                type="text"
                placeholder="Write an empathetic reply..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-white border border-[#ebd8c8] rounded-full px-5 py-3 text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-[#e15b50]"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="bg-[#e15b50] hover:bg-[#d04b40] disabled:opacity-40 text-white p-3 rounded-full transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHARE YOUR CONFESSION MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#faefe6] w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-[#ebd8c8] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#ebd8c8] bg-[#f3e6d8]">
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Share Anonymous Confession
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-800 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateConfession} className="p-7 space-y-4">
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
                  className="w-full bg-white text-xs sm:text-sm p-4 border border-[#ebd8c8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e15b50]"
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
                  className="w-full bg-white text-xs sm:text-sm p-3.5 border border-[#ebd8c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e15b50]"
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
                  className="w-full bg-white text-xs sm:text-sm p-3.5 border border-[#ebd8c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e15b50]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#e85342] to-[#ec5b53] hover:opacity-95 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
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
