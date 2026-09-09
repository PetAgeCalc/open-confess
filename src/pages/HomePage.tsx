import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Search, X, Send, MapPin } from 'lucide-react';

export interface Confession {
  id: string;
  authorName?: string;
  text: string;
  country?: string;
  city?: string;
  category?: string;
  createdAt: number;
  reactions?: Record<string, number>;
  commentCount?: number;
}

const LOCAL_STORAGE_REACTIONS_KEY = 'oc_persistent_reactions_v1';
const LOCAL_STORAGE_POSTS_KEY = 'oc_local_confessions_v1';

const getSavedReactions = (): Record<string, Record<string, number>> => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_REACTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveReactionLocally = (postId: string, reactionType: string) => {
  try {
    const saved = getSavedReactions();
    if (!saved[postId]) saved[postId] = {};
    saved[postId][reactionType] = (saved[postId][reactionType] || 0) + 1;
    localStorage.setItem(LOCAL_STORAGE_REACTIONS_KEY, JSON.stringify(saved));
  } catch (err) {
    console.error('Failed to save reaction locally:', err);
  }
};

const INITIAL_SEEDS: Confession[] = [
  {
    id: 'seed-1',
    authorName: 'QuietSoul',
    text: "I still drive past your house every Friday evening, pretending it's on my way home from work.",
    city: 'Mumbai',
    country: 'India',
    category: 'Love',
    createdAt: Date.now() - 1000 * 60 * 25,
    reactions: { '❤️': 38, '🥺': 19, '🫂': 12 },
    commentCount: 6,
  },
  {
    id: 'seed-2',
    authorName: 'ShadowWalker',
    text: "Everyone thinks I have my life completely sorted out. In reality, I haven't slept properly in 4 months and I cry in my car during lunch breaks.",
    city: 'London',
    country: 'United Kingdom',
    category: 'Life',
    createdAt: Date.now() - 1000 * 60 * 75,
    reactions: { '🫂': 54, '🥺': 31, '💔': 15 },
    commentCount: 11,
  },
  {
    id: 'seed-3',
    authorName: 'Wanderer99',
    text: "I secretly paid off my younger brother's college debt and told him the university gave him an anonymous merit grant.",
    city: 'Toronto',
    country: 'Canada',
    category: 'Family',
    createdAt: Date.now() - 1000 * 60 * 140,
    reactions: { '❤️': 89, '👏': 45, '✨': 22 },
    commentCount: 9,
  },
  {
    id: 'seed-4',
    authorName: 'AnonymousUser',
    text: "I pretended to lose my phone just to get an entire weekend without anyone asking me for anything.",
    city: 'Tokyo',
    country: 'Japan',
    category: 'Funny',
    createdAt: Date.now() - 1000 * 60 * 210,
    reactions: { '😂': 67, '🔥': 20, '🙌': 18 },
    commentCount: 4,
  },
  {
    id: 'seed-5',
    authorName: 'DeepSea',
    text: "I bought two coffee cups this morning and walked into office looking like someone cared enough to bring me one.",
    city: 'New York',
    country: 'United States',
    category: 'Secret',
    createdAt: Date.now() - 1000 * 60 * 300,
    reactions: { '🫂': 44, '💔': 27, '🥺': 19 },
    commentCount: 8,
  },
  {
    id: 'seed-6',
    authorName: 'MidnightChai',
    text: 'Ami kokhono kauke bolini, kintu ami amar bondhur ex-ke bhalobashtam. Shey konodin janteo parbena.',
    city: 'Kolkata',
    country: 'India',
    category: 'Love',
    createdAt: Date.now() - 1000 * 60 * 420,
    reactions: { '❤️': 51, '🥺': 24, '🤐': 16 },
    commentCount: 7,
  },
  {
    id: 'seed-7',
    authorName: 'TechExhausted',
    text: 'I automated 90% of my remote software engineering job 6 months ago. I work 1 hour a day and spend the rest learning classical guitar.',
    city: 'Berlin',
    country: 'Germany',
    category: 'Work',
    createdAt: Date.now() - 1000 * 60 * 560,
    reactions: { '🔥': 112, '😂': 73, '👏': 49 },
    commentCount: 15,
  },
  {
    id: 'seed-8',
    authorName: 'DilKiBaat',
    text: 'Ghar wale shaadi ke liye rishte dekh rahe hain, aur mujhe unhe batane ki himmat nahi ho rahi ki mujhe kisi aur se beinteha mohabbat hai.',
    city: 'Delhi',
    country: 'India',
    category: 'Family',
    createdAt: Date.now() - 1000 * 60 * 700,
    reactions: { '🫂': 62, '🥺': 39, '💔': 21 },
    commentCount: 13,
  },
];

const CATEGORIES = ['All', 'Love', 'Secret', 'Life', 'Family', 'Work', 'Funny'];
const REACTION_LIST = ['❤️', '🫂', '🥺', '😂', '🔥', '👏'];

