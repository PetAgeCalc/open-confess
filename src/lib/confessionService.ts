import {
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  query,
  limit,
  startAfter,
  serverTimestamp,
  setDoc,
  where,
  orderBy,
  QueryDocumentSnapshot,
  deleteDoc,
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
  if (typeof val === 'number') {
    return val < 10000000000 ? val * 1000 : val;
  }
  if (val?.toMillis) return val.toMillis();
  if (val?.seconds) return val.seconds * 1000;
  if (typeof val === 'string') {
    const parsed = Date.parse(val);
    if (!isNaN(parsed)) return parsed;
  }
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
    try {
      return await fetchFirestorePage(null, regionFilter);
    } catch (e) {
      console.error("Firestore fetch failed, falling to local:", e);
      return fetchLocalPage(0, regionFilter);
    }
  }
  return fetchLocalPage(0, regionFilter);
}

export async function fetchNextPage(
  cursor: QueryDocumentSnapshot | number | null,
  regionFilter?: string
): Promise<FeedPage> {
  if (isFirebaseConfigured && postsDb) {
    try {
      return await fetchFirestorePage(cursor as QueryDocumentSnapshot | null, regionFilter);
    } catch (e) {
      return fetchLocalPage((cursor as number) ?? 0, regionFilter);
    }
  }
  return fetchLocalPage((cursor as number) ?? 0, regionFilter);
}

async function fetchFirestorePage(
  cursor: QueryDocumentSnapshot | null,
  regionFilter?: string
): Promise<FeedPage> {
  const colRef = collection(postsDb!, 'confessions');
  
  // FIX: Added orderBy('createdAt', 'desc') so newest posts always come first!
  let q;
  try {
    q = cursor
      ? query(colRef, orderBy('createdAt', 'desc'), startAfter(cursor), limit(PAGE_SIZE * 2))
      : query(colRef, orderBy('createdAt', 'desc'), limit(PAGE_SIZE * 2));
  } catch (err) {
    // Fallback if index is creating
    q = cursor
      ? query(colRef, startAfter(cursor), limit(PAGE_SIZE * 2))
      : query(colRef, limit(PAGE_SIZE * 2));
  }

  const snap = await getDocs(q);
  const targetDb = interactionsDb || postsDb;

  const postsPromises = snap.docs.map(async (docSnap) => {
    const data = docSnap.data();
    if (regionFilter && data.region && data.region !== regionFilter) return null;

    let reactionData: any = null;
    if (targetDb) {
      try {
        const reactionSnap = await getDoc(doc(targetDb, 'reactions', docSnap.id));
        if (reactionSnap.exists()) {
          reactionData = reactionSnap.data();
        }
      } catch (e) {}
    }

    const rawTime = data.createdAt || data.createdA || data.timestamp || Date.now();

    return {
      id: docSnap.id,
      authorName: data.authorName || data.author || 'Anonymous',
      text: data.body || data.text || data.content || '',
      imageUrl: data.imageUrl || data.image || null,
      country: data.country || '',
      city: data.city || '',
      region: data.region || data.category || '',
      createdAt: safeEpochMs(rawTime),
      viewsCount: data.viewsCount ?? 0,
      likesCount: Number(reactionData?.likesCount ?? data.likesCount ?? data.likes ?? 0),
      reactions: reactionData?.reactions ?? emptyReactions(),
      comments: [],
    } as Confession;
  });

  const resolvedPosts = await Promise.all(postsPromises);
  const validPosts = resolvedPosts.filter((post): post is Confession => post !== null);

  // Strictly sort latest epoch timestamp on top
  validPosts.sort((a, b) => safeEpochMs(b.createdAt) - safeEpochMs(a.createdAt));
  const posts = validPosts.slice(0, PAGE_SIZE);

  const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
  return { posts, cursor: lastDoc, hasMore: snap.docs.length >= PAGE_SIZE };
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
  const nowIso = new Date().toISOString();

  if (isFirebaseConfigured && postsDb) {
    const docRef = await addDoc(collection(postsDb, 'confessions'), {
      authorName: input.authorName || 'Anonymous',
      author: input.authorName || 'Anonymous',
      body: input.text,
      text: input.text,
      content: input.text,
      imageUrl: input.imageUrl,
      image: input.imageUrl,
      category: input.category || 'General',
      country: input.country,
      city: input.city,
      region,
      createdAt: nowIso, // Stores exact ISO string so it is immediately searchable
      createdA: nowIso,
      timestamp: Date.now(),
      likesCount: 0,
      likes: 0,
      commentsCount: 0,
      comments: 0,
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
          where('postId', '==', postId)
        )
      );
      const comments = snap.docs.map((d) => ({
        id: d.id,
        authorName: d.data().author || d.data().authorName || 'Anonymous',
        text: d.data().body || d.data().text || '',
        createdAt: safeEpochMs(d.data().createdAt),
        parentId: null,
      }));
      return comments.sort((a, b) => safeEpochMs(a.createdAt) - safeEpochMs(b.createdAt));
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

export async function deleteConfession(postId: string): Promise<boolean> {
  let deleted = false;

  // 1. Firebase Firestore se delete karein (posts & interactions dono se)
  if (isFirebaseConfigured) {
    try {
      if (postsDb) {
        await deleteDoc(doc(postsDb, 'confessions', postId));
      }
      const targetDb = interactionsDb || postsDb;
      if (targetDb) {
        await deleteDoc(doc(targetDb, 'reactions', postId));
      }
      deleted = true;
    } catch (err) {
      console.error('Firebase delete failed:', err);
    }
  }

  // 2. Local fallback storage se bhi delete karein agar wahan save ho
  const localPosts = readLocalPosts();
  const updatedPosts = localPosts.filter((p) => p.id !== postId);
  if (updatedPosts.length !== localPosts.length) {
    writeLocalPosts(updatedPosts);
    deleted = true;
  }

  const localStats = readLocalStats();
  if (localStats[postId]) {
    delete localStats[postId];
    writeLocalStats(localStats);
  }

  return deleted;
}
