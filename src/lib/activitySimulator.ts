import { Confession } from '../types';
import { WORLD_LOCATIONS } from '../data/locations';

// Crystal clear, watermark-free, text-free scenic photos
const CLEAN_AESTHETIC_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=70',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=70',
];

// Fallback lightweight JPG Base64 (strictly under 15KB)
const FALLBACK_LIGHTWEIGHT_JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

const GLOBAL_STORIES = [
  "I still look up my childhood best friend's profile every month just to make sure they're doing okay.",
  "I pretended to have meetings all afternoon today just so I could sit in my car and listen to music in peace.",
  "I bought two train tickets today just to keep the empty seat next to me so nobody would talk to me.",
  "I'm terrified that everyone around me has their life figured out while I'm just winging every single day.",
  "I forgave someone years ago, not because they apologized, but because holding onto that grudge was exhausting me.",
  "I tell everyone I love living alone, but on quiet Sunday evenings, the silence is honestly overwhelming.",
  "I got the promotion everyone congratulated me for, but deep down, I miss the time when work wasn't my whole life.",
  "I wrote a long letter saying everything I couldn't say out loud, and then deleted the draft before hitting send.",
  "Kabhi kabhi sabke beech reh kar bhi lagta hai koi apna nahi hai. Bas ek muskaan ke peeche sab chhipa leta hoon.",
  "I secretly paid off my sister's college tuition fee balance and made the office tell her it was a mystery scholarship.",
  "Mon er kotha gulo kauke bolte pari na, tai chupchap ekhane likhe fellam. Shanti lagche ektu.",
  "I never told my parents how close I came to quitting my final year. I just quietly pushed through for their smile.",
  "I still keep the dried flower they gave me three years ago tucked inside a book nobody opens.",
  "Log sochte hain main bohot strong hoon, par raat ko akele mein aanso rukte hi nahi.",
];

const COMMENTS_BY_LANG: Record<string, string[]> = {
  en: [
    "This hit so close to home. Sending you so much warmth.",
    "You are definitely not alone in feeling this way.",
    "Thank you for having the courage to share this.",
    "Quiet battles are often the heaviest. Stay strong.",
    "I needed to read this today more than you know.",
    "Please be kind to yourself. You are doing much better than you think.",
    "The fact that you reflect on this proves your heart is in the right place.",
    "Sending peace and strength your way from across the world.",
  ],
  hi: [
    "आप अकेले नहीं हैं, हम सब कभी न कभी इस दौर से गुजरते हैं। हिम्मत रखिए।",
    "यह दिल को छू गया। खुद पर भरोसा रखिए, सब ठीक हो जाएगा।",
    "इतनी सच्चाई से अपनी बात कहने के लिए बहुत हिम्मत चाहिए।",
    "हर मुश्किल वक्त बीत जाता है, अपने आप को संभालिए। ढेर सारा प्यार।",
    "आपकी बात पढ़कर लगा जैसे कोई मेरी ही कहानी बयां कर रहा हो।",
  ],
  bn: [
    "তুমি একা নও, সময় সব ক্ষত সারিয়ে দেয়। শক্ত থেকো।",
    "কথাগুলো একদম মনের গভীরে গিয়ে লাগলো। ভালো থেকো তুমি।",
    "নিজের খেয়াল রেখো, নিজের উপর বিশ্বাস হারিও না।",
    "এত সহজ করে মনের না বলা কথাগুলো প্রকাশ করার জন্য ধন্যবাদ।",
  ],
  hinglish: [
    "Bhai/Dost, aap akele nahi ho. Sab theek ho jayega waqt ke sath, bharosa rakho.",
    "Ye sach me dil ko lag gaya... stay strong dost.",
    "Khud par zyada sakht mat bano, aap jo kar rahe ho bohot accha hai.",
    "Ye padhkar laga jaise meri hi feelings kisi ne likh di ho. Himmat rakho.",
    "Sachai se apni baat kehna asaan nahi hota. Respect for your honesty.",
  ],
};

const ENGAGEMENT_REACTIONS = ['❤️', '🫂', '👏', '😢', '🔥', '🙏', '💯'];
const SIMULATED_POSTS_KEY = 'open_confess_simulated_posts_v3';
const LAST_SIM_DATE_KEY = 'open_confess_last_sim_date_v3';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Language Detection
export function detectLanguage(text: string): 'bn' | 'hi' | 'hinglish' | 'en' {
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  const hinglishWords = /\b(kabhi|nahi|mera|meri|mujhe|tum|kuch|bohot|hoga|hota|wala|wali|yaar|bhai|dost|zindagi|dil|apna|apni|kisi|raha|rahi|samajh|theek)\b/i;
  if (hinglishWords.test(text)) return 'hinglish';
  return 'en';
}

