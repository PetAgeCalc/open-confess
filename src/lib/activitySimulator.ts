import { createConfession, setReaction, addComment } from './confessionService';
import { Confession, ReactionEmoji } from '../types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const POSTED_HASHES_KEY = 'open_confess_posted_hashes_v6';
const SIMULATOR_SCHEDULE_KEY = 'open_confess_sim_schedule_v6';
const ENGAGEMENT_TRACKER_KEY = 'open_confess_post_milestones_v4';

// Bengali & South Asian context images (Portraits, Kolkata/Dhaka streets & architecture)
const BENGAL_CURATED_IMAGE_IDS = [
  'photo-1558431382-27e303142255', // Kolkata yellow taxi / streets
  'photo-1609137144822-263a2339d6e4', // Victoria Memorial / architecture
  'photo-1534528741775-53994a69daeb', // Expressive face/portrait
  'photo-1507003211169-0a1dd7228f2d', // Solitary young person
  'photo-1524504388940-b1c1722653e1', // Emotional portrait
  'photo-1517841905240-472988babdf9', // Contemplative portrait
  'photo-1596178065887-1198b6148b2b', // Kolkata Ghat / Hooghly river vibe
  'photo-1544005313-94ddf0286df2'  // Thoughtful face
];

// Global aesthetic & architecture images
const GLOBAL_CURATED_IMAGE_IDS = [
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
  'photo-1499209974431-9dddcece7f88',
  'photo-1517048676732-d65bc937f952',
  'photo-1436491865332-7a61a109cc05'
];

interface LocationProfile {
  city: string;
  country: string;
  langGroup: 'Bengali' | 'IndiaMix' | 'GlobalEnglish';
}

