export type ReactionEmoji = '❤️' | '🔥' | '😮' | '😢' | '👏';

export interface Comment {
  id: string;
  authorName: string;
  text: string;
  createdAt: number; // epoch ms
  parentId: string | null;
}

export interface ReactionMap {
  '❤️': number;
  '🔥': number;
  '😮': number;
  '😢': number;
  '👏': number;
}

export interface Confession {
  id: string;
  authorName: string; // "Anonymous" or custom
  text: string;
  imageUrl: string | null;
  country: string;
  city: string;
  region: string; // "City, Country" combined, used for filtering/display
  createdAt: number; // epoch ms, from serverTimestamp() or seed data
  viewsCount: number;
  likesCount: number;
  reactions: ReactionMap;
  comments: Comment[];
}

export interface VisitorInteractionRecord {
  reaction: ReactionEmoji | null;
  commentCount: number;
}
