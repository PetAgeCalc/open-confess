import { createConfession, setReaction, addComment } from './confessionService';
import { Confession } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const POSTED_HASHES_KEY = 'open_confess_posted_hashes_v4';
const SIMULATOR_SCHEDULE_KEY = 'open_confess_sim_schedule_v4';
const ENGAGEMENT_TRACKER_KEY = 'open_confess_post_milestones_v1';

// 8 Diverse Pillars: Facebook & X organic styles
const CATEGORY_POOLS = [
  {
    category: 'Love & Relationships',
    topics: [
      'falling secretly for a long-time co-worker',
      'the painful realization of falling out of love after 5 years',
      'an unexpected modern dating app encounter that felt surreal',
      'long-distance relationship struggles and airport goodbyes',
      'getting closure from an ex without saying a single word'
    ]
  },
  {
    category: 'Business & Startup',
    topics: [
      'the hidden mental pressure of a zero-revenue bootstrapped startup',
      'watching a college friend raise millions while my venture failed',
      'office politics and walking away from a high-paying toxic corporate role',
      'a quiet freelance win that finally paid off all family debt',
      'a harsh reality check about entrepreneurship vs hustle culture'
    ]
  },
  {
    category: 'Gaming & Tech',
    topics: [
      'meeting late-night squad teammates on Discord who saved my sanity',
      'the nostalgic grief of seeing a favourite online game server shut down',
      'an unhealthily deep obsession with open-world RPG mechanics',
      'building an indie tech tool in secret after regular 9-to-5 shifts',
      'the raw thrill of clutching a 1v4 tournament round with random players'
    ]
  },
  {
    category: 'Politics & Society',
    topics: [
      'feeling alienated by family WhatsApp groups debating heated elections',
      'the quiet guilt of remaining silent during an unfair neighborhood protest',
      'how modern media polarizing algorithms destroy real community friendships',
      'a grassroots activist story that changed my view on public policy',
      'the helplessness of watching historic city landmarks get bulldozed'
    ]
  },
  {
    category: 'Funny & Awkward',
    topics: [
      'an embarrassing hot mic moment during a global company Zoom call',
      'waving aggressively back at a stranger who was waving at someone else',
      'trying to act street-smart in front of a date and falling flat on face',
      'accidentally sending a roast meme directly to the person it was about',
      'a hilariously chaotic cooking disaster trying an ambitious viral recipe'
    ]
  },
  {
    category: 'Motivational & Growth',
    topics: [
      'quietly hitting 1 year completely clean and sober alone in a studio flat',
      'failing the most critical entrance exam and realizing life goes on',
      'the empowering feeling of walking into a gym terrified and returning every day',
      'learning to forgive myself for wasted years in my early twenties',
      'buying parents their dream gift from my very first independent earnings'
    ]
  },
  {
    category: 'News & Current Affairs',
    topics: [
      'living through sudden citywide power blackouts and watching neighbors unite',
      'unpredictable flash floods turning ordinary streets into chaotic rescue zones',
      'the subtle terror and awe of seeing AI write entire production codebases',
      'watching local street vendors adapt to digital payments and cashless economies',
      'the eerie quietness of metro stations during late-night commuter curfews'
    ]
  },
  {
    category: 'Raw Confessions',
    topics: [
      'hiding a massive personal setback so aged parents do not panic',
      'the sheer loneliness of living abroad despite having a comfortable flat',
      'envying my sibling effortlessly while fighting chronic self-doubt',
      'a random cab driver giving life advice that prevented a breakdown',
      'pretending to be busy on phone calls just to avoid awkward party conversations'
    ]
  }
];

