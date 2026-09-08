# Open Confess

Anonymous confession-sharing platform. No login, no signup, no footer — just
stories. Built with React + TypeScript + Vite + Tailwind CSS.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). The app works
immediately with **zero configuration** — it serves 50 pre-seeded realistic
confessions from around the world and persists your likes/comments/new posts
in `localStorage` for the session.

## Connecting real backends (optional)

Copy `.env.example` to `.env` and fill in the values you want to enable:

- **Cloudinary** — for real, persisted image uploads (compressed client-side
  to under 50 KB before upload). Without it, uploaded images preview locally
  but aren't persisted.
- **Firebase (`postsDb`)** — stores the `confessions` collection (text,
  image URL, location, timestamps).
- **Firebase (`interactionsDb`)** — stores `post_interactions` (likes/
  reactions) and each post's `comments` sub-collection. Can be the same
  Firebase project as `postsDb`, or a separate project/billing boundary.

If either Firebase config is incomplete, the app automatically and silently
falls back to the local seed dataset + localStorage — nothing breaks.

### Suggested Firestore structure

```
confessions/{postId}
  authorName, text, imageUrl, country, city, region, createdAt, viewsCount

post_interactions/{postId}          (in the interactions project)
  likesCount, reactions: { ❤️, 🔥, 😮, 😢, 👏 }
  comments/{commentId}
    authorName, text, createdAt, parentId
```

### Suggested Firestore security rules (starting point)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /confessions/{postId} {
      allow read: if true;
      allow create: if request.resource.data.text is string
                    && request.resource.data.text.size() < 12000;
      allow update, delete: if false;
    }
    match /post_interactions/{postId} {
      allow read: if true;
      allow write: if true; // tighten with App Check / rate limiting in production
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.resource.data.text.size() < 2000;
        allow update, delete: if false;
      }
    }
  }
}
```

## Feature checklist

- No login/signup/password anywhere in the UI or code.
- Region search box with live post counts, 3-dot menu (About, Contact,
  Privacy, Terms, Disclaimer) — no footer.
- 2,000-word confession limit with live word/character counter.
- Optional author name (defaults to "Anonymous").
- Single image upload, client-side canvas-compressed to strictly under 50 KB
  JPG, uploaded to Cloudinary (unsigned) or previewed locally as a fallback.
- Native Web Share API on mobile; desktop popover with WhatsApp, X, Facebook,
  and copy-link (with toast-style confirmation).
- One reaction per visitor per post (stored in `localStorage`), toggling
  replaces the previous reaction.
- Max 3 comments per visitor per post, enforced client-side via
  `localStorage`, with the input disabled once reached.
- `serverTimestamp()` on Firestore writes; clean relative timestamps
  ("Just now", "5m ago", etc.) with no timezone drift.
- Feed loads 8 posts at a time via Firestore cursor pagination
  (`startAfter`) or an equivalent local page cursor.
- Feed cards clamp confession text to 3 lines; full text, image, and
  comments only appear in the detail modal.
- 50 pre-seeded, realistic, geographically diverse confessions with
  comments and weighted emoji reactions, used automatically whenever
  Firebase isn't configured.

## Production notes

- Add rate limiting / Firebase App Check before opening interaction writes
  to the public internet at scale.
- Consider a moderation queue (e.g. a scheduled Cloud Function scanning new
  posts) since there's no authentication to gate submissions.
- The image compressor works entirely client-side via `<canvas>`; very
  detailed source photos may take a few compression passes but will always
  land under 50 KB or throw a clear error asking for a smaller photo.
