import { ReactionEmoji, VisitorInteractionRecord } from '../types';

const STORAGE_KEY = 'openconfess_interactions_v1';
export const MAX_COMMENTS_PER_POST = 3;

type InteractionStore = Record<string, VisitorInteractionRecord>;

function readStore(): InteractionStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InteractionStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: InteractionStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage unavailable (private browsing quota, etc.) — fail silently,
    // interaction limits just won't persist across reloads for this visitor.
  }
}

function getRecord(postId: string): VisitorInteractionRecord {
  const store = readStore();
  return store[postId] ?? { reaction: null, commentCount: 0 };
}

export function getVisitorReaction(postId: string): ReactionEmoji | null {
  return getRecord(postId).reaction;
}

export function setVisitorReaction(postId: string, reaction: ReactionEmoji | null): void {
  const store = readStore();
  const existing = getRecord(postId);
  store[postId] = { ...existing, reaction };
  writeStore(store);
}

export function getVisitorCommentCount(postId: string): number {
  return getRecord(postId).commentCount;
}

export function canVisitorComment(postId: string): boolean {
  return getVisitorCommentCount(postId) < MAX_COMMENTS_PER_POST;
}

export function incrementVisitorCommentCount(postId: string): void {
  const store = readStore();
  const existing = getRecord(postId);
  store[postId] = { ...existing, commentCount: existing.commentCount + 1 };
  writeStore(store);
}