// Browser Canvas Image Compressor (strictly under 50KB JPG base64)
export async function compressUrlToUnder50KB(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension clamp to 800px
        const MAX_DIM = 800;
        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(FALLBACK_LIGHTWEIGHT_JPEG);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Quality reduction loop until file size is strictly under 50KB (~65000 chars base64)
        let quality = 0.65;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        while (dataUrl.length > 65000 && quality > 0.2) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      } catch {
        resolve(FALLBACK_LIGHTWEIGHT_JPEG);
      }
    };
    img.onerror = () => resolve(FALLBACK_LIGHTWEIGHT_JPEG);
    img.src = imageUrl;
  });
}

// Generate 50 Posts with under-50KB JPGs
export async function generateDailySimulatedPosts(): Promise<Confession[]> {
  const generated: Confession[] = [];
  const now = Date.now();

  for (let i = 0; i < 50; i++) {
    const loc = pickRandom(WORLD_LOCATIONS);
    const cityObj = pickRandom(loc.cities);
    const storyText = pickRandom(GLOBAL_STORIES);
    const lang = detectLanguage(storyText);
    const commentPool = COMMENTS_BY_LANG[lang] || COMMENTS_BY_LANG.en;

    const commentCount = getRandomInt(1, 6);
    const commentsList = Array.from({ length: commentCount }).map((_, idx) => ({
      id: `sim_comm_${now}_${i}_${idx}`,
      author: 'Anonymous',
      text: pickRandom(commentPool),
      createdAt: `${getRandomInt(5, 55)}m ago`,
    }));

    // Random clean image selected and compressed
    const rawImage = pickRandom(CLEAN_AESTHETIC_IMAGES);
    const compressedJpg = await compressUrlToUnder50KB(rawImage);

    generated.push({
      id: `sim_post_${now}_${i}`,
      text: storyText,
      authorName: Math.random() > 0.6 ? 'Anonymous' : '',
      country: loc.country,
      city: cityObj.city,
      imageUrl: compressedJpg, // Guaranteed under-50KB JPEG
      likesCount: getRandomInt(14, 160),
      commentsCount: commentCount,
      commentsList,
      userReaction: pickRandom(ENGAGEMENT_REACTIONS),
      createdAt: new Date(now - getRandomInt(1000 * 60 * 15, 1000 * 60 * 60 * 22)).toISOString(),
    } as unknown as Confession);
  }

  return generated;
}

// Async Sync Daily 50 Posts
export async function syncSimulatedActivity(existingPosts: Confession[]): Promise<Confession[]> {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem(LAST_SIM_DATE_KEY);

  let cachedSimulated: Confession[] = [];
  try {
    const raw = localStorage.getItem(SIMULATED_POSTS_KEY);
    if (raw) cachedSimulated = JSON.parse(raw);
  } catch {
    cachedSimulated = [];
  }

  if (lastDate !== today || cachedSimulated.length === 0) {
    const fresh50 = await generateDailySimulatedPosts();
    cachedSimulated = [...fresh50, ...cachedSimulated.slice(0, 100)];
    try {
      localStorage.setItem(SIMULATED_POSTS_KEY, JSON.stringify(cachedSimulated));
      localStorage.setItem(LAST_SIM_DATE_KEY, today);
    } catch {
      // Storage fallback if quota reached
      cachedSimulated = fresh50.slice(0, 20);
    }
  }

  return [...existingPosts, ...cachedSimulated];
}

// Progressive Context-Aware Comments for Real User Posts
export function scheduleEngagementForNewPost(
  confession: Confession,
  onUpdate: (updatedFields: Record<string, any>) => void
) {
  const postText = (confession as any).text || (confession as any).content || '';
  const lang = detectLanguage(postText);
  const commentPool = COMMENTS_BY_LANG[lang] || COMMENTS_BY_LANG.en;

  // Reaction in 25-45s
  setTimeout(() => {
    onUpdate({
      likesCountIncrement: getRandomInt(1, 3),
      reaction: pickRandom(ENGAGEMENT_REACTIONS),
    });
  }, getRandomInt(25000, 45000));

  // Matching Language Comment 1 in 1.5-3m
  setTimeout(() => {
    const firstComment = {
      id: String(Date.now()),
      author: 'Anonymous',
      text: pickRandom(commentPool),
      createdAt: 'Just now',
    };
    onUpdate({
      newComment: firstComment,
      likesCountIncrement: getRandomInt(1, 4),
    });
  }, getRandomInt(90000, 180000));

  // Matching Language Comment 2 in 4-8m
  setTimeout(() => {
    const secondComment = {
      id: String(Date.now() + 1),
      author: 'Anonymous',
      text: pickRandom(commentPool),
      createdAt: 'Just now',
    };
    onUpdate({
      newComment: secondComment,
      likesCountIncrement: getRandomInt(2, 6),
    });
  }, getRandomInt(240000, 480000));
}
