import { createConfession } from './confessionService';
import { Confession, ReactionEmoji } from '../types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const POSTED_HASHES_KEY = 'open_confess_posted_hashes_v9';
const SIMULATOR_SCHEDULE_KEY = 'open_confess_sim_schedule_v9';

interface LocationProfile {
  city: string;
  country: string;
  langGroup: 'Bengali' | 'IndiaMix' | 'GlobalEnglish';
}

const GLOBAL_LOCATIONS: LocationProfile[] = [
  { city: 'Kolkata', country: 'India', langGroup: 'Bengali' },
  { city: 'Dhaka', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Chittagong', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Sylhet', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Howrah', country: 'India', langGroup: 'Bengali' },
  { city: 'Delhi', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Mumbai', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Pune', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Bengaluru', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Hyderabad', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Lucknow', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Jaipur', country: 'India', langGroup: 'IndiaMix' },
  { city: 'London', country: 'UK', langGroup: 'GlobalEnglish' },
  { city: 'New York', country: 'USA', langGroup: 'GlobalEnglish' },
  { city: 'Toronto', country: 'Canada', langGroup: 'GlobalEnglish' },
  { city: 'Sydney', country: 'Australia', langGroup: 'GlobalEnglish' }
];

const BENGALI_USERNAMES = [
  'KolkataGhumonto', 'MeghBalika', 'BhalobasharKobi', 'NisshoPothik',
  'ChaKhorKolkata', 'Anamika_99', 'ShohorerChithi', 'BobaSur', 'ChokherJol',
  'Nil_Kabbo', 'EkaPothik', 'SondhaTara', 'BristirGaan', 'HariyeJawaMon',
  'RupkotharRajputro', 'ChhotoChhobi', 'Mayaboti_7', 'BishadSindhu'
];

const HINDI_USERNAMES = [
  'KhamoshMusafir', 'DilliWalaShayar', 'TanhaiKaSafar', 'SukoonKiKhoj',
  'ChaiAurKitaabein', 'RasteKeMusafir', 'ZindagiDiary', 'NeendUdi',
  'KhaaliPanna', 'AlfaazMere', 'RaatKaMusaafir', 'ChupkeSeJeeRaha',
  'BefikraRooh', 'YaadonKiDukaan', 'AawaraParinda', 'SahilKiRet'
];

const GLOBAL_USERNAMES = [
  'SilentVoyager', 'NeonDrifter', 'MidnightEcho', 'QuietRebel',
  'Wanderer_99', 'CityLightsSoul', 'AuraSeeker', 'SolitaryThinker',
  'NightOwlEcho', 'RusticEcho', 'UrbanSoul', 'PixelNomad', 'VelvetSilence',
  'StarlightWalker', 'CandidNotes', 'EchoInTheDark'
];

const BENGAL_PHOTOS = [
  'photo-1558431382-27e303142255', 'photo-1609137144822-263a2339d6e4',
  'photo-1534528741775-53994a69daeb', 'photo-1507003211169-0a1dd7228f2d',
  'photo-1524504388940-b1c1722653e1', 'photo-1517841905240-472988babdf9',
  'photo-1596178065887-1198b6148b2b', 'photo-1544005313-94ddf0286df2',
  'photo-1509198397868-475647b2a1e5', 'photo-1513836279014-a89f7a76ae86',
  'photo-1508672019048-805479717ca9', 'photo-1506744038136-46273834b3fb',
  'photo-1511988617509-a57c8a288659', 'photo-1470071459604-3b5ec3a7fe05'
];

const INDIA_PHOTOS = [
  'photo-1506744038136-46273834b3fb', 'photo-1517841905240-472988babdf9',
  'photo-1492562080023-ab3db95bfbce', 'photo-1498050108023-c5249f4df085',
  'photo-1519389950473-47ba0277781c', 'photo-1486312338219-ce68d2c6f44d',
  'photo-1470246973918-29a93221c455', 'photo-1506126613408-eca07ce68773',
  'photo-1542751371-adc38448a05e', 'photo-1538481199705-c710c4e965fc',
  'photo-1499209974431-9dddcece7f88', 'photo-1517048676732-d65bc937f952',
  'photo-1436491865332-7a61a109cc05', 'photo-1518199266791-5375a83190b7',
  'photo-1516589178581-6cd7833ae3b2', 'photo-1528722828814-77b9b83aafb2',
  'photo-1531746020798-e6953c6e8e04', 'photo-1519085360753-af0119f7cbe7',
  'photo-1501386761578-eac5c94b800a', 'photo-1497215728101-856f4ea42174',
  'photo-1477959858617-67f30bc75b82', 'photo-1507525428034-b723cf961d3e'
];

const GLOBAL_PHOTOS = [
  'photo-1518199266791-5375a83190b7', 'photo-1516589178581-6cd7833ae3b2',
  'photo-1492562080023-ab3db95bfbce', 'photo-1498050108023-c5249f4df085',
  'photo-1519389950473-47ba0277781c', 'photo-1486312338219-ce68d2c6f44d',
  'photo-1509198397868-475647b2a1e5', 'photo-1470246973918-29a93221c455',
  'photo-1506126613408-eca07ce68773', 'photo-1542751371-adc38448a05e',
  'photo-1538481199705-c710c4e965fc', 'photo-1499209974431-9dddcece7f88',
  'photo-1517048676732-d65bc937f952', 'photo-1436491865332-7a61a109cc05',
  'photo-1500530855697-b586d89ba3ee', 'photo-1514565131-fce0801e5785',
  'photo-1494790108377-be9c29b29330', 'photo-1517841905240-472988babdf9',
  'photo-1522075469751-3a6694fb2f61', 'photo-1496442226666-8d4d0e62e6e9'
];

const DIVERSE_PILLARS = [
  {
    category: 'Love & Relationships',
    subAngles: [
      'moving on after silence and unsaid closure',
      'falling for a best friend and watching them marry someone else',
      'guilt of falling out of love in a comfortable relationship',
      'secret regret of choosing career ambition over the only true love'
    ],
    reactionPool: ['❤️', '🤗', '😢', '💔', '🙏'] as ReactionEmoji[]
  },
  {
    category: 'Business & Career',
    subAngles: [
      'bootstrapped startup fear of running out of money without telling parents',
      'corporate exhaustion, high package but total loss of self-worth',
      'pretending to be successful on social media while drowning in debts',
      'leaving a comfortable job to pursue art secretly'
    ],
    reactionPool: ['❤️', '👏', '🔥', '💯', '🙏'] as ReactionEmoji[]
  },
  {
    category: 'Family & Identity',
    subAngles: [
      'hiding true passion to become the family trophy child',
      'homesickness in a rented metro flat hiding tears on family phone calls',
      'the guilt of outgrowing childhood friends and siblings',
      'carrying financial burdens while keeping a bright smiling face'
    ],
    reactionPool: ['❤️', '🤗', '😢', '🙏', '💔'] as ReactionEmoji[]
  },
  {
    category: 'Raw Personal Truths',
    subAngles: [
      'imposter syndrome among hyper-competitive peers',
      'silent loneliness on weekend nights inside a crowded city',
      'unresolved grief of losing a loved one without saying goodbye',
      'social anxiety disguised as being arrogant and distant'
    ],
    reactionPool: ['❤️', '😢', '🤗', '🙏', '💔'] as ReactionEmoji[]
  }
];

function determineTargetLanguage(location: LocationProfile): 'Bengali' | 'Hindi' | 'English' {
  if (location.langGroup === 'Bengali') return 'Bengali';
  if (location.langGroup === 'IndiaMix') {
    return Math.random() < 0.5 ? 'Hindi' : 'English';
  }
  return 'English';
}

function getAppropriateUsername(lang: 'Bengali' | 'Hindi' | 'English'): string {
  if (lang === 'Bengali') {
    return BENGALI_USERNAMES[Math.floor(Math.random() * BENGALI_USERNAMES.length)];
  }
  if (lang === 'Hindi') {
    return HINDI_USERNAMES[Math.floor(Math.random() * HINDI_USERNAMES.length)];
  }
  return GLOBAL_USERNAMES[Math.floor(Math.random() * GLOBAL_USERNAMES.length)];
}

function generateGuaranteedCoverImage(isBengaliContext: boolean, isIndianContext: boolean): string {
  let pool = GLOBAL_PHOTOS;
  if (isBengaliContext) {
    pool = BENGAL_PHOTOS;
  } else if (isIndianContext) {
    pool = INDIA_PHOTOS;
  }

  const randomPhotoId = pool[Math.floor(Math.random() * pool.length)];
  const randomVersion = Math.floor(Math.random() * 1000);
  return `https://images.unsplash.com/${randomPhotoId}?auto=format&fit=crop&w=600&h=420&q=70&fm=jpg&v=${randomVersion}`;
}

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
  const cleanSnippet = text.trim().slice(0, 50).toLowerCase();
  const hashes = getStoredHashes();
  return hashes.includes(cleanSnippet);
}

