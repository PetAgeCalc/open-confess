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
  commentsList: CommentItem[];
}

const LOCAL_STORAGE_POSTS_KEY = 'oc_full_posts_v4';
const LOCAL_STORAGE_USER_LIKES_KEY = 'oc_user_liked_ids_v4';

const INITIAL_POSTS: Confession[] = [
  {
    id: 'post-1',
    authorName: 'Anonymous',
    location: 'Los Angeles, USA',
    timeAgo: '3h ago',
    text: "I found out at 34 that the man I call Dad isn't my biological father. My mother told me on her deathbed, not to hurt him, but because she felt I deserved the truth before she left this world.",
    imageUrl: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=800&auto=format&fit=crop&q=80',
    likes: 843,
    commentsList: [
      { id: 'c1', author: 'KindStranger', text: 'Blood doesn’t make a father, love and presence do. He is still your dad.', timeAgo: '2h ago' },
      { id: 'c2', author: 'SilentListener', text: 'Sending you so much strength. That must be so heavy to carry.', timeAgo: '1h ago' },
      { id: 'c3', author: 'Rohit_M', text: 'Stay strong brother. Respect him even more now.', timeAgo: '30m ago' }
    ],
  },
  {
    id: 'post-2',
    authorName: 'Anonymous',
    location: 'Zurich, Switzerland',
    timeAgo: '5h ago',
    text: "I booked a solo cabin in the Alps and told my colleagues I was on a high-stakes business tour. I spent 4 days staring at the clouds and eating cheese in total silence.",
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    likes: 512,
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
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    likes: 1204,
    commentsList: [
      { id: 'c6', author: 'KarmaIsReal', text: 'The world needs more souls like you.', timeAgo: '7h ago' },
      { id: 'c7', author: 'Sakura_99', text: 'Such a subtle and respectful way to help.', timeAgo: '5h ago' }
    ],
  },
  {
    id: 'post-4',
    authorName: 'Anonymous',
    location: 'Mumbai, India',
    timeAgo: '11h ago',
    text: "I still drive past your lane every Friday evening pretending it's on my regular route home from work.",
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    likes: 928,
    commentsList: [
      { id: 'c8', author: 'DilSe', text: 'Purani yaadein kabhi peecha nahi chhodti...', timeAgo: '9h ago' },
      { id: 'c9', author: 'Aniket_K', text: 'Ek baar baat kar ke dekh lo, guilt se accha hai.', timeAgo: '6h ago' }
    ],
  },
];

