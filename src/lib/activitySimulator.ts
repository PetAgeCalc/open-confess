import { createConfession, setReaction, addComment } from './confessionService';
import { Confession, ReactionEmoji } from '../types';
// Cloudinary upload function ko import karein (aapke cloudinary.ts se)
import { uploadToCloudinary } from './cloudinary';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const POSTED_HASHES_KEY = 'open_confess_posted_hashes_v8';
const SIMULATOR_SCHEDULE_KEY = 'open_confess_sim_schedule_v8';
const ENGAGEMENT_TRACKER_KEY = 'open_confess_organic_growth_v2';

interface LocationProfile {
  city: string;
  country: string;
  langGroup: 'Bengali' | 'IndiaMix' | 'GlobalEnglish';
}

const GLOBAL_LOCATIONS: LocationProfile[] = [
  // Bengali Context
  { city: 'Kolkata', country: 'India', langGroup: 'Bengali' },
  { city: 'Dhaka', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Chittagong', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Sylhet', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Howrah', country: 'India', langGroup: 'Bengali' },

  // Indian Context (Hindi / Hinglish / English)
  { city: 'Delhi', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Mumbai', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Pune', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Bengaluru', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Hyderabad', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Lucknow', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Jaipur', country: 'India', langGroup: 'IndiaMix' },

  // Global Context
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

function detectPostLanguage(text: string, city: string = ''): 'Bengali' | 'Hindi' | 'English' {
  if (/[\u0980-\u09FF]/.test(text)) return 'Bengali';
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  if (['Kolkata', 'Dhaka', 'Chittagong', 'Sylhet', 'Howrah'].includes(city)) return 'Bengali';
  if (['Delhi', 'Mumbai', 'Pune', 'Lucknow', 'Jaipur'].includes(city)) return 'Hindi';
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

// -------------------------------------------------------------
// IMAGE GENERATION + AUTO 50KB JPG COMPRESSION + CLOUDINARY UPLOAD
// -------------------------------------------------------------

// Helper to convert Image to Compressed 50KB JPG File
async function compressImageToJpgFile(imageUrl: string): Promise<File> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 600x800 resolution keeps aspect ratio sharp while targeting ~40-50KB JPG
      const targetWidth = 600;
      const targetHeight = Math.round((img.height / img.width) * targetWidth);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      if (!ctx) {
        return resolve(new File([blob], `confess_${Date.now()}.jpg`, { type: 'image/jpeg' }));
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Quality 0.65 yields crisp ~40-50KB JPG output
      canvas.toBlob(
        (compressedBlob) => {
          if (compressedBlob) {
            const file = new File([compressedBlob], `confess_${Date.now()}.jpg`, {
              type: 'image/jpeg'
            });
            resolve(file);
          } else {
            resolve(new File([blob], `confess_${Date.now()}.jpg`, { type: 'image/jpeg' }));
          }
        },
        'image/jpeg',
        0.65
      );
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(blob);
  });
}

// Generates, compresses to ~50KB JPG and uploads directly to Cloudinary
async function generateAndUploadCompressedImage(
  confessionText: string,
  isBengaliContext: boolean
): Promise<string> {
  const visualStyles = [
    'cinematic moody photography, soft shadows, candid 35mm film grain',
    'atmospheric city street at twilight, lo-fi aesthetic, quiet reflection',
    'minimalist silhouette near rainy window, muted tones, deep contrast',
    'retro warm vintage photography, contemplative solitary atmosphere',
    'empty street corner with misty lamplight, evocative fine art'
  ];

  const selectedStyle = visualStyles[Math.floor(Math.random() * visualStyles.length)];
  const contextSubject = isBengaliContext
    ? 'kolkata dhaka vintage street architecture, heritage windows'
    : 'modern city twilight, quiet urban corner';

  const cleanSnippet = confessionText
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 6)
    .join(' ');

  const prompt = encodeURIComponent(
    `${cleanSnippet} ${contextSubject}, ${selectedStyle}, aesthetic wallpaper, 4k, no text, no visible faces, subtle background`
  );

  const uniqueSeed = Date.now() + Math.floor(Math.random() * 10000000);
  const rawGeneratedUrl = `https://image.pollinations.ai/prompt/${prompt}?width=768&height=1024&seed=${uniqueSeed}&nologo=true&model=flux`;

  try {
    // 1. Fetch & compress to ~50KB JPG File
    const compressedJpgFile = await compressImageToJpgFile(rawGeneratedUrl);

    // 2. Upload to your Cloudinary storage
    const cloudinaryUrl = await uploadToCloudinary(compressedJpgFile);

    if (cloudinaryUrl) {
      return cloudinaryUrl;
    }
  } catch (err) {
    console.warn('Cloudinary compression/upload fallback:', err);
  }

  // Fallback if Cloudinary is temporarily unreachable
  return rawGeneratedUrl;
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

// Generates highly realistic context-aware replies matched to post language & meaning
async function generateSmartMatchingComment(postText: string, lang: 'Bengali' | 'Hindi' | 'English'): Promise<string> {
  if (!GROQ_API_KEY || !GROQ_API_KEY.startsWith('gsk_')) {
    if (lang === 'Bengali') return 'কথাগুলো বুক ছুঁয়ে গেল, শক্ত থেকো।';
    if (lang === 'Hindi') return 'हर लाइन से तुम्हारा दर्द महसूस हो रहा है भाई, हिम्मत रखो।';
    return 'Felt every single word of this. Stay strong.';
  }

  let languageInstruction = 'Natural short spoken English (max 15 words).';
  if (lang === 'Bengali') {
    languageInstruction = 'Short, emotional, natural conversational Bengali (বাংলা লিপি) reply as an empathetic reader (max 15 words).';
  } else if (lang === 'Hindi') {
    languageInstruction = 'Short, natural, heartfelt conversational Hindi (देवनागरी लिपि) reply as an empathetic reader (max 15 words).';
  }

  const prompt = `Read this confession carefully:
"${postText.slice(0, 250)}"

Task: Write 1 short, deeply empathetic reader comment responding directly to what happened in the confession.
Rules:
- ${languageInstruction}
- Must feel 100% human, casual, and specific to the post.
- No quotes, no hashtags, no meta explanations. Output ONLY the comment text.`;

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
        temperature: 0.85,
        max_tokens: 50
      })
    });

    if (!res.ok) throw new Error();
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (reply && reply.length > 3) return reply.replace(/^["']|["']$/g, '');
  } catch {}

  if (lang === 'Bengali') return 'নিজেকে একা মনে কোরো না, সময় সব ঠিক করে দেবে।';
  if (lang === 'Hindi') return 'तुम अकेले नहीं हो दोस्त, वक्त के साथ सब बेहतर होगा।';
  return 'Sending you strength and warmth.';
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

// Gradual Organic Growth Engine:
// - Delayed start (first reaction/comment strictly after 6-10 minutes)
// - Slow, steady compounding up to 100+ reactions (heavy ❤️ bias) and 50+ smart comments
async function applyOrganicGradualEngagement(posts: Confession[]) {
  try {
    const rawTracker = localStorage.getItem(ENGAGEMENT_TRACKER_KEY);
    const tracker: Record<string, { commentsCount: number; reactionsCount: number; lastActivity: number }> =
      rawTracker ? JSON.parse(rawTracker) : {};
    const now = Date.now();

    for (const post of posts.slice(0, 35)) {
      const createdAt = Number((post as any).createdAt || (post as any).timestamp || 0);
      if (!createdAt) continue;

      const elapsedMinutes = Math.floor((now - createdAt) / (60 * 1000));

      // Rule: Pehle 6 minute tak ZERO activity (organic pacing)
      if (elapsedMinutes < 6) continue;

      const record = tracker[post.id] || { commentsCount: 0, reactionsCount: 0, lastActivity: 0 };

      // Spacing: Har 5-8 minute me ek ek wave
      if (now - record.lastActivity < 5 * 60 * 1000) continue;

      const postLang = detectPostLanguage(post.text, (post as any).city);

      // Reactions Growth -> 100+ target
      if (record.reactionsCount < 120) {
        const reactsToAdd = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < reactsToAdd; i++) {
          const emoji: ReactionEmoji = Math.random() < 0.8 ? '❤️' : (Math.random() < 0.5 ? '🤗' : '🙏');
          setReaction(post.id, null, emoji).catch(() => {});
        }
        record.reactionsCount += reactsToAdd;
      }

      // Comments Growth -> 50+ target
      if (record.commentsCount < 60) {
        const smartComment = await generateSmartMatchingComment(post.text, postLang);
        const randomUser = getAppropriateUsername(postLang);
        addComment(post.id, randomUser, smartComment).catch(() => {});
        record.commentsCount += 1;
      }

      record.lastActivity = now;
      tracker[post.id] = record;
    }

    localStorage.setItem(ENGAGEMENT_TRACKER_KEY, JSON.stringify(tracker));
  } catch {}
}

export async function generateAndPublishConfession(): Promise<Confession | null> {
  const randomLoc = GLOBAL_LOCATIONS[Math.floor(Math.random() * GLOBAL_LOCATIONS.length)];
  const targetLang = determineTargetLanguage(randomLoc);
  const isBengaliContext = targetLang === 'Bengali';

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

  // 50KB JPG compress hokar direct Cloudinary me upload hogi
  const imageUrl = await generateAndUploadCompressedImage(story.body, isBengaliContext);

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

    // ~14.4 mins = ~100 posts in 24 hours
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