const GLOBAL_LOCATIONS: LocationProfile[] = [
  // Bengali context
  { city: 'Kolkata', country: 'India', langGroup: 'Bengali' },
  { city: 'Dhaka', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Chittagong', country: 'Bangladesh', langGroup: 'Bengali' },
  { city: 'Sylhet', country: 'Bangladesh', langGroup: 'Bengali' },

  // Indian locations (Hindi / English Mix)
  { city: 'Delhi', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Mumbai', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Pune', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Bengaluru', country: 'India', langGroup: 'IndiaMix' },
  { city: 'Hyderabad', country: 'India', langGroup: 'IndiaMix' },

  // Global English locations
  { city: 'London', country: 'UK', langGroup: 'GlobalEnglish' },
  { city: 'New York', country: 'USA', langGroup: 'GlobalEnglish' },
  { city: 'Toronto', country: 'Canada', langGroup: 'GlobalEnglish' },
  { city: 'Sydney', country: 'Australia', langGroup: 'GlobalEnglish' }
];

const BENGALI_USERNAMES = [
  'KolkataGhumonto', 'MeghBalika', 'BhalobasharKobi', 'NisshoPothik',
  'ChaKhorKolkata', 'Anamika_99', 'ShohorerChithi', 'BobaSur', 'ChokherJol'
];

const HINDI_USERNAMES = [
  'KhamoshMusafir', 'DilliWalaShayar', 'TanhaiKaSafar', 'SukoonKiKhoj',
  'ChaiAurKitaabein', 'RasteKeMusafir', 'ZindagiDiary', 'NeendUdi'
];

const GLOBAL_USERNAMES = [
  'SilentVoyager', 'NeonDrifter', 'MidnightEcho', 'QuietRebel',
  'Wanderer_99', 'CityLightsSoul', 'AuraSeeker', 'SolitaryThinker',
  'NightOwlEcho', 'RusticEcho', 'UrbanSoul', 'PixelNomad', 'VelvetSilence'
];

const DIVERSE_PILLARS = [
  {
    category: 'Love & Relationships',
    topic: 'heartbreak, silence, unsaid emotions and moving on',
    reactionPool: ['❤️', '🤗', '😢', '💔', '🙏'] as ReactionEmoji[],
    bengaliFallback: {
      body: 'টানা তিন বছর তার সবথেকে কাছের বন্ধু সেজে নিজের সব না-বলা অনুভূতি বুকের ভেতর চেপে রেখেছিলাম। গতকাল যখন সামাজিক মাধ্যমে তার বিয়ের ছবিগুলো দেখলাম, তখন উপলব্ধি করলাম যে আমি হয়তো তার গল্পের এক ক্ষুদ্র অধ্যায় ছিলাম, আর সে ছিল আমার সম্পূর্ণ উপন্যাস। এই নিস্তব্ধ ঘরের নিঃশব্দ যন্ত্রণা কোনো কোলাহলপূর্ণ শহরের থেকেও বেশি ভারী মনে হয়। কথা দিয়ে হয়তো কখনোই সঠিক সমাপ্তি মেলে না, নিজেকে শান্তভাবে সরিয়ে নেওয়াই একমাত্র সম্মানজনক সিদ্ধান্ত।',
      comments: [
        'না বলা অনুভূতিগুলো ভেতরে ভেতরে সত্যিই খুব কষ্ট দেয়। নিজের যত্ন নিও।',
        'নিজেকে সরিয়ে নেওয়া দুর্বলতা নয়, প্রচণ্ড সাহসের লক্ষণ।',
        'লেখাটার প্রতিটি শব্দ বুকের ভেতর গিয়ে বিঁধল। ভালো থেকো।'
      ]
    },
    hindiFallback: {
      body: 'चार साल तक सबसे अच्छा दोस्त बनकर अपने दिल की बात कभी जुबां पर नहीं ला पाया। कल उसकी सगाई की तस्वीरें देखकर एहसास हुआ कि जिंदगी में किसी को पूरी शिद्दत से चाहना और उसे किसी और का होते देखना कितना तकलीफदेह होता है। रात के इस शांत कमरे में पुरानी यादों का शोर बहुत ज्यादा है। कभी-कभी बिना कोई शिकायत किए खुद को पीछे खींच लेना ही सबसे बेहतर रास्ता होता है।',
      comments: [
        'बिना बोले दिल में दर्द छुपाना बहुत मुश्किल होता है दोस्त। हिम्मत रखो।',
        'हर लाइन से तुम्हारा दर्द महसूस हो रहा है। वक्त सब ठीक कर देगा।',
        'खामोशी से आगे बढ़ जाना ही सबसे बड़ी समझदारी है।'
      ]
    },
    englishFallback: {
      body: 'After four continuous years of pretending to be just her dependable best friend, reality finally struck me hard. Watching her celebrate engagement photos made me understand that my presence was just a fleeting chapter for her, while she was the entire book for me. The silence inside this empty apartment feels heavier than any crowded marketplace. Walking away quietly was my only dignified choice.',
      comments: [
        'Unspoken feelings hurt for years. Take care of yourself.',
        'Walking away quietly takes unbelievable strength.',
        'Felt every single word of this.'
      ]
    }
  },
  {
    category: 'Business & Startup',
    topic: 'financial struggle, bootstrapped survival, grit and sleepless nights',
    reactionPool: ['👏', '🔥', '💯', '❤️', '🙏'] as ReactionEmoji[],
    bengaliFallback: {
      body: 'লিঙ্কডইনে সবাই শুধু ফান্ডিং আর সাফল্যের চাকচিক্য দেখে, কিন্তু ফান্ডিং ছাড়া কোনো প্রজেক্ট চালানোর পেছনে যে রাতের পর রাত দুশ্চিন্তা আর ঘুমহীন ক্লান্তি থাকে তা কেউ বোঝে না। টানা দুই মাস ক্লায়েন্টের পেমেন্ট না পেয়ে অফিসের খরচ মেটাতে নিজের সঞ্চয় শেষ করতে হয়েছে। পরিবারকে দুশ্চিন্তায় না রেখে হাসিমুখে এই মানসিক চাপ বহন করা সত্যিই কঠিন। তবে এই অন্ধকার দিনগুলোই চরিত্র তৈরি করে।',
      comments: [
        'কঠিন লড়াই চালিয়ে যাও, সাফল্য একদিন ঠিক আসবে।',
        'এই নিঃশব্দ লড়াইগুলোকে কোনোদিন সোশ্যাল মিডিয়া দেখাবে না। স্যালুট আপনার ধৈর্যকে।',
        'বুটস্ট্র্যাপ করা মানসিক শক্তির পরীক্ষা নেয়।'
      ]
    },
    hindiFallback: {
      body: 'सोशल मीडिया पर लोग केवल फंडिंग और लग्जरी देखते हैं, लेकिन बिना किसी इन्वेस्टर के स्टार्टअप चलाने का असली तनाव सिर्फ वही समझ सकता है जो इससे गुजर रहा हो। लगातार दो महीने से क्लाइंट का पेमेंट अटका हुआ था और टीम की सैलरी समय पर देने के लिए अपने सारे सेविंग्स दांव पर लगाने पड़े। परिवार के सामने मुस्कुराते हुए यह तनाव झेलना आसान नहीं है, पर यही संघर्ष असली ताकत बनता है।',
      comments: [
        'सच्ची लीडरशिप यही है कि टीम का ध्यान रखो और खुद दर्द सहो। सम्मान!',
        'हर सफल सफर में ऐसे मुश्किल दौर आते हैं भाई, हार मत मानना।',
        'ज़मीनी सच्चाई बहुत अलग होती है, लगे रहो।'
      ]
    },
    englishFallback: {
      body: 'Nobody sees the terrifying pressure behind running a bootstrapped startup with completely zero external funding. Skipping personal groceries just to ensure our junior developers received their paychecks on time requires a level of endurance nobody talks about. Entrepreneurship has zero glamour in real life, but the emotional resilience it builds inside is worth every setback.',
      comments: [
        'True leadership is carrying stress quietly. Massive respect.',
        'Keep building, every major success had dark months like this.',
        'LinkedIn glorifies everything, reality is tough.'
      ]
    }
  },
  {
    category: 'Raw Confessions',
    topic: 'loneliness, adult life burdens, homesickness and city isolation',
    reactionPool: ['🤗', '❤️', '😢', '🙏', '💔'] as ReactionEmoji[],
    bengaliFallback: {
      body: 'বাইরে থেকে সবাই ভাবে এই বিশাল মেট্রো শহরে একা ফ্ল্যাটে আমি চমৎকার জীবনযাপন করছি। কিন্তু সত্যিটা হলো, কাজ শেষে এই নিস্তব্ধ ঘরে ল্যাপটপের সামনে বসে যখন মায়ের ফোন আসে, তখন চোখের জল লুকিয়ে বলতে হয় যে আমি খুব ভালো আছি। লক্ষ মানুষের ভিড়েও নিজেকে সম্পূর্ণ অদৃশ্য মনে হয়। প্রাপ্তবয়স্ক জীবনের সবচেয়ে কঠিন দিক হলো নিজের মানসিক কষ্ট কাউকে বুঝতে না দিয়ে প্রতিদিন সাধারণ থাকার ভান করা।',
      comments: [
        'তুমি একা নও, বহু মানুষ আজ এই নিঃসঙ্গতার মধ্য দিয়েই দিন কাটাচ্ছে। ভালোবাসা নিও।',
        'বাড়ি থেকে দূরে থাকার যন্ত্রণা সত্যিই মারাত্মক। মন শক্ত রেখো।',
        'এই দিনগুলোও কেটে যাবে, নিজের যত্ন নিও।'
      ]
    },
    hindiFallback: {
      body: 'घर से दूर इस बड़े शहर में काम करते हुए बाहर से सब कुछ बहुत अच्छा दिखता है। हकीकत यह है कि रात को कमरे में अकेले बैठकर जब माँ का फोन आता है, तो गले में अटके आंसुओं को रोककर हंसना पड़ता है ताकि उन्हें कोई फिक्र न हो। लाखों लोगों की भीड़ में भी यह खालीपन अंदर तक सालता है। अकेले रहकर अपनी जिम्मेदारियां निभाना कभी-कभी बहुत थका देता है।',
      comments: [
        'घर से दूर रहने का दर्द सिर्फ वही समझ सकता है जो इसे झेलता है। ख्याल रखो अपना।',
        'तुम अकेले नहीं हो दोस्त, बहुत से लोग इसी जंग से रोज गुजरते हैं।',
        'वक्त बदलेगा, हिम्मत मत हारना।'
      ]
    },
    englishFallback: {
      body: 'People assume I am thriving in this metropolitan city. In reality, my dinner is instant noodles over a laptop screen while hiding tears whenever my mother calls to ask if I am eating properly. The heaviest burden of adult life is learning to carry your own emotional heartbreak without bothering anyone else around you.',
      comments: [
        'You are not alone in feeling this way.',
        'Homesickness is brutal. Sending love.',
        'Living alone in a new city changes you completely.'
      ]
    }
  }
];

function determineTargetLanguage(location: LocationProfile): 'Bengali' | 'Hindi' | 'English' {
  if (location.langGroup === 'Bengali') {
    return 'Bengali';
  }
  if (location.langGroup === 'IndiaMix') {
    // 50% Hindi, 50% English for Indian mainland locations
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

function createTargetedImageUrl(isBengaliContext: boolean): string {
  const pool = isBengaliContext ? BENGAL_CURATED_IMAGE_IDS : GLOBAL_CURATED_IMAGE_IDS;
  const randomPhotoId = pool[Math.floor(Math.random() * pool.length)];
  return `https://images.unsplash.com/${randomPhotoId}?auto=format&fit=crop&w=650&h=420&q=75`;
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
  const cleanSnippet = text.trim().slice(0, 55).toLowerCase();
  const hashes = getStoredHashes();
  return hashes.includes(cleanSnippet);
}

async function callGroqAI(
  category: string,
  topic: string,
  lang: 'Bengali' | 'Hindi' | 'English',
  city: string
) {
  if (!GROQ_API_KEY || !GROQ_API_KEY.startsWith('gsk_')) return null;

  let languagePromptRule = 'Write strictly in modern, natural English.';
  if (lang === 'Bengali') {
    languagePromptRule =
      'Write strictly in standard, authentic, emotional Bengali (বাংলা লিপি). Ensure the tone sounds like someone from Kolkata or Bangladesh.';
  } else if (lang === 'Hindi') {
    languagePromptRule =
      'Write strictly in natural, emotional, authentic Hindi (देवनागरी लिपि). Natural conversational flow without overly formal Sanskritized words.';
  }

  const prompt = `Write an authentic, deeply emotional first-person confession for an anonymous feed.
Category: ${category}
Topic: ${topic}
Current Setting/City: ${city}
Language Rule: ${languagePromptRule}

CRITICAL REQUIREMENT:
1. Length: Keep it between 75 and 100 words.
2. Tone: Raw, conversational, vulnerable, deeply human.
3. Absolutely NO hashtags, no numbered points, no moral lecturing at the end.
4. Output strictly a JSON object:
{
  "author": "RelevantLocalUsername",
  "confession": "Confession story in requested language...",
  "comment": "1 realistic empathetic response comment in the SAME requested language"
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
        temperature: 0.88,
        response_format: { type: 'json_object' }
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);

    if (!parsed.confession || parsed.confession.length < 50) return null;

    return {
      body: parsed.confession,
      author: parsed.author || getAppropriateUsername(lang),
      category,
      firstComment: parsed.comment || 'Felt this deeply.'
    };
  } catch {
    return null;
  }
}

function generateProceduralStory(lang: 'Bengali' | 'Hindi' | 'English') {
  const pillar = DIVERSE_PILLARS[Math.floor(Math.random() * DIVERSE_PILLARS.length)];
  let selectedData = pillar.englishFallback;

  if (lang === 'Bengali') {
    selectedData = pillar.bengaliFallback;
  } else if (lang === 'Hindi') {
    selectedData = pillar.hindiFallback;
  }

  const comment = selectedData.comments[Math.floor(Math.random() * selectedData.comments.length)];

  return {
    body: selectedData.body,
    author: getAppropriateUsername(lang),
    category: pillar.category,
    firstComment: comment
  };
}

// Gradually adds 4 to 6 reactions & multi-tier realistic empathetic comments
async function applyOrganicGradualEngagement(posts: Confession[]) {
  try {
    const rawTracker = localStorage.getItem(ENGAGEMENT_TRACKER_KEY);
    const tracker: Record<string, number> = rawTracker ? JSON.parse(rawTracker) : {};
    const now = Date.now();

    for (const post of posts.slice(0, 25)) {
      const createdAt = Number((post as any).createdAt || (post as any).timestamp || 0);
      if (!createdAt) continue;

      const elapsedMinutes = Math.floor((now - createdAt) / (60 * 1000));
      const currentStage = tracker[post.id] || 0;
      const pool = DIVERSE_PILLARS.find((p) => p.category === (post as any).category) || DIVERSE_PILLARS[0];
      const reactions = pool.reactionPool;

      const postCity = (post as any).city || '';
      const isBengaliCity = ['Kolkata', 'Dhaka', 'Chittagong', 'Sylhet'].includes(postCity);
      const isHindiCity = ['Delhi', 'Mumbai', 'Pune'].includes(postCity);

      const lang: 'Bengali' | 'Hindi' | 'English' = isBengaliCity
        ? 'Bengali'
        : isHindiCity
        ? 'Hindi'
        : 'English';

      const commentSource =
        lang === 'Bengali'
          ? pool.bengaliFallback.comments
          : lang === 'Hindi'
          ? pool.hindiFallback.comments
          : pool.englishFallback.comments;

      // Stage 1: ~6-8 mins -> First wave reaction (❤️ or 🤗)
      if (elapsedMinutes >= 6 && currentStage < 1) {
        tracker[post.id] = 1;
        setReaction(post.id, null, reactions[0] || '❤️').catch(() => {});
      }

      // Stage 2: ~16 mins -> First empathetic reply comment + secondary reaction
      if (elapsedMinutes >= 16 && currentStage < 2) {
        tracker[post.id] = 2;
        const randomCommenter = getAppropriateUsername(lang);
        const text = commentSource[0] || 'Stay strong.';
        addComment(post.id, randomCommenter, text).catch(() => {});
        setReaction(post.id, null, reactions[1] || '🤗').catch(() => {});
      }

      // Stage 3: ~32 mins -> Additional diverse reaction (😢 or 💔 or 👏)
      if (elapsedMinutes >= 32 && currentStage < 3) {
        tracker[post.id] = 3;
        setReaction(post.id, null, reactions[2] || '😢').catch(() => {});
        // Extra boost reaction for realism
        setReaction(post.id, null, reactions[0] || '❤️').catch(() => {});
      }

      // Stage 4: ~50 mins -> Second thoughtful community reply
      if (elapsedMinutes >= 50 && currentStage < 4) {
        tracker[post.id] = 4;
        const randomCommenter = getAppropriateUsername(lang);
        const text = commentSource[1] || commentSource[0];
        addComment(post.id, randomCommenter, text).catch(() => {});
        setReaction(post.id, null, reactions[3] || '🙏').catch(() => {});
      }

      // Stage 5: ~75 mins -> Final lingering reflection reaction/comment
      if (elapsedMinutes >= 75 && currentStage < 5) {
        tracker[post.id] = 5;
        if (commentSource.length > 2) {
          const randomCommenter = getAppropriateUsername(lang);
          addComment(post.id, randomCommenter, commentSource[2]).catch(() => {});
        }
        setReaction(post.id, null, reactions[4] || reactions[0] || '❤️').catch(() => {});
      }
    }

    localStorage.setItem(ENGAGEMENT_TRACKER_KEY, JSON.stringify(tracker));
  } catch {}
}

export async function generateAndPublishConfession(): Promise<Confession | null> {
  const randomLoc = GLOBAL_LOCATIONS[Math.floor(Math.random() * GLOBAL_LOCATIONS.length)];
  const targetLang = determineTargetLanguage(randomLoc);
  const isBengaliContext = targetLang === 'Bengali';

  const pillar = DIVERSE_PILLARS[Math.floor(Math.random() * DIVERSE_PILLARS.length)];

  let story = await callGroqAI(pillar.category, pillar.topic, targetLang, randomLoc.city);

  if (!story || !story.body || isDuplicate(story.body)) {
    story = generateProceduralStory(targetLang);
  }

  if (isDuplicate(story.body)) {
    story = generateProceduralStory(targetLang);
  }

  const imageUrl = createTargetedImageUrl(isBengaliContext);

  const newPost = await createConfession({
    authorName: story.author,
    text: story.body,
    imageUrl: imageUrl,
    city: randomLoc.city,
    country: randomLoc.country,
    category: story.category
  });

  if (newPost && story.firstComment) {
    const commenter = getAppropriateUsername(targetLang);
    addComment(newPost.id, commenter, story.firstComment).catch(() => {});
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