function InlineCard({
  confession,
  onReact,
}: {
  confession: Confession;
  onReact: (emoji: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between text-xs text-stone-400 mb-3">
        <div className="flex items-center gap-1.5 font-medium text-stone-600">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>{confession.city ? `${confession.city}, ${confession.country}` : 'Earth'}</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium text-[11px]">
          {confession.category || 'Secret'}
        </span>
      </div>

      <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-wrap">
        {confession.text}
      </p>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {REACTION_LIST.map((emoji) => {
            const count = confession.reactions?.[emoji] || 0;
            return (
              <button
                key={emoji}
                onClick={() => onReact(emoji)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-50 hover:bg-rose-50 hover:border-rose-200 border border-stone-200 text-xs transition-transform active:scale-90"
              >
                <span>{emoji}</span>
                {count > 0 && <span className="text-[11px] font-medium text-stone-600">{count}</span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 text-stone-400 text-xs font-medium">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{confession.commentCount || 0}</span>
        </div>
      </div>
    </div>
  );
}

function InlineModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (item: Confession) => void;
}) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Secret');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newConfession: Confession = {
      id: 'post-' + Date.now(),
      authorName: 'Anonymous',
      text: text.trim(),
      city: city.trim() || 'Unknown',
      country: country.trim() || 'World',
      category: category,
      createdAt: Date.now(),
      reactions: { '❤️': 1 },
      commentCount: 0,
    };

    onCreated(newConfession);
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="font-serif font-bold text-lg text-stone-900">Share Your Confession</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">What is on your mind?</label>
            <textarea
              rows={4}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Spill your heart out anonymously... No one will know it is you."
              className="w-full text-sm p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">City (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Siliguri, Delhi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Post Anonymously</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const mergeWithSavedReactions = (posts: Confession[]): Confession[] => {
    const savedReactions = getSavedReactions();
    return posts.map((post) => {
      const savedForPost = savedReactions[post.id] || {};
      const current = { ...(post.reactions || {}) };

      Object.keys(savedForPost).forEach((emoji) => {
        current[emoji] = (current[emoji] || 0) + savedForPost[emoji];
      });

      return {
        ...post,
        reactions: current,
      };
    });
  };

  useEffect(() => {
    try {
      let loadedPosts: Confession[] = [];
      const cached = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);

      if (cached) {
        try {
          loadedPosts = JSON.parse(cached);
        } catch {
          loadedPosts = INITIAL_SEEDS;
        }
      } else {
        loadedPosts = INITIAL_SEEDS;
        localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(INITIAL_SEEDS));
      }

      setConfessions(mergeWithSavedReactions(loadedPosts));
    } catch {
      setConfessions(mergeWithSavedReactions(INITIAL_SEEDS));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReaction = (confessionId: string, reactionType: string) => {
    setConfessions((prevList) =>
      prevList.map((post) => {
        if (post.id === confessionId) {
          const reactions = { ...(post.reactions || {}) };
          reactions[reactionType] = (reactions[reactionType] || 0) + 1;
          return { ...post, reactions };
        }
        return post;
      })
    );

    saveReactionLocally(confessionId, reactionType);
  };

  const handleConfessionCreated = (newConfession: Confession) => {
    setConfessions((prev) => [newConfession, ...prev]);

    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
      const parsed: Confession[] = cached ? JSON.parse(cached) : INITIAL_SEEDS;
      localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify([newConfession, ...parsed]));
    } catch {
      // Ignore
    }
  };

  const filteredConfessions = confessions.filter((confession) => {
    const matchesCategory =
      selectedCategory === 'All' || confession.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      confession.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      confession.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      confession.country?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#fff8f5] text-stone-900 selection:bg-rose-100 selection:text-rose-900 pb-20">
      <section className="px-4 pt-6 pb-6 text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-semibold tracking-wide uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" /> 100% Anonymous & Safe
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15]">
          Real stories. <span className="italic text-rose-600">Zero identities.</span>
        </h1>
        <p className="mt-3 text-stone-600 text-sm sm:text-base font-sans max-w-lg mx-auto leading-relaxed">
          A judgment-free space to speak the unspoken thoughts from across the globe. No account, no email, no tracking.
        </p>

        <div className="mt-6 relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by thoughts, city or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400/50 shadow-sm"
          />
        </div>

        <div className="flex items-center justify-center gap-2 mt-5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-xl mx-auto px-4 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-stone-400 text-sm">Loading real stories...</div>
        ) : filteredConfessions.length === 0 ? (
          <div className="py-16 text-center bg-white/70 rounded-2xl border border-stone-200 p-8">
            <MessageCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-stone-700 font-medium text-sm">No confessions found</p>
            <p className="text-stone-400 text-xs mt-1">Be the first to share one!</p>
          </div>
        ) : (
          filteredConfessions.map((confession) => (
            <InlineCard
              key={confession.id}
              confession={confession}
              onReact={(emoji: string) => handleReaction(confession.id, emoji)}
            />
          ))
        )}
      </main>

      <InlineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleConfessionCreated}
      />
    </div>
  );
}