async function callGroqAI(
  category: string,
  subAngle: string,
  lang: 'Bengali' | 'Hindi' | 'English',
  city: string
) {
  if (!GROQ_API_KEY || !GROQ_API_KEY.startsWith('gsk_')) return null;

  let languagePromptRule = 'Write strictly in modern, natural English.';
  if (lang === 'Bengali') {
    languagePromptRule =
      'Write strictly in standard, deeply emotional, natural Bengali (বাংলা লিপি). Use authentic spoken colloquial phrasing common in West Bengal/Bangladesh.';
  } else if (lang === 'Hindi') {
    languagePromptRule =
      'Write strictly in natural, emotional, authentic Hindi (देवनागरी लिपि). Use natural spoken Hindi that touches the heart without difficult textbook words.';
  }

  const randomSalt = Math.random().toString(36).substring(2, 9);

  const prompt = `Write an authentic, deeply moving first-person confession for an anonymous social feed.
Category: ${category}
Core Angle: ${subAngle}
City/Setting: ${city}
Language Rule: ${languagePromptRule}
Dynamic Seed Token: ${randomSalt}

MANDATORY RULES:
1. Length: Exactly between 90 and 100 words. (Do not write less than 85 words).
2. Format: Raw, honest, realistic first-person emotional storytelling.
3. Absolutely NO hashtags, NO moral preaching at the end, NO quotes around the text.
4. Output strictly a JSON object:
{
  "author": "CreativeNaturalUsername",
  "confession": "Full 90-100 word confession paragraph in requested language..."
}`;

  try {
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
    if (!parsed.confession || parsed.confession.trim().split(' ').length < 65) return null;

    return {
      body: parsed.confession.trim(),
      author: parsed.author || getAppropriateUsername(lang),
      category
    };
  } catch {
    return null;
  }
}

