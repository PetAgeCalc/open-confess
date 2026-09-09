import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';

export interface Confession {
  id: string;
  authorName: string;
  location: string;
  timeAgo: string;
  text: string;
  imageUrl: string;
  likes: number;
  comments: number;
}

const LOCAL_STORAGE_LIKES_KEY = 'oc_likes_data_v2';

const getSavedLikes = (): Record<string, number> => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const INITIAL_POSTS: Confession[] = [
  {
    id: 'post-1',
    authorName: 'Anonymous',
    location: 'Los Angeles, USA',
    timeAgo: '3h ago',
    text: "I found out at 34 that the man I call Dad isn't my biological father. My mother told me on her deathbed, not to hurt him, but because she felt I deserved the truth before she left this world.",
    imageUrl: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=800&auto=format&fit=crop&q=80',
    likes: 843,
    comments: 3,
  },
  {
    id: 'post-2',
    authorName: 'Anonymous',
    location: 'Zurich, Switzerland',
    timeAgo: '5h ago',
    text: "I booked a solo cabin in the Alps and told my colleagues I was on a high-stakes business tour. I spent 4 days staring at the clouds and eating cheese in total silence.",
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    likes: 512,
    comments: 7,
  },
  {
    id: 'post-3',
    authorName: 'Anonymous',
    location: 'Tokyo, Japan',
    timeAgo: '8h ago',
    text: "Every Friday, I leave an extra prepaid bento box with the local convenience store clerk for whoever comes in looking like they haven't eaten all day.",
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    likes: 1204,
    comments: 19,
  },
  {
    id: 'post-4',
    authorName: 'Anonymous',
    location: 'Mumbai, India',
    timeAgo: '11h ago',
    text: "I still drive past your lane every Friday evening pretending it's on my regular route home from work.",
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    likes: 928,
    comments: 12,
  },
];

export default function HomePage() {
  const [posts, setPosts] = useState<Confession[]>([]);

  useEffect(() => {
    const saved = getSavedLikes();
    const merged = INITIAL_POSTS.map((post) => ({
      ...post,
      likes: post.likes + (saved[post.id] || 0),
    }));
    setPosts(merged);
  }, []);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + 1 };
        }
        return post;
      })
    );

    try {
      const saved = getSavedLikes();
      saved[postId] = (saved[postId] || 0) + 1;
      localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, JSON.stringify(saved));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f3e6d8] pb-24">
      {/* Title & Share Button */}
      <div className="pt-6 pb-6 px-4 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#e15b50] tracking-tight">
          Real stories. Zero identities.
        </h1>

        <div className="mt-4">
          <button className="inline-flex items-center justify-center bg-gradient-to-r from-[#e85342] to-[#ec5b53] hover:opacity-95 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full shadow-md active:scale-95 transition-all">
            + Share Your Confession
          </button>
        </div>
      </div>

      {/* Confession Cards Feed */}
      <main className="max-w-md mx-auto px-4 space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-[28px] overflow-hidden bg-[#faefe6] shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-[#ebd8c8]"
          >
            {/* Top Image Banner */}
            <div className="w-full h-56 sm:h-64 overflow-hidden bg-stone-200">
              <img
                src={post.imageUrl}
                alt="Confession story"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Post Content */}
            <div className="p-5">
              {/* Meta Info */}
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

              {/* Story Text */}
              <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-normal">
                {post.text}
              </p>

              {/* Action Bar */}
              <div className="mt-5 flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eee0d2] text-stone-700 text-xs font-medium hover:bg-[#e6d6c6] active:scale-90 transition-all"
                  >
                    <Heart className="w-3.5 h-3.5 fill-stone-400 text-stone-400" />
                    <span>{post.likes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eee0d2] text-stone-700 text-xs font-medium">
                    <MessageCircle className="w-3.5 h-3.5 text-stone-500" />
                    <span>{post.comments}</span>
                  </div>

                  <button className="p-1.5 rounded-full bg-[#eee0d2] text-stone-700 text-xs hover:bg-[#e6d6c6] active:scale-90 transition-all">
                    <Share2 className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                </div>

                <span className="text-xs font-medium text-[#e15b50] hover:underline cursor-pointer">
                  Tap to view
                </span>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
