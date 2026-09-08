import {
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  updateDoc,
  setDoc,
  increment,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { postsDb, interactionsDb, isFirebaseConfigured } from './firebase';
import { seedConfessions } from './seedData';
import { Confession, Comment, ReactionEmoji, ReactionMap } from '../types';
import { toEpochMs } from './timeUtils';

const PAGE_SIZE = 8;
const LOCAL_POSTS_KEY = 'openconfess_local_posts_v1';
const LOCAL_INTERACTIONS_KEY = 'openconfess_local_post_stats_v1';

// ---------------------------------------------------------------------------
// Local (no-Firebase) persistence layer.
// Used automatically whenever Firebase env vars are absent/incomplete, so the
// whole app — including new confessions a visitor creates — works fully
// offline/demo without any backend setup.
// ---------------------------------------------------------------------------

interface LocalPostStats {
  likesCount: number;
  reactions: ReactionMap;
  comments: Comment[];
}

function readLocalPosts(): Confession[] {
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_KEY);
    return raw ? (JSON.parse(raw) as Confession[]) : [];
  } catch {
    return [];
  }
}

function writeLocalPosts(posts: Confession[]): void {
  try {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch {
    // Ignore quota errors — the confession still shows for this session.
  }
}

function readLocalStats(): Record<string, LocalPostStats> {
  try {
    const raw = localStorage.getItem(LOCAL_INTERACTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalStats(stats: Record<string, LocalPostStats>): void {
  try {
    localStorage.setItem(LOCAL_INTERACTIONS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore quota errors.
  }
}

function emptyReactions(): ReactionMap {
  return { '❤️': 0, '🔥': 0, '😮': 0, '😢': 0, '👏': 0 };
}

/**
 * Merges seed data + any locally-created posts + any locally-recorded
 * interaction deltas (likes/comments added this session) into one feed,
 * freshest first. This is the fallback path used whenever Firebase isn't
 * configured.
 */
function getMergedLocalFeed(): Confession[] {
  const localPosts = readLocalPosts();
  const stats = readLocalStats();

  const all = [...localPosts, ...seedConfessions].map((post) => {
    const override = stats[post.id];
    if (!override) return post;
    return {
      ...post,
      likesCount: override.likesCount,
      reactions: override.reactions,
      comments: [...post.comments, ...override.comments],
    };
  });

  return all.sort((a, b) => b.createdAt - a.createdAt);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface FeedPage {
  posts: Confession[];
  cursor: QueryDocumentSnapshot | number | null; // Firestore cursor OR local page index
  hasMore: boolean;
}

export async function fetchInitialFeed(regionFilter?: string): Promise<FeedPage> {
  if (isFirebaseConfigured && postsDb) {
    return fetchFirestorePage(null, regionFilter);
  }
  return fetchLocalPage(0, regionFilter);
}

export async function fetchNextPage(
  cursor: QueryDocumentSnapshot | number | null,
  regionFilter?: string
): Promise<FeedPage> {
  if (isFirebaseConfigured && postsDb) {
    return fetchFirestorePage(cursor as QueryDocumentSnapshot | null, regionFilter);
  }
  return fetchLocalPage((cursor as number) ?? 0, regionFilter);
}

async function fetchFirestorePage(
  cursor: QueryDocumentSnapshot | null,
  regionFilter?: string
): Promise<FeedPage> {
  const colRef = collection(postsDb!, 'confessions');
  const constraints = [orderBy('createdAt', 'desc'), limit(PAGE_SIZE)];
  const q = cursor
    ? query(colRef, ...constraints, startAfter(cursor))
    : query(colRef, ...constraints);

  const snap = await getDocs(q);
  const posts: Confession[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (regionFilter && data.region !== regionFilter) continue;
    const interactionSnap = await getDoc(doc(interactionsDb!, 'post_interactions', docSnap.id));
    const interaction = interactionSnap.exists() ? interactionSnap.data() : null;

    posts.push({
      id: docSnap.id,
      authorName: data.authorName,
      text: data.text,
      imageUrl: data.imageUrl ?? null,
      country: data.country,
      city: data.city,
      region: data.region,
      createdAt: toEpochMs(data.createdAt),
      viewsCount: data.viewsCount ?? 0,
      likesCount: interaction?.likesCount ?? 0,
      reactions: interaction?.reactions ?? emptyReactions(),
      comments: [], // loaded on-demand in PostDetailModal for cost efficiency
    });
  }

  const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
  return { posts, cursor: lastDoc, hasMore: snap.docs.length === PAGE_SIZE };
}

function fetchLocalPage(pageIndex: number, regionFilter?: string): FeedPage {
  const all = getMergedLocalFeed().filter(
    (p) => !regionFilter || p.region === regionFilter
  );
  const start = pageIndex * PAGE_SIZE;
  const slice = all.slice(start, start + PAGE_SIZE);
  return {
    posts: slice,
    cursor: pageIndex + 1,
    hasMore: start + PAGE_SIZE < all.length,
  };
}

export function getAllRegionsWithCounts(): { region: string; count: number }[] {
  const all = isFirebaseConfigured ? seedConfessions : getMergedLocalFeed();
  const counts = new Map<string, number>();
  all.forEach((p) => counts.set(p.region, (counts.get(p.region) ?? 0) + 1));
  return Array.from(counts.entries())
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTotalPostCount(): number {
  return isFirebaseConfigured ? seedConfessions.length : getMergedLocalFeed().length;
}

export interface CreateConfessionInput {
  authorName: string;
  text: string;
  imageUrl: string | null;
  country: string;
  city: string;
}

export async function createConfession(input: CreateConfessionInput): Promise<Confession> {
  const region = `${input.city}, ${input.country}`;

  if (isFirebaseConfigured && postsDb && interactionsDb) {
    const docRef = await addDoc(collection(postsDb, 'confessions'), {
      authorName: input.authorName || 'Anonymous',
      text: input.text,
      imageUrl: input.imageUrl,
      country: input.country,
      city: input.city,
      region,
      createdAt: serverTimestamp(),
      viewsCount: 0,
    });

    await setDoc(doc(interactionsDb, 'post_interactions', docRef.id), {
      likesCount: 0,
      reactions: emptyReactions(),
    });

    return {
      id: docRef.id,
      authorName: input.authorName || 'Anonymous',
      text: input.text,
      imageUrl: input.imageUrl,
      country: input.country,
      city: input.city,
      region,
      createdAt: Date.now(),
      viewsCount: 0,
      likesCount: 0,
      reactions: emptyReactions(),
      comments: [],
    };
  }

  // Local fallback
  const newPost: Confession = {
    id: `local-${Date.now()}`,
    authorName: input.authorName || 'Anonymous',
    text: input.text,
    imageUrl: input.imageUrl,
    country: input.country,
    city: input.city,
    region,
    createdAt: Date.now(),
    viewsCount: 0,
    likesCount: 0,
    reactions: emptyReactions(),
    comments: [],
  };
  const posts = readLocalPosts();
  posts.unshift(newPost);
  writeLocalPosts(posts);
  return newPost;
}

export async function setReaction(
  postId: string,
  previous: ReactionEmoji | null,
  next: ReactionEmoji | null
): Promise<ReactionMap> {
  if (isFirebaseConfigured && interactionsDb) {
    const ref = doc(interactionsDb, 'post_interactions', postId);
    const updates: Record<string, unknown> = {};
    if (previous) updates[`reactions.${previous}`] = increment(-1);
    if (next) updates[`reactions.${next}`] = increment(1);
    updates.likesCount = increment((next ? 1 : 0) - (previous ? 1 : 0));
    await updateDoc(ref, updates);
    const snap = await getDoc(ref);
    return (snap.data()?.reactions as ReactionMap) ?? emptyReactions();
  }

  // Local fallback
  const stats = readLocalStats();
  const base = stats[postId] ?? {
    likesCount: findPostAnywhere(postId)?.likesCount ?? 0,
    reactions: findPostAnywhere(postId)?.reactions ?? emptyReactions(),
    comments: [],
  };
  const reactions = { ...base.reactions };
  if (previous) reactions[previous] = Math.max(0, reactions[previous] - 1);
  if (next) reactions[next] = reactions[next] + 1;
  const likesCount = base.likesCount + (next ? 1 : 0) - (previous ? 1 : 0);
  stats[postId] = { ...base, reactions, likesCount };
  writeLocalStats(stats);
  return reactions;
}

export async function addComment(
  postId: string,
  authorName: string,
  text: string
): Promise<Comment> {
  const comment: Comment = {
    id: `comment-${Date.now()}-${Math.round(Math.random() * 100000)}`,
    authorName: authorName || 'Anonymous',
    text,
    createdAt: Date.now(),
    parentId: null,
  };

  if (isFirebaseConfigured && interactionsDb) {
    await addDoc(
      collection(interactionsDb, 'post_interactions', postId, 'comments'),
      {
        authorName: comment.authorName,
        text: comment.text,
        createdAt: serverTimestamp(),
        parentId: null,
      }
    );
    return comment;
  }

  // Local fallback
  const stats = readLocalStats();
  const base = stats[postId] ?? {
    likesCount: findPostAnywhere(postId)?.likesCount ?? 0,
    reactions: findPostAnywhere(postId)?.reactions ?? emptyReactions(),
    comments: [],
  };
  base.comments = [...base.comments, comment];
  stats[postId] = base;
  writeLocalStats(stats);
  return comment;
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  if (isFirebaseConfigured && interactionsDb) {
    const snap = await getDocs(
      query(
        collection(interactionsDb, 'post_interactions', postId, 'comments'),
        orderBy('createdAt', 'asc')
      )
    );
    return snap.docs.map((d) => ({
      id: d.id,
      authorName: d.data().authorName,
      text: d.data().text,
      createdAt: toEpochMs(d.data().createdAt),
      parentId: d.data().parentId ?? null,
    }));
  }

  const post = findPostAnywhere(postId);
  const stats = readLocalStats()[postId];
  return [...(post?.comments ?? []), ...(stats?.comments ?? [])].sort(
    (a, b) => a.createdAt - b.createdAt
  );
}

function findPostAnywhere(postId: string): Confession | undefined {
  return getMergedLocalFeed().find((p) => p.id === postId);
}
