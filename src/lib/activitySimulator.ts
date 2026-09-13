import { createConfession, setReaction, addComment } from './confessionService';
import { Confession, ReactionEmoji } from '../types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const POSTED_HASHES_KEY = 'open_confess_posted_hashes_v6';
const SIMULATOR_SCHEDULE_KEY = 'open_confess_sim_schedule_v6';
const ENGAGEMENT_TRACKER_KEY = 'open_confess_post_milestones_v4';

const CURATED_IMAGE_IDS = [
  'photo-1518199266791-5375a83190b7',
  'photo-1516589178581-6cd7833ae3b2',
  'photo-1492562080023-ab3db95bfbce',
  'photo-1498050108023-c5249f4df085',
  'photo-1519389950473-47ba0277781c',
  'photo-1486312338219-ce68d2c6f44d',
  'photo-1509198397868-475647b2a1e5',
  'photo-1470246973918-29a93221c455',
  'photo-1506126613408-eca07ce68773',
  'photo-1542751371-adc38448a05e',
  'photo-1538481199705-c710c4e965fc',
  'photo-1517841905240-472988babdf9',
  'photo-1499209974431-9dddcece7f88',
  'photo-1517048676732-d65bc937f952',
  'photo-1436491865332-7a61a109cc05'
];

const DIVERSE_PILLARS = [
  {
    category: 'Love & Relationships',
    intros: [
      'We spent nearly eleven months talking every night until sunrise, sharing our fears and unspoken feelings without any relationship label.',
      'Yesterday was her engagement party, and I watched the celebration videos on Instagram in absolute silence from my quiet rented room.',
      'I still take the longer crowded metro route every evening just to avoid running into my ex at the central interchange station.',
      'After four continuous years of pretending to be just her dependable best friend, reality finally struck me hard last night.'
    ],
    middles: [
      'You tell yourself that you have moved on, but old habits hurt deeply. Every shared playlist and rainy commute brings back tiny memories that refuse to fade. We planned to build a simple life together, but corporate jobs and different cities slowly destroyed everything.',
      'Watching them smile and celebrate with someone else made me understand that my presence was just a fleeting chapter for them, while they were the entire book for me. The silence inside this empty apartment feels louder than any crowded marketplace.'
    ],
    conclusions: [
      'I guess closure never arrives through spoken words; it comes when you quietly stop waiting for their late-night text messages.',
      'Some memories are better preserved untouched rather than trying to fix broken bonds. Walking away silently was my only dignified choice.'
    ],
    gradualComments: [
      'Unspoken feelings hurt for years. Take care of yourself.',
      'Walking away quietly takes unbelievable strength.',
      'Felt every single word of this.',
      'Time will heal this, trust the process.'
    ],
    reactionPool: ['❤️', '🤗', '😢', '💔'] as ReactionEmoji[]
  },
  {
    category: 'Business & Startup',
    intros: [
      'Nobody on LinkedIn sees the terrifying pressure and sleepless anxiety behind running a bootstrapped startup with completely zero external funding.',
      'I had to quietly pack my bags and leave our shared coworking space yesterday because client payments were delayed by two whole months.',
      'Walking away from a high-paying corporate software career to build my own digital product was both exhilarating and mentally exhausting.',
      'Watching my college batchmate raise three million dollars in seed funding while my small venture collapsed taught me brutal lessons.'
    ],
    middles: [
      'Everyone thinks running your own business means luxury and freedom, but the truth is surviving on cheap takeout while staring at pending vendor invoices and shrinking savings accounts. When your product launch gets zero signups after six months of intense grinding, intense self-doubt kicks in.',
      'I skipped personal groceries for three straight weeks just to ensure our junior developers received their paychecks on time without guessing our financial crisis. Carrying payroll stress while smiling in front of family requires a level of endurance nobody talks about.'
    ],
    conclusions: [
      'Entrepreneurship has zero glamour in real life, but the emotional resilience it builds inside your soul is worth every single setback.',
      'Failure hurts deeply, but waking up tomorrow morning to try one more marketing experiment is the only way forward in life.'
    ],
    gradualComments: [
      'True leadership is carrying stress quietly. Massive respect.',
      'Keep building, every major success had dark months like this.',
      'LinkedIn glorifies everything, reality is tough.',
      'Salute to your grit founder.'
    ],
    reactionPool: ['👏', '🔥', '💯', '❤️'] as ReactionEmoji[]
  },
  {
    category: 'Motivational & Growth',
    intros: [
      'Two years ago, a severe panic attack left me completely paralyzed and terrified of stepping outside my front apartment door.',
      'I failed the civil service competitive examination four consecutive times while watching all my peers settle down into stable jobs.',
      'Walking into a commercial gym for the first time severely overweight and self-conscious was the most humiliating experience of my life.',
      'Last night I finally completed the lingering personal loan repayment my father had taken years ago for my higher engineering education.'
    ],
    middles: [
      'When everyone around writes you off as a failure, the hardest daily battle is convincing your own mind to stay in the fight. Small boring steps look useless initially. Reading ten pages, running fifteen minutes, or just showing up when feeling hopeless feels like absolute nonsense.',
      'Yet days slowly compound into quiet strength. Standing alone on the busy metro platform today, breathing calmly without anxiety crushing my chest felt like winning a gold medal. Real healing does not make any loud announcements; it arrives in quiet everyday habits.'
    ],
    conclusions: [
      'Life does not end when plans collapse; it simply gives you an empty canvas to rebuild yourself with honest resilience.',
      'Be patient with your quiet healing. You are fighting silent battles that nobody will ever clap for, and that is completely fine.'
    ],
    gradualComments: [
      'Needed to read this today. Inspiring.',
      'Quiet victories are the sweetest.',
      'Proud of your progress stranger!',
      'This gives me hope for my own battles.'
    ],
    reactionPool: ['❤️', '👏', '🙏', '💯'] as ReactionEmoji[]
  },
  {
    category: 'Raw Confessions',
    intros: [
      'I frequently pretend to attend urgent work calls during crowded family gatherings just to sit alone in the quiet staircase.',
      'I am deliberately hiding a massive career setback from my aged parents because their fragile health cannot handle any more panic.',
      'Moving abroad for a high-paying overseas corporate job sounded luxurious, but the sheer emotional isolation in this studio apartment is suffocating.',
      'I constantly smile and crack jokes at dinner parties, but the second I lock my car doors, an overwhelming sadness takes over.'
    ],
    middles: [
      'People browse my social media photos and assume I am thriving in this metropolitan city. In reality, my dinner is instant noodles over a laptop screen while video calling home, hiding my tears whenever my mother asks if I am eating properly.',
      'It is strange how you can live surrounded by millions of busy people yet feel entirely invisible to the world. The heaviest burden of adult life is learning to carry your own emotional heartbreak without bothering anyone else around you.'
    ],
    conclusions: [
      'Admitting loneliness is not a sign of weakness; it is simply acknowledging that every human soul desperately needs warmth and genuine connection.',
      'Sometimes typing out raw honest thoughts to anonymous strangers on the internet is the only therapeutic release available after long exhausting days.'
    ],
    gradualComments: [
      'You are not alone in feeling this way.',
      'Homesickness is brutal. Sending love.',
      'Carry on, this phase will pass.',
      'Living alone in a new city changes you completely.'
    ],
    reactionPool: ['🤗', '❤️', '😢', '🙏'] as ReactionEmoji[]
  }
];

