/**
 * Converts an epoch-ms timestamp into a clean relative time string.
 * Works off Date.now() at call time, so timers/re-renders keep it fresh —
 * there's no reliance on the client's timezone, only elapsed duration,
 * which avoids the timezone-drift bugs common with raw Date math.
 */
export function timeAgo(timestampMs: number): string {
  const now = Date.now();
  const diffSeconds = Math.max(0, Math.floor((now - timestampMs) / 1000));

  if (diffSeconds < 30) return 'Just now';
  if (diffSeconds < 60) return `${diffSeconds}s ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}w ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}

/**
 * Converts a Firestore Timestamp-like object (with a toMillis method) OR
 * a raw epoch number OR a Firestore serverTimestamp() placeholder (null while
 * pending) into a safe epoch-ms number for local sorting/display.
 */
export function toEpochMs(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object' && 'toMillis' in (value as any)) {
    return (value as any).toMillis();
  }
  // Pending serverTimestamp() resolves to null on the client until the
  // server round-trip completes; fall back to "now" so optimistic UI
  // still sorts correctly at the top of the feed.
  return Date.now();
}
