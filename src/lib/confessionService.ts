export async function setReaction(
  postId: string,
  previous: ReactionEmoji | null,
  next: ReactionEmoji | null
): Promise<ReactionMap> {
  if (isFirebaseConfigured && interactionsDb) {
    const ref = doc(interactionsDb, 'post_interactions', postId);

    try {
      const snap = await getDoc(ref);
      const data = snap.data();
      const reactions: ReactionMap = {
        ...emptyReactions(),
        ...(data?.reactions || {}),
      };

      // 1. Emoji specific count update
      if (previous && reactions[previous] !== undefined) {
        reactions[previous] = Math.max(0, (reactions[previous] || 0) - 1);
      }
      if (next) {
        reactions[next] = (reactions[next] || 0) + 1;
      }

      // 2. 1-Visitor-1-Reaction: Total count math
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
      console.error('Firestore setReaction error:', err);
      return emptyReactions();
    }
  }

  // Local Storage Fallback
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