const GLOBAL_LOCATIONS = [
  { city: 'Mumbai', country: 'India' },
  { city: 'Bengaluru', country: 'India' },
  { city: 'Kolkata', country: 'India' },
  { city: 'Delhi', country: 'India' },
  { city: 'Hyderabad', country: 'India' },
  { city: 'Pune', country: 'India' },
  { city: 'London', country: 'UK' },
  { city: 'New York', country: 'USA' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Sydney', country: 'Australia' }
];

const REAL_USERNAMES = [
  'SilentVoyager', 'NeonDrifter', 'MidnightEcho', 'QuietRebel', 
  'Wanderer_99', 'CityLightsSoul', 'AuraSeeker', 'SolitaryThinker', 
  'ChaiAndRain', 'CuriousMind', 'NightOwlEcho', 'RusticEcho',
  'UrbanSoul', 'WanderDrift', 'PixelNomad', 'VelvetSilence'
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
  if (!text) return true;
  const cleanSnippet = text.trim().slice(0, 55).toLowerCase();
  const hashes = getStoredHashes();
  return hashes.includes(cleanSnippet);
}

function createCompressedMatchingImageUrl(): string {
  const randomPhotoId = CURATED_IMAGE_IDS[Math.floor(Math.random() * CURATED_IMAGE_IDS.length)];
  return `https://images.unsplash.com/${randomPhotoId}?auto=format&fit=crop&w=550&h=340&q=75`;
}

async function callGroqAI(category: string, topic: string) {
  if (!GROQ_API_KEY || !GROQ_API_KEY.startsWith('gsk_')) return null;

  try {
    const prompt = `Write an authentic, emotional, realistic first-person story for an anonymous feed.
Category: ${category}
Topic: ${topic}

CRITICAL REQUIREMENT:
1. The confession MUST be EXACTLY 90 to 100 words in length. Count every word carefully.
2. Tone: Conversational, raw, human, vulnerable.
3. Absolutely NO hashtags, no bullet points, no moral life advice at the end.
4. Output strictly a JSON object:
{
  "author": "RealisticUsername",
  "confession": "90-100 words confession story here...",
  "comment": "1 realistic empathetic response comment"
}`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        response_format: { type: 'json_object' }
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);

    const words = (parsed.confession || '').trim().split(/\s+/).length;
    if (words < 85 || words > 105) return null;

    return {
      body: parsed.confession,
      author: parsed.author || REAL_USERNAMES[Math.floor(Math.random() * REAL_USERNAMES.length)],
      category: category,
      imageUrl: createCompressedMatchingImageUrl(),
      firstComment: parsed.comment || 'Felt this deeply.'
    };
  } catch {
    return null;
  }
}