function generateDynamicFallback(lang: 'Bengali' | 'Hindi' | 'English', city: string) {
  const pillar = DIVERSE_PILLARS[Math.floor(Math.random() * DIVERSE_PILLARS.length)];
  const author = getAppropriateUsername(lang);

  if (lang === 'Bengali') {
    return {
      body: `${city} শহরের এই চার দেয়ালের মাঝে প্রতিদিন কত স্বপ্ন যে নিঃশব্দে হারিয়ে যায়, তার খবর কেউ রাখে না। পরিবারের সবাইকে খুশি রাখতে গিয়ে নিজের ভালোলাগাগুলোকে কবে যেন বিসর্জন দিয়েছি। কাজের ব্যস্ততায় দিন কেটে যায় ঠিকই, কিন্তু রাতের বেলা নিস্তব্ধ ঘরের জানলায় দাঁড়িয়ে মনে হয় আমি কি সত্যিই বাঁচছি নাকি কেবল সাধারণ টিকে থাকার অভিনয় করে যাচ্ছি? কাউকে বলার মতো সাহস নেই, শুধু বুকের ভেতর চেপে রাখা একরাশ না-বলা কথা।`,
      author,
      category: pillar.category
    };
  }

  if (lang === 'Hindi') {
    return {
      body: `${city} की भागदौड़ में बाहर से सब ठीक नजर आता है, लेकिन इस फ्लैट के अकेलेपन में हर शाम एक अधूरापन घेर लेता है। घर पर फोन करके हमेशा कहता हूँ कि मैं बहुत खुश हूँ, लेकिन असल में जिम्मेदारियों का बोझ इतना भारी हो चुका है कि खुलकर मुस्कुराना भूल गया हूँ। कभी-कभी लगता है कि सब छोड़कर वापस चला जाऊँ, पर परिवार की उम्मीदें मुझे रोक लेती हैं। खुद से हारने का डर सबसे ज्यादा तकलीफ देता है।`,
      author,
      category: pillar.category
    };
  }

  return {
    body: `Living alone in ${city} looks like a dream from social media posts, but the silent weight of routine is slowly taking away who I used to be. Every call with my parents feels like a rehearsed performance of pretending everything is perfect when I am barely holding things together. Carrying expectations quietly while battling internal exhaustion is the hardest price of adult life, and I wonder when I will finally feel at peace again.`,
    author,
    category: pillar.category
  };
}

