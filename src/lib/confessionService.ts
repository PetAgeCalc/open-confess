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
  setDoc,
  where,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { postsDb, interactionsDb, isFirebaseConfigured } from './firebase';
import { seedConfessions } from './seedData';
import { Confession, Comment, ReactionEmoji, ReactionMap } from '../types';
import { toEpochMs } from './timeUtils';

const PAGE_SIZE = 8;
const LOCAL_POSTS_KEY = 'openconfess_local_posts_v2';
const LOCAL_INTERACTIONS_KEY = 'openconfess_local_post_stats_v2';

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
  } catch {}
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
  } catch {}
}

function emptyReactions(): ReactionMap {
  return { '❤️': 0, '🤗': 0, '😢': 0, '👏': 0, '🔥': 0, '😂': 0, '😮': 0, '💔': 0, '🙏': 0, '💯': 0 };
}

function safeEpochMs(val: any): number {
  if (!val) return Date.now();
  if (typeof val === 'number') return val;
  if (val?.toMillis) return val.toMillis();
  if (val?.seconds) return val.seconds * 1000;
  const parsed = toEpochMs(val);
  return isNaN(parsed) ? Date.now() : parsed;
}

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
      comments: [...(post.comments || []), ...(override.comments || [])],
    };
  });

  return all.sort((a, b) => safeEpochMs(b.createdAt) - safeEpochMs(a.createdAt));
}

export interface FeedPage {
  posts: Confession[];
  cursor: QueryDocumentSnapshot | number | null;
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
  const constraints: any[] = [orderBy('createdAt', 'desc'), limit(PAGE_SIZE)];

  const q = cursor
    ? query(colRef, ...constraints, startAfter(cursor))
    : query(colRef, ...constraints);

  const snap = await getDocs(q);
  const posts: Confession[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (regionFilter && data.region && data.region !== regionFilter) continue;

    let reactionData: any = null;
    const targetDb = interactionsDb || postsDb;
    if (targetDb) {
      try {
        const reactionSnap = await getDoc(doc(targetDb, 'reactions', docSnap.id));
        if (reactionSnap.exists()) {
          reactionData = reactionSnap.data();
        }
      } catch (e) {}
    }

    posts.push({
      id: docSnap.id,
      authorName: data.authorName || data.author || 'Anonymous',
      text: data.body || data.text || data.content || '',
      imageUrl: data.imageUrl ?? null,
      country: data.country || '',
      city: data.city || '',
      region: data.region || data.category || '',
      createdAt: safeEpochMs(data.createdAt),
      viewsCount: data.viewsCount ?? 0,
      likesCount: Number(reactionData?.likesCount ?? data.likesCount ?? 0),
      reactions: reactionData?.reactions ?? emptyReactions(),
      comments: [],
    });
  }

  posts.sort((a, b) => safeEpochMs(b.createdAt) - safeEpochMs(a.createdAt));
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
  all.forEach((p) => {
    if (p.region) {
      counts.set(p.region, (counts.get(p.region) ?? 0) + 1);
    }
  });
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
  category?: string;
}

export async function createConfession(input: CreateConfessionInput): Promise<Confession> {
  const region = [input.city, input.country].filter(Boolean).join(', ');

  if (isFirebaseConfigured && postsDb) {
    const docRef = await addDoc(collection(postsDb, 'confessions'), {
      authorName: input.authorName || 'Anonymous',
      body: input.text,
      text: input.text,
      imageUrl: input.imageUrl,
      category: input.category || 'General',
      country: input.country,
      city: input.city,
      region,
      createdAt: serverTimestamp(),
      viewsCount: 0,
    });

    const targetDb = interactionsDb || postsDb;
    if (targetDb) {
      await setDoc(doc(targetDb, 'reactions', docRef.id), {
        likesCount: 0,
        reactions: emptyReactions(),
      }, { merge: true });
    }

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
  const targetDb = interactionsDb || postsDb;
  if (isFirebaseConfigured && targetDb) {
    const ref = doc(targetDb, 'reactions', postId);

    try {
      const snap = await getDoc(ref);
      const data = snap.data();
      const reactions: ReactionMap = {
        ...emptyReactions(),
        ...(data?.reactions || {}),
      };

      if (previous && reactions[previous] !== undefined) {
        reactions[previous] = Math.max(0, (reactions[previous] || 0) - 1);
      }
      if (next) {
        reactions[next] = (reactions[next] || 0) + 1;
      }

      const diff = (next ? 1 : 0) - (previous ? 1 : 0);
      const currentLikes = Number(data?.likesCount ?? 0);
      const newLikesCount = Math.max(0, currentLikes + diff);

      await setDoc(
        ref,
        {
          likesCount: newLikesCount,
          reactions: reactions,
        },
        { merge: true }
      );

      return reactions;
    } catch (err) {
      return emptyReactions();
    }
  }

  const stats = readLocalStats();
  const base = stats[postId] ?? {
    likesCount: findPostAnywhere(postId)?.likesCount ?? 0,
    reactions: findPostAnywhere(postId)?.reactions ?? emptyReactions(),
    comments: [],
  };
  const reactions = { ...emptyReactions(), ...base.reactions };
  if (previous) reactions[previous] = Math.max(0, (reactions[previous] || 0) - 1);
  if (next) reactions[next] = (reactions[next] || 0) + 1;
  const likesCount = Math.max(0, base.likesCount + (next ? 1 : 0) - (previous ? 1 : 0));
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

  const targetDb = interactionsDb || postsDb;
  if (isFirebaseConfigured && targetDb) {
    await addDoc(
      collection(targetDb, 'comments'),
      {
        postId: postId,
        author: comment.authorName,
        body: comment.text,
        text: comment.text,
        createdAt: serverTimestamp(),
      }
    );
    return comment;
  }

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
  const targetDb = interactionsDb || postsDb;
  if (isFirebaseConfigured && targetDb) {
    try {
      const snap = await getDocs(
        query(
          collection(targetDb, 'comments'),
          where('postId', '==', postId),
          orderBy('createdAt', 'asc')
        )
      );
      return snap.docs.map((d) => ({
        id: d.id,
        authorName: d.data().author || d.data().authorName || 'Anonymous',
        text: d.data().body || d.data().text || '',
        createdAt: safeEpochMs(d.data().createdAt),
        parentId: null,
      }));
    } catch (e) {
      return [];
    }
  }

  const post = findPostAnywhere(postId);
  const stats = readLocalStats()[postId];
  return [...(post?.comments ?? []), ...(stats?.comments ?? [])].sort(
    (a, b) => safeEpochMs(a.createdAt) - safeEpochMs(b.createdAt)
  );
}

function findPostAnywhere(postId: string): Confession | undefined {
  return getMergedLocalFeed().find((p) => p.id === postId);
}