function generateProceduralStory() {
  const pillar = DIVERSE_PILLARS[Math.floor(Math.random() * DIVERSE_PILLARS.length)];
  const intro = pillar.intros[Math.floor(Math.random() * pillar.intros.length)];
  const middle = pillar.middles[Math.floor(Math.random() * pillar.middles.length)];
  const conclusion = pillar.conclusions[Math.floor(Math.random() * pillar.conclusions.length)];
  const author = REAL_USERNAMES[Math.floor(Math.random() * REAL_USERNAMES.length)];

  const body = `${intro} ${middle} ${conclusion}`;
  const imageUrl = createCompressedMatchingImageUrl();
  const firstComment = pillar.gradualComments[Math.floor(Math.random() * pillar.gradualComments.length)];

  return {
    body,
    author,
    category: pillar.category,
    imageUrl,
    firstComment
  };
}

// Diverse Emojis & Comments that grow gradually over time
async function applyOrganicGradualEngagement(posts: Confession[]) {
  try {
    const rawTracker = localStorage.getItem(ENGAGEMENT_TRACKER_KEY);
    const tracker: Record<string, number> = rawTracker ? JSON.parse(rawTracker) : {};
    const now = Date.now();

    for (const post of posts.slice(0, 20)) {
      const createdAt = Number((post as any).createdAt || (post as any).timestamp || 0);
      if (!createdAt) continue;

      const elapsedMinutes = Math.floor((now - createdAt) / (60 * 1000));
      const currentStage = tracker[post.id] || 0;
      const pool = DIVERSE_PILLARS.find((p) => p.category === (post as any).category) || DIVERSE_PILLARS[0];
      const reactions = pool.reactionPool;

      // Stage 1: ~10 mins -> Add first reaction (❤️ or 🤗)
      if (elapsedMinutes >= 10 && currentStage < 1) {
        tracker[post.id] = 1;
        const emoji = reactions[0] || '❤️';
        setReaction(post.id, null, emoji).catch(() => {});
      }

      // Stage 2: ~25 mins -> Add 1 organic comment + secondary reaction (👏 or 🔥)
      if (elapsedMinutes >= 25 && currentStage < 2) {
        tracker[post.id] = 2;
        const randomCommenter = REAL_USERNAMES[Math.floor(Math.random() * REAL_USERNAMES.length)];
        const text = pool.gradualComments[Math.floor(Math.random() * pool.gradualComments.length)];
        addComment(post.id, randomCommenter, text).catch(() => {});
        const emoji = reactions[1] || '🤗';
        setReaction(post.id, null, emoji).catch(() => {});
      }

      // Stage 3: ~45 mins -> Add 3rd diverse reaction (😢 or 💯 or ❤️)
      if (elapsedMinutes >= 45 && currentStage < 3) {
        tracker[post.id] = 3;
        const emoji = reactions[2] || '👏';
        setReaction(post.id, null, emoji).catch(() => {});
      }

      // Stage 4: ~70 mins -> Add final discussion comment + boost reaction
      if (elapsedMinutes >= 70 && currentStage < 4) {
        tracker[post.id] = 4;
        const randomCommenter = REAL_USERNAMES[Math.floor(Math.random() * REAL_USERNAMES.length)];
        const text = pool.gradualComments[(Math.floor(Math.random() * pool.gradualComments.length) + 1) % pool.gradualComments.length];
        addComment(post.id, randomCommenter, text).catch(() => {});
        const emoji = reactions[3] || reactions[0] || '❤️';
        setReaction(post.id, null, emoji).catch(() => {});
      }
    }

    localStorage.setItem(ENGAGEMENT_TRACKER_KEY, JSON.stringify(tracker));
  } catch {}
}

