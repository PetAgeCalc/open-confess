import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  doc,
  setDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { postsDb, interactionsDb } from '../firebase';
import ConfessionCard from '../components/ConfessionCard';
import ConfessionModal from '../components/ConfessionModal';
import { Heart, Sparkles, Flame, MessageCircle, Compass, Plus, Search } from 'lucide-react';

export interface Confession {
  id: string;
  authorName?: string;
  text: string;
  imageUrl?: string | null;
  country?: string;
  city?: string;
  region?: string;
  category?: string;
  createdAt: any;
  reactions?: Record<string, number>;
  commentCount?: number;
  views?: number;
}

// ==========================================
// Reaction Storage Persistence Helpers
// ==========================================
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

// ==========================================
// Initial 50 Seed Worldwide Confessions
// ==========================================
const INITIAL_SEEDS: Confession[] = [
  {
    id: 'seed-1',
    authorName: 'QuietSoul',
    text: "I still drive past your house every Friday evening, pretending it's on my way home from work.",
    city: 'Mumbai',
    country: 'India',
    region: 'Maharashtra',
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
    region: 'England',
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
    region: 'Ontario',
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
    region: 'Kanto',
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
    region: 'NY',
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
    region: 'West Bengal',
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
    region: 'Berlin',
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
    region: 'Delhi',
    category: 'Family',
    createdAt: Date.now() - 1000 * 60 * 700,
    reactions: { '🫂': 62, '🥺': 39, '💔': 21 },
    commentCount: 13,
  },
  {
    id: 'seed-9',
    authorName: 'SilentEcho',
    text: "I leave positive sticky notes inside random library books hoping someone having a bad day finds them.",
    city: 'Sydney',
    country: 'Australia',
    region: 'NSW',
    category: 'Life',
    createdAt: Date.now() - 1000 * 60 * 850,
    reactions: { '❤️': 95, '✨': 58, '👏': 34 },
    commentCount: 5,
  },
  {
    id: 'seed-10',
    authorName: 'LostDreamer',
    text: "Left medical school in the final semester because I realized saving lives when I didn't want my own made no sense. Now I bake bread and I have never been happier.",
    city: 'Paris',
    country: 'France',
    region: 'Île-de-France',
    category: 'Life',
    createdAt: Date.now() - 1000 * 60 * 1020,
    reactions: { '❤️': 140, '✨': 88, '👏': 62 },
    commentCount: 22,
  },
];

const CATEGORIES = ['All', 'Love', 'Secret', 'Life', 'Family', 'Work', 'Funny'];

export default function HomePage() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // ==========================================
  // Merge Persisted Reactions with Posts
  // ==========================================
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

  // ==========================================
  // Load Confessions on Mount
  // ==========================================
  useEffect(() => {
    const loadConfessions = async () => {
      try {
        let loadedPosts: Confession[] = [];

        // Check if postsDb is available
        if (postsDb) {
          try {
            const q = query(
              collection(postsDb, 'confessions'),
              orderBy('createdAt', 'desc'),
              limit(50)
            );
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
              loadedPosts = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
              })) as Confession[];
            }
          } catch (dbErr) {
            console.warn('Firestore fetch skipped or not configured, checking local storage:', dbErr);
          }
        }

        // Fallback to local storage or Seed Data
        if (loadedPosts.length === 0) {
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
        }

        // Apply saved reactions permanently
        const finalizedPosts = mergeWithSavedReactions(loadedPosts);
        setConfessions(finalizedPosts);
      } catch (err) {
        console.error('Error loading confessions:', err);
        setConfessions(mergeWithSavedReactions(INITIAL_SEEDS));
      } finally {
        setLoading(false);
      }
    };

    loadConfessions();
  }, []);

  // ==========================================
  // Handle Reaction Click (Persistent & Safe)
  // ==========================================
  const handleReaction = async (confessionId: string, reactionType: string) => {
    // 1. Instant UI update
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

    // 2. Persist locally (will never disappear on refresh)
    saveReactionLocally(confessionId, reactionType);

    // Also update cached posts in local storage if present
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
      if (cached) {
        const parsed: Confession[] = JSON.parse(cached);
        const updated = parsed.map((p) => {
          if (p.id === confessionId) {
            const rx = { ...(p.reactions || {}) };
            rx[reactionType] = (rx[reactionType] || 0) + 1;
            return { ...p, reactions: rx };
          }
          return p;
        });
        localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }

    // 3. Persist to interactionsDb Firestore (if connected)
    try {
      if (interactionsDb) {
        const interactionDocRef = doc(interactionsDb, 'post_interactions', confessionId);
        await setDoc(
          interactionDocRef,
          {
            reactions: {
              [reactionType]: increment(1),
            },
          },
          { merge: true }
        );
      }
    } catch (firebaseErr) {
      console.warn('Interactions Firestore sync skipped:', firebaseErr);
    }
  };

  // ==========================================
  // Handle New Confession Submission
  // ==========================================
  const handleConfessionCreated = (newConfession: Confession) => {
    setConfessions((prev) => [newConfession, ...prev]);

    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
      const parsed: Confession[] = cached ? JSON.parse(cached) : INITIAL_SEEDS;
      localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify([newConfession, ...parsed]));
    } catch {
      // Ignore local storage error
    }
  };

  // Filter confessions
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
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#fff8f5]/90 backdrop-blur-md border-b border-stone-200/70 px-4 py-3 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Heart className="w-4 h-4 fill-white" />
            </span>
            <span className="font-serif font-bold text-xl tracking-tight text-stone-900">
              Open Confess
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Share Confession</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 pt-10 pb-6 text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-semibold tracking-wide uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" /> 100% Anonymous & Safe
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15]">
          Real stories. <span className="italic text-rose-600">Zero identities.</span>
        </h1>
        <p className="mt-3 text-stone-600 text-sm sm:text-base font-sans max-w-lg mx-auto leading-relaxed">
          A judgment-free space to speak the unspoken thoughts from across the globe. No account, no email, no tracking.
        </p>

        {/* Search Bar */}
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

        {/* Category Pills */}
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

      {/* Confessions Feed */}
      <main className="max-w-xl mx-auto px-4 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-stone-400 text-sm">
            Loading real stories...
          </div>
        ) : filteredConfessions.length === 0 ? (
          <div className="py-16 text-center bg-white/70 rounded-2xl border border-stone-200 p-8">
            <MessageCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-stone-700 font-medium text-sm">No confessions found</p>
            <p className="text-stone-400 text-xs mt-1">Be the first to share one!</p>
          </div>
        ) : (
          filteredConfessions.map((confession) => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              onReact={(emoji: string) => handleReaction(confession.id, emoji)}
            />
          ))
        )}
      </main>

      {/* New Confession Modal */}
      {isModalOpen && (
        <ConfessionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={handleConfessionCreated}
        />
      )}
    </div>
  );
}