const GLOBAL_LOCATIONS = [
  { city: 'Mumbai', country: 'India' },
  { city: 'Kolkata', country: 'India' },
  { city: 'Bengaluru', country: 'India' },
  { city: 'Delhi', country: 'India' },
  { city: 'Hyderabad', country: 'India' },
  { city: 'Pune', country: 'India' },
  { city: 'London', country: 'UK' },
  { city: 'New York', country: 'USA' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Singapore', country: 'Singapore' },
  { city: 'Dubai', country: 'UAE' },
  { city: 'San Francisco', country: 'USA' }
];

function getStoredHashes(): string[] {
  try {
    const raw = localStorage.getItem(POSTED_HASHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHash(hash: string) {
  try {
    const hashes = getStoredHashes();
    hashes.push(hash);
    if (hashes.length > 5000) hashes.shift();
    localStorage.setItem(POSTED_HASHES_KEY, JSON.stringify(hashes));
  } catch {}
}

function isDuplicate(text: string): boolean {
  const cleanSnippet = text.trim().slice(0, 45).toLowerCase();
  const hashes = getStoredHashes();
  return hashes.includes(cleanSnippet);
}

// Generate 90-100 word post + contextual matching comments via Gemini
async function generateDiverseStory(category: string, topic: string): Promise<{
  body: string;
  imagePrompt: string;
  author: string;
  category: string;
  contextualComments: { author: string; text: string }[];
} | null> {
  if (!GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY is missing.');
    return null;
  }

  const prompt = `Write a realistic, human first-person post for an anonymous feed (Facebook/X style).
Category: ${category}
Topic: ${topic}

Requirements:
1. Post text: EXACTLY 90 to 100 words. Natural, raw, authentic conversational tone.
2. No greetings, no concluding moral slogans, no hashtags.
3. Matching Comments: Provide 4 realistic comments strictly matching the language, tone, and specific topic of the post.
4. Output STRICTLY a valid JSON:
{
  "author": "Realistic username (e.g., SilentReader, NeonShadow, QuietDrifter)",
  "confession": "The 90-100 word story.",
  "imageVisualPrompt": "4-5 descriptive visual keywords matching the context (e.g., lonely metro station lights night bokeh, cinematic 8k)",
  "comments": [
    {"author": "CuriousWanderer", "text": "Comment matching topic..."},
    {"author": "Anonymous", "text": "Another contextual response..."},
    {"author": "Realist_99", "text": "Thoughtful reaction..."},
    {"author": "MidnightMind", "text": "Relatable take..."}
  ]
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.95,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    const data = await res.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return null;

    const parsed = JSON.parse(rawJson);
    return {
      body: parsed.confession,
      imagePrompt: parsed.imageVisualPrompt,
      author: parsed.author || 'Anonymous',
      category: category,
      contextualComments: Array.isArray(parsed.comments) ? parsed.comments : []
    };
  } catch (err) {
    console.error('Gemini post generation error:', err);
    return null;
  }
}

// Generates ~50KB compressed JPG image via dimensions & quality capping
function createCompressedMatchingImageUrl(visualPrompt: string): string {
  const seed = `${Date.now()}_${Math.floor(Math.random() * 10000000)}`;
  const cleanPrompt = encodeURIComponent(
    `${visualPrompt}, editorial candid photography, documentary aesthetic, natural lighting, sharp focus`
  );
  // width=600&height=380 ensures lightweight JPG transfer (~45-55KB)
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=600&height=380&seed=${seed}&nologo=true`;
}

// Incremental realistic engagement curve: 10m, 20m, 30m, 50m
async function applyOrganicGradualEngagement(posts: Confession[]) {
  try {
    const rawTracker = localStorage.getItem(ENGAGEMENT_TRACKER_KEY);
    const tracker: Record<string, number> = rawTracker ? JSON.parse(rawTracker) : {};
    const now = Date.now();

    for (const post of posts.slice(0, 15)) {
      const createdAt = Number((post as any).createdAt || (post as any).timestamp || 0);
      if (!createdAt) continue;

      const elapsedMinutes = Math.floor((now - createdAt) / (60 * 1000));
      const currentStage = tracker[post.id] || 0;

      // Stage 1: ~10 minutes (Initial likes trickle in)
      if (elapsedMinutes >= 10 && currentStage < 1) {
        tracker[post.id] = 1;
        setReaction(post.id, null, '❤️').catch(() => {});
      }

      // Stage 2: ~20 minutes (Another heart + community interaction)
      if (elapsedMinutes >= 20 && currentStage < 2) {
        tracker[post.id] = 2;
        setReaction(post.id, null, '❤️').catch(() => {});
      }

      // Stage 3: ~30 minutes (Follow-up reaction)
      if (elapsedMinutes >= 30 && currentStage < 3) {
        tracker[post.id] = 3;
        setReaction(post.id, null, '❤️').catch(() => {});
      }

      // Stage 4: ~50 minutes (Matured engagement)
      if (elapsedMinutes >= 50 && currentStage < 4) {
        tracker[post.id] = 4;
        setReaction(post.id, null, '❤️').catch(() => {});
      }
    }

    localStorage.setItem(ENGAGEMENT_TRACKER_KEY, JSON.stringify(tracker));
  } catch (err) {
    console.warn('Organic engagement tracker bypassed:', err);
  }
}

// Generate new post & store contextual comments for gradual delivery
export async function generateAndPublishConfession(): Promise<Confession | null> {
  const selectedGroup = CATEGORY_POOLS[Math.floor(Math.random() * CATEGORY_POOLS.length)];
  const randomTopic = selectedGroup.topics[Math.floor(Math.random() * selectedGroup.topics.length)];
  const randomLoc = GLOBAL_LOCATIONS[Math.floor(Math.random() * GLOBAL_LOCATIONS.length)];

  const generated = await generateDiverseStory(selectedGroup.category, randomTopic);
  if (!generated || isDuplicate(generated.body)) {
    return null;
  }

  const imageUrl = createCompressedMatchingImageUrl(generated.imagePrompt);

  const newPost = await createConfession({
    authorName: generated.author,
    text: generated.body,
    imageUrl: imageUrl,
    city: randomLoc.city,
    country: randomLoc.country,
    category: generated.category,
  });

  // Attach first instant matching comment to ignite discussions
  if (newPost && generated.contextualComments.length > 0) {
    const firstComment = generated.contextualComments[0];
    addComment(newPost.id, firstComment.author, firstComment.text).catch(() => {});
  }

  saveHash(generated.body.trim().slice(0, 45).toLowerCase());
  return newPost;
}

// Periodic simulator trigger (~100 posts / 24 hours + gradual activity progression)
export async function syncSimulatedActivity(existingPosts: Confession[]): Promise<Confession[]> {
  try {
    const now = Date.now();
    const lastRun = Number(localStorage.getItem(SIMULATOR_SCHEDULE_KEY) || 0);

    // Gradual interaction progression for existing posts
    applyOrganicGradualEngagement(existingPosts).catch(() => {});

    // Every 14.4 minutes publish 1 fresh confession (100 posts/day)
    if (now - lastRun > 14 * 60 * 1000) {
      localStorage.setItem(SIMULATOR_SCHEDULE_KEY, String(now));
      generateAndPublishConfession().catch((err) => {
        console.warn('Background auto-post generation error:', err);
      });
    }
  } catch (e) {
    console.warn('Simulation routine failed:', e);
  }

  return existingPosts;
}

export function scheduleEngagementForNewPost(
  _post: Confession,
  _onUpdate: (data: { likesCountIncrement?: number; newComment?: any }) => void
) {
  // Retained for interface contract
}