export async function generateAndPublishConfession(): Promise<Confession | null> {
  const randomLoc = GLOBAL_LOCATIONS[Math.floor(Math.random() * GLOBAL_LOCATIONS.length)];

  let story = await callGroqAI('Personal Life', 'night reflections and life journeys');
  if (!story || !story.body || isDuplicate(story.body)) {
    story = generateProceduralStory();
  }

  if (isDuplicate(story.body)) {
    story = generateProceduralStory();
  }

  const newPost = await createConfession({
    authorName: story.author,
    text: story.body,
    imageUrl: story.imageUrl,
    city: randomLoc.city,
    country: randomLoc.country,
    category: story.category,
  });

  if (newPost && story.firstComment) {
    const initialAuthor = REAL_USERNAMES[Math.floor(Math.random() * REAL_USERNAMES.length)];
    addComment(newPost.id, initialAuthor, story.firstComment).catch(() => {});
  }

  saveHash(story.body.trim().slice(0, 55).toLowerCase());
  return newPost;
}

export async function syncSimulatedActivity(existingPosts: Confession[]): Promise<Confession[]> {
  try {
    const now = Date.now();
    const lastRun = Number(localStorage.getItem(SIMULATOR_SCHEDULE_KEY) || 0);

    applyOrganicGradualEngagement(existingPosts).catch(() => {});

    if (!existingPosts || existingPosts.length < 4) {
      localStorage.setItem(SIMULATOR_SCHEDULE_KEY, String(now));
      await generateAndPublishConfession();
      return existingPosts;
    }

    if (now - lastRun > 14 * 60 * 1000) {
      localStorage.setItem(SIMULATOR_SCHEDULE_KEY, String(now));
      await generateAndPublishConfession();
    }
  } catch (e) {
    console.warn(e);
  }

  return existingPosts;
}

export function scheduleEngagementForNewPost(
  _post: Confession,
  _onUpdate: (data: { likesCountIncrement?: number; newComment?: any }) => void
) {}
