import { createConfession, setReaction, addComment } from './confessionService';
import { Confession } from '../types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const POSTED_HASHES_KEY = 'open_confess_posted_hashes_v6';
const SIMULATOR_SCHEDULE_KEY = 'open_confess_sim_schedule_v6';
const ENGAGEMENT_TRACKER_KEY = 'open_confess_post_milestones_v3';

// Diverse Organic Categories with Varied Scenarios
const DIVERSE_PILLARS = [
  {
    category: 'Love & Relationships',
    intros: [
      'We spent almost a year talking until 3 AM every single weekend without any label.',
      'Yesterday was her wedding, and I watched the celebration clips on Instagram in total silence.',
      'I still take the longer metro route just so I do not bump into my ex at the interchange station.',
      'After four years of pretending to be just supportive close friends, I realized something painful.',
      'Long-distance dating taught me the brutal silence of empty airport arrivals and cold goodbyes.'
    ],
    middles: [
      'You tell yourself that you are totally fine and that life moves on, but old habits do not die easily. Every shared playlist and tiny inside joke comes rushing back at the most random hours.',
      'We had plans to build an entire life together in a small rented flat, but corporate placements and different cities slowly drained the magic until conversations felt like polite office meetings.',
      'I watched them smile and laugh with someone else, realizing that my presence was just a temporary chapter in their journey while they were the whole book for me.'
    ],
    conclusions: [
      'I guess closure never comes from a final spoken conversation; it arrives when you quietly stop checking their last seen status.',
      'Some memories are better preserved untouched in the back of your mind rather than revisited.',
      'Walking away without creating a scene was the hardest but most mature choice I ever made.'
    ],
    prompts: [
      'lonely rain window evening lights bokeh portrait',
      'empty metro train seat quiet reflection moody',
      'couple silhouette walking away autumn twilight'
    ],
    gradualComments: [
      'Unspoken feelings hurt for years. Take care of yourself.',
      'Walking away quietly takes unbelievable strength.',
      'Felt every single word of this.',
      'Time will heal this, trust the process.'
    ]
  },
  {
    category: 'Business & Startup',
    intros: [
      'Nobody on LinkedIn sees the terrifying pressure behind running a zero-revenue bootstrapped startup.',
      'I had to quietly surrender my shared coworking desk yesterday because client invoices got delayed.',
      'Walking away from a steady 18 LPA corporate software role to build my own agency was terrifying.',
      'Watching my college batchmate raise three million dollars while my venture failed taught me true humility.'
    ],
    middles: [
      'Family thinks running your own thing means unlimited freedom and luxury, but reality is eating cold takeout at midnight while staring at a dwindling bank account and pending salaries.',
      'When your product launches to absolute zero traffic after six months of relentless weekend grinding, self-doubt hits you like a brick wall. You question your talent, your timing, and your sanity.',
      'I skipped personal expenses for three straight months just to ensure our two interns got paid without sensing how close we were to running out of runway.'
    ],
    conclusions: [
      'Entrepreneurship in real life has zero glamor, but the resilience it builds inside you is priceless.',
      'Failure hurts, but waking up tomorrow to try one more marketing angle is all we can do.',
      'The hustle culture online is fake, but honest quiet persistence is very real.'
    ],
    prompts: [
      'messy desk dual monitors coding late night room',
      'empty startup office dark evening moody lighting',
      'coffee cup next to laptop documents blurry bokeh'
    ],
    gradualComments: [
      'True leadership is carrying stress quietly. Massive respect.',
      'Keep building, every major success had dark months like this.',
      'LinkedIn glorifies everything, reality is tough.',
      'Salute to your grit founder.'
    ]
  },
  {
    category: 'Motivational & Growth',
    intros: [
      'Two years ago, a crippling panic attack left me terrified of stepping outside my apartment door.',
      'I failed the national entrance examination three times while everyone around me cleared it.',
      'Walking into a commercial gym for the first time completely overweight was humiliating.',
      'Last night I finally paid off the lingering personal debt my father took for my college education.'
    ],
    middles: [
      'When everyone writes you off, the hardest fight is convincing your own mind to stay in the ring. You wake up every day fighting invisible battles that nobody will ever clap for.',
      'Small incremental steps look completely useless when you start. Reading ten pages, running for fifteen minutes, or just showing up when you feel utterly hopeless seems pointless until months compound.',
      'Sitting alone on the metro today, listening to music without anxiety clawing at my chest felt like winning an Olympic medal. Freedom comes in quiet everyday victories.'
    ],
    conclusions: [
      'Life does not stop when you fail; it simply gives you an empty canvas to rebuild stronger.',
      'Be gentle with yourself. You are doing much better than your anxious mind tells you.',
      'Consistency is not excitement; it is doing the work on days when you feel nothing.'
    ],
    prompts: [
      'subway platform warm light peaceful commuter quiet morning',
      'jogger trail sunrise mist golden hour lens flare',
      'open notebook tea cup morning sunshine aesthetic'
    ],
    gradualComments: [
      'Needed to read this today. Inspiring.',
      'Quiet victories are the sweetest.',
      'Proud of your progress stranger!',
      'This gives me hope for my own battles.'
    ]
  },
  {
    category: 'Gaming & Tech',
    intros: [
      'I am twenty-eight with corporate duties, but my Discord gaming squad from 2018 is still my safe space.',
      'Watching our favorite nostalgic community multiplayer game server permanently shut down hurt.',
      'Building indie software tools in secret between 10 PM and 2 AM keeps my curiosity alive.'
    ],
    middles: [
      'Adult life slowly drains away your high school and college friends, but having three anonymous squadmates jump into a Discord voice channel to clutch a tournament round brings back that pure childlike laughter.',
      'You can have a stressful day handling endless escalations and angry client emails, but booting up a beautifully crafted open world game and exploring quiet landscapes cures mental fatigue better than anything else.'
    ],
    conclusions: [
      'Never let the world convince you that gaming or digital companionship is a waste of life.',
      'Sometimes anonymous strangers on Discord treat you with more genuine kindness than coworkers.'
    ],
    prompts: [
      'mechanical keyboard neon ambient lighting dark room setup',
      'gamer headset illuminated pc tower aesthetic dark blur',
      'arcade cabinet screen reflections nostalgic retro vintage'
    ],
    gradualComments: [
      'Squad mates are real brothers.',
      '2 AM gaming sessions hit completely different.',
      'Gaming keeps the child inside us alive.',
      'Clutching rounds with randoms is therapy.'
    ]
  },
  {
    category: 'Raw Confessions',
    intros: [
      'I pretend to take urgent phone calls at social events just to sit quietly on the staircase alone.',
      'Hiding a huge setback from my aging parents because I cannot bear seeing them worry.',
      'Moving abroad to earn well sounded like a dream, but the sheer loneliness in this flat is unbearable.'
    ],
    middles: [
      'People see my social media stories and think I am thriving in a foreign city. In reality, my dinner is instant noodles while video calling home, hiding my tears whenever my mother asks if I am eating well.',
      'It is strange how you can be surrounded by hundreds of people in a bustling city and still feel entirely invisible. The hardest thing about growing older is learning to carry your own emotional weight in complete silence.'
    ],
    conclusions: [
      'Being honest about loneliness is not weakness; it is acknowledging that we all need human warmth.',
      'Sometimes writing it out to anonymous strangers is the only therapy available.'
    ],
    prompts: [
      'lonely city streets night walk streetlights bokeh rain',
      'empty park bench evening shadows autumn leaves quiet',
      'apartment window view cloudy rainy city landscape'
    ],
    gradualComments: [
      'You are not alone in feeling this way.',
      'Homesickness is brutal. Sending love.',
      'Carry on, this phase will pass.',
      'Living alone in a new city changes you completely.'
    ]
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

// Generates ~50KB compressed JPG image with guaranteed unique visual seed
function createCompressedMatchingImageUrl(visualPrompt: string): string {
  // High entropy unique seed to ensure image is never identical/re-uploaded
  const uniqueSeed = `${Date.now()}_${Math.floor(Math.random() * 99999999)}`;
  const cleanKeyword = visualPrompt.replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
  const cleanPrompt = encodeURIComponent(
    `${cleanKeyword}, authentic documentary photo, 35mm film grain, moody natural light`
  );
  // Dimensions 550x340 capped as lightweight JPG (~45-52KB)
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=550&height=340&seed=${uniqueSeed}&nologo=true`;
}

// Groq AI Generator (Llama-3.3)
async function callGroqAI(category: string, topic: string) {
  if (!GROQ_API_KEY || !GROQ_API_KEY.startsWith('gsk_')) return null;

  try {
    const prompt = `Write an authentic, candid first-person story for an anonymous feed.
Category: ${category}
Specific Theme: ${topic}
Word Count: EXACTLY 90 to 100 words.
Tone: Natural, conversational, emotional. No hashtags, no moral quotes.
Output JSON:
{
  "author": "Username",
  "confession": "90-100 word narrative",
  "imageKeyword": "3 descriptive photo keywords",
  "comment": "1 immediate human reaction comment"
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
        temperature: 0.95,
        response_format: { type: 'json_object' }
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);

    return {
      body: parsed.confession,
      author: parsed.author || REAL_USERNAMES[Math.floor(Math.random() * REAL_USERNAMES.length)],
      category: category,
      imageUrl: createCompressedMatchingImageUrl(parsed.imageKeyword || topic),
      firstComment: parsed.comment || 'Felt this deeply.'
    };
  } catch {
    return null;
  }
}

// Procedural Organic Generator (Guaranteed unique combination every run)
function generateProceduralStory() {
  const pillar = DIVERSE_PILLARS[Math.floor(Math.random() * DIVERSE_PILLARS.length)];
  const intro = pillar.intros[Math.floor(Math.random() * pillar.intros.length)];
  const middle = pillar.middles[Math.floor(Math.random() * pillar.middles.length)];
  const conclusion = pillar.conclusions[Math.floor(Math.random() * pillar.conclusions.length)];
  const randomPrompt = pillar.prompts[Math.floor(Math.random() * pillar.prompts.length)];
  const author = REAL_USERNAMES[Math.floor(Math.random() * REAL_USERNAMES.length)];

  const body = `${intro} ${middle} ${conclusion}`;
  const imageUrl = createCompressedMatchingImageUrl(randomPrompt);
  const firstComment = pillar.gradualComments[Math.floor(Math.random() * pillar.gradualComments.length)];

  return {
    body,
    author,
    category: pillar.category,
    imageUrl,
    firstComment
  };
}

// Organic gradual engagement: Reactions and comments grow progressively over time
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

      // Stage 1: ~10 mins -> Add 1 Heart Reaction
      if (elapsedMinutes >= 10 && currentStage < 1) {
        tracker[post.id] = 1;
        setReaction(post.id, null, '❤️').catch(() => {});
      }

      // Stage 2: ~20 mins -> Add 1 Contextual Comment
      if (elapsedMinutes >= 20 && currentStage < 2) {
        tracker[post.id] = 2;
        const randomCommenter = REAL_USERNAMES[Math.floor(Math.random() * REAL_USERNAMES.length)];
        const pool = DIVERSE_PILLARS.find(p => p.category === (post as any).category) || DIVERSE_PILLARS[0];
        const text = pool.gradualComments[Math.floor(Math.random() * pool.gradualComments.length)];
        addComment(post.id, randomCommenter, text).catch(() => {});
      }

      // Stage 3: ~35 mins -> Add Support Reaction
      if (elapsedMinutes >= 35 && currentStage < 3) {
        tracker[post.id] = 3;
        setReaction(post.id, null, '❤️').catch(() => {});
      }

      // Stage 4: ~50 mins -> Add 1 more thoughtful reaction/comment
      if (elapsedMinutes >= 50 && currentStage < 4) {
        tracker[post.id] = 4;
        const randomCommenter = REAL_USERNAMES[Math.floor(Math.random() * REAL_USERNAMES.length)];
        const pool = DIVERSE_PILLARS.find(p => p.category === (post as any).category) || DIVERSE_PILLARS[0];
        const text = pool.gradualComments[Math.floor(Math.random() * pool.gradualComments.length)];
        addComment(post.id, randomCommenter, text).catch(() => {});
        setReaction(post.id, null, '❤️').catch(() => {});
      }
    }

    localStorage.setItem(ENGAGEMENT_TRACKER_KEY, JSON.stringify(tracker));
  } catch {}
}

export async function generateAndPublishConfession(): Promise<Confession | null> {
  const randomLoc = GLOBAL_LOCATIONS[Math.floor(Math.random() * GLOBAL_LOCATIONS.length)];

  // Try Groq AI first; if unavailable, run procedural engine
  let story = await callGroqAI('Personal Life', 'night reflections and life journeys');
  if (!story || !story.body || isDuplicate(story.body)) {
    story = generateProceduralStory();
  }

  // Safety check against duplicate body snippet
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

  // Attach only 1 initial comment to ignite discussion; others grow gradually over time
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

    // Apply incremental reactions & comments to existing posts
    applyOrganicGradualEngagement(existingPosts).catch(() => {});

    // Cold-start seed: If feed has fewer than 4 posts, create immediately
    if (!existingPosts || existingPosts.length < 4) {
      localStorage.setItem(SIMULATOR_SCHEDULE_KEY, String(now));
      await generateAndPublishConfession();
      return existingPosts;
    }

    // Har 14.4 minute me 1 naya confession (~100 posts daily)
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
