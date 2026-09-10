async function handleEmojiSelect(e: React.MouseEvent, emoji: ReactionEmoji) {
    e.preventDefault();
    e.stopPropagation();

    if (!postId) return;

    const previousReaction = userReaction;
    const isRemoving = userReaction === emoji;
    const nextReaction: ReactionEmoji | null = isRemoving ? null : emoji;

    // 1. Local screen update (1-user-1-reaction logic)
    setUserReaction(nextReaction);
    if (!previousReaction && nextReaction) {
      // Pehli baar react kiya (+1)
      setLikes((prev) => prev + 1);
    } else if (previousReaction && isRemoving) {
      // Same emoji click karke cancel kiya (-1)
      setLikes((prev) => Math.max(0, prev - 1));
    }
    // Swap hone par (e.g. ❤️ se 😂) total likes same rahenge, bas icon change hoga

    setPickerOpen(false);

    // 2. Browser me visitor ka single reaction save
    try {
      const stored = JSON.parse(localStorage.getItem('openconfess_user_reactions') || '{}');
      if (nextReaction) {
        stored[postId] = nextReaction;
      } else {
        delete stored[postId];
      }
      localStorage.setItem('openconfess_user_reactions', JSON.stringify(stored));
    } catch (err) {
      console.error('LocalStorage error:', err);
    }

    if (onReactionChange) {
      onReactionChange(postId, nextReaction);
    }

    // 3. Interactions Database me sync
    try {
      await setReaction(postId, previousReaction, nextReaction);
    } catch (err) {
      console.error('Service setReaction failed:', err);
    }
  }