export default function HomePage() {
  const [posts, setPosts] = useState<Confession[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [activePost, setActivePost] = useState<Confession | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  // Share form states
  const [newText, setNewText] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Load posts & liked status from LocalStorage
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
        setLikedPostIds(JSON.parse(storedLikes));
      }
    } catch (e) {
      setPosts(INITIAL_POSTS);
    }
  }, []);

  // Save changes to localStorage
  const persistPosts = (updatedPosts: Confession[]) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(updatedPosts));
    } catch (err) {
      console.error(err);
    }
  };

  // Like click toggle with persistence
  const handleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isAlreadyLiked = likedPostIds.includes(postId);
    const updatedLikedIds = isAlreadyLiked
      ? likedPostIds.filter((id) => id !== postId)
      : [...likedPostIds, postId];

    setLikedPostIds(updatedLikedIds);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_LIKES_KEY, JSON.stringify(updatedLikedIds));
    } catch (err) {
      console.error(err);
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const newLikes = isAlreadyLiked ? Math.max(0, post.likes - 1) : post.likes + 1;
        const updated = { ...post, likes: newLikes };
        if (activePost && activePost.id === postId) {
          setActivePost(updated);
        }
        return updated;
      }
      return post;
    });

    persistPosts(updatedPosts);
  };

  // Add Comment function
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
        const updatedComments = [newComment, ...post.commentsList];
        const updated = { ...post, commentsList: updatedComments };
        setActivePost(updated);
        return updated;
      }
      return post;
    });

    persistPosts(updatedPosts);
    setCommentInput('');
  };

  // Create New Confession function
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
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
      likes: 1,
      commentsList: [],
    };

    const updated = [newConfession, ...posts];
    persistPosts(updated);
    setNewText('');
    setNewLocation('');
    setNewImageUrl('');
    setIsShareModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#f3e6d8] pb-24 font-sans text-stone-900 selection:bg-rose-200">
      {/* Title & Share Button Area */}
      <div className="pt-6 pb-6 px-4 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#e15b50] tracking-tight">
          Real stories. Zero identities.
        </h1>

        <div className="mt-4">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#e85342] to-[#ec5b53] hover:opacity-95 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Share Your Confession</span>
          </button>
        </div>
      </div>

      {/* Confession Cards Feed */}
      <main className="max-w-md mx-auto px-4 space-y-6">
        {posts.map((post) => {
          const isLiked = likedPostIds.includes(post.id);
          return (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="rounded-[28px] overflow-hidden bg-[#faefe6] shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-[#ebd8c8] cursor-pointer hover:shadow-lg transition-all"
            >
              {/* Image Banner */}
              <div className="w-full h-56 sm:h-64 overflow-hidden bg-stone-200">
                <img
                  src={post.imageUrl}
                  alt="Confession story"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Meta details */}
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-3">
                  <span>{post.authorName}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-[#e15b50]">
                    <MapPin className="w-3.5 h-3.5 fill-[#e15b50]/20" />
                    <span>{post.location}</span>
                  </span>
                  <span>·</span>
                  <span>{post.timeAgo}</span>
                </div>

                {/* Text excerpt */}
                <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-normal line-clamp-3">
                  {post.text}
                </p>

                {/* Bottom Bar */}
                <div className="mt-5 flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    {/* Like button */}
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-90 ${
                        isLiked
                          ? 'bg-rose-100 text-rose-600 border border-rose-300'
                          : 'bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6]'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-rose-500 text-rose-500' : 'fill-stone-400 text-stone-400'
                        }`}
                      />
                      <span>{post.likes}</span>
                    </button>

                    {/* Comment count */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eee0d2] text-stone-700 text-xs font-medium">
                      <MessageCircle className="w-3.5 h-3.5 text-stone-500" />
                      <span>{post.commentsList.length}</span>
                    </div>

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
                      className="p-1.5 rounded-full bg-[#eee0d2] text-stone-700 text-xs hover:bg-[#e6d6c6] active:scale-90 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5 text-stone-600" />
                    </button>
                  </div>

                  <span className="text-xs font-medium text-[#e15b50] hover:underline">
                    Tap to view
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* ======================================================== */}
      {/* FULL POST DETAIL & COMMENT MODAL (Opens on Card Click)   */}
      {/* ======================================================== */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-[#faefe6] w-full max-w-lg max-h-[92vh] rounded-[28px] shadow-2xl flex flex-col overflow-hidden border border-[#ebd8c8] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#ebd8c8] bg-[#f3e6d8]">
              <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                <span>{activePost.authorName}</span>
                <span>·</span>
                <span className="text-[#e15b50] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {activePost.location}
                </span>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              {/* Image banner */}
              <div className="w-full h-56 rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={activePost.imageUrl}
                  alt="Post banner"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Full Text */}
              <p className="text-stone-900 text-base leading-relaxed whitespace-pre-wrap font-serif">
                "{activePost.text}"
              </p>

              {/* Likes & Reactions Bar */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#ebd8c8]">
                <button
                  onClick={() => handleLike(activePost.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    likedPostIds.includes(activePost.id)
                      ? 'bg-rose-500 text-white'
                      : 'bg-[#eee0d2] text-stone-700 hover:bg-[#e6d6c6]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedPostIds.includes(activePost.id) ? 'fill-white' : ''
                    }`}
                  />
                  <span>{activePost.likes} Likes</span>
                </button>

                <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#eee0d2] text-stone-700 text-xs font-medium">
                  <MessageCircle className="w-4 h-4 text-stone-600" />
                  <span>{activePost.commentsList.length} Comments</span>
                </div>
              </div>

              {/* Comments Thread */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Comments ({activePost.commentsList.length})
                </h4>

                {activePost.commentsList.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-3 text-center">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {activePost.commentsList.map((c) => (
                      <div
                        key={c.id}
                        className="bg-[#f3e6d8] p-3 rounded-xl text-xs space-y-1 border border-[#e4d4c4]"
                      >
                        <div className="flex items-center justify-between text-stone-500 font-semibold text-[11px]">
                          <span>{c.author}</span>
                          <span className="font-normal text-[10px]">{c.timeAgo}</span>
                        </div>
                        <p className="text-stone-800 leading-snug">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comment Input Box */}
            <form
              onSubmit={handleAddComment}
              className="p-3 border-t border-[#ebd8c8] bg-[#f3e6d8] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Leave an anonymous, empathetic reply..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-white border border-[#ebd8c8] rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#e15b50]"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="bg-[#e15b50] hover:bg-[#d04b40] disabled:opacity-40 text-white p-2.5 rounded-full transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE CONFESSION MODAL ("+ Share Your Confession")       */}
      {/* ======================================================== */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#faefe6] w-full max-w-lg rounded-[28px] shadow-2xl overflow-hidden border border-[#ebd8c8] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebd8c8] bg-[#f3e6d8]">
              <h3 className="font-serif font-bold text-lg text-stone-900">
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
                  placeholder="Spill your heart out... 100% anonymous. No logs, no judgment."
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
                className="w-full py-3 bg-gradient-to-r from-[#e85342] to-[#ec5b53] hover:opacity-95 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
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