// -------------------------------------------------------------
// CLIENT ENGAGEMENT DISABLED (Fully handled server-side by api/cron.ts)
// -------------------------------------------------------------
async function applyOrganicGradualEngagement(_posts: Confession[]) {
  return;
}

export async function generateAndPublishConfession(): Promise<Confession | null> {
  const randomLoc = GLOBAL_LOCATIONS[Math.floor(Math.random() * GLOBAL_LOCATIONS.length)];
  const targetLang = determineTargetLanguage(randomLoc);
  const isBengaliContext = targetLang === 'Bengali';
  const isIndianContext = randomLoc.country === 'India';

  const pillar = DIVERSE_PILLARS[Math.floor(Math.random() * DIVERSE_PILLARS.length)];
  const subAngle = pillar.subAngles[Math.floor(Math.random() * pillar.subAngles.length)];

  let story = await callGroqAI(pillar.category, subAngle, targetLang, randomLoc.city);

  if (!story || !story.body || isDuplicate(story.body)) {
    const backupAngle = pillar.subAngles[(pillar.subAngles.indexOf(subAngle) + 1) % pillar.subAngles.length];
    story = await callGroqAI(pillar.category, backupAngle, targetLang, randomLoc.city);
  }

  if (!story || !story.body || isDuplicate(story.body)) {
    story = generateDynamicFallback(targetLang, randomLoc.city);
  }

  const imageUrl = generateGuaranteedCoverImage(isBengaliContext, isIndianContext);

  const newPost = await createConfession({
    authorName: story.author,
    text: story.body,
    imageUrl: imageUrl,
    city: randomLoc.city,
    country: randomLoc.country,
    category: story.category
  });

  saveHash(story.body.trim().slice(0, 50).toLowerCase());
  return newPost;
}

export async function syncSimulatedActivity(existingPosts: Confession[]): Promise<Confession[]> {
  try {
    const now = Date.now();
    const lastRun = Number(localStorage.getItem(SIMULATOR_SCHEDULE_KEY) || 0);

    applyOrganicGradualEngagement(existingPosts).catch(() => {});

    if (!existingPosts || existingPosts.length < 2) {
      localStorage.setItem(SIMULATOR_SCHEDULE_KEY, String(now));
      await generateAndPublishConfession();
      return existingPosts;
    }

    if (now - lastRun >= 14 * 60 * 1000) {
      localStorage.setItem(SIMULATOR_SCHEDULE_KEY, String(now));
      await generateAndPublishConfession();
    }
  } catch (e) {
    console.warn('Simulation sync error:', e);
  }

  return existingPosts;
}

export function scheduleEngagementForNewPost(
  _post: Confession,
  _onUpdate: (data: { likesCountIncrement?: number; newComment?: any }) => void
) {}
