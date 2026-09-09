import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Confession } from '../types';
import { fetchInitialFeed, fetchNextPage, FeedPage } from '../lib/confessionService';
import ConfessionCard from '../components/ConfessionCard';
import PostDetailModal from '../components/PostDetailModal';
import CreateConfessionModal from '../components/CreateConfessionModal';

interface HomePageProps {
  regionFilter: string | null;
}

export default function HomePage({ regionFilter }: HomePageProps) {
  const [posts, setPosts] = useState<Confession[]>([]);
  const [cursor, setCursor] = useState<FeedPage['cursor']>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activePost, setActivePost] = useState<Confession | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const page = await fetchInitialFeed(regionFilter ?? undefined);
      setPosts(page.posts);
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } finally {
      setLoading(false);
    }
  }, [regionFilter]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const page = await fetchNextPage(cursor, regionFilter ?? undefined);
      setPosts((prev) => [...prev, ...page.posts]);
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }

  function handleCreated(confession: Confession) {
    setPosts((prev) => [confession, ...prev]);
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

      {/* Feed: Mobile aur Desktop dono me Full-Width Single Column */}
      <section className="w-full max-w-2xl mx-auto px-3 sm:px-4 pt-1 pb-16 space-y-4">
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
              <ConfessionCard key={post.id} confession={post} onOpen={() => setActivePost(post)} />
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

      {activePost && (
        <PostDetailModal confession={activePost} onClose={() => setActivePost(null)} />
      )}

      {createOpen && (
        <CreateConfessionModal onClose={() => setCreateOpen(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}
